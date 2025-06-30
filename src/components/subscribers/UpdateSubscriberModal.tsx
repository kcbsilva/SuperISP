// src/components/subscribers/UpdateSubscriberModal.tsx
'use client';

import * as React from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
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
import type { Subscriber } from '@/types/subscribers';

/* 👉 make sure the schema is exported here */
import { subscriberSchema } from '@/lib/validators/subscriber';

export type UpdateSubscriberModalProps = {
  open: boolean;
  onClose: () => void;
  subscriber: Subscriber;
  onSuccess?: () => void;
};

type FormData = z.infer<typeof subscriberSchema>;

export function UpdateSubscriberModal({
  open,
  onClose,
  subscriber,
  onSuccess,
}: UpdateSubscriberModalProps) {
  const { toast } = useToast();
  const { t } = useLocale();
  const iconSize = 'h-3 w-3';

  const form = useForm<FormData>({
    resolver: zodResolver(subscriberSchema),
    defaultValues: {
      subscriber_type: subscriber.subscriberType,
      full_name: subscriber.fullName ?? '',
      company_name: subscriber.companyName ?? '',
      birthday: subscriber.birthday ? new Date(subscriber.birthday) : undefined,
      established_date: subscriber.establishedDate ? new Date(subscriber.establishedDate) : undefined,
      address: subscriber.address,
      point_of_reference: subscriber.pointOfReference ?? '',
      email: subscriber.email,
      phone_number: subscriber.phoneNumber,
      mobile_number: subscriber.mobileNumber ?? '',
      tax_id: subscriber.taxId ?? '',
      business_number: subscriber.businessNumber ?? '',
      id_number: (subscriber as any).idNumber ?? '',
      signup_date: subscriber.signupDate ? new Date(subscriber.signupDate) : new Date(),
      status: subscriber.status,
    },
  });

  const subType = form.watch('subscriber_type');

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        birthday: data.birthday ?? null,
        established_date: data.established_date ?? null,
      };

      const res = await fetch(`/api/subscribers/update/${subscriber.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Unknown error occurred.');
      }

      toast({ title: t('update_subscriber.success_toast', 'Subscriber updated') });
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast({
        title: t('update_subscriber.error_toast', 'Error updating'),
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-sm">{t('update_subscriber.title', 'Edit Subscriber')}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2"
          >
            <FormField
              control={form.control}
              name="subscriber_type"
              render={({ field }) => (
                <FormItem className="space-y-3 md:col-span-2">
                  <FormLabel>{t('add_subscriber.type_label')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      {...field}
                      className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
                      onValueChange={field.onChange}
                    >
                      <FormItem className="flex items-center space-x-2">
                        <RadioGroupItem value="Residential" />
                        <FormLabel className="font-normal flex items-center gap-1 text-xs">
                          <User className={iconSize} /> {t('add_subscriber.type_residential')}
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <RadioGroupItem value="Commercial" />
                        <FormLabel className="font-normal flex items-center gap-1 text-xs">
                          <Building className={iconSize} /> {t('add_subscriber.type_commercial')}
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TODO: Add rest of the fields as needed (same structure as Add modal) */}

            <DialogFooter className="md:col-span-2 mt-2">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? <Loader2 className={`mr-2 ${iconSize} animate-spin`} />
                  : <Save className={`mr-2 ${iconSize}`} />}
                {t('update_subscriber.save_button', 'Save')}
              </Button>
              <Button variant="outline" type="button" onClick={onClose}>
                {t('update_subscriber.cancel_button', 'Cancel')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}