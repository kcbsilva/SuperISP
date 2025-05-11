// src/services/mysql/subscribers.ts
'use server';
import pool from './db';
import type { Subscriber, SubscriberData, SubscriberStatus, SubscriberType } from '@/types/subscribers';

export async function addSubscriber(subscriberData: SubscriberData): Promise<number> {
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
    status = 'Active',
  } = subscriberData;

  const sql = `
    INSERT INTO subscribers (
      subscriber_type, full_name, company_name, birthday, established_date,
      address, point_of_reference, email, phone_number, mobile_number,
      tax_id, business_number, signup_date, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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

export async function listSubscribers(): Promise<Subscriber[]> {
  const sql = `
    SELECT 
      id, subscriber_type as "subscriberType", full_name as "fullName", company_name as "companyName", 
      birthday, established_date as "establishedDate", address, point_of_reference as "pointOfReference", 
      email, phone_number as "phoneNumber", mobile_number as "mobileNumber", tax_id as "taxId", 
      business_number as "businessNumber", signup_date as "signupDate", status, 
      created_at as "createdAt", updated_at as "updatedAt"
    FROM subscribers 
    ORDER BY created_at DESC
  `;
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(sql);
    return rows as Subscriber[];
  } catch (e: any) {
    console.error("Error getting subscribers from MySQL: ", e);
    throw new Error(`Failed to fetch subscribers: ${e.message}`);
  } finally {
    if (connection) connection.release();
  }
}

export async function getSubscriberById(id: number | string): Promise<Subscriber | null> {
  const sql = `
    SELECT 
      id, subscriber_type as "subscriberType", full_name as "fullName", company_name as "companyName", 
      birthday, established_date as "establishedDate", address, point_of_reference as "pointOfReference", 
      email, phone_number as "phoneNumber", mobile_number as "mobileNumber", tax_id as "taxId", 
      business_number as "businessNumber", signup_date as "signupDate", status, 
      created_at as "createdAt", updated_at as "updatedAt"
    FROM subscribers 
    WHERE id = ?
  `;
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(sql, [id]);
    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0] as Subscriber;
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
