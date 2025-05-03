// src/types/pops.ts
import type { Timestamp } from 'firebase/firestore'; // Keep Firestore Timestamp for potential future use or type checking

// Data needed to create/update a PoP
export interface PopData {
  name: string;
  location: string;
  status?: string; // Status might be optional during creation/update
}

// Full PoP object structure including ID and timestamps
// Adjust for potential MySQL data types (Date instead of Firestore Timestamp)
export interface Pop extends PopData {
  id: string | number; // ID could be number (MySQL auto_increment) or string (Firestore)
  status: string; // Ensure status is always present
  createdAt?: Date | Timestamp; // Can be Date from MySQL or Timestamp from Firestore
  updatedAt?: Date | Timestamp; // Can be Date from MySQL or Timestamp from Firestore
}
