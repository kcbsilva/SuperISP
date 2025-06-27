// src/services/postgres/subscribers.ts
'use server';

import { query } from './db';
import type {
  Subscriber,
  SubscriberData,
  SubscriberStatus,
  SubscriberType,
} from '@/types/subscribers';

/* -------------------------------------------------------------
   Helper – map a DB row to the frontend Subscriber shape
-------------------------------------------------------------- */
function mapRowToSubscriber(row: any): Subscriber {
  return {
    id: row.id.toString(),
    subscriberType: row.subscriber_type as SubscriberType,

    /* personal / business */
    fullName: row.full_name,
    companyName: row.company_name,
    birthday: row.birthday ? new Date(row.birthday) : undefined,
    establishedDate: row.established_date
      ? new Date(row.established_date)
      : undefined,

    /* address & contact */
    address: row.address,
    pointOfReference: row.point_of_reference,
    email: row.email,
    phoneNumber: row.phone_number,
    mobileNumber: row.mobile_number,

    /* IDs */
    taxId: row.tax_id,
    businessNumber: row.business_number,
    idNumber: row.id_number,

    /* meta */
    signupDate: new Date(row.signup_date),
    status: row.status as SubscriberStatus,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),

    /* stubs for yet-to-implement relations */
    services: [],
    billing: {
      balance: 0,
      nextBillDate: '',
      pastInvoices: [],
      pendingInvoices: [],
      canceledInvoices: [],
      paymentPlans: [],
      promisesToPay: [],
    },
    serviceCalls: [],
    inventory: [],
    documents: [],
    notes: [],
    history: [],
  };
}

/* -------------------------------------------------------------
   LIST
-------------------------------------------------------------- */
export async function listSubscribers(): Promise<Subscriber[]> {
  const { rows } = await query(
    'SELECT * FROM subscribers WHERE deleted_at IS NULL ORDER BY created_at DESC'
  );
  return rows.map(mapRowToSubscriber);
}

/* -------------------------------------------------------------
   ADD
-------------------------------------------------------------- */
export async function addSubscriber(
  subscriberData: SubscriberData
): Promise<Subscriber> {
  const dataToInsert = {
    subscriber_type: subscriberData.subscriber_type,
    full_name: subscriberData.full_name || null,
    company_name: subscriberData.company_name || null,
    birthday: subscriberData.birthday
      ? new Date(subscriberData.birthday).toISOString().split('T')[0]
      : null,
    established_date: subscriberData.established_date
      ? new Date(subscriberData.established_date).toISOString().split('T')[0]
      : null,
    address: subscriberData.address,
    point_of_reference: subscriberData.point_of_reference || null,
    email: subscriberData.email,
    phone_number: subscriberData.phone_number,
    mobile_number: subscriberData.mobile_number || null,
    tax_id: subscriberData.tax_id || null,
    business_number: subscriberData.business_number || null,
    id_number: subscriberData.id_number || null,
    signup_date: subscriberData.signup_date
      ? new Date(subscriberData.signup_date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    status: subscriberData.status || 'Active',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const cols = Object.keys(dataToInsert).join(', ');
  const placeholders = Object.keys(dataToInsert)
    .map((_, i) => `$${i + 1}`)
    .join(', ');
  const values = Object.values(dataToInsert);

  const { rows } = await query(
    `INSERT INTO subscribers (${cols}) VALUES (${placeholders}) RETURNING *`,
    values
  );
  if (rows.length === 0) throw new Error('Failed to add subscriber.');
  return mapRowToSubscriber(rows[0]);
}

/* -------------------------------------------------------------
   GET by ID
-------------------------------------------------------------- */
export async function getSubscriberById(
  id: string
): Promise<Subscriber | null> {
  const { rows } = await query(
    'SELECT * FROM subscribers WHERE id = $1 AND deleted_at IS NULL',
    [id]
  );
  return rows.length ? mapRowToSubscriber(rows[0]) : null;
}

/* -------------------------------------------------------------
   UPDATE  (🔧 map type fixed here)
-------------------------------------------------------------- */
export async function updateSubscriber(
  id: string,
  updates: Partial<SubscriberData>
): Promise<Subscriber> {
  if (Object.keys(updates).length === 0) {
    throw new Error('No fields provided for update.');
  }

  /* only map DB-backed fields */
  const map: Partial<Record<keyof SubscriberData, string>> = {
    subscriber_type: 'subscriber_type',
    full_name: 'full_name',
    company_name: 'company_name',
    birthday: 'birthday',
    established_date: 'established_date',
    address: 'address',
    point_of_reference: 'point_of_reference',
    email: 'email',
    phone_number: 'phone_number',
    mobile_number: 'mobile_number',
    tax_id: 'tax_id',
    business_number: 'business_number',
    id_number: 'id_number',
    signup_date: 'signup_date',
    status: 'status',
  };

  const sets: string[] = [];
  const values: any[] = [];
  let idx = 1;

  for (const [key, val] of Object.entries(updates) as [
    keyof SubscriberData,
    any
  ][]) {
    if (val === undefined) continue;
    const column = map[key];
    if (!column) continue; // skip nested props like services, billing …
    sets.push(`${column} = $${idx}`);

    values.push(val instanceof Date ? val.toISOString().split('T')[0] : val);
    idx++;
  }

  sets.push('updated_at = NOW()');
  values.push(id);

  const { rows } = await query(
    `UPDATE subscribers SET ${sets.join(', ')}
     WHERE id = $${idx} AND deleted_at IS NULL
     RETURNING *`,
    values
  );
  if (rows.length === 0) throw new Error('Subscriber not found.');
  return mapRowToSubscriber(rows[0]);
}

/* -------------------------------------------------------------
   DELETE
-------------------------------------------------------------- */
export async function deleteSubscriber(
  id: string
): Promise<Subscriber | null> {
  const { rows } = await query(
    'DELETE FROM subscribers WHERE id = $1 RETURNING *',
    [id]
  );
  return rows.length ? mapRowToSubscriber(rows[0]) : null;
}

/* -------------------------------------------------------------
   STATS
-------------------------------------------------------------- */
export interface SubscriberStats {
  newSubscribers: number;
  activeSubscribers: number;
  suspendedSubscribers: number;
  totalSubscribers: number;
}

export async function getSubscriberStats(): Promise<SubscriberStats> {
  const { rows } = await query(`
      SELECT
        COUNT(*) FILTER (WHERE signup_date >= date_trunc('month', CURRENT_DATE)) AS new_subscribers,
        COUNT(*) FILTER (WHERE status = 'Active')     AS active_subscribers,
        COUNT(*) FILTER (WHERE status = 'Suspended')  AS suspended_subscribers,
        COUNT(*)                                       AS total_subscribers
      FROM subscribers
      WHERE deleted_at IS NULL;
  `);

  const r = rows[0] || {};
  return {
    newSubscribers: Number(r.new_subscribers ?? 0),
    activeSubscribers: Number(r.active_subscribers ?? 0),
    suspendedSubscribers: Number(r.suspended_subscribers ?? 0),
    totalSubscribers: Number(r.total_subscribers ?? 0),
  };
}
