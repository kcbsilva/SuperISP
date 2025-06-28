'use client';

import { Button } from '@/components/ui/button';
import { ServerCog } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type Props = {
  id: number;
};

export function GenerateConfigButton({ id }: Props) {
  const handleGenerate = async () => {
    const res = await fetch(`/api/settings/network/vpn/generate/${id}`, {
      method: 'POST',
    });

    if (res.ok) {
      toast({ title: 'Config written to /etc/ipsec.conf and /etc/ipsec.secrets' });
    } else {
      toast({
        title: 'Failed to write VPN config',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button onClick={handleGenerate} variant="secondary" size="sm" title="Generate and write config to server">
      <ServerCog className="w-4 h-4 mr-2" />
      Write Config
    </Button>
  );
}
