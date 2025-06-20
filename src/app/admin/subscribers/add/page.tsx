// src/app/subscribers/add/page.tsx
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, User, Building, Save, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/LocaleContext';
import { addSubscriber } from '@/services/postgres/subscribers';
import type { SubscriberData } from '@/types/subscribers';
import { useRouter } from 'next/navigation';

const subscriberSchema = z.object({
  subscriber_type: z.enum(['Residential', 'Commercial'], {
    required_error: "You need to select a subscriber type.",
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
}).refine(data => data.subscriber_type !== 'Residential' || (data.full_name && data.full_name.length > 0), {
  message: "Full Name is required for Residential subscribers.",
  path: ["full_name"],
}).refine(data => data.subscriber_type !== 'Residential' || data.birthday, {
    message: "Birthday is required for Residential subscribers.",
    path: ["birthday"],
}).refine(data => data.subscriber_type !== 'Residential' || (data.tax_id && data.tax_id.length > 0), {
    message: "Tax ID is required for Residential subscribers.",
    path: ["tax_id"],
}).refine(data => data.subscriber_type !== 'Commercial' || (data.company_name && data.company_name.length > 0), {
  message: "Company Name is required for Commercial subscribers.",
  path: ["company_name"],
}).refine(data => data.subscriber_type !== 'Commercial' || data.established_date, {
    message: "Established Date is required for Commercial subscribers.",
    path: ["established_date"],
}).refine(data => data.subscriber_type !== 'Commercial' || (data.tax_id && data.tax_id.length > 0), {
    message: "CNPJ (Tax ID) is required for Commercial subscribers.",
    path: ["tax_id"],
});


type SubscriberFormZodData = z.infer<typeof subscriberSchema>;

export default function AddSubscriberPage() {
  const { toast } = useToast();
  const { t } = useLocale();
  const router = useRouter();
  const iconSize = "h-3 w-3";
  const form = useForm<SubscriberFormZodData>({
    resolver: zodResolver(subscriberSchema),
    defaultValues: {
      subscriber_type: undefined,
      full_name: '',
      company_name: '',
      birthday: undefined,
      established_date: undefined,
      address: '',
      point_of_reference: '',
      email: '',
      phone_number: '',
      mobile_number: '',
      tax_id: '',
      business_number: '',
      id_number: '',
      signup_date: new Date(),
      status: 'Active',
    },
  });

  const subscriberType = form.watch('subscriber_type');

  const onSubmit = React.useCallback(async (data: SubscriberFormZodData) => {
    try {
      const subscriberServiceData: SubscriberData = {
        ...data,
        birthday: data.birthday ? data.birthday : null,
        established_date: data.established_date ? data.established_date : null,
        signup_date: data.signup_date ? data.signup_date : new Date(),
      };
      const newSubscriber = await addSubscriber(subscriberServiceData);
      const name = newSubscriber.subscriberType === 'Residential' ? newSubscriber.fullName : newSubscriber.companyName;
      toast({
        title: t('add_subscriber.add_success_toast_title'),
        description: t('add_subscriber.add_success_toast_description', 'Details for {name} saved with ID {id}.').replace('{name}', name || 'N/A').replace('{id}', newSubscriber.id.toString()),
      });
      form.reset();
      router.push('/admin/subscribers/list');
    } catch (error: any) {
      toast({
        title: t('add_subscriber.add_error_toast_title', 'Error Adding Subscriber'),
        description: error.message || t('add_subscriber.add_error_toast_desc', 'Could not add subscriber.'),
        variant: 'destructive',
      });
    }
  }, [router, toast, t]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-base font-semibold">{t('add_subscriber.title')}</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('add_subscriber.card_title')}</CardTitle>
          <CardDescription className="text-xs">{t('add_subscriber.card_description')}</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Residential" />
                          </FormControl>
                          <FormLabel className="font-normal flex items-center gap-2 text-xs">
                             <User className={`${iconSize} text-muted-foreground`}/> {t('add_subscriber.type_residential')}
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Commercial" />
                          </FormControl>
                          <FormLabel className="font-normal flex items-center gap-2 text-xs">
                             <Building className={`${iconSize} text-muted-foreground`}/> {t('add_subscriber.type_commercial')}
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {subscriberType === 'Residential' && (
                <>
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('add_subscriber.fullname_label')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('add_subscriber.fullname_placeholder')} {...field} />
                        </FormControl>
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
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal text-xs",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>{t('add_subscriber.birthday_placeholder')}</span>
                                )}
                                <CalendarIcon className={`ml-auto ${iconSize} opacity-50`} />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                      control={form.control}
                      name="tax_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('add_subscriber.taxid_label')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('add_subscriber.taxid_placeholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                   />
                    <FormField
                      control={form.control}
                      name="id_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('add_subscriber.id_number_label', 'ID Number (RG)')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('add_subscriber.id_number_placeholder', 'e.g., 12.345.678-9')} {...field} />
                          </FormControl>
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
                        <FormControl>
                          <Input placeholder={t('add_subscriber.company_name_placeholder')} {...field} />
                        </FormControl>
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
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal text-xs",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>{t('add_subscriber.established_date_placeholder')}</span>
                                )}
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
                   <FormField
                      control={form.control}
                      name="tax_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('add_subscriber.cnpj_label', 'CNPJ *')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('add_subscriber.cnpj_placeholder', 'e.g., XX.XXX.XXX/0001-XX')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                   />
                    <FormField
                      control={form.control}
                      name="business_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('add_subscriber.state_registration_label', 'State Registration')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('add_subscriber.state_registration_placeholder', 'e.g., XXX.XXX.XXX.XXX')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                   />
                </>
              )}

               <FormField
                 control={form.control}
                 name="address"
                 render={({ field }) => (
                   <FormItem className="md:col-span-2">
                     <FormLabel>{t('add_subscriber.address_label')}</FormLabel>
                     <FormControl>
                       <Input placeholder={t('add_subscriber.address_placeholder')} {...field} />
                     </FormControl>
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
                    <FormControl>
                      <Input placeholder={t('add_subscriber.point_of_reference_placeholder')} {...field} />
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
                     <FormLabel>{t('add_subscriber.email_label')}</FormLabel>
                     <FormControl>
                       <Input type="email" placeholder={t('add_subscriber.email_placeholder')} {...field} />
                     </FormControl>
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
                      <FormControl>
                        <Input type="tel" placeholder={t('add_subscriber.phone_placeholder')} {...field} />
                      </FormControl>
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
                       <FormControl>
                         <Input type="tel" placeholder={t('add_subscriber.mobile_placeholder')} {...field} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
                  <FormField
                    control={form.control}
                    name="signup_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{t('add_subscriber.signup_date_label', 'Signup Date')}</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn("pl-3 text-left font-normal text-xs",!field.value && "text-muted-foreground")}
                              >
                                {field.value ? format(field.value, "PPP") : <span>{t('add_subscriber.signup_date_placeholder', 'Select signup date')}</span>}
                                <CalendarIcon className={`ml-auto ${iconSize} opacity-50`} />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit" disabled={!subscriberType || form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Loader2 className={`mr-2 ${iconSize} animate-spin`} /> : <Save className={`mr-2 ${iconSize}`} />}
                {t('add_subscriber.save_button')}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
