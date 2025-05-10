// src/app/subscribers/add/page.tsx
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'; // Corrected import
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
import { Label } from "@/components/ui/label"; // Keep Label for direct use if needed
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, User, Building, Save } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/LocaleContext';
// import { addSubscriber } from '@/services/postgresql/subscribers'; // Removed PostgreSQL import

const subscriberSchema = z.object({
  subscriberType: z.enum(['Residential', 'Commercial'], {
    required_error: "You need to select a subscriber type.",
  }),
  fullName: z.string().optional(),
  companyName: z.string().optional(),
  birthday: z.date().optional(),
  establishedDate: z.date().optional(),
  address: z.string().min(1, 'Address is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  mobileNumber: z.string().optional(),
  taxId: z.string().optional(),
  businessNumber: z.string().optional(),
}).refine(data => data.subscriberType !== 'Residential' || (data.fullName && data.fullName.length > 0), {
  message: "Full Name is required for Residential subscribers.",
  path: ["fullName"],
}).refine(data => data.subscriberType !== 'Residential' || data.birthday, {
    message: "Birthday is required for Residential subscribers.",
    path: ["birthday"],
}).refine(data => data.subscriberType !== 'Residential' || data.taxId && data.taxId.length > 0, {
    message: "Tax ID is required for Residential subscribers.",
    path: ["taxId"],
}).refine(data => data.subscriberType !== 'Commercial' || (data.companyName && data.companyName.length > 0), {
  message: "Company Name is required for Commercial subscribers.",
  path: ["companyName"],
}).refine(data => data.subscriberType !== 'Commercial' || data.establishedDate, {
    message: "Established Date is required for Commercial subscribers.",
    path: ["establishedDate"],
}).refine(data => data.subscriberType !== 'Commercial' || data.businessNumber && data.businessNumber.length > 0, {
    message: "Business Number is required for Commercial subscribers.",
    path: ["businessNumber"],
});


type SubscriberFormData = z.infer<typeof subscriberSchema>;

export default function AddSubscriberPage() {
  const { toast } = useToast();
  const { t } = useLocale();
  const iconSize = "h-3 w-3"; // Reduced icon size
  const form = useForm<SubscriberFormData>({
    resolver: zodResolver(subscriberSchema),
    defaultValues: {
      subscriberType: undefined,
      fullName: '',
      companyName: '',
      birthday: undefined,
      establishedDate: undefined,
      address: '',
      email: '',
      phoneNumber: '',
      mobileNumber: '',
      taxId: '',
      businessNumber: '',
    },
  });

  const subscriberType = form.watch('subscriberType');

  const onSubmit = (data: SubscriberFormData) => {
    // Simulate saving data locally or to mock storage
    console.log('Subscriber Data (Simulated Save):', data);
    const name = data.subscriberType === 'Residential' ? data.fullName : data.companyName;
    toast({
      title: t('add_subscriber.add_success_toast_title'),
      description: t('add_subscriber.add_success_toast_description', 'Details for {name} saved.').replace('{name}', name || ''),
    });
    form.reset();
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-base font-semibold">{t('add_subscriber.title')}</h1> {/* Reduced heading size */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('add_subscriber.card_title')}</CardTitle> {/* Reduced title size */}
          <CardDescription className="text-xs">{t('add_subscriber.card_description')}</CardDescription> 
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="subscriberType"
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
                    name="fullName"
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
                      name="taxId"
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
                </>
              )}

              {subscriberType === 'Commercial' && (
                <>
                  <FormField
                    control={form.control}
                    name="companyName"
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
                    name="establishedDate"
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
                      name="businessNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('add_subscriber.business_number_label')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('add_subscriber.business_number_placeholder')} {...field} />
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
                  name="phoneNumber"
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
                   name="mobileNumber"
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

            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit" disabled={!subscriberType || form.formState.isSubmitting}>
                <Save className={`mr-2 ${iconSize}`} />
                {t('add_subscriber.save_button')}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
