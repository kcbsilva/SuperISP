// src/lib/encryption.ts
import crypto from 'crypto';

const IV_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const rawKey = process.env.NAS_ENCRYPTION_KEY;
  if (!rawKey) {
    throw new Error('NAS_ENCRYPTION_KEY is not defined in the environment variables.');
  }
  return Buffer.from(rawKey.padEnd(32, '0')); // Pad to 32 bytes
}

export function encrypt(text: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string): string {
  const key = getEncryptionKey();
  const [ivHex, encryptedHex] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
