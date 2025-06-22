// src/components/setup-wizard/userinfo.tsx
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Loader2 } from 'lucide-react';

export const stepUserSchema = z.object({
  fullName: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type StepUserData = z.infer<typeof stepUserSchema>;

interface UserInfoStepProps {
  defaultValues?: StepUserData;
  onBack: () => void;
  onNext: (data: StepUserData) => void;
  tenantId: string;
}

export function UserInfoStep({ defaultValues, onBack, onNext, tenantId }: UserInfoStepProps) {
  const [loading, setLoading] = React.useState(false);
  const form = useForm<StepUserData>({
    resolver: zodResolver(stepUserSchema),
    defaultValues: defaultValues ?? {
      fullName: '',
      email: '',
      password: '',
    },
  });

  const handleSubmit = async (data: StepUserData) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${tenantId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to create user');

      localStorage.setItem('setupStepUser', JSON.stringify(data));
      onNext(data);
    } catch (err) {
      console.error(err);
      alert('Failed to create user. Check the console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 animate-fade-in-left">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Admin Full Name" {...field} />
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
                <Input type="email" placeholder="admin@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between pt-2">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Next'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
