// src/components/inventory/suppliers/UpdateSupplierModal.tsx
'use client';

import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Supplier } from '@/types/inventory';

const supplierSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  email: z.string().email('Valid email is required'),
  telephone: z.string().min(6, 'Telephone is required'),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;

interface Props {
  supplier: Supplier | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (data: SupplierFormData) => Promise<void>;
}

export function UpdateSupplierModal({
  supplier,
  open,
  onOpenChange,
  onUpdate,
}: Props) {
  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      businessName: '',
      email: '',
      telephone: '',
    },
  });

  useEffect(() => {
    if (supplier) {
      form.reset({
        businessName: supplier.businessName,
        email: supplier.email,
        telephone: supplier.telephone,
      });
    }
  }, [supplier, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm">Edit Supplier</DialogTitle>
          <DialogDescription className="text-xs">Update supplier details.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onUpdate)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Business Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telephone</FormLabel>
                  <FormControl>
                    <Input placeholder="Telephone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Supplier</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
