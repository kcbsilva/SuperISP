// src/services/postgresql/olts.ts
'use server';

import { query } from '@/lib/postgresql/client';
import type { Olt, OltData, OltTechnology } from '@/types/olts';

const OLTS_TABLE_SCHEMA = `
  CREATE TABLE IF NOT EXISTS olts (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    technology VARCHAR(50) NOT NULL, -- EPON, GPON, XGS-PON
    ports INTEGER NOT NULL,
    ip_address VARCHAR(45) NOT NULL UNIQUE, -- Accommodates IPv4 and IPv6
    management_port INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'Active', -- Active, Inactive, Maintenance
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
`;

const UPDATE_OLTS_TRIGGER_FUNCTION = `
  CREATE OR REPLACE FUNCTION update_olts_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ language 'plpgsql';
`;

const UPDATE_OLTS_TRIGGER = `
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_trigger
      WHERE tgname = 'update_olts_updated_at' AND tgrelid = 'olts'::regclass
    ) THEN
      CREATE TRIGGER update_olts_updated_at
      BEFORE UPDATE ON olts
      FOR EACH ROW
      EXECUTE FUNCTION update_olts_updated_at_column();
    END IF;
  END
  $$;
`;

let oltsTableEnsured = false;
async function ensureOltsTable() {
  if (!oltsTableEnsured) {
    try {
      await query(OLTS_TABLE_SCHEMA);
      await query(UPDATE_OLTS_TRIGGER_FUNCTION);
      await query(UPDATE_OLTS_TRIGGER);
      console.log("'olts' table schema ensured.");
      oltsTableEnsured = true;
    } catch (e) {
      console.error("Error ensuring 'olts' table schema: ", e);
      // Potentially throw e or handle as critical error
    }
  }
}

/**
 * Adds a new OLT to the PostgreSQL database.
 */
export const addOlt = async (oltData: OltData): Promise<number> => {
  await ensureOltsTable();
  const {
    description,
    manufacturer,
    model,
    technology,
    ports,
    ipAddress,
    managementPort,
    status = 'Active',
  } = oltData;

  const sql = `
    INSERT INTO olts (
      description, manufacturer, model, technology, ports,
      ip_address, management_port, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id;
  `;
  const params = [
    description,
    manufacturer,
    model,
    technology,
    ports,
    ipAddress,
    managementPort,
    status,
  ];

  try {
    const result = await query(sql, params);
    console.log("OLT added with ID (PostgreSQL): ", result.rows[0].id);
    return result.rows[0].id;
  } catch (e: any) {
    console.error("Error adding OLT to PostgreSQL: ", e);
    if (e.code === '23505') { // unique_violation for ip_address
        throw new Error(`Failed to add OLT. IP address "${ipAddress}" already exists.`);
    }
    throw new Error(`Failed to add OLT (PostgreSQL): ${e.message}`);
  }
};

/**
 * Fetches all OLTs from the PostgreSQL database.
 */
export const getOlts = async (): Promise<Olt[]> => {
  await ensureOltsTable();
  const sql = `
    SELECT id, description, manufacturer, model, technology, ports,
           ip_address, management_port, status, created_at, updated_at
    FROM olts
    ORDER BY created_at DESC;
  `;
  try {
    const result = await query(sql);
    return result.rows.map((row: any) => ({
      id: row.id,
      description: row.description,
      manufacturer: row.manufacturer,
      model: row.model,
      technology: row.technology as OltTechnology,
      ports: row.ports,
      ipAddress: row.ip_address,
      managementPort: row.management_port,
      status: row.status,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));
  } catch (e: any) {
    console.error("Error getting OLTs from PostgreSQL: ", e);
    throw new Error(`Failed to fetch OLTs (PostgreSQL): ${e.message}`);
  }
};

/**
 * Fetches a single OLT by ID from the PostgreSQL database.
 */
export const getOltById = async (id: number): Promise<Olt | null> => {
  await ensureOltsTable();
  const sql = `
    SELECT id, description, manufacturer, model, technology, ports,
           ip_address, management_port, status, created_at, updated_at
    FROM olts
    WHERE id = $1;
  `;
  try {
    const result = await query(sql, [id]);
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    return {
      id: row.id,
      description: row.description,
      manufacturer: row.manufacturer,
      model: row.model,
      technology: row.technology as OltTechnology,
      ports: row.ports,
      ipAddress: row.ip_address,
      managementPort: row.management_port,
      status: row.status,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  } catch (e: any) {
    console.error(`Error getting OLT by ID ${id} from PostgreSQL: `, e);
    throw new Error(`Failed to fetch OLT (PostgreSQL): ${e.message}`);
  }
};

/**
 * Updates an existing OLT in the PostgreSQL database.
 */
export const updateOlt = async (id: number, data: Partial<OltData>): Promise<void> => {
  await ensureOltsTable();
  const fields = Object.keys(data).filter(key => (data as any)[key] !== undefined);
  if (fields.length === 0) {
    console.warn("No fields provided for OLT update.");
    return;
  }

  const setClauses = fields.map((field, index) => {
    // Convert camelCase to snake_case for DB columns
    const dbField = field === 'ipAddress' ? 'ip_address' : field === 'managementPort' ? 'management_port' : field.replace(/([A-Z])/g, '_$1').toLowerCase();
    return `${dbField} = $${index + 1}`;
  });

  const params = fields.map(field => (data as any)[field]);
  params.push(id); // For WHERE id = $N

  const sql = `
    UPDATE olts
    SET ${setClauses.join(', ')}
    WHERE id = $${params.length};
  `;

  try {
    await query(sql, params);
    console.log("OLT updated with ID (PostgreSQL): ", id);
  } catch (e: any) {
    console.error("Error updating OLT in PostgreSQL: ", e);
    if (e.code === '23505' && e.constraint === 'olts_ip_address_key') { // Check specific constraint name if available
        throw new Error(`Failed to update OLT. IP address "${data.ipAddress}" already exists.`);
    }
    throw new Error(`Failed to update OLT (PostgreSQL): ${e.message}`);
  }
};

/**
 * Deletes an OLT from the PostgreSQL database.
 */
export const deleteOlt = async (id: number): Promise<void> => {
  await ensureOltsTable();
  const sql = 'DELETE FROM olts WHERE id = $1;';
  try {
    await query(sql, [id]);
    console.log("OLT deleted with ID (PostgreSQL): ", id);
  } catch (e: any) {
    console.error("Error deleting OLT from PostgreSQL: ", e);
    throw new Error(`Failed to delete OLT (PostgreSQL): ${e.message}`);
  }
};
