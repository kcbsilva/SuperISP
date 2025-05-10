// src/lib/postgresql/client.ts
'use server';

import { Pool } from 'pg';

let pool: Pool;
let poolInitializationAttempted = false;

const getPool = (): Pool => {
  if (!pool && !poolInitializationAttempted) {
    poolInitializationAttempted = true; // Mark that we've tried to initialize
    const connectionString = process.env.POSTGRES_URL;
    try {
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
      console.log("PostgreSQL pool created successfully.");

      pool.on('error', (err) => {
        console.error('Unexpected error on idle PostgreSQL client', err);
        // Optional: re-initialize pool or handle error appropriately
      });
    } catch (error) {
        console.error("Failed to create PostgreSQL pool:", error);
        // pool remains undefined, so subsequent calls will re-throw or re-attempt if logic allows
        throw error; // Re-throw to indicate failure
    }
  }
  if (!pool) {
    // This case means initialization was attempted but failed, or was never attempted and is now requested again.
    // If it failed, re-throwing or a more specific error is appropriate.
    throw new Error("PostgreSQL pool is not available. Check previous logs for connection errors.");
  }
  return pool;
};

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  let currentPool;
  try {
    currentPool = getPool();
  } catch (poolError) {
    console.error("Failed to get PostgreSQL pool for query:", poolError);
    throw poolError; // Propagate the error
  }
  
  const client = await currentPool.connect();
  try {
    const res = await client.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration: `${duration}ms`, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error executing query', { text, error });
    throw error;
  } finally {
    client.release();
  }
};
