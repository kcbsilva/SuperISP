// /src/components/inventory/products/ListProducts.tsx
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
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit, Trash2 } from 'lucide-react';
import { Product } from '@/types/inventory';
import { useLocale } from '@/contexts/LocaleContext';
import { inventoryCategories, manufacturers, suppliers } from '@/data/inventory';

interface Props {
  products: Product[];
  loading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  setEditingProduct: (product: Product) => void;
  setProductToDelete: (product: Product) => void;
  onPageChange: (page: number) => void;
}

export function ListProducts({
  products,
  loading,
  page,
  totalPages,
  totalItems,
  setEditingProduct,
  setProductToDelete,
  onPageChange,
}: Props) {
  const { t } = useLocale();
  const iconSize = 'h-3 w-3';

  const from = (page - 1) * 10 + 1;
  const to = Math.min(page * 10, totalItems);

  return (
    <div className="p-6">
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-xs font-bold">ID</TableHead>
              <TableHead className="text-xs font-bold">Patrimonial</TableHead>
              <TableHead className="text-xs font-bold">Name</TableHead>
              <TableHead className="text-xs font-bold">Category</TableHead>
              <TableHead className="text-xs font-bold">Manufacturer</TableHead>
              <TableHead className="text-xs font-bold">Supplier</TableHead>
              <TableHead className="text-xs font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? [...Array(10)].map((_, i) => (
                  <TableRow key={i}>
                    {Array(7)
                      .fill(null)
                      .map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                  </TableRow>
                ))
              : products.length > 0
              ? products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {product.id.substring(0, 8)}
                    </TableCell>
                    <TableCell className="text-xs">{product.patrimonialNumber}</TableCell>
                    <TableCell className="text-xs font-medium">{product.name}</TableCell>
                    <TableCell className="text-xs">
                      {inventoryCategories.find((c) => c.id === product.categoryId)?.name}
                    </TableCell>
                    <TableCell className="text-xs">
                    {manufacturers.find((m) => m.id === product.manufacturerId)?.businessName}
                    </TableCell>
                    <TableCell className="text-xs">
                    {suppliers.find((s) => s.id === product.supplierId)?.businessName}
                    </TableCell>
                    <TableCell className="text-xs text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Edit className={iconSize} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setProductToDelete(product)}
                      >
                        <Trash2 className={iconSize} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              : !loading && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-xs text-muted-foreground py-6">
                      {t('inventory_products.no_products_found', 'No products configured yet.')}
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2 text-xs text-muted-foreground pt-4">
        <span>
          {t('pagination.label', 'Showing')} {from}–{to} {t('pagination.of', 'of')} {totalItems}
        </span>
        <div className="space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            {t('pagination.prev', 'Previous')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            {t('pagination.next', 'Next')}
          </Button>
        </div>
      </div>
    </div>
  );
}
