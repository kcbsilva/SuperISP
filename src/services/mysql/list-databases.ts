// src/services/mysql/list-databases.ts
'use server';
import pool from './db';

export async function listMysqlDatabases(): Promise<string[]> {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query('SHOW DATABASES');
    // The result for SHOW DATABASES is an array of objects, each with a 'Database' property
    if (Array.isArray(rows)) {
      return rows.map((row: any) => row.Database).filter(dbName => 
        !['information_schema', 'mysql', 'performance_schema', 'sys'].includes(dbName)
      );
    }
    return [];
  } catch (error: any) {
    console.error('Error listing MySQL databases:', error);
    throw new Error(`Failed to list MySQL databases: ${error.message}`);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export async function createMysqlDatabase(dbName: string): Promise<void> {
  if (!dbName || !/^[a-zA-Z0-9_]+$/.test(dbName)) {
    throw new Error('Invalid database name. Only alphanumeric characters and underscores are allowed.');
  }
  let connection;
  try {
    connection = await pool.getConnection();
    // Use backticks to safely quote the database name
    await connection.query(`CREATE DATABASE \`${dbName}\``);
    console.log(`Database ${dbName} created successfully.`);
  } catch (error: any) {
    console.error(`Error creating MySQL database ${dbName}:`, error);
    throw new Error(`Failed to create MySQL database ${dbName}: ${error.message}`);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
