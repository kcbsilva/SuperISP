// src/components/subscribers/AddSubscriberModal.tsx
'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, User, Building, Save, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/LocaleContext';
import type { SubscriberData } from '@/types/subscribers';

export type AddSubscriberModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const subscriberSchema = z.object({
  subscriber_type: z.enum(['Residential', 'Commercial']),
  full_name: z.string().optional(),
  company_name: z.string().optional(),
  birthday: z.date().optional(),
  established_date: z.date().optional(),
  address: z.string().min(1),
  point_of_reference: z.string().optional(),
  email: z.string().email(),
  phone_number: z.string().min(1),
  mobile_number: z.string().optional(),
  tax_id: z.string().optional(),
  business_number: z.string().optional(),
  id_number: z.string().optional(),
  signup_date: z.date().optional(),
  status: z.enum(['Active', 'Inactive', 'Suspended', 'Planned', 'Canceled']).default('Active').optional(),
}).refine(d => d.subscriber_type !== 'Residential' || (d.full_name && d.full_name.length > 0), {
  message: 'Full Name is required for Residential subscribers.',
  path: ['full_name'],
}).refine(d => d.subscriber_type !== 'Residential' || d.birthday, {
  message: 'Birthday is required for Residential subscribers.',
  path: ['birthday'],
}).refine(d => d.subscriber_type !== 'Residential' || (d.tax_id && d.tax_id.length > 0), {
  message: 'Tax ID is required for Residential subscribers.',
  path: ['tax_id'],
}).refine(d => d.subscriber_type !== 'Commercial' || (d.company_name && d.company_name.length > 0), {
  message: 'Company Name is required for Commercial subscribers.',
  path: ['company_name'],
}).refine(d => d.subscriber_type !== 'Commercial' || d.established_date, {
  message: 'Established Date is required for Commercial subscribers.',
  path: ['established_date'],
}).refine(d => d.subscriber_type !== 'Commercial' || (d.tax_id && d.tax_id.length > 0), {
  message: 'CNPJ (Tax ID) is required for Commercial subscribers.',
  path: ['tax_id'],
});

export type SubscriberFormData = z.infer<typeof subscriberSchema>;

export function AddSubscriberModal({ open, onClose, onSuccess }: AddSubscriberModalProps) {
  const { toast } = useToast();
  const { t } = useLocale();
  const iconSize = 'h-3 w-3';

  const form = useForm<SubscriberFormData>({
    resolver: zodResolver(subscriberSchema),
    defaultValues: {
      subscriber_type: undefined,
      address: '',
      email: '',
      phone_number: '',
      signup_date: new Date(),
      status: 'Active',
    },
  });

  const subscriberType = form.watch('subscriber_type');

  const onSubmit = React.useCallback(async (data: SubscriberFormData) => {
    try {
      const payload: SubscriberData = {
        ...data,
        birthday: data.birthday ?? null,
        established_date: data.established_date ?? null,
        signup_date: data.signup_date ?? new Date(),
      };

      const res = await fetch('/api/subscribers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Unknown error occurred.');
      }

      toast({
        title: t('add_subscriber.add_success_toast_title', 'Subscriber added'),
        description: t('add_subscriber.add_success_toast_description', 'The subscriber was saved successfully.'),
      });

      form.reset();
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast({
        title: t('add_subscriber.add_error_toast_title', 'Error Adding Subscriber'),
        description: err.message || t('add_subscriber.add_error_toast_desc', 'Could not add subscriber.'),
        variant: 'destructive',
      });
    }
  }, [form, toast, t, onSuccess, onClose]);

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('add_subscriber.title', 'Add Subscriber')}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="subscriber_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('add_subscriber.type_label')}</FormLabel>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-4"
                  >
                    <FormItem className="flex items-center gap-2">
                      <FormControl><RadioGroupItem value="Residential" /></FormControl>
                      <FormLabel className="text-xs flex items-center gap-1"><User className={iconSize} />{t('add_subscriber.type_residential')}</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center gap-2">
                      <FormControl><RadioGroupItem value="Commercial" /></FormControl>
                      <FormLabel className="text-xs flex items-center gap-1"><Building className={iconSize} />{t('add_subscriber.type_commercial')}</FormLabel>
                    </FormItem>
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              )}
            />

            {subscriberType === 'Residential' && (
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('add_subscriber.fullname_label')}</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {subscriberType === 'Commercial' && (
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('add_subscriber.company_name_label')}</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('add_subscriber.address_label')}</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('add_subscriber.email_label')}</FormLabel>
                  <FormControl><Input type="email" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('add_subscriber.phone_label')}</FormLabel>
                  <FormControl><Input type="tel" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Loader2 className={`mr-2 ${iconSize} animate-spin`} /> : <Save className={`mr-2 ${iconSize}`} />}
                {t('add_subscriber.save_button', 'Save')}
              </Button>
              <Button variant="outline" type="button" onClick={onClose}>{t('add_subscriber.cancel_button', 'Cancel')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
