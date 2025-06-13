// src/services/mysql/pops.ts
import type { Pop, PopData } from '@/types/pops';

// Helper function to call the generic SQL API
async function executeSql<T = any>(sqlCommand: string, params: any[] = []): Promise<T> {
  // Note: The current /api/mysql route doesn't directly support parameterized queries.
  // For true parameterized queries to prevent SQL injection, the API route would need modification.
  // Here, we're just sending the raw SQL string. BE VERY CAREFUL WITH USER INPUT if this were to be used more broadly.
  // For PoPs, the input is validated by Zod, which offers some protection.

  // Simple parameter replacement for now (NOT SQL INJECTION SAFE for arbitrary input)
  let formattedSql = sqlCommand;
  params.forEach((param, index) => {
    const placeholder = new RegExp(`\\$${index + 1}`);
    if (typeof param === 'string') {
      // Basic escaping for strings
      formattedSql = formattedSql.replace(placeholder, `'${param.replace(/'/g, "''")}'`);
    } else if (typeof param === 'number') {
      formattedSql = formattedSql.replace(placeholder, param.toString());
    } else if (param === null || param === undefined) {
      formattedSql = formattedSql.replace(placeholder, 'NULL');
    } else {
      // Fallback for other types - might need more specific handling
      formattedSql = formattedSql.replace(placeholder, `'${String(param).replace(/'/g, "''")}'`);
    }
  });


  const response = await fetch('/api/mysql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sqlCommand: formattedSql }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `API Error: ${response.status}`);
  }
  return response.json();
}

// Map database row to Pop type
function mapRowToPop(row: any): Pop {
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    status: row.status,
    createdAt: row.created_at ? new Date(row.created_at) : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
  };
}

export async function getPops(): Promise<Pop[]> {
  const result = await executeSql<{ rows: any[] }>('SELECT id, name, location, status, created_at, updated_at FROM pops ORDER BY name ASC;');
  return result.rows.map(mapRowToPop);
}

export async function addPop(popData: PopData): Promise<number> { // Returns new PoP ID
  const sql = 'INSERT INTO pops (name, location, status) VALUES ($1, $2, $3);';
  const params = [popData.name, popData.location, popData.status || 'Active'];
  const result = await executeSql<{ insertId?: number; affectedRows?: number }>(sql, params);
  if (result.insertId) {
    return result.insertId;
  }
  // Fallback or if insertId is not returned for some reason but rows were affected
  if (result.affectedRows && result.affectedRows > 0) {
     // We can't easily get the ID here without another query if insertId isn't present
     // For now, we'll assume the calling code might refetch or handle it.
     // A more robust solution would ensure insertId is always available or query it.
    return 0; // Placeholder, ideally this case is handled better
  }
  throw new Error('Failed to add PoP, no insertId returned.');
}

export async function updatePop(id: string | number, popData: PopData): Promise<number> { // Returns number of affected rows
  const sql = 'UPDATE pops SET name = $1, location = $2, status = $3 WHERE id = $4;';
  const params = [popData.name, popData.location, popData.status || 'Active', id];
  const result = await executeSql<{ affectedRows: number }>(sql, params);
  return result.affectedRows;
}

export async function removePop(id: string | number): Promise<number> { // Returns number of affected rows
  const sql = 'DELETE FROM pops WHERE id = $1;';
  const params = [id];
  const result = await executeSql<{ affectedRows: number }>(sql, params);
  return result.affectedRows;
}
