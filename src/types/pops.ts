// src/types/pops.ts
import type { Timestamp } from 'firebase/firestore';

// Data needed to create/update a PoP
export interface PopData {
  name: string;
  location: string;
  status?: string; // Status might be optional during creation/update
}

// Full PoP object structure including ID and timestamps
export interface Pop extends PopData {
  id: string; // Firestore document ID
  status: string; // Ensure status is always present
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
