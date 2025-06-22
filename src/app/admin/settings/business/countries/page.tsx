// src/app/admin/settings/business/countries/page.tsx
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const countrySchema = z.object({
  description: z.string().min(2, 'Description is required'),
  dateFormat: z.enum(['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY/MM/DD', 'YYYY/DD/MM']),
  currency: z.string().min(1, 'Currency is required'),
});

type Country = z.infer<typeof countrySchema>;

export default function CountriesPage() {
  const [countries, setCountries] = React.useState<Country[]>([]);
  const { toast } = useToast();

  const form = useForm<Country>({
    resolver: zodResolver(countrySchema),
    defaultValues: {
      description: '',
      dateFormat: 'DD/MM/YYYY',
      currency: '',
    },
  });

  const onSubmit = (data: Country) => {
    setCountries((prev) => [...prev, data]);
    toast({ title: 'Country added' });
    form.reset({ description: '', dateFormat: 'DD/MM/YYYY', currency: '' });
  };

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>🌍 Countries Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <Input {...form.register('description')} placeholder="e.g. Brazil" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Date Format</label>
            <Select
              onValueChange={(value) => form.setValue('dateFormat', value as Country['dateFormat'])}
              value={form.watch('dateFormat')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="YYYY/MM/DD">YYYY/MM/DD</SelectItem>
                <SelectItem value="YYYY/DD/MM">YYYY/DD/MM</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Currency</label>
            <Input {...form.register('currency')} placeholder="e.g. BRL" />
          </div>
          <div className="md:col-span-3 text-right">
            <Button type="submit">Add Country</Button>
          </div>
        </form>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Date Format</TableHead>
              <TableHead>Currency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {countries.map((c, i) => (
              <TableRow key={i}>
                <TableCell>{c.description}</TableCell>
                <TableCell>{c.dateFormat}</TableCell>
                <TableCell>{c.currency}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
