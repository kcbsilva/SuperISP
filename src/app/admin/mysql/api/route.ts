// src/app/mysql/api/route.ts
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Function to parse the DATABASE_URL
function parseDatabaseUrl(databaseUrl: string) {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }

  const url = new URL(databaseUrl);

  // Basic validation
  if (url.protocol !== 'mysql:') {
    throw new Error('Invalid database URL protocol. Expected "mysql:".');
  }

  return {
    host: url.hostname,
    port: url.port ? parseInt(url.port, 10) : 3306, // Default MySQL port
    user: url.username,
    password: url.password,
    database: url.pathname.substring(1), // Remove leading '/'
  };
}

export async function POST(request: Request) {
  let connection; // Declare connection outside try block to ensure it can be closed in finally

  try {
    const { sqlCommand } = await request.json();

    if (!sqlCommand) {
      return NextResponse.json({ error: 'SQL command is missing' }, { status: 400 });
    }

    // Parse database URL from environment variable
    const dbConfig = parseDatabaseUrl(process.env.DATABASE_URL || '');

    // Establish database connection
    connection = await mysql.createConnection(dbConfig);

    // Execute the query
    // Use connection.execute for prepared statements to prevent SQL injection
    // However, since we are executing arbitrary commands from the CLI,
    // we'll use connection.query for simplicity here.
    // Be extremely cautious with this in a real application and sanitize input.
    const [rows, fields] = await connection.query(sqlCommand);

    // Determine if it's a SELECT query or an affecting query
    if (Array.isArray(rows)) {
      // SELECT query
      return NextResponse.json({ rows, fields: fields });
    } else {
      // INSERT, UPDATE, DELETE, etc.
      // The 'rows' object in this case contains properties like affectedRows, insertId, etc.
      return NextResponse.json({ rowCount: (rows as any).affectedRows, message: 'Command executed successfully.' });
    }

  } catch (error: any) {
    console.error('Database query error:', error);
    // Return error response
    return NextResponse.json({ error: error.message || 'An error occurred during query execution' }, { status: 500 });
  } finally {
    // Ensure the connection is closed even if an error occurs
    if (connection) {
      await connection.end();
    }
  }
}
