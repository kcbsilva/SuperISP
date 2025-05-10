// src/services/postgresql/pops.ts
'use server';

import { query } from '@/lib/postgresql/client';
import type { Pop, PopData } from '@/types/pops';

const POPS_TABLE_SCHEMA = `
  CREATE TABLE IF NOT EXISTS pops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
`;

const UPDATE_POPS_TRIGGER_FUNCTION = `
  CREATE OR REPLACE FUNCTION update_pops_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ language 'plpgsql';
`;

const UPDATE_POPS_TRIGGER = `
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_trigger
      WHERE tgname = 'update_pops_updated_at' AND tgrelid = 'pops'::regclass
    ) THEN
      CREATE TRIGGER update_pops_updated_at
      BEFORE UPDATE ON pops
      FOR EACH ROW
      EXECUTE FUNCTION update_pops_updated_at_column();
    END IF;
  END
  $$;
`;

let popsTableEnsured = false;
async function ensurePopsTable() {
  if (!popsTableEnsured) {
    try {
      await query(POPS_TABLE_SCHEMA);
      await query(UPDATE_POPS_TRIGGER_FUNCTION);
      await query(UPDATE_POPS_TRIGGER);
      console.log("'pops' table schema ensured.");
      popsTableEnsured = true;
    } catch (e) {
      console.error("Error ensuring 'pops' table schema: ", e);
      // Potentially throw e or handle as critical error
    }
  }
}

// Function to add a new PoP to PostgreSQL
export const addPop = async (popData: PopData): Promise<number> => {
  await ensurePopsTable();
  const sql = 'INSERT INTO pops (name, location, status) VALUES ($1, $2, $3) RETURNING id';
  const status = popData.status ?? 'Active';
  const params = [popData.name, popData.location, status];
  try {
    const result = await query(sql, params);
    console.log("PoP added with ID (PostgreSQL): ", result.rows[0].id);
    return result.rows[0].id;
  } catch (e) {
    console.error("Error adding PoP to PostgreSQL: ", e);
    throw new Error('Failed to add PoP (PostgreSQL)');
  }
};

// Function to get all PoPs from PostgreSQL
export const getPops = async (): Promise<Pop[]> => {
  await ensurePopsTable();
  const sql = 'SELECT id, name, location, status, created_at, updated_at FROM pops ORDER BY created_at DESC';
  try {
    const result = await query(sql);
    console.log("Fetched PoPs (PostgreSQL): ", result.rows.length);
    return result.rows.map((row: any) => ({
      id: row.id, // id is number from SERIAL
      name: row.name,
      location: row.location,
      status: row.status,
      createdAt: row.created_at ? new Date(row.created_at) : undefined,
      updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
    }));
  } catch (e) {
    console.error("Error getting PoPs from PostgreSQL: ", e);
    throw new Error('Failed to fetch PoPs (PostgreSQL)');
  }
};

// Function to delete a PoP from PostgreSQL
export const deletePop = async (id: number | string): Promise<void> => {
  await ensurePopsTable();
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  if (isNaN(numericId)) {
    throw new Error('Invalid PoP ID for deletion.');
  }
  const sql = 'DELETE FROM pops WHERE id = $1';
  try {
    await query(sql, [numericId]);
    console.log("PoP deleted with ID (PostgreSQL): ", id);
  } catch (e) {
    console.error("Error deleting PoP from PostgreSQL: ", e);
    throw new Error('Failed to delete PoP (PostgreSQL)');
  }
};

// Function to update a PoP in PostgreSQL
export const updatePop = async (id: number | string, data: Partial<PopData>): Promise<void> => {
  await ensurePopsTable();
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  if (isNaN(numericId)) {
    throw new Error('Invalid PoP ID for update.');
  }

  const fields = Object.keys(data).filter(key => data[key as keyof PopData] !== undefined);
  if (fields.length === 0) {
    console.warn("No fields provided for PoP update.");
    return;
  }

  const setClauses = fields.map((field, index) => `${field} = $${index + 1}`);
  const params = fields.map(field => data[field as keyof PopData]);
  params.push(numericId); // For WHERE id = $N

  // updated_at is handled by the trigger, so we don't need to set it manually here.
  const sql = `UPDATE pops SET ${setClauses.join(', ')} WHERE id = $${params.length}`;

  try {
    await query(sql, params);
    console.log("PoP updated with ID (PostgreSQL): ", id);
  } catch (e) {
    console.error("Error updating PoP in PostgreSQL: ", e);
    throw new Error('Failed to update PoP (PostgreSQL)');
  }
};
