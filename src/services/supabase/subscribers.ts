// src/services/supabase/subscribers.ts
'use server';
import { supabase } from './db';
import type { Subscriber, SubscriberData, SubscriberStatus, SubscriberType } from '@/types/subscribers';

// Helper to map Supabase row to frontend Subscriber type
function mapRowToSubscriber(row: any): Subscriber {
  return {
    id: row.id,
    subscriberType: row.subscriber_type as SubscriberType,
    fullName: row.full_name,
    companyName: row.company_name,
    birthday: row.birthday ? new Date(row.birthday) : undefined,
    establishedDate: row.established_date ? new Date(row.established_date) : undefined,
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
    // For list view, these are typically empty or fetched on demand for profile
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

export async function listSubscribersFromSupabase(): Promise<Subscriber[]> {
  console.log('Supabase service: listSubscribersFromSupabase called');
  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching subscribers from Supabase:', error);
    throw new Error(`Failed to fetch subscribers: ${error.message}`);
  }
  return data ? data.map(mapRowToSubscriber) : [];
}

export async function addSubscriberToSupabase(subscriberData: SubscriberData): Promise<Subscriber> {
  console.log('Supabase service: addSubscriberToSupabase called with', subscriberData);
  
  // Prepare data for Supabase (match column names)
  const dataToInsert = {
    subscriber_type: subscriberData.subscriber_type,
    full_name: subscriberData.full_name || null,
    company_name: subscriberData.company_name || null,
    birthday: subscriberData.birthday ? new Date(subscriberData.birthday).toISOString().split('T')[0] : null,
    established_date: subscriberData.established_date ? new Date(subscriberData.established_date).toISOString().split('T')[0] : null,
    address: subscriberData.address,
    point_of_reference: subscriberData.point_of_reference || null,
    email: subscriberData.email,
    phone_number: subscriberData.phone_number,
    mobile_number: subscriberData.mobile_number || null,
    tax_id: subscriberData.tax_id || null,
    business_number: subscriberData.business_number || null,
    id_number: subscriberData.id_number || null,
    signup_date: subscriberData.signup_date ? new Date(subscriberData.signup_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    status: subscriberData.status || 'Active',
  };

  const { data: newRow, error } = await supabase
    .from('subscribers')
    .insert(dataToInsert)
    .select()
    .single();

  if (error) {
    console.error('Error adding subscriber to Supabase:', error);
    throw new Error(`Failed to add subscriber: ${error.message}`);
  }
  if (!newRow) {
    throw new Error('Failed to add subscriber, no data returned.');
  }
  return mapRowToSubscriber(newRow);
}

export async function getSubscriberByIdFromSupabase(id: string): Promise<Subscriber | null> {
  console.log('Supabase service: getSubscriberByIdFromSupabase called for ID', id);
  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // PostgREST error code for "Not found"
      return null;
    }
    console.error(`Error fetching subscriber ${id} from Supabase:`, error);
    throw new Error(`Failed to fetch subscriber: ${error.message}`);
  }
  return data ? mapRowToSubscriber(data) : null;
}

// Add updateSubscriber and removeSubscriber functions as needed for Supabase
