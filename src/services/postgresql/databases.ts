// src/services/postgresql/databases.ts
'use server';

import { query } from '@/lib/postgresql/client';

export interface DatabaseInfo {
  datname: string;
  datdba_owner: string | null; // Assuming owner can be fetched via join or specific query if needed
  encoding_name: string | null; // String representation of encoding like 'UTF8'
  size_bytes: string | null; // Size in bytes (as string from pg_database_size)
  size_pretty: string | null; // Human-readable size
}


// Basic validation for database name (server-side)
const isValidDbName = (name: string): boolean => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);

export async function createDatabase(dbName: string): Promise<void> {
  if (!isValidDbName(dbName)) {
    throw new Error('Invalid database name. Only alphanumeric characters and underscores are allowed, and it must start with a letter or underscore.');
  }
  // Use a parameterized query or ensure dbName is thoroughly sanitized if constructing SQL dynamically.
  // For CREATE DATABASE, the name cannot be a parameter directly.
  // We rely on isValidDbName for basic safety, but more robust sanitization/validation is crucial if names are complex.
  const sql = `CREATE DATABASE "${dbName}";`; // Double quotes handle reserved keywords and case sensitivity if needed.

  try {
    await query(sql); // No parameters needed for CREATE DATABASE like this
    console.log(`Database "${dbName}" created successfully.`);
  } catch (e: any) {
    console.error(`Error creating database "${dbName}": `, e.message, e.code);
    if (e.code === '42P04') { // duplicate_database
      throw new Error(`Database "${dbName}" already exists.`);
    } else if (e.code === '42501') { // insufficient_privilege
        throw new Error(`User does not have permission to create database "${dbName}".`);
    }
    // Add more specific error handling based on PostgreSQL error codes if needed
    throw new Error(`Failed to create database "${dbName}". Reason: ${e.message}`);
  }
}

export async function getDatabases(): Promise<DatabaseInfo[]> {
  try {
    // Query to get database names, owners (requires join with pg_authid), encoding, and size
    // Note: pg_get_userbyid is a function that converts owner OID to username
    const result = await query(`
      SELECT
        d.datname,
        pg_catalog.pg_get_userbyid(d.datdba) as datdba_owner,
        pg_catalog.pg_encoding_to_char(d.encoding) as encoding_name,
        pg_catalog.pg_database_size(d.datname) as size_bytes,
        pg_catalog.pg_size_pretty(pg_catalog.pg_database_size(d.datname)) as size_pretty
      FROM pg_catalog.pg_database d
      WHERE d.datistemplate = false
      ORDER BY d.datname;
    `);
    return result.rows as DatabaseInfo[];
  } catch (e:any) {
    console.error("Error fetching database list:", e);
    // Provide a more specific error or re-throw
    throw new Error(`Failed to fetch database list. Reason: ${e.message}`);
  }
}