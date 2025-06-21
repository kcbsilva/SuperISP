// src/components/setup-wizard/ipinfo.tsx
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export const step4Schema = z.object({
    ipInfo: z.string().min(1, 'IP information is required'),
});

export type Step4Data = z.infer<typeof step4Schema>;

interface IPInfoStepProps {
    defaultValues?: Step4Data;
    onBack: () => void;
    onNext: (data: Step4Data) => void;
}

export function IPInfoStep({ defaultValues, onBack, onNext }: IPInfoStepProps) {
    const form = useForm<Step4Data>({
        resolver: zodResolver(step4Schema),
        defaultValues: defaultValues ?? {
            ipInfo: '',
        },
    });

    const handleSubmit = (data: Step4Data) => {
        localStorage.setItem('setupStep4', JSON.stringify(data));
        onNext(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="ipInfo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>IP Information</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
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
