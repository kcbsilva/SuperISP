// src/services/postgresql/subscribers.ts
import { query } from '@/lib/postgresql/client';
import type { Subscriber, SubscriberData } from '@/types/subscribers';

const SUBSCRIBERS_TABLE_SCHEMA = `
  CREATE TABLE IF NOT EXISTS subscribers (
    id SERIAL PRIMARY KEY,
    subscriber_type VARCHAR(50) NOT NULL, -- Residential, Commercial
    full_name VARCHAR(255),
    company_name VARCHAR(255),
    birthday DATE,
    established_date DATE,
    address TEXT NOT NULL,
    point_of_reference TEXT,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(50) NOT NULL,
    mobile_number VARCHAR(50),
    tax_id VARCHAR(100), -- CPF or other tax ID
    business_number VARCHAR(100), -- CNPJ or other business ID
    signup_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Active', -- Active, Inactive, Suspended, Planned, Canceled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
`;

const UPDATE_SUBSCRIBERS_TRIGGER_FUNCTION = `
  CREATE OR REPLACE FUNCTION update_subscribers_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ language 'plpgsql';
`;

const UPDATE_SUBSCRIBERS_TRIGGER = `
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_trigger
      WHERE tgname = 'update_subscribers_updated_at' AND tgrelid = 'subscribers'::regclass
    ) THEN
      CREATE TRIGGER update_subscribers_updated_at
      BEFORE UPDATE ON subscribers
      FOR EACH ROW
      EXECUTE FUNCTION update_subscribers_updated_at_column();
    END IF;
  END
  $$;
`;

let subscribersTableEnsured = false;
async function ensureSubscribersTable() {
  if (!subscribersTableEnsured) {
    try {
      await query(SUBSCRIBERS_TABLE_SCHEMA);
      await query(UPDATE_SUBSCRIBERS_TRIGGER_FUNCTION);
      await query(UPDATE_SUBSCRIBERS_TRIGGER);
      console.log("'subscribers' table schema ensured.");
      subscribersTableEnsured = true;
    } catch (e) {
      console.error("Error ensuring 'subscribers' table schema: ", e);
      // Potentially throw e or handle as critical error
    }
  }
}


/**
 * Adds a new subscriber to the PostgreSQL database.
 */
export const addSubscriber = async (subscriberData: SubscriberData): Promise<number> => {
  await ensureSubscribersTable();
  const {
    subscriberType,
    fullName,
    companyName,
    birthday,
    establishedDate,
    address,
    pointOfReference,
    email,
    phoneNumber,
    mobileNumber,
    taxId,
    businessNumber,
    signupDate,
    status = 'Active', // Default status
  } = subscriberData;

  const sql = `
    INSERT INTO subscribers (
      subscriber_type, full_name, company_name, birthday, established_date,
      address, point_of_reference, email, phone_number, mobile_number,
      tax_id, business_number, signup_date, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING id;
  `;

  // Ensure dates are correctly formatted or null for the database
  const params = [
    subscriberType,
    fullName || null,
    companyName || null,
    birthday ? new Date(birthday) : null,
    establishedDate ? new Date(establishedDate) : null,
    address,
    pointOfReference || null,
    email,
    phoneNumber,
    mobileNumber || null,
    taxId || null,
    businessNumber || null,
    signupDate ? new Date(signupDate) : new Date(), // Default to now if not provided
    status,
  ];

  try {
    const result = await query(sql, params);
    console.log("Subscriber added with ID (PostgreSQL): ", result.rows[0].id);
    return result.rows[0].id;
  } catch (e) {
    console.error("Error adding subscriber to PostgreSQL: ", e);
    throw new Error('Failed to add subscriber (PostgreSQL)');
  }
};

/**
 * Fetches all subscribers from the PostgreSQL database.
 */
export const getSubscribers = async (): Promise<Subscriber[]> => {
  await ensureSubscribersTable();
  const sql = `
    SELECT id, subscriber_type, full_name, company_name, birthday, established_date,
           address, point_of_reference, email, phone_number, mobile_number,
           tax_id, business_number, signup_date, status, created_at, updated_at
    FROM subscribers
    ORDER BY created_at DESC;
  `;
  try {
    const result = await query(sql);
    return result.rows.map((row: any) => ({
      ...row,
      birthday: row.birthday ? new Date(row.birthday) : null,
      establishedDate: row.established_date ? new Date(row.established_date) : null,
      signupDate: new Date(row.signup_date),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    } as Subscriber));
  } catch (e) {
    console.error("Error getting subscribers from PostgreSQL: ", e);
    throw new Error('Failed to fetch subscribers (PostgreSQL)');
  }
};

/**
 * Fetches a single subscriber by ID from the PostgreSQL database.
 */
export const getSubscriberById = async (id: number): Promise<Subscriber | null> => {
  await ensureSubscribersTable();
  const sql = `
    SELECT id, subscriber_type, full_name, company_name, birthday, established_date,
           address, point_of_reference, email, phone_number, mobile_number,
           tax_id, business_number, signup_date, status, created_at, updated_at
    FROM subscribers
    WHERE id = $1;
  `;
  try {
    const result = await query(sql, [id]);
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    return {
      ...row,
      birthday: row.birthday ? new Date(row.birthday) : null,
      establishedDate: row.established_date ? new Date(row.established_date) : null,
      signupDate: new Date(row.signup_date),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    } as Subscriber;
  } catch (e) {
    console.error(`Error getting subscriber by ID ${id} from PostgreSQL: `, e);
    throw new Error('Failed to fetch subscriber (PostgreSQL)');
  }
};

/**
 * Updates an existing subscriber in the PostgreSQL database.
 */
export const updateSubscriber = async (id: number, data: Partial<SubscriberData>): Promise<void> => {
  await ensureSubscribersTable();
  const fields = Object.keys(data).filter(key => (data as any)[key] !== undefined);
  if (fields.length === 0) {
    console.warn("No fields provided for subscriber update.");
    return;
  }

  const setClauses = fields.map((field, index) => {
    const dbField = field.replace(/([A-Z])/g, '_$1').toLowerCase(); // Convert camelCase to snake_case
    return `${dbField} = $${index + 1}`;
  });

  const params = fields.map(field => {
    const value = (data as any)[field];
    if (['birthday', 'establishedDate', 'signupDate'].includes(field) && value) {
      return new Date(value);
    }
    return value;
  });
  params.push(id); // For WHERE id = $N

  // updated_at is handled by the trigger
  const sql = `
    UPDATE subscribers
    SET ${setClauses.join(', ')}
    WHERE id = $${params.length};
  `;

  try {
    await query(sql, params);
    console.log("Subscriber updated with ID (PostgreSQL): ", id);
  } catch (e) {
    console.error("Error updating subscriber in PostgreSQL: ", e);
    throw new Error('Failed to update subscriber (PostgreSQL)');
  }
};

/**
 * Deletes a subscriber from the PostgreSQL database.
 */
export const deleteSubscriber = async (id: number): Promise<void> => {
  await ensureSubscribersTable();
  const sql = 'DELETE FROM subscribers WHERE id = $1;';
  try {
    await query(sql, [id]);
    console.log("Subscriber deleted with ID (PostgreSQL): ", id);
  } catch (e) {
    console.error("Error deleting subscriber from PostgreSQL: ", e);
    throw new Error('Failed to delete subscriber (PostgreSQL)');
  }
};
