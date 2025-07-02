// src/components/inventory/suppliers/ListSuppliers.tsx
'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Supplier } from '@/types/inventory';
import { useLocale } from '@/contexts/LocaleContext';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  suppliers: Supplier[];
  currentPage: number;
  totalPages: number;
  loading: boolean;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
  onPageChange: (page: number) => void;
}

export function ListSuppliers({
  suppliers,
  currentPage,
  totalPages,
  loading,
  onEdit,
  onDelete,
  onPageChange,
}: Props) {
  const { t } = useLocale();

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-xs">ID</TableHead>
                <TableHead className="font-bold text-xs">Business Name</TableHead>
                <TableHead className="font-bold text-xs">Business Number</TableHead>
                <TableHead className="font-bold text-xs">Email</TableHead>
                <TableHead className="font-bold text-xs">Telephone</TableHead>
                <TableHead className="font-bold text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                : suppliers.length > 0 ? (
                  suppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="text-xs">{supplier.id}</TableCell>
                      <TableCell className="text-xs">{supplier.businessName ?? supplier.businessName}</TableCell>
                      <TableCell className="text-xs">{supplier.businessNumber ?? supplier.businessNumber}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{supplier.email}</TableCell>
                      <TableCell className="text-xs">{supplier.telephone}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onEdit(supplier)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => onDelete(supplier)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-xs text-muted-foreground py-6">
                      {t('inventory_suppliers.no_suppliers_found', 'No suppliers configured yet.')}
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              {t('common.previous', 'Previous')}
            </Button>
            <span className="text-xs">{currentPage} / {totalPages}</span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              {t('common.next', 'Next')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
