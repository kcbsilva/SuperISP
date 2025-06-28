// /opt/Prolter/src/utils/loadEncryptedCreds.ts
import { execSync } from 'child_process';

export function loadEncryptedCreds() {
  try {
    const decrypted = execSync(
      `gpg --quiet --batch --yes --decrypt --passphrase '${process.env.PGPASSWORD}' /opt/Prolter/db/creds.ts.gpg`
    ).toString();

    const dbVars = {
      dbUser: '',
      dbPassword: '',
      dbName: '',
    };

    decrypted.split('\n').forEach((line) => {
      if (line.includes('export const')) {
        const [, key, value] = line.match(/export const (\w+) = ['"](.+)['"]/) || [];
        if (key && value) dbVars[key as keyof typeof dbVars] = value;
      }
    });

    return dbVars;
  } catch (err) {
    console.error('❌ Failed to load encrypted DB credentials:', err);
    throw err;
  }
}
