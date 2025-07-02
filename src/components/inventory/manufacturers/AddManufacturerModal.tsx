// src/components/inventory/manufacturers/AddManufacturerModal.tsx
'use client';

import React from 'react';
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
  DialogTrigger,
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
import { PlusCircle, Loader2 } from 'lucide-react';

const schema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  businessNumber: z.string().min(1, 'Business number is required'),
  address: z.string().min(1, 'Address is required'),
  telephone: z.string().min(1, 'Telephone is required'),
  email: z.string().email('Valid email is required'),
});

export type ManufacturerFormData = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: ManufacturerFormData) => void;
}

export function AddManufacturerModal({ onSubmit }: Props) {
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <PlusCircle className="mr-2 h-3 w-3" />
          Add Manufacturer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-sm">Add New Manufacturer</DialogTitle>
          <DialogDescription className="text-xs">Fill in the details for the new manufacturer.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
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
                <Button type="button" variant="outline" disabled={form.formState.isSubmitting}>Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                Save Manufacturer
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
