// src/types/olts.ts
export type OltTechnology = 'EPON' | 'GPON' | 'XGS-PON';

// Data needed to create/update an OLT
export interface OltData {
  description: string;
  manufacturer: string;
  model: string;
  technology: OltTechnology;
  ports: number;
  ipAddress: string;
  managementPort: number;
  status?: string; // e.g., Active, Inactive, Maintenance
}

// Full OLT object structure including ID and timestamps
export interface Olt extends OltData {
  id: number; // SERIAL PRIMARY KEY
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
