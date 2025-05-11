// src/services/mysql/db.ts
import mysql from 'mysql2/promise';

// Configuration for the MySQL connection pool
// It's recommended to use environment variables for sensitive data
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'superisp', // Default to 'superisp' if not set
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query(sql: string, params?: any[]) {
  const connection = await pool.getConnection();
  try {
    const [rows, fields] = await connection.execute(sql, params);
    return { rows, fields };
  } finally {
    connection.release();
  }
}

export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to MySQL.');
    connection.release();
    return true;
  } catch (error) {
    console.error('Failed to connect to MySQL:', error);
    return false;
  }
}

export default pool;
