// src/services/postgresql/databases.ts
'use server';

import { query } from '@/lib/postgresql/client';
// import { Client } from 'pg'; // Uncomment if direct client connection becomes necessary

// Basic validation for database name (server-side)
// Allows letters, numbers, and underscores. Must start with a letter or underscore.
// PostgreSQL identifiers are case-insensitive unless double-quoted. This regex enforces a common safe subset.
const isValidDbName = (name: string): boolean => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);

export async function createDatabase(dbName: string): Promise<void> {
  if (!isValidDbName(dbName)) {
    throw new Error('Invalid database name. Only alphanumeric characters and underscores are allowed, and it must start with a letter or underscore.');
  }

  // IMPORTANT: PostgreSQL's CREATE DATABASE command does not directly support parameters for the database name.
  // This means we have to interpolate the database name. This is a security risk if dbName is not
  // properly sanitized. The `isValidDbName` function provides basic sanitization.
  // In PostgreSQL, it's standard practice to double-quote identifiers to preserve case and allow reserved keywords.
  const sql = `CREATE DATABASE "${dbName}";`;

  try {
    // Assuming the pooled connection user has CREATEDB privileges.
    // If not, a direct connection with a superuser or a user with CREATEDB rights to the 'postgres'
    // maintenance database would be required.
    // Example for direct client (if needed later):
    /*
    const pgConfig = {
        host: process.env.PGHOST,
        user: process.env.PGUSER_ADMIN, // A user with CREATEDB privileges
        password: process.env.PGPASSWORD_ADMIN,
        port: parseInt(process.env.PGPORT || "5432", 10),
        database: 'postgres', // Connect to default 'postgres' db to issue CREATE DATABASE
    };
    const client = new Client(pgConfig);
    await client.connect();
    try {
        await client.query(sql);
        console.log(`Database "${dbName}" created successfully.`);
    } finally {
        await client.end();
    }
    */

    await query(sql); // Using the existing pool
    console.log(`Database "${dbName}" created successfully.`);
  } catch (e: any) {
    console.error(`Error creating database "${dbName}": `, e.message, e.code);
    // Check for specific PostgreSQL error codes
    if (e.code === '42P04') { // duplicate_database
      throw new Error(`Database "${dbName}" already exists.`);
    } else if (e.code === '42501') { // insufficient_privilege
        throw new Error(`User does not have permission to create database "${dbName}".`);
    }
    throw new Error(`Failed to create database "${dbName}". Reason: ${e.message}`);
  }
}

// Placeholder for getDatabases - actual implementation would query pg_catalog.pg_database
// This function is not used by the current "Add Database" feature but would be needed for listing.
/*
export async function getDatabases(): Promise<{ name: string }[]> {
  try {
    // This query typically requires superuser or specific grants.
    const result = await query("SELECT datname as name FROM pg_database WHERE datistemplate = false;");
    return result.rows;
  } catch (e) {
    console.error("Error fetching database list:", e);
    throw new Error("Failed to fetch database list.");
  }
}
*/