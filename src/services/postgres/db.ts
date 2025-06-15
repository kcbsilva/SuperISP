// src/services/postgres/db.ts
import { Pool } from 'pg';

// Ensure your .env file has these variables:
// PG_HOST=your_postgres_host
// PG_PORT=your_postgres_port
// PG_USER=your_postgres_user
// PG_PASSWORD=your_postgres_password
// PG_DATABASE=your_postgres_database

const pool = new Pool({
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT || "5432", 10),
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false, // Basic SSL support
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } finally {
    client.release();
  }
}

export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()'); // Simple query to check connection
    client.release();
    console.log('PostgreSQL connection test successful.');
    return true;
  } catch (error) {
    console.error('PostgreSQL connection test failed:', error);
    return false;
  }
}

// Export the pool itself if you need to use transactions or more complex operations
export { pool };
