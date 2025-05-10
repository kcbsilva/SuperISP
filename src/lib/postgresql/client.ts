// src/lib/postgresql/client.ts
import { Pool } from 'pg';

let pool: Pool;

const getPool = (): Pool => {
  if (!pool) {
    const connectionString = process.env.POSTGRES_URL;
    if (!connectionString) {
        // Fallback to individual environment variables if POSTGRES_URL is not set
        if (!process.env.PGHOST || !process.env.PGUSER || !process.env.PGPASSWORD || !process.env.PGDATABASE || !process.env.PGPORT) {
            console.error("PostgreSQL connection details are missing. Please set POSTGRES_URL or individual PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT environment variables.");
            throw new Error("PostgreSQL connection details are not configured properly.");
        }
        pool = new Pool({
            host: process.env.PGHOST,
            user: process.env.PGUSER,
            password: process.env.PGPASSWORD,
            database: process.env.PGDATABASE,
            port: parseInt(process.env.PGPORT, 10),
            ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined, // Basic SSL support
        });
    } else {
        pool = new Pool({
            connectionString,
            ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined, // Basic SSL support
        });
    }

    pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client', err);
      // Optional: re-initialize pool or handle error appropriately
    });
  }
  return pool;
};

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  const currentPool = getPool();
  const client = await currentPool.connect();
  try {
    const res = await client.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error executing query', { text, error });
    throw error;
  } finally {
    client.release();
  }
};
