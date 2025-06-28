// src/lib/db.ts
import { Pool } from 'pg';
import { loadEncryptedCreds } from '@/utils/loadEncryptedCreds';

const { dbUser, dbPassword, dbName } = loadEncryptedCreds();

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT || 5432),
  user: dbUser || process.env.PGUSER || 'postgres',
  password: dbPassword || process.env.PGPASSWORD || 'your_password',
  database: dbName || process.env.PGDATABASE || 'your_database_name',
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
export { pool };
export const db = { query, pool };
