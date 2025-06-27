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
import { addSubscriber } from '@/services/postgres/subscribers';
import type { SubscriberData } from '@/types/subscribers';

type AddSubscriberModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;          // optional callback (e.g. refetch list)
};

/* ---------- Validation schema (same as the page) ---------- */
const subscriberSchema = z.object({
  subscriber_type: z.enum(['Residential', 'Commercial'], {
    required_error: 'You need to select a subscriber type.',
  }),
  full_name: z.string().optional(),
  company_name: z.string().optional(),
  birthday: z.date().optional(),
  established_date: z.date().optional(),
  address: z.string().min(1, 'Address is required'),
  point_of_reference: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone_number: z.string().min(1, 'Phone number is required'),
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

type SubscriberFormData = z.infer<typeof subscriberSchema>;

/* ------------------------ Component ------------------------ */
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

  const onSubmit = React.useCallback(
    async (data: SubscriberFormData) => {
      try {
        const payload: SubscriberData = {
          ...data,
          birthday: data.birthday ?? null,
          established_date: data.established_date ?? null,
          signup_date: data.signup_date ?? new Date(),
        };
        await addSubscriber(payload);
        toast({
          title: t('add_subscriber.add_success_toast_title', 'Subscriber added'),
          description: t('add_subscriber.add_success_toast_description', 'The subscriber was saved successfully.'),
        });
        form.reset();
        onSuccess?.();           // refresh list if provided
        onClose();               // close modal
      } catch (err: any) {
        toast({
          title: t('add_subscriber.add_error_toast_title', 'Error Adding Subscriber'),
          description: err.message || t('add_subscriber.add_error_toast_desc', 'Could not add subscriber.'),
          variant: 'destructive',
        });
      }
    },
    [form, toast, t, onSuccess, onClose]
  );

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-sm">{t('add_subscriber.title', 'Add Subscriber')}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
            {/* -------- Subscriber Type (radio) -------- */}
            <FormField
              control={form.control}
              name="subscriber_type"
              render={({ field }) => (
                <FormItem className="space-y-3 md:col-span-2">
                  <FormLabel>{t('add_subscriber.type_label')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl><RadioGroupItem value="Residential" /></FormControl>
                        <FormLabel className="font-normal flex items-center gap-2 text-xs"><User className={`${iconSize} text-muted-foreground`} />{t('add_subscriber.type_residential')}</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl><RadioGroupItem value="Commercial" /></FormControl>
                        <FormLabel className="font-normal flex items-center gap-2 text-xs"><Building className={`${iconSize} text-muted-foreground`} />{t('add_subscriber.type_commercial')}</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ---------- Conditional fields ---------- */}
            {subscriberType === 'Residential' && (
              <>
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('add_subscriber.fullname_label')}</FormLabel>
                      <FormControl><Input placeholder={t('add_subscriber.fullname_placeholder')} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t('add_subscriber.birthday_label')}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant="outline" className={cn('pl-3 text-left font-normal text-xs', !field.value && 'text-muted-foreground')}>
                              {field.value ? format(field.value, 'PPP') : <span>{t('add_subscriber.birthday_placeholder')}</span>}
                              <CalendarIcon className={`ml-auto ${iconSize} opacity-50`} />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {subscriberType === 'Commercial' && (
              <>
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('add_subscriber.company_name_label')}</FormLabel>
                      <FormControl><Input placeholder={t('add_subscriber.company_name_placeholder')} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="established_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t('add_subscriber.established_date_label')}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant="outline" className={cn('pl-3 text-left font-normal text-xs', !field.value && 'text-muted-foreground')}>
                              {field.value ? format(field.value, 'PPP') : <span>{t('add_subscriber.established_date_placeholder')}</span>}
                              <CalendarIcon className={`ml-auto ${iconSize} opacity-50`} />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* -------- Shared fields (address, contact, etc.) -------- */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>{t('add_subscriber.address_label')}</FormLabel>
                  <FormControl><Input placeholder={t('add_subscriber.address_placeholder')} {...field} /></FormControl>
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
                  <FormControl><Input type="email" placeholder={t('add_subscriber.email_placeholder')} {...field} /></FormControl>
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
                  <FormControl><Input type="tel" placeholder={t('add_subscriber.phone_placeholder')} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* -------- Submit -------- */}
            <DialogFooter className="md:col-span-2 mt-2">
              <Button type="submit" disabled={!subscriberType || form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? <Loader2 className={`mr-2 ${iconSize} animate-spin`} />
                  : <Save className={`mr-2 ${iconSize}`} />}
                {t('add_subscriber.save_button')}
              </Button>
              <Button variant="outline" type="button" onClick={onClose}>{t('add_subscriber.cancel_button', 'Cancel')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
