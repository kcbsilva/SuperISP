// src/services/mysql/execute-query.ts
'use server';
import pool from './db';

interface QueryResult {
  rows?: any[];
  fields?: any[];
  rowCount?: number; // For SELECT, affectedRows for INSERT/UPDATE/DELETE
  command?: string; // The SQL command executed
  error?: string;
}

export async function executeMysqlQuery(sqlCommand: string): Promise<QueryResult> {
  if (!sqlCommand.trim()) {
    return { error: 'SQL command cannot be empty.' };
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const [results, fields] = await connection.execute(sqlCommand);

    // Determine if it's a SELECT or other type of query
    if (Array.isArray(results)) { // Typically for SELECT
      return {
        rows: results,
        fields: fields?.map(f => ({ name: f.name, type: f.type })), // Simplified field info
        rowCount: results.length,
        command: sqlCommand.substring(0, 50) + (sqlCommand.length > 50 ? '...' : ''),
      };
    } else if (typeof results === 'object' && results !== null && 'affectedRows' in results) { // For INSERT, UPDATE, DELETE
      return {
        rowCount: (results as mysql.OkPacket).affectedRows,
        command: sqlCommand.substring(0, 50) + (sqlCommand.length > 50 ? '...' : ''),
        // You might want to return insertId for INSERT operations
        // insertId: (results as mysql.OkPacket).insertId 
      };
    }
    return { command: sqlCommand.substring(0,50) + '...', error: 'Unknown query result format.' };

  } catch (error: any) {
    console.error(`Error executing MySQL query: ${sqlCommand}`, error);
    return { error: error.message || 'An unexpected error occurred during query execution.' };
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
