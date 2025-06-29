// /opt/Prolter/src/utils/loadEncryptedCreds.ts
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

export function loadEncryptedCreds() {
  try {
    // Read the passphrase from the .gpgpass file
    const passphrase = readFileSync('/opt/Prolter/.gpgpass', 'utf8').trim();
    
    const decrypted = execSync(
      `gpg --quiet --batch --yes --decrypt --passphrase '${passphrase}' /opt/Prolter/db/creds.ts.gpg`,
      { encoding: 'utf8' }
    );

    const dbVars = {
      dbUser: '',
      dbPassword: '',
      dbName: '',
    };

    decrypted.split('\n').forEach((line) => {
      if (line.includes('export const')) {
        const match = line.match(/export const (\w+) = ['"](.+)['"]/);
        if (match) {
          const [, key, value] = match;
          if (key in dbVars) {
            dbVars[key as keyof typeof dbVars] = value;
          }
        }
      }
    });

    return dbVars;
  } catch (err) {
    console.error('❌ Failed to load encrypted DB credentials:', err);
    throw err;
  }
}