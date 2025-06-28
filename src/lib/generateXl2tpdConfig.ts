// src/lib/generateXl2tpdConfig.ts
import { VPNConnection } from '@/types/vpn';
import fs from 'fs';

export function generateXl2tpdConfig(vpn: VPNConnection): string {
  return `
[client-${vpn.username}]
lns = ${vpn.remote_address}
ppp debug = yes
pppoptfile = /etc/ppp/options.l2tpd.${vpn.username}
length bit = yes
`.trim();
}

export function generatePppOptions(vpn: VPNConnection): string {
  return `
name ${vpn.username}
password ${vpn.password}
require-mschap-v2
refuse-eap
require-authentication
ms-dns 8.8.8.8
ms-dns 1.1.1.1
noccp
idle 1800
mtu 1410
mru 1410
lock
connect-delay 5000
`.trim();
}

export function writeXl2tpdFiles(vpn: VPNConnection) {
  const l2tpConfig = generateXl2tpdConfig(vpn);
  const pppOptions = generatePppOptions(vpn);

  fs.appendFileSync('/etc/xl2tpd/xl2tpd.conf', `\n\n${l2tpConfig}`);
  fs.writeFileSync(`/etc/ppp/options.l2tpd.${vpn.username}`, pppOptions);
}
