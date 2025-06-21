// src/components/setup-wizard/businessinfo.tsx
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export const step2Schema = z.object({
    businessName: z.string().min(1, 'Business name is required'),
    businessNumber: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Invalid email').optional(),
    billingEmail: z.string().email('Invalid email').optional(),
    supportEmail: z.string().email('Invalid email').optional(),
    responsible: z.string().optional(),
    taxId: z.string().optional(),
});

export type Step2Data = z.infer<typeof step2Schema>;

interface BusinessInfoStepProps {
    defaultValues?: Step2Data;
    onBack: () => void;
    onNext: (data: Step2Data) => void;
}

export function BusinessInfoStep({ defaultValues, onBack, onNext }: BusinessInfoStepProps) {
    const form = useForm<Step2Data>({
        resolver: zodResolver(step2Schema),
        defaultValues: defaultValues ?? {
            businessName: '',
            businessNumber: '',
            address: '',
            phone: '',
            email: '',
            billingEmail: '',
            supportEmail: '',
            responsible: '',
            taxId: '',
        },
    });

    const handleSubmit = (data: Step2Data) => {
        localStorage.setItem('setupStep2', JSON.stringify(data));
        onNext(data);
    }
    
        return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="businessName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Business Name</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="businessNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Business Number</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl><Input type="email" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="billingEmail"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Billing Email</FormLabel>
                                <FormControl><Input type="email" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="supportEmail"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Support Email</FormLabel>
                                <FormControl><Input type="email" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="responsible"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Responsible Person</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="taxId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tax / ID</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
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
