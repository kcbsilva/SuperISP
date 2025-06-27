// src/components/finances/entry-categories/ListCategories.tsx
'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { EntryCategory } from './types'; // You'll define this in a shared type file
import { useLocale } from '@/contexts/LocaleContext';

type Props = {
  categories: EntryCategory[];
  loading: boolean;
  onEdit: (cat: EntryCategory) => void;
  onDelete: (cat: EntryCategory) => void;
  getCategoryNumber: (cat: EntryCategory, all: EntryCategory[]) => string;
  getIndentationLevel: (cat: EntryCategory, all: EntryCategory[]) => number;
};

export function ListCategories({
  categories,
  loading,
  onEdit,
  onDelete,
  getCategoryNumber,
  getIndentationLevel,
}: Props) {
  const { t } = useLocale();

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-[200px] flex-1" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-6 ml-auto" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-32 py-2">{t('entry_categories.table_header_category_number', 'Category No.')}</TableHead>
          <TableHead className="py-2">{t('entry_categories.table_header_description', 'Description')}</TableHead>
          <TableHead className="py-2">{t('entry_categories.table_header_type', 'Type')}</TableHead>
          <TableHead className="text-right w-28 py-2">{t('entry_categories.table_header_actions', 'Actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => {
          const isStatic = ['static-income-root', 'static-expense-root'].includes(category.id);
          const indent = getIndentationLevel(category, categories);
          return (
            <TableRow key={category.id}>
              <TableCell>{getCategoryNumber(category, categories)}</TableCell>
              <TableCell style={{ paddingLeft: `${indent * 1.25 + 0.5}rem` }}>{category.name}</TableCell>
              <TableCell className="text-center">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  category.type === 'Income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {t(`entry_categories.category_type_${category.type.toLowerCase()}` as any, category.type)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(category)} disabled={isStatic}>
                  <Edit className="h-3 w-3" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" disabled={isStatic}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  {/* Delete dialog goes here, to be extracted into separate component */}
                </AlertDialog>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
