// src/components/inventory/manufacturers/UpdateManufacturerModal.tsx
'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import type { Manufacturer } from '@/types/inventory';

const schema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  businessNumber: z.string().min(1, 'Business number is required'),
  address: z.string().min(1, 'Address is required'),
  telephone: z.string().min(1, 'Telephone is required'),
  email: z.string().email('Valid email is required'),
});

export type ManufacturerFormData = z.infer<typeof schema>;

interface Props {
  manufacturer: Manufacturer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (data: ManufacturerFormData) => void;
}

export function UpdateManufacturerModal({
  manufacturer,
  open,
  onOpenChange,
  onUpdate,
}: Props) {
  const form = useForm<ManufacturerFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      businessName: '',
      businessNumber: '',
      address: '',
      telephone: '',
      email: '',
    },
  });

  useEffect(() => {
    if (manufacturer) {
      form.reset({
        businessName: manufacturer.businessName,
        businessNumber: manufacturer.businessNumber,
        address: manufacturer.address,
        telephone: manufacturer.telephone,
        email: manufacturer.email,
      });
    }
  }, [manufacturer, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-sm">Edit Manufacturer</DialogTitle>
          <DialogDescription className="text-xs">
            Update manufacturer details.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onUpdate)} className="grid gap-4 py-4">
            {[
              ['businessName', 'Business Name'],
              ['businessNumber', 'Business Number'],
              ['address', 'Address'],
              ['telephone', 'Telephone'],
              ['email', 'Email'],
            ].map(([name, label]) => (
              <FormField
                key={name}
                control={form.control}
                name={name as keyof ManufacturerFormData}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={form.formState.isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                Update Manufacturer
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
