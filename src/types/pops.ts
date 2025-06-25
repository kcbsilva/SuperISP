// src/types/pops.ts

export interface PopData {
  name: string;
  fullAddress: string;
  latitude: number;
  longitude: number;
  type: 'site' | 'tower' | 'presence';
  ownership: 'own' | 'rent';
  monthlyRent?: number;
  rentDueDate?: string;
  onContract?: boolean;
  contractLengthMonths?: number;
  contractStartDate?: string;
  alertRenewal?: boolean;
  alertBefore?: number;
  alertPeriodType?: 'days' | 'weeks' | 'months';
}

export interface Pop extends PopData {
  id: string; // 🟢 Ensure it's a string
  status?: string; // 🟢 Optional if it's not always present
  created_at?: string;
  updated_at?: string;
}
