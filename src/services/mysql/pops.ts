// src/services/mysql/pops.ts
'use server';
import pool from './db';
import type { Pop, PopData } from '@/types/pops';

export async function addPop(popData: PopData): Promise<number> {
  const { name, location, status = 'Active' } = popData;
  const sql = 'INSERT INTO pops (name, location, status) VALUES (?, ?, ?)';
  const params = [name, location, status];
  let connection;
  try {
    connection = await pool.getConnection();
    const [result] = await connection.execute(sql, params);
    // For INSERT, result is an OkPacket, which has insertId
    return (result as any).insertId;
  } catch (e: any) {
    console.error("Error adding PoP to MySQL: ", e);
    throw new Error(`Failed to add PoP: ${e.message}`);
  } finally {
    if (connection) connection.release();
  }
}

export async function getPops(): Promise<Pop[]> {
  const sql = 'SELECT id, name, location, status, created_at as "createdAt", updated_at as "updatedAt" FROM pops ORDER BY created_at DESC';
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(sql);
    return rows as Pop[];
  } catch (e: any) {
    console.error("Error getting PoPs from MySQL: ", e);
    throw new Error(`Failed to fetch PoPs: ${e.message}`);
  } finally {
    if (connection) connection.release();
  }
}

export async function updatePop(id: number | string, popData: Partial<Omit<PopData, 'id'>>): Promise<boolean> {
  const fields = [];
  const params = [];
  if (popData.name !== undefined) {
    fields.push('name = ?');
    params.push(popData.name);
  }
  if (popData.location !== undefined) {
    fields.push('location = ?');
    params.push(popData.location);
  }
  if (popData.status !== undefined) {
    fields.push('status = ?');
    params.push(popData.status);
  }

  if (fields.length === 0) {
    return false; // No fields to update
  }

  params.push(id);
  const sql = `UPDATE pops SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
  let connection;
  try {
    connection = await pool.getConnection();
    const [result] = await connection.execute(sql, params);
    return (result as any).affectedRows > 0;
  } catch (e: any) {
    console.error(`Error updating PoP ${id} in MySQL: `, e);
    throw new Error(`Failed to update PoP: ${e.message}`);
  } finally {
    if (connection) connection.release();
  }
}

export async function removePop(id: number | string): Promise<boolean> {
  const sql = 'DELETE FROM pops WHERE id = ?';
  let connection;
  try {
    connection = await pool.getConnection();
    const [result] = await connection.execute(sql, [id]);
    return (result as any).affectedRows > 0;
  } catch (e: any) {
    console.error(`Error removing PoP ${id} from MySQL: `, e);
    throw new Error(`Failed to remove PoP: ${e.message}`);
  } finally {
    if (connection) connection.release();
  }
}
