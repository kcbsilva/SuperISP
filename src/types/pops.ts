// src/types/pops.ts

// Data needed to create/update a PoP
export interface PopData {
  name: string;
  location: string;
  status?: string; // Optional when creating, default to 'active'
}

// Full PoP object structure returned from DB/API
export interface Pop extends PopData {
  id: number; // PostgreSQL SERIAL = number
  status: string; // Always present in DB
  created_at?: string; // Timestamps come as ISO strings from PostgreSQL
  updated_at?: string;
}
