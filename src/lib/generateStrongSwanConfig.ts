// src/lib/generateStrongSwanConfig.ts
import { VPNConnection } from '@/types/vpn';
import fs from 'fs';
import path from 'path';

type ConfigOptions = {
  leftId: string;
  leftSubnet: string;
  writeToDisk?: boolean;
};

export function generateIpsecConf(
  vpn: VPNConnection,
  options: ConfigOptions
): string {
  const { leftId, leftSubnet } = options;

  return `
conn ${vpn.name}
  auto=add
  keyexchange=ikev2
  type=tunnel
  authby=psk
  left=%any
  leftid=${leftId}
  leftsubnet=${leftSubnet}
  right=${vpn.remote_address || '%any'}
  rightsubnet=${vpn.remote_subnet}
  ike=aes256-sha256-modp2048
  esp=aes256-sha256
`.trim();
}

export function generateIpsecSecrets(
  vpn: VPNConnection,
  options: ConfigOptions
): string {
  return `${options.leftId} : PSK "${vpn.pre_shared_key}"`;
}

/**
 * Optionally write generated content to disk (as root)
 */
export function writeServerVpnConfigToDisk(
  vpn: VPNConnection,
  options: ConfigOptions
) {
  const conf = generateIpsecConf(vpn, options);
  const secrets = generateIpsecSecrets(vpn, options);

  fs.appendFileSync('/etc/ipsec.conf', `\n\n${conf}`);
  fs.appendFileSync('/etc/ipsec.secrets', `\n${secrets}`);
}
