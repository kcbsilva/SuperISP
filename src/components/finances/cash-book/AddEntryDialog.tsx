// src/components/finances/cash-book/AddEntryDialog.tsx
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/contexts/LocaleContext';

interface AddEntryDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (entry: any) => void;
}

export function AddEntryDialog({ open, onClose, onSubmit }: AddEntryDialogProps) {
  const { t } = useLocale();
  const [description, setDescription] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [type, setType] = React.useState<'Income' | 'Expense'>('Income');

  const handleSave = () => {
    const newEntry = {
      id: Date.now().toString(),
      date: new Date(),
      description,
      amount: parseFloat(amount),
      type,
      category: '-',
      reference: '-',
    };
    onSubmit(newEntry);
    onClose();
    setDescription('');
    setAmount('');
    setType('Income');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('cash_book.add_entry_title', 'Add Entry')}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="description">{t('cash_book.description', 'Description')}</Label>
            <Input id="description" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">{t('cash_book.amount', 'Amount')}</Label>
            <Input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t('cash_book.type', 'Type')}</Label>
            <select value={type} onChange={e => setType(e.target.value as 'Income' | 'Expense')} className="w-full border rounded px-2 py-1">
              <option value="Income">{t('cash_book.type_income', 'Income')}</option>
              <option value="Expense">{t('cash_book.type_expense', 'Expense')}</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>{t('cash_book.save', 'Save')}</Button>
          <DialogClose asChild>
            <Button variant="outline">{t('cash_book.cancel', 'Cancel')}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
