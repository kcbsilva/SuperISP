// src/types/subscribers.ts
export type SubscriberType = 'Residential' | 'Commercial';
export type SubscriberStatus = 'Active' | 'Inactive' | 'Suspended' | 'Planned' | 'Canceled';
export type ServiceStatus = 'Active' | 'Suspended' | 'Canceled' | 'Planned';
export type ServiceTechnology = 'Fiber' | 'Radio' | 'UTP' | 'Satellite' | 'Other';
export type AuthenticationType = 'PPPoE' | 'IPoE' | 'IPxMAC' | 'StaticIP' | 'Other';


export interface SubscriberService {
  id: string;
  type: 'Internet' | 'TV' | 'Landline' | 'Mobile' | 'Combo' | 'Other';
  plan: string;
  popId: string;
  status: ServiceStatus;
  technology?: ServiceTechnology; // Optional, specific to Internet typically
  downloadSpeed?: string;
  uploadSpeed?: string;
  ipAddress?: string;
  onlineStatus?: 'Online' | 'Offline';
  authenticationType?: AuthenticationType;
  pppoeUsername?: string;
  pppoePassword?: string; // Store securely or handle appropriately
  ipoeUsername?: string;
  ipoePassword?: string;
  macAddress?: string;
  xponSn?: string;
}

export interface Invoice {
  id: string;
  contractId: string;
  dateMade: string; // Or Date
  dueDate: string; // Or Date
  value: number;
  wallet: string;
  status: 'Paid' | 'Due' | 'Canceled';
  itemType?: 'invoice'; // For differentiating in combined lists
}

export interface PaymentPlan {
  id: string;
  startDate: string; // Or Date
  installments: number;
  installmentAmount: number;
  status: 'Active' | 'Completed' | 'Defaulted';
  itemType?: 'paymentPlan';
}

export interface PromiseToPay {
  id: string;
  promiseDate: string; // Or Date
  amount: number;
  status: 'Pending' | 'Honored' | 'Broken';
  itemType?: 'promiseToPay';
}

export interface BillingDetails {
  balance: number;
  nextBillDate: string; // Or Date
  pastInvoices: Invoice[];
  pendingInvoices: Invoice[];
  canceledInvoices: Invoice[];
  paymentPlans: PaymentPlan[];
  promisesToPay: PromiseToPay[];
}

export interface ServiceCall {
    id: string;
    date: string; // Or Date
    reason: string;
    status: 'Pending' | 'In Progress' | 'Resolved' | 'Canceled';
    technician?: string;
    notes?: string;
}

export interface InventoryItem {
    id: string;
    name: string;
    serialNumber: string;
    type: 'Router' | 'Modem' | 'ONT' | 'SetTopBox' | 'Other';
    status: 'Lent' | 'Sold' | 'Returned' | 'Defective';
    assignedDate: string; // Or Date
}

export interface Document {
    id: string;
    name: string;
    type: 'Contract' | 'ID' | 'Proof of Address' | 'Other';
    uploadDate: string; // Or Date
    url: string; // Link to the document
}

export interface Note {
    id: string;
    date: string; // Or Date
    author: string;
    content: string;
}

export interface HistoryEntry {
    id: string;
    date: string; // Or Date
    user: string;
    action: string;
    details?: string;
}


// Data needed to create/update a Subscriber
export interface SubscriberData {
  subscriber_type: SubscriberType; // Matches Supabase column name
  full_name?: string | null; // Matches Supabase column name
  company_name?: string | null; // Matches Supabase column name
  birthday?: Date | string | null;
  established_date?: Date | string | null; // Matches Supabase column name
  address: string;
  point_of_reference?: string | null; // Matches Supabase column name
  email: string;
  phone_number: string; // Matches Supabase column name
  mobile_number?: string | null; // Matches Supabase column name
  tax_id?: string | null; // Matches Supabase column name
  business_number?: string | null; // Matches Supabase column name
  id_number?: string | null; // Matches Supabase column name
  signup_date?: Date | string | null; // Matches Supabase column name
  status?: SubscriberStatus;
  // These will be handled by separate tables/queries in Supabase
  services?: SubscriberService[];
  billing?: BillingDetails;
  serviceCalls?: ServiceCall[];
  inventory?: InventoryItem[];
  documents?: Document[];
  notes?: Note[];
  history?: HistoryEntry[];
}

// Full Subscriber object structure including ID and timestamps
export interface Subscriber extends Omit<SubscriberData, 'subscriber_type' | 'full_name' | 'company_name' | 'established_date' | 'point_of_reference' | 'phone_number' | 'mobile_number' | 'tax_id' | 'business_number' | 'id_number' | 'signup_date'> {
  id: string; // UUID from Supabase
  subscriberType: SubscriberType; // Mapped from subscriber_type for frontend consistency
  fullName?: string | null; // Mapped from full_name
  companyName?: string | null; // Mapped from company_name
  establishedDate?: Date | string | null; // Mapped
  pointOfReference?: string | null; // Mapped
  phoneNumber: string; // Mapped
  mobileNumber?: string | null; // Mapped
  taxId?: string | null; // Mapped
  businessNumber?: string | null; // Mapped
  idNumber?: string | null; // Mapped
  signupDate: Date; // Mapped and ensured as Date
  status: SubscriberStatus;
  createdAt: Date; // Mapped from created_at
  updatedAt: Date; // Mapped from updated_at

  // Nested details will be fetched separately for profile view
  services: SubscriberService[];
  billing: BillingDetails;
  serviceCalls: ServiceCall[];
  inventory: InventoryItem[];
  documents: Document[];
  notes: Note[];
  history: HistoryEntry[];
}
