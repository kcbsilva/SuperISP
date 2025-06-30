// src/components/subscribers/ListSubscribers.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Eye, Pencil, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Subscriber } from '@/types/subscribers';
import { SubscriberProfile } from './SubscriberProfile';
import { UpdateSubscriberModal } from './UpdateSubscriberModal';
import { RemoveSubscriberModal } from './RemoveSubscriberModal';

interface Props {
  subscribers: Subscriber[];
  loading: boolean;
  refetch: () => void;
}

export function ListSubscribers({ subscribers, loading, refetch }: Props) {
  const [viewing, setViewing] = React.useState<Subscriber | null>(null);
  const [editing, setEditing] = React.useState<Subscriber | null>(null);
  const [removing, setRemoving] = React.useState<Subscriber | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscribers</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}><Skeleton className="h-4 w-full" /></TableCell>
                  </TableRow>
                ))}
              </>
            ) : (
              subscribers.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell>
                    {subscriber.subscriberType === 'Residential' ? subscriber.fullName : subscriber.companyName}
                  </TableCell>
                  <TableCell>{subscriber.email}</TableCell>
                  <TableCell>{subscriber.phoneNumber}</TableCell>
                  <TableCell>{subscriber.status}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" onClick={() => setViewing(subscriber)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setEditing(subscriber)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => setRemoving(subscriber)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      {viewing && (
        <SubscriberProfile
          open={!!viewing}
          subscriber={viewing}
          onClose={() => setViewing(null)}
          onEdit={() => {
            setEditing(viewing);
            setViewing(null);
          }}
          onDelete={() => {
            setRemoving(viewing);
            setViewing(null);
          }}
        />
      )}

      {editing && (
        <UpdateSubscriberModal
          open={!!editing}
          subscriber={editing}
          onClose={() => setEditing(null)}
          onSuccess={refetch}
        />
      )}

      {removing && (
        <RemoveSubscriberModal
          open={!!removing}
          subscriberId={removing.id}
          subscriberName={removing.fullName ?? removing.companyName ?? undefined}
          onClose={() => setRemoving(null)}
          onSuccess={() => {
            refetch();
            setRemoving(null);
          }}
        />
      )}
    </Card>
  );
}
