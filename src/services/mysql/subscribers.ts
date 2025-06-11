// src/services/mysql/subscribers.ts
// This file is no longer used for fetching subscribers as we've switched to Supabase.
// It can be kept for reference or removed if MySQL is fully deprecated.
// For now, I'll leave its content but note its deprecation for this specific functionality.

'use server';
import pool from './db';
import type { Subscriber, SubscriberData } from '@/types/subscribers'; // Ensure types align

export async function addSubscriber(subscriberData: SubscriberData): Promise<number> {
  const {
    subscriber_type: subscriberType, // Use the snake_case version for DB
    full_name: fullName,
    company_name: companyName,
    birthday,
    established_date: establishedDate,
    address,
    point_of_reference: pointOfReference,
    email,
    phone_number: phoneNumber,
    mobile_number: mobileNumber,
    tax_id: taxId,
    business_number: businessNumber,
    id_number: idNumber,
    signup_date: signupDate,
    status = 'Active',
  } = subscriberData;

  const sql = `
    INSERT INTO subscribers (
      subscriber_type, full_name, company_name, birthday, established_date,
      address, point_of_reference, email, phone_number, mobile_number,
      tax_id, business_number, id_number, signup_date, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
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
    idNumber || null,
    signupDate ? new Date(signupDate) : new Date(),
    status,
  ];

  let connection;
  try {
    connection = await pool.getConnection();
    const [result] = await connection.execute(sql, params);
    return (result as any).insertId;
  } catch (e: any) {
    console.error("Error adding subscriber to MySQL: ", e);
    throw new Error(`Failed to add subscriber: ${e.message}`);
  } finally {
    if (connection) connection.release();
  }
}

// This function is deprecated in favor of listSubscribersFromSupabase
export async function listSubscribers(): Promise<Subscriber[]> {
  console.warn("listSubscribers (MySQL) is deprecated. Use listSubscribersFromSupabase instead.");
  const sql = `
    SELECT 
      id, subscriber_type as "subscriberType", full_name as "fullName", company_name as "companyName", 
      birthday, established_date as "establishedDate", address, point_of_reference as "pointOfReference", 
      email, phone_number as "phoneNumber", mobile_number as "mobileNumber", tax_id as "taxId", 
      business_number as "businessNumber", id_number as "idNumber", signup_date as "signupDate", status, 
      created_at as "createdAt", updated_at as "updatedAt"
    FROM subscribers 
    ORDER BY created_at DESC
  `;
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(sql);
     // Map to ensure consistency with the Subscriber type, especially if ID is string in type but number in DB
    return (rows as any[]).map(row => ({
      ...row,
      id: row.id.toString(), // Ensure ID is string if type expects string
      services: [], // Placeholder
      billing: { balance: 0, nextBillDate: '', pastInvoices: [], pendingInvoices: [], canceledInvoices:[], paymentPlans: [], promisesToPay: [] }, // Placeholder
      serviceCalls: [], // Placeholder
      inventory: [], // Placeholder
      documents: [], // Placeholder
      notes: [], // Placeholder
      history: [], // Placeholder
    })) as Subscriber[];
  } catch (e: any) {
    console.error("Error getting subscribers from MySQL: ", e);
    throw new Error(`Failed to fetch subscribers: ${e.message}`);
  } finally {
    if (connection) connection.release();
  }
}

// This function is deprecated in favor of getSubscriberByIdFromSupabase
export async function getSubscriberById(id: number | string): Promise<Subscriber | null> {
  console.warn(`getSubscriberById (MySQL) is deprecated for id ${id}. Use getSubscriberByIdFromSupabase instead.`);
  const sql = `
    SELECT 
      id, subscriber_type as "subscriberType", full_name as "fullName", company_name as "companyName", 
      birthday, established_date as "establishedDate", address, point_of_reference as "pointOfReference", 
      email, phone_number as "phoneNumber", mobile_number as "mobileNumber", tax_id as "taxId", 
      business_number as "businessNumber", id_number as "idNumber", signup_date as "signupDate", status, 
      created_at as "createdAt", updated_at as "updatedAt"
    FROM subscribers 
    WHERE id = ?
  `;
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(sql, [id]);
    if (Array.isArray(rows) && rows.length > 0) {
      const row = rows[0] as any;
      return {
        ...row,
        id: row.id.toString(), // Ensure ID is string if type expects string
        services: [], // Placeholder
        billing: { balance: 0, nextBillDate: '', pastInvoices: [], pendingInvoices: [], canceledInvoices: [], paymentPlans: [], promisesToPay: [] }, // Placeholder
        serviceCalls: [], // Placeholder
        inventory: [], // Placeholder
        documents: [], // Placeholder
        notes: [], // Placeholder
        history: [], // Placeholder
      } as Subscriber;
    }
    return null;
  } catch (e: any) {
    console.error(`Error getting subscriber ${id} from MySQL: `, e);
    throw new Error(`Failed to fetch subscriber: ${e.message}`);
  } finally {
    if (connection) connection.release();
  }
}

// Add updateSubscriber and removeSubscriber functions as needed
