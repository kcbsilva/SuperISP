// src/components/subscribers/ListSubscribers.tsx
'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Subscriber } from '@/types/subscribers';
import { SubscriberProfile } from './SubscriberProfile';
import { UpdateSubscriberModal } from './UpdateSubscriberModal';
import { RemoveSubscriberModal } from './RemoveSubscriberModal';

interface Props {
  subscribers?: Subscriber[];
  loading: boolean;
  refetch: () => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ListSubscribers({
  subscribers = [],
  loading,
  refetch,
  page,
  totalPages,
  onPageChange,
}: Props) {
  const [viewing, setViewing] = React.useState<Subscriber | null>(null);
  const [editing, setEditing] = React.useState<Subscriber | null>(null);
  const [removing, setRemoving] = React.useState<Subscriber | null>(null);
  const iconSize = 'h-4 w-4';

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="text-xs">Name</TableHead>
              <TableHead className="text-xs">Type</TableHead>
              <TableHead className="text-xs">Email</TableHead>
              <TableHead className="text-right w-28 text-xs">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  {Array.from({ length: 3 }).map((__, col) => (
                    <TableCell key={col}>
                      <Skeleton className="h-4 w-full max-w-[150px]" />
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-20 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
              : subscribers.length > 0
                ? subscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell>
                      {subscriber.subscriberType === 'Residential'
                        ? subscriber.fullName
                        : subscriber.companyName}
                    </TableCell>
                    <TableCell>{subscriber.subscriberType}</TableCell>
                    <TableCell>{subscriber.email}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setViewing(subscriber)}
                      >
                        <Eye className={iconSize} />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setEditing(subscriber)}
                      >
                        <Pencil className={iconSize} />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setRemoving(subscriber)}
                      >
                        <Trash2 className={iconSize} />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
                : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8 text-xs">
                      No subscribers found.
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center items-center pt-4">
        <div className="flex items-center gap-2 text-xs">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span>
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="ml-4"
            onClick={refetch}
          >
            <RefreshCw className={`${iconSize} mr-2`} />
            Refresh
          </Button>
        </div>
      </div>

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
          subscriber={editing}
          onClose={() => setEditing(null)}
          onSuccess={refetch}
          open={!!editing}
        />
      )}
      {editing && (
        <UpdateSubscriberModal
          subscriber={editing}
          onClose={() => setEditing(null)}
          onSuccess={refetch}
          open={!!editing}
        />
      )}
    </div>
  );
}
