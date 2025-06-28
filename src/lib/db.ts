// src/lib/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'your_password',
  database: process.env.PGDATABASE || 'your_database_name',
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
export { pool };
export const db = { query, pool };
