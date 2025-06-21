// src/components/setup-wizard/popinfo.tsx
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const step3Schema = z.object({
    popName: z.string().min(1, 'PoP name is required'),
    popAddress: z.string().min(1, 'PoP address is required'),
    popCity: z.string().min(1, 'City is required'),
    gps: z.string().optional(),
    popType: z.enum(['Main', 'Branch']),
});

export type Step3Data = z.infer<typeof step3Schema>;

interface PopInfoStepProps {
    defaultValues?: Step3Data;
    onBack: () => void;
    onNext: (data: Step3Data) => void;
}

export function PopInfoStep({ defaultValues, onBack, onNext }: PopInfoStepProps) {
    const form = useForm<Step3Data>({
        resolver: zodResolver(step3Schema),
        defaultValues: defaultValues ?? {
            popName: '',
            popAddress: '',
            popCity: '',
            gps: '',
            popType: 'Main',
        },
    });

    const handleSubmit = (data: Step3Data) => {
        localStorage.setItem('setupStep3', JSON.stringify(data));
        onNext(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="popName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>PoP Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="popAddress"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="popCity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="gps"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>GPS Coordinates</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="popType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>PoP Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Main">Main</SelectItem>
                                    <SelectItem value="Branch">Branch</SelectItem>
                                </SelectContent>
                            </Select>
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
