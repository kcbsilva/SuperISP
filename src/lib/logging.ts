// src/lib/logging.ts
import { db } from './db';

export interface LogEntry {
  userId: string | null;         // ID of the user performing the action
  action: string;                // e.g. CREATE_POP, DELETE_NAS
  target: string;                // e.g. PoP, NAS, Plan, etc.
  targetId?: string | number;   // ID of the affected resource (optional)
  message: string;              // Description of the action
  level?: 'info' | 'warning' | 'error'; // Optional log level
}

/**
 * Logs a user or system action into the system_logs table.
 */
export async function logAction({
  userId,
  action,
  target,
  targetId,
  message,
  level = 'info',
}: LogEntry): Promise<void> {
  try {
    await db.query(
      `
      INSERT INTO system_logs (user_id, action, target, target_id, message, level, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      `,
      [
        userId || 'system',
        action,
        target,
        targetId?.toString() ?? null,
        message,
        level,
      ]
    );
  } catch (error) {
    console.error('[LOGGING_ERROR]', error);
  }
}
