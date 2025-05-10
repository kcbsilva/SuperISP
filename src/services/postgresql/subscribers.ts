// src/services/postgresql/subscribers.ts
import { query } from '@/lib/postgresql/client';
import type { Subscriber, SubscriberData, SubscriberStatus } from '@/types/subscribers';

/**
 * Adds a new subscriber to the PostgreSQL database.
 */
export const addSubscriber = async (subscriberData: SubscriberData): Promise<number> => {
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

  const sql = `
    UPDATE subscribers
    SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP
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
  const sql = 'DELETE FROM subscribers WHERE id = $1;';
  try {
    await query(sql, [id]);
    console.log("Subscriber deleted with ID (PostgreSQL): ", id);
  } catch (e) {
    console.error("Error deleting subscriber from PostgreSQL: ", e);
    throw new Error('Failed to delete subscriber (PostgreSQL)');
  }
};
