// src/components/inventory/manufacturers/ListManufacturers.tsx
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
import { Edit, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Manufacturer } from '@/types/inventory';
import { RemoveManufacturerDialog } from './RemoveManufacturerDialog';

interface Props {
  manufacturers: Manufacturer[];
  onEdit: (manufacturer: Manufacturer) => void;
  onDelete: (manufacturer: Manufacturer) => void;
  loading?: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

export function ListManufacturers({
  manufacturers,
  onEdit,
  onDelete,
  loading = false,
  page,
  totalPages,
  onPageChange,
  onRefresh,
}: Props) {
  const iconSize = 'h-3 w-3';

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-xs">ID</TableHead>
              <TableHead className="text-xs">Business Name</TableHead>
              <TableHead className="text-xs">Business Number</TableHead>
              <TableHead className="text-xs">Address</TableHead>
              <TableHead className="text-xs">Telephone</TableHead>
              <TableHead className="text-xs">Email</TableHead>
              <TableHead className="text-right w-28 text-xs">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 10 }).map((_, idx) => (
                  <TableRow key={idx}>
                    {Array.from({ length: 6 }).map((__, col) => (
                      <TableCell key={col}>
                        <Skeleton className="h-4 w-full max-w-[150px]" />
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <Skeleton className="h-4 w-20 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              : manufacturers.length > 0
              ? manufacturers.map((manufacturer) => (
                  <TableRow key={manufacturer.id}>
                    <TableCell className="font-mono text-muted-foreground text-xs">
                      {manufacturer.id.substring(0, 8)}
                    </TableCell>
                    <TableCell className="text-xs">{manufacturer.businessName}</TableCell>
                    <TableCell className="text-xs">{manufacturer.businessNumber}</TableCell>
                    <TableCell className="text-xs">{manufacturer.address}</TableCell>
                    <TableCell className="text-xs">{manufacturer.telephone}</TableCell>
                    <TableCell className="text-xs">{manufacturer.email}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onEdit(manufacturer)}
                      >
                        <Edit className={iconSize} />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <RemoveManufacturerDialog
                        manufacturer={manufacturer}
                        onConfirm={() => onDelete(manufacturer)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8 text-xs">
                    No manufacturers found.
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
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
            onClick={onRefresh}
          >
            <RefreshCw className={`${iconSize} mr-2`} />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}
