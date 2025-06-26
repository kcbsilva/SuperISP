// src/components/finances/cash-book/ListEntries.tsx
'use client';

import * as React from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { useLocale, dateLocales } from '@/contexts/LocaleContext';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Entry {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'Income' | 'Expense';
  amount: number;
  reference?: string;
}

interface ListEntriesProps {
  entries: Entry[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (entry: Entry) => void;
  onDelete: (entry: Entry) => void;
  formatCurrency: (amount: number) => string;
}

export function ListEntries({
  entries,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  formatCurrency,
}: ListEntriesProps) {
  const { locale, t } = useLocale();

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden sm:block">
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">{t('cash_book.date', 'Date')}</TableHead>
                    <TableHead>{t('cash_book.description', 'Description')}</TableHead>
                    <TableHead>{t('cash_book.category', 'Category')}</TableHead>
                    <TableHead>{t('cash_book.type', 'Type')}</TableHead>
                    <TableHead className="text-center">{t('cash_book.amount', 'Amount')}</TableHead>
                    <TableHead>{t('cash_book.reference', 'Reference')}</TableHead>
                    <TableHead className="text-center">{t('cash_book.actions', 'Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map(entry => (
                    <TableRow key={entry.id}>
                      <TableCell className="text-center text-xs">
                        {format(new Date(entry.date), 'PP', { locale: dateLocales[locale] })}
                      </TableCell>
                      <TableCell className="text-xs font-medium">{entry.description}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{entry.category}</TableCell>
                      <TableCell className="text-xs text-center">
                        <Badge className={cn(entry.type === 'Income' ? 'bg-green-600/20 text-green-700' : 'bg-red-600/20 text-red-700', 'text-xs')}>
                          {entry.type}
                        </Badge>
                      </TableCell>
                      <TableCell className={cn("text-center text-xs font-semibold", entry.type === 'Income' ? 'text-green-600' : 'text-red-600')}>
                        {formatCurrency(entry.amount)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{entry.reference || '-'}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit(entry)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onDelete(entry)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Cards */}
      <div className="block sm:hidden space-y-4">
        {entries.map(entry => (
          <Card key={entry.id} className="px-4 py-2">
            <div className="flex justify-between text-xs">
              <span className="font-medium">
                {format(new Date(entry.date), 'PP', { locale: dateLocales[locale] })}
              </span>
              <Badge className={cn(entry.type === 'Income' ? 'bg-green-600/20 text-green-700' : 'bg-red-600/20 text-red-700')}>
                {entry.type}
              </Badge>
            </div>
            <div className="text-sm font-semibold mt-2">{entry.description}</div>
            <div className="text-xs text-muted-foreground">{entry.category}</div>
            <div className={cn("text-sm mt-1", entry.type === 'Income' ? 'text-green-600' : 'text-red-600')}>
              {formatCurrency(entry.amount)}
            </div>
            {entry.reference && <div className="text-xs text-muted-foreground">Ref: {entry.reference}</div>}
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit(entry)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onDelete(entry)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          &larr; {t('cash_book.prev', 'Prev')}
        </Button>
        <span className="text-xs">
          {t('cash_book.page', 'Page')} {currentPage} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          {t('cash_book.next', 'Next')} &rarr;
        </Button>
      </div>
    </>
  );
}
