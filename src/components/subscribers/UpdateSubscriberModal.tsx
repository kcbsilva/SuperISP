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
import {
  CalendarIcon, Save, Loader2, User, Building,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/LocaleContext';
import { updateSubscriber } from '@/services/postgres/subscribers';
import type { Subscriber } from '@/types/subscribers';

/* 👉 make sure the schema is exported here */
import { subscriberSchema } from '@/lib/validators/subscriber';

type UpdateSubscriberModalProps = {
  open: boolean;
  onClose: () => void;
  subscriber: Subscriber;          // Prefetched subscriber object
  onSuccess?: () => void;          // Optional refetch callback
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

  /* ------------------------------------------------------------------ */
  /* Prefill form with subscriber data                                  */
  /* ------------------------------------------------------------------ */
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

  /* ------------------------------------------------------------------ */
  /* Submit update                                                      */
  /* ------------------------------------------------------------------ */
  const onSubmit = async (data: FormData) => {
    try {
      await updateSubscriber(subscriber.id, {
        ...data,
        birthday: data.birthday ?? null,
        established_date: data.established_date ?? null,
      });
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

  /* ------------------------------------------------------------------ */
  /* Render                                                              */
  /* ------------------------------------------------------------------ */
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

            {/* ---------------- Subscriber Type ---------------- */}
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

            {/* ---------------- Conditional fields -------------- */}
            {subType === 'Residential' && (
              <>
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('add_subscriber.fullname_label')}</FormLabel>
                      <FormControl><Input {...field} placeholder={t('add_subscriber.fullname_placeholder')} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Birthday */}
                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t('add_subscriber.birthday_label')}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn('pl-3 text-left font-normal text-xs', !field.value && 'text-muted-foreground')}
                            >
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

            {subType === 'Commercial' && (
              <>
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('add_subscriber.company_name_label')}</FormLabel>
                      <FormControl><Input {...field} placeholder={t('add_subscriber.company_name_placeholder')} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Established date */}
                <FormField
                  control={form.control}
                  name="established_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t('add_subscriber.established_date_label')}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn('pl-3 text-left font-normal text-xs', !field.value && 'text-muted-foreground')}
                            >
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

            {/* ---------------- Shared fields ------------------- */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>{t('add_subscriber.address_label')}</FormLabel>
                  <FormControl><Input {...field} placeholder={t('add_subscriber.address_placeholder')} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="point_of_reference"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>{t('add_subscriber.point_of_reference_label')}</FormLabel>
                  <FormControl><Input {...field} placeholder={t('add_subscriber.point_of_reference_placeholder')} /></FormControl>
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
                  <FormControl><Input type="email" {...field} placeholder={t('add_subscriber.email_placeholder')} /></FormControl>
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
                  <FormControl><Input type="tel" {...field} placeholder={t('add_subscriber.phone_placeholder')} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobile_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('add_subscriber.mobile_label')}</FormLabel>
                  <FormControl><Input type="tel" {...field} placeholder={t('add_subscriber.mobile_placeholder')} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="signup_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t('add_subscriber.signup_date_label')}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn('pl-3 text-left font-normal text-xs', !field.value && 'text-muted-foreground')}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>{t('add_subscriber.signup_date_placeholder')}</span>}
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

            {/* ---------------- Footer --------------------------- */}
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
