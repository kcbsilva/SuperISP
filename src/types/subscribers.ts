// src/types/subscribers.ts
export type SubscriberType = 'Residential' | 'Commercial';
export type SubscriberStatus = 'Active' | 'Inactive' | 'Suspended' | 'Planned' | 'Canceled';

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
  signupDate?: Date | string | null;
  status?: SubscriberStatus;
}

// Full Subscriber object structure including ID and timestamps
export interface Subscriber extends SubscriberData {
  id: number; // SERIAL PRIMARY KEY
  status: SubscriberStatus;
  signupDate: Date; // Should be Date object after fetching
  createdAt: Date;
  updatedAt: Date;
}
