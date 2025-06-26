// src/app/finances/cash-book/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ListEntries } from '@/components/finances/cash-book/ListEntries';
import { AddEntryDialog } from '@/components/finances/cash-book/AddEntryDialog';
import { UpdateEntryDialog } from '@/components/finances/cash-book/UpdateEntryDialog';
import { DeleteEntryDialog } from '@/components/finances/cash-book/DeleteEntryDialog';

export default function CashBookPage() {
  const { t, locale } = useLocale();
  const { toast } = useToast();

  const [entries, setEntries] = React.useState<any[]>([]); // Replace with real type
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [entryToEdit, setEntryToEdit] = React.useState<any | null>(null);
  const [entryToDelete, setEntryToDelete] = React.useState<any | null>(null);

  const pageSize = 10;
  const filteredAndSortedEntries = entries; // Add filtering/sorting logic later

  const totalPages = Math.ceil(filteredAndSortedEntries.length / pageSize);
  const paginatedEntries = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedEntries.slice(start, start + pageSize);
  }, [filteredAndSortedEntries, currentPage]);

  const totalIncome = entries.filter(e => e.type === 'Income').reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = entries.filter(e => e.type === 'Expense').reduce((sum, e) => sum + e.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString(locale === 'pt' ? 'pt-BR' : 'en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  const handleAdd = (entry: any) => {
    setEntries(prev => [...prev, entry]);
    toast({ title: t('cash_book.entry_added', 'Entry added') });
  };

  const handleEdit = (entry: any) => {
    setEntryToEdit(entry);
  };

  const handleEditSubmit = (updated: any) => {
    setEntries(prev => prev.map(e => (e.id === updated.id ? updated : e)));
    setEntryToEdit(null);
    toast({ title: t('cash_book.entry_updated', 'Entry updated') });
  };

  const handleDelete = (entry: any) => {
    setEntryToDelete(entry);
  };

  const handleDeleteConfirm = () => {
    if (entryToDelete) {
      setEntries(prev => prev.filter(e => e.id !== entryToDelete.id));
      toast({ title: t('cash_book.entry_deleted', 'Entry deleted') });
      setEntryToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {entries.length === 0 ? (
        <Card className="text-center py-10">
          <CardContent className="flex flex-col items-center gap-3">
            <p className="text-sm text-muted-foreground">
              {t('cash_book.no_entries_found', 'No entries found matching your criteria.')}
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" /> {t('cash_book.add_entry_button', 'Add Entry')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ListEntries
          entries={paginatedEntries}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
          formatCurrency={formatCurrency}
        />
      )}

      <Card>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 text-xs">
          <div className="text-green-600 font-medium">{t('cash_book.total_income_label', 'Total Income')}: {formatCurrency(totalIncome)}</div>
          <div className="text-red-600 font-medium">{t('cash_book.total_expenses_label', 'Total Expenses')}: {formatCurrency(totalExpenses)}</div>
          <div className={cn("font-bold", netBalance >= 0 ? 'text-green-600' : 'text-red-600')}>{t('cash_book.net_balance_label', 'Net Balance')}: {formatCurrency(netBalance)}</div>
        </CardFooter>
      </Card>

      <AddEntryDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAdd}
      />

      <UpdateEntryDialog
        entry={entryToEdit}
        onClose={() => setEntryToEdit(null)}
        onSubmit={handleEditSubmit}
      />

      <DeleteEntryDialog
        entry={entryToDelete}
        onCancel={() => setEntryToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
