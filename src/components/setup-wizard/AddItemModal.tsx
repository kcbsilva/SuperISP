// src/components/setup-wizard/AddItemModal.tsx
'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

interface AddItemModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (value: string) => void;
  title: string;
  label: string;
  placeholder: string;
  apiPath: string;
  tenantId: string;
}

const currencyOptions = [
  { code: 'BRL', symbol: 'R$' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'ARS', symbol: '$' },
  { code: 'MXN', symbol: '$' },
];

const dateFormatOptions = [
  'DD/MM/YYYY',
  'MM/DD/YYYY',
  'YYYY/MM/DD',
  'YYYY/DD/MM',
];

export function AddItemModal({
  open,
  onClose,
  onAdd,
  title,
  label,
  placeholder,
  apiPath,
  tenantId,
}: AddItemModalProps) {
  const [name, setName] = React.useState('');
  const [currency, setCurrency] = React.useState('BRL');
  const [dateFormat, setDateFormat] = React.useState('DD/MM/YYYY');
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const isCountry = label.toLowerCase() === 'country';

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${apiPath}/${tenantId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isCountry
            ? { description: name, currency, date_format: dateFormat }
            : { name }
        ),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add item');

      onAdd(data.description || data.name);
      toast({ title: `${label} added`, description: `"${name}" was added successfully.` });
      setName('');
      setCurrency('BRL');
      setDateFormat('DD/MM/YYYY');
      onClose();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <Label>{label} Name</Label>
            <Input
              placeholder={placeholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Only show for countries */}
          {isCountry && (
            <>
              <div>
                <Label>Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.symbol} ({c.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Date Format</Label>
                <Select value={dateFormat} onValueChange={setDateFormat}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateFormatOptions.map((format) => (
                      <SelectItem key={format} value={format}>
                        {format}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Submit */}
          <Button onClick={handleSubmit} disabled={loading || !name.trim()} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Add'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
