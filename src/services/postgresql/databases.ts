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
  const sql = `CREATE DATABASE "${dbName}";`;

  try {
    await query(sql);
    console.log(`Database "${dbName}" created successfully.`);
  } catch (e: any) {
    console.error(`Error creating database "${dbName}": `, e.message, e.code);
    if (e.code === '42P04') {
      throw new Error(`Database "${dbName}" already exists.`);
    } else if (e.code === '42501') {
        throw new Error(`User does not have permission to create database "${dbName}".`);
    }
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
    throw new Error(`Failed to fetch database list. Reason: ${e.message}`);
  }
}

export async function getCurrentDatabaseInfo(): Promise<DatabaseInfo | null> {
  const configuredDbName = process.env.PGDATABASE;

  if (!configuredDbName) {
    console.warn("PGDATABASE environment variable is not set. Cannot get current database info.");
    // This case might also be handled if getDatabases() fails due to getPool() throwing an error
    // because PGDATABASE is part of the connection details.
    // However, explicitly checking here provides a clearer warning.
    return null;
  }

  try {
    const allDatabases = await getDatabases(); // This will attempt to connect using PGDATABASE
    const currentDbInfo = allDatabases.find(db => db.datname === configuredDbName);

    if (!currentDbInfo) {
      console.warn(`Database "${configuredDbName}" specified in PGDATABASE was not found in the list of databases from the server, or it's a template database.`);
      return null;
    }
    return currentDbInfo;
  } catch (error) {
    // This catch block will handle errors from getDatabases (e.g., connection issues)
    console.error(`Error fetching info for current database "${configuredDbName}":`, error);
    // Re-throw the error so useQuery can handle it and display an error state in the UI
    throw error;
  }
}
