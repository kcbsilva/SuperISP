// src/services/postgresql/pops.ts
import { query } from '@/lib/postgresql/client';
import type { Pop, PopData } from '@/types/pops';

/**
 * PostgreSQL Table Schema for 'pops':
 *
 * CREATE TABLE pops (
 *   id SERIAL PRIMARY KEY,
 *   name VARCHAR(255) NOT NULL,
 *   location VARCHAR(255) NOT NULL,
 *   status VARCHAR(50) DEFAULT 'Active',
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
 * );
 *
 * -- Optional: Trigger to update updated_at on row update
 * CREATE OR REPLACE FUNCTION update_updated_at_column()
 * RETURNS TRIGGER AS $$
 * BEGIN
 *    NEW.updated_at = NOW();
 *    RETURN NEW;
 * END;
 * $$ language 'plpgsql';
 *
 * CREATE TRIGGER update_pops_updated_at
 * BEFORE UPDATE ON pops
 * FOR EACH ROW
 * EXECUTE FUNCTION update_updated_at_column();
 *
 */

// Function to add a new PoP to PostgreSQL
export const addPop = async (popData: PopData): Promise<number> => {
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

  const sql = `UPDATE pops SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${params.length}`;

  try {
    await query(sql, params);
    console.log("PoP updated with ID (PostgreSQL): ", id);
  } catch (e) {
    console.error("Error updating PoP in PostgreSQL: ", e);
    throw new Error('Failed to update PoP (PostgreSQL)');
  }
};
