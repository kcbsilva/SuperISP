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
  subscriberType: SubscriberType;
  fullName?: string;
  companyName?: string;
  birthday?: Date | string | null;
  establishedDate?: Date | string | null;
  address: string;
  pointOfReference?: string;
  email: string;
  phoneNumber: string;
  mobileNumber?: string;
  taxId?: string;
  businessNumber?: string;
  idNumber?: string; // Added from previous use
  signupDate?: Date | string | null;
  status?: SubscriberStatus;
  services?: SubscriberService[];
  billing?: BillingDetails;
  serviceCalls?: ServiceCall[];
  inventory?: InventoryItem[];
  documents?: Document[];
  notes?: Note[];
  history?: HistoryEntry[];
}

// Full Subscriber object structure including ID and timestamps
export interface Subscriber extends SubscriberData {
  id: number; // SERIAL PRIMARY KEY
  status: SubscriberStatus;
  signupDate: Date; // Should be Date object after fetching
  createdAt: Date;
  updatedAt: Date;
  // Ensure these are always present on the full Subscriber object
  services: SubscriberService[];
  billing: BillingDetails;
  serviceCalls: ServiceCall[];
  inventory: InventoryItem[];
  documents: Document[];
  notes: Note[];
  history: HistoryEntry[];
}
