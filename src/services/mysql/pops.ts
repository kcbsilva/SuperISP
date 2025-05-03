// src/services/mysql/pops.ts
import { query } from '@/lib/mysql/client'; // Using the simulated client
import type { Pop, PopData } from '@/types/pops';

/**
 * MySQL Table Schema for 'pops':
 *
 * CREATE TABLE pops (
 *   id INT AUTO_INCREMENT PRIMARY KEY,
 *   name VARCHAR(255) NOT NULL,
 *   location VARCHAR(255) NOT NULL,
 *   status VARCHAR(50) DEFAULT 'Active',
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
 * );
 *
 */

// Function to add a new PoP to MySQL
export const addPop = async (popData: PopData): Promise<number> => {
  const sql = 'INSERT INTO pops (name, location, status) VALUES (?, ?, ?)';
  const params = [popData.name, popData.location, popData.status || 'Active'];
  try {
    const result = await query(sql, params);
    console.log("PoP added with ID (MySQL Simulated): ", result.insertId);
    // Assuming the simulated query returns an object with insertId
    if (typeof result.insertId === 'number') {
       return result.insertId;
    }
     // Fallback for simulation if insertId is not a number
     return Date.now(); // Return a mock ID
  } catch (e) {
    console.error("Error adding PoP to MySQL (Simulated): ", e);
    throw new Error('Failed to add PoP (MySQL Simulated)');
  }
};

// Function to get all PoPs from MySQL
export const getPops = async (): Promise<Pop[]> => {
  const sql = 'SELECT id, name, location, status, created_at, updated_at FROM pops ORDER BY created_at DESC';
  try {
    const results = await query(sql);
    console.log("Fetched PoPs (MySQL Simulated): ", results.length);
    // Map MySQL row structure to Pop type
    return results.map((row: any) => ({
      id: row.id.toString(), // Ensure ID is string if needed by frontend type
      name: row.name,
      location: row.location,
      status: row.status,
      createdAt: row.created_at ? new Date(row.created_at) : undefined, // Convert to Date
      updatedAt: row.updated_at ? new Date(row.updated_at) : undefined, // Convert to Date
    }));
  } catch (e) {
    console.error("Error getting PoPs from MySQL (Simulated): ", e);
    throw new Error('Failed to fetch PoPs (MySQL Simulated)');
  }
};

// Function to delete a PoP from MySQL
export const deletePop = async (id: number | string): Promise<void> => {
    // Ensure id is a number for the query if your table uses numeric IDs
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(numericId)) {
        throw new Error('Invalid PoP ID for deletion.');
    }
  const sql = 'DELETE FROM pops WHERE id = ?';
  try {
    await query(sql, [numericId]);
    console.log("PoP deleted with ID (MySQL Simulated): ", id);
  } catch (e) {
    console.error("Error deleting PoP from MySQL (Simulated): ", e);
    throw new Error('Failed to delete PoP (MySQL Simulated)');
  }
};

// Function to update a PoP in MySQL
export const updatePop = async (id: number | string, data: Partial<PopData>): Promise<void> => {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
     if (isNaN(numericId)) {
         throw new Error('Invalid PoP ID for update.');
     }
  // Build SET clause dynamically based on provided data
  const fields = Object.keys(data).filter(key => data[key as keyof PopData] !== undefined);
  if (fields.length === 0) {
    console.warn("No fields provided for PoP update.");
    return; // Nothing to update
  }
  const setClause = fields.map(field => `${field} = ?`).join(', ');
  const params = fields.map(field => data[field as keyof PopData]);
  params.push(numericId); // Add ID for the WHERE clause

  const sql = `UPDATE pops SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

  try {
    await query(sql, params);
    console.log("PoP updated with ID (MySQL Simulated): ", id);
  } catch (e) {
    console.error("Error updating PoP in MySQL (Simulated): ", e);
    throw new Error('Failed to update PoP (MySQL Simulated)');
  }
};
