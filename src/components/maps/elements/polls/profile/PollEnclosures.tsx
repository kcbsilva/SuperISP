// src/components/maps/elements/polls/profile/PollEnclosures.tsx
'use client';

import * as React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin } from 'lucide-react';

interface Enclosure {
  id: string;
  type: 'FDH' | 'FOSC';
  tags: string[];
  gpsCoordinates: string;
}

interface Props {
  pollId?: string;
  onSeeInMap?: (id: string) => void;
}

export function PollEnclosures({ pollId, onSeeInMap }: Props) {
  const [tab, setTab] = React.useState<'fdhs' | 'foscs'>('fdhs');
  const [enclosures, setEnclosures] = React.useState<Enclosure[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!pollId) return;

    // Simulated API call
    setLoading(true);
    setTimeout(() => {
      setEnclosures([
        { id: 'FDH-001', type: 'FDH', tags: ['MAIN'], gpsCoordinates: '-3.745,-38.523' },
        { id: 'FDH-002', type: 'FDH', tags: ['DISTRIBUTION'], gpsCoordinates: '-3.745,-38.520' },
        { id: 'FOSC-001', type: 'FOSC', tags: ['BACKBONE'], gpsCoordinates: '-3.745,-38.522' },
        { id: 'FOSC-002', type: 'FOSC', tags: ['PON'], gpsCoordinates: '-3.746,-38.523' },
      ]);
      setLoading(false);
    }, 1000);
  }, [pollId]);

  const filtered = enclosures.filter((e) => e.type.toLowerCase() === tab);

  const getTagVariant = (tag: string) => {
    switch (tag.toUpperCase()) {
      case 'BACKBONE':
        return 'destructive';
      case 'PON':
        return 'default';
      case 'DWDM':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleTabChange = (value: string) => {
    if (value === 'fdhs' || value === 'foscs') {
      setTab(value);
    }
  };

  return (
    <div className="text-xs w-full">
      <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="fdhs">
            FDHs
            <Badge className="ml-2" variant="secondary">
              {enclosures.filter(e => e.type === 'FDH').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="foscs">
            FOSCs
            <Badge className="ml-2" variant="secondary">
              {enclosures.filter(e => e.type === 'FOSC').length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fdhs">
          <div className="relative overflow-auto border rounded-md">
            <table className="min-w-full text-xs text-left">
              <thead className="sticky top-0 bg-background z-10 border-b">
                <tr>
                  <th className="px-3 py-2 font-medium">ID</th>
                  <th className="px-3 py-2 font-medium">Tags</th>
                  <th className="px-3 py-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i} className="border-b">
                        <td className="px-3 py-2"><Skeleton className="h-4 w-20" /></td>
                        <td className="px-3 py-2"><Skeleton className="h-4 w-28" /></td>
                        <td className="px-3 py-2 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
                      </tr>
                    ))
                  : filtered.map((enc) => (
                      <tr key={enc.id} className="border-b">
                        <td className="px-3 py-2">{enc.id}</td>
                        <td className="px-3 py-2 space-x-1">
                          {enc.tags.map((tag, i) => (
                            <Badge key={i} variant={getTagVariant(tag)}>
                              {tag}
                            </Badge>
                          ))}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onSeeInMap?.(enc.id)}
                          >
                            <MapPin className="h-4 w-4 mr-1" />
                            See in Map
                          </Button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="foscs">
          <div className="relative overflow-auto border rounded-md">
            <table className="min-w-full text-xs text-left">
              <thead className="sticky top-0 bg-background z-10 border-b">
                <tr>
                  <th className="px-3 py-2 font-medium">ID</th>
                  <th className="px-3 py-2 font-medium">Tags</th>
                  <th className="px-3 py-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i} className="border-b">
                        <td className="px-3 py-2"><Skeleton className="h-4 w-20" /></td>
                        <td className="px-3 py-2"><Skeleton className="h-4 w-28" /></td>
                        <td className="px-3 py-2 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
                      </tr>
                    ))
                  : filtered.map((enc) => (
                      <tr key={enc.id} className="border-b">
                        <td className="px-3 py-2">{enc.id}</td>
                        <td className="px-3 py-2 space-x-1">
                          {enc.tags.map((tag, i) => (
                            <Badge key={i} variant={getTagVariant(tag)}>
                              {tag}
                            </Badge>
                          ))}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onSeeInMap?.(enc.id)}
                          >
                            <MapPin className="h-4 w-4 mr-1" />
                            See in Map
                          </Button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}