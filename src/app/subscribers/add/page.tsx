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
} from "@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

// --- Validation Schema ---
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
  phoneNumber: z.string().min(1, 'Phone number is required'), // Basic validation
  mobileNumber: z.string().optional(), // Basic validation
  taxId: z.string().optional(), // Consider more specific validation (e.g., regex)
  businessNumber: z.string().optional(), // Consider more specific validation
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

  // --- Handle Submission ---
  const onSubmit = (data: SubscriberFormData) => {
    console.log('Subscriber Data:', data);
    // TODO: Implement actual submission logic (e.g., API call)
    toast({
      title: "Subscriber Added (Simulated)",
      description: `Details for ${data.subscriberType === 'Residential' ? data.fullName : data.companyName} saved.`,
    });
    form.reset(); // Reset form after successful submission
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Add New Subscriber</h1>
      <Card>
        <CardHeader>
          <CardTitle>Subscriber Information</CardTitle>
          <CardDescription>Fill in the details for the new subscriber.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subscriber Type */}
              <FormField
                control={form.control}
                name="subscriberType"
                render={({ field }) => (
                  <FormItem className="space-y-3 md:col-span-2">
                    <FormLabel>Subscriber Type *</FormLabel>
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
                          <FormLabel className="font-normal flex items-center gap-2">
                             <User className="h-4 w-4 text-muted-foreground"/> Residential
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Commercial" />
                          </FormControl>
                          <FormLabel className="font-normal flex items-center gap-2">
                             <Building className="h-4 w-4 text-muted-foreground"/> Commercial
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Conditional Fields */}
              {subscriberType === 'Residential' && (
                <>
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
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
                        <FormLabel>Birthday *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
                          <FormLabel>Tax ID / SSN *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., XXX-XX-XXXX" {...field} />
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
                        <FormLabel>Company Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Corporation" {...field} />
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
                        <FormLabel>Established Date *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
                          <FormLabel>Business Number / EIN *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., XX-XXXXXXX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                   />
                </>
              )}

              {/* Common Fields */}
               <FormField
                 control={form.control}
                 name="address"
                 render={({ field }) => (
                   <FormItem className="md:col-span-2">
                     <FormLabel>Address *</FormLabel>
                     <FormControl>
                       {/* Using Input for single line address for now */}
                       <Input placeholder="123 Main St, Anytown, USA 12345" {...field} />
                       {/* Or use Textarea for multi-line:
                       <Textarea placeholder="123 Main St&#10;Anytown, USA 12345" {...field} /> */}
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
                     <FormLabel>Email *</FormLabel>
                     <FormControl>
                       <Input type="email" placeholder="subscriber@example.com" {...field} />
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
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="(555) 123-4567" {...field} />
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
                       <FormLabel>Mobile Number (Optional)</FormLabel>
                       <FormControl>
                         <Input type="tel" placeholder="(555) 987-6543" {...field} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />

            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit" disabled={!subscriberType || form.formState.isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                Save Subscriber
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
