// src/components/maps/elements/polls/profile/PollDetails.tsx
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { HydroPoll } from '../types';
import { PollMiniMap } from './PollMiniMap';

interface PollDetailsProps {
  poll: HydroPoll;
  isEditing: boolean;
  onChange: (field: keyof HydroPoll, value: any) => void;
}

export function PollDetails({ poll, isEditing, onChange }: PollDetailsProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2 text-xs">
      {/* Left: Details */}
      <div className="space-y-3">
        {[
          ['ID', <span className="font-medium">{poll.id}</span>],
          ['Description', <Input className="h-7" disabled={!isEditing} value={poll.description} onChange={e => onChange('description', e.target.value)} />],
          ['Project', <Input className="h-7" disabled={!isEditing} value={poll.project} onChange={e => onChange('project', e.target.value)} />],
          ['Height', <Input className="h-7" disabled={!isEditing} value={poll.height} onChange={e => onChange('height', e.target.value)} />],
          ['Type', <Input className="h-7" disabled={!isEditing} value={poll.type} onChange={e => onChange('type', e.target.value)} />],
          ['Address', <Input className="h-7" disabled={!isEditing} value={poll.address} onChange={e => onChange('address', e.target.value)} />],
          ['Transformer',
            isEditing
              ? <Switch checked={poll.transformer === 'Yes'} onCheckedChange={(val) => onChange('transformer', val ? 'Yes' : 'No')} />
              : <Badge variant={poll.transformer === 'Yes' ? 'destructive' : 'default'} className="text-xs">{poll.transformer}</Badge>
          ]
        ].map(([label, control], idx) => (
          <div key={idx} className="grid grid-cols-3 items-center gap-3">
            <Label className="text-muted-foreground col-span-1">{label}:</Label>
            <div className="col-span-2">{control}</div>
          </div>
        ))}
      </div>

      {/* Right: Map */}
      {poll.gpsCoordinates && (
        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground mb-1 block">Location</Label>
          <PollMiniMap coordinates={poll.gpsCoordinates} />
          <div className="flex justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push(`/admin/maps/view?highlight=${poll.id}`)}
            >
              View Full Map
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
