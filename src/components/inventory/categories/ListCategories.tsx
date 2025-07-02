// src/components/inventory/categories/ListCategories.tsx
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
import { Edit, Trash2, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { InventoryCategory } from '@/types/inventory';

interface Props {
  categories: InventoryCategory[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onEdit: (category: InventoryCategory) => void;
  onDelete: (category: InventoryCategory) => void;
  loading?: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

export function ListCategories({
  categories,
  searchTerm,
  setSearchTerm,
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
    <div className="flex flex-col gap-4 p-6">
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="w-16 text-xs">ID</TableHead>
              <TableHead className="text-xs">Name</TableHead>
              <TableHead className="text-right w-28 text-xs">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-mono text-muted-foreground text-xs">
                    <span title={category.id}>{category.id.substring(0, 8)}</span>
                  </TableCell>
                  <TableCell className="font-medium text-xs">{category.name}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onEdit(category)}
                    >
                      <Edit className={iconSize} />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(category)}
                    >
                      <Trash2 className={iconSize} />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8 text-xs">
                  {searchTerm
                    ? 'No categories found matching your search.'
                    : 'No categories configured yet.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination + Refresh */}
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
