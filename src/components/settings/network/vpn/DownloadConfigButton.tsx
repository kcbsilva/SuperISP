// src/components/settings/network/vpn/DownloadConfigButton.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { VPNConnection } from '@/types/vpn';
import {
  generateIpsecConf,
  generateIpsecSecrets,
} from '@/lib/generateStrongSwanConfig';

type Props = {
  vpn: VPNConnection;
};

export function DownloadConfigButton({ vpn }: Props) {
  const downloadTextFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = () => {
    const options = {
      leftId: '@vpn.prolter.local', // your server identity
      leftSubnet: '192.168.250.1/24',
    };

    const conf = generateIpsecConf(vpn, options);
    const secrets = generateIpsecSecrets(vpn, options);

    downloadTextFile(`${vpn.name}-ipsec.conf`, conf);
    downloadTextFile(`${vpn.name}-ipsec.secrets`, secrets);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={handleDownload}
      title="Download StrongSwan Config"
    >
      <Download className="h-4 w-4" />
    </Button>
  );
}
