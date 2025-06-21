// src/components/setup-wizard/countrycity.tsx
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export const step1Schema = z.object({
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
});

export type Step1Data = z.infer<typeof step1Schema>;

interface CountryCityStepProps {
  defaultValues?: Step1Data;
  onBack: () => void;
  onNext: (data: Step1Data) => void;
}

export function CountryCityStep({ defaultValues, onBack, onNext }: CountryCityStepProps) {
  const form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: defaultValues ?? {
      country: '',
      city: '',
    },
  });

  const handleSubmit = (data: Step1Data) => {
    localStorage.setItem('setupStep1', JSON.stringify(data));
    onNext(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder="Country" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="City" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>Back</Button>
          <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  );
}
