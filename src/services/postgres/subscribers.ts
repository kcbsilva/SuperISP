// src/services/postgres/subscribers.ts
'use server';

import { query } from './db';
import type {
  Subscriber,
  SubscriberData,
  SubscriberStatus,
  SubscriberType,
} from '@/types/subscribers';

// Helper to map PostgreSQL row to frontend Subscriber type
function mapRowToSubscriber(row: any): Subscriber {
  return {
    id: row.id.toString(), // Ensure ID is string if it's a number from DB
    subscriberType: row.subscriber_type as SubscriberType,
    fullName: row.full_name,
    companyName: row.company_name,
    birthday: row.birthday ? new Date(row.birthday) : undefined,
    establishedDate: row.established_date
      ? new Date(row.established_date)
      : undefined,
    address: row.address,
    pointOfReference: row.point_of_reference,
    email: row.email,
    phoneNumber: row.phone_number,
    mobileNumber: row.mobile_number,
    taxId: row.tax_id,
    businessNumber: row.business_number,
    idNumber: row.id_number,
    signupDate: new Date(row.signup_date),
    status: row.status as SubscriberStatus,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
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

export async function listSubscribers(): Promise<Subscriber[]> {
  console.log('PostgreSQL service: listSubscribers called');
  try {
    const { rows } = await query(
      'SELECT * FROM subscribers ORDER BY created_at DESC'
    );
    return rows.map(mapRowToSubscriber);
  } catch (error) {
    console.error('Error fetching subscribers from PostgreSQL:', error);
    throw new Error(`Failed to fetch subscribers: ${(error as Error).message}`);
  }
}

export async function addSubscriber(
  subscriberData: SubscriberData
): Promise<Subscriber> {
  console.log('PostgreSQL service: addSubscriber called with', subscriberData);

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
  };

  const columns = Object.keys(dataToInsert).join(', ');
  const placeholders = Object.keys(dataToInsert)
    .map((_, i) => `$${i + 1}`)
    .join(', ');
  const values = Object.values(dataToInsert);

  const sql = `
    INSERT INTO subscribers (${columns})
    VALUES (${placeholders})
    RETURNING *;
  `;

  try {
    const { rows } = await query(sql, values);
    if (rows.length === 0) {
      throw new Error('Failed to add subscriber, no data returned.');
    }
    return mapRowToSubscriber(rows[0]);
  } catch (error) {
    console.error('Error adding subscriber to PostgreSQL:', error);
    throw new Error(`Failed to add subscriber: ${(error as Error).message}`);
  }
}

export async function getSubscriberById(
  id: string
): Promise<Subscriber | null> {
  console.log('PostgreSQL service: getSubscriberById called for ID', id);
  try {
    const { rows } = await query('SELECT * FROM subscribers WHERE id = $1', [
      id,
    ]);
    if (rows.length === 0) {
      return null;
    }
    return mapRowToSubscriber(rows[0]);
  } catch (error) {
    console.error(`Error fetching subscriber ${id} from PostgreSQL:`, error);
    throw new Error(`Failed to fetch subscriber: ${(error as Error).message}`);
  }
}

export interface SubscriberStats {
  newSubscribers: number;
  activeSubscribers: number;
  suspendedSubscribers: number;
  totalSubscribers: number;
}

export async function getSubscriberStats(): Promise<SubscriberStats> {
  const sql = `
    SELECT
      COUNT(*) FILTER (WHERE signup_date >= date_trunc('month', CURRENT_DATE)) AS new_subscribers,
      COUNT(*) FILTER (WHERE status = 'Active') AS active_subscribers,
      COUNT(*) FILTER (WHERE status = 'Suspended') AS suspended_subscribers,
      COUNT(*) AS total_subscribers
    FROM subscribers;
  `;
  const { rows } = await query(sql);
  const stats = rows[0] || {};
  return {
    newSubscribers: Number(stats.new_subscribers ?? 0),
    activeSubscribers: Number(stats.active_subscribers ?? 0),
    suspendedSubscribers: Number(stats.suspended_subscribers ?? 0),
    totalSubscribers: Number(stats.total_subscribers ?? 0),
  };
}
