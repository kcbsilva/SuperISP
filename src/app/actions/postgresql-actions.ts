// src/app/actions/postgresql-actions.ts
'use server';

import { query } from '@/lib/postgresql/client';
import type { QueryResult } from 'pg';

interface ExecutionResponse {
  result?: any; // Can be QueryResult or a simple message
  error?: string;
}

export async function executeSqlCommand(sql: string): Promise<ExecutionResponse> {
  if (!sql || sql.trim() === "") {
    return { error: "SQL command cannot be empty." };
  }

  try {
    const pgResult: QueryResult = await query(sql);
    // For SELECT queries, pgResult.rows contains the data.
    // For DML/DDL (INSERT, UPDATE, DELETE, CREATE, ALTER, DROP), pgResult usually contains command and rowCount.
    // We will return the whole pgResult object for flexibility in the frontend,
    // or a simplified version if preferred.
    return { result: pgResult };
  } catch (e: any) {
    console.error("Error executing SQL command via server action:", e);
    // Sanitize error message if needed, but for an admin CLI, showing raw error might be acceptable.
    return { error: e.message || "An unknown error occurred during SQL execution." };
  }
}
