// src/components/setup-wizard/nasinfo.tsx
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

export const step5Schema = z.object({
    nasName: z.string().min(1, 'NAS name is required'),
    nasPop: z.string().min(1, 'PoP selection is required'),
    nasIpBlock: z.string().min(1, 'IP Block is required'),
    brand: z.string().optional(),
    port: z.string().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    snmpVersion: z.string().optional(),
    snmpCommunity: z.string().optional(),
    snmpPort: z.string().optional(),
    lockMac: z.boolean().default(false),
    allowSimultaneous: z.boolean().default(false),
    simultaneousCount: z.coerce.number().optional(),
});

export type Step5Data = z.infer<typeof step5Schema>;

interface NASInfoStepProps {
    defaultValues?: Step5Data;
    onBack: () => void;
    onFinish: (data: Step5Data) => void;
}

export function NASInfoStep({ defaultValues, onBack, onFinish }: NASInfoStepProps) {
    const form = useForm<Step5Data>({
        resolver: zodResolver(step5Schema),
        defaultValues: defaultValues ?? {
            nasName: '',
            nasPop: '',
            nasIpBlock: '',
            brand: '',
            port: '',
            username: '',
            password: '',
            snmpVersion: '',
            snmpCommunity: '',
            snmpPort: '',
            lockMac: false,
            allowSimultaneous: false,
            simultaneousCount: undefined,
        },
    });

    const watchSimultaneous = form.watch('allowSimultaneous');

    const handleSubmit = (data: Step5Data) => {
        localStorage.setItem('setupStep5', JSON.stringify(data));
        onFinish(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="nasName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Device Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="nasPop"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>PoP</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="nasIpBlock"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>IP Block</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Device Brand</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="port"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Port</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl><Input type="password" {...field} /></FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="snmpVersion"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>SNMP Version</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="snmpCommunity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>SNMP Community</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="snmpPort"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>SNMP Port</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lockMac"
                    render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel>Lock Login + MAC?</FormLabel>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="allowSimultaneous"
                    render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel>Allow Simultaneous Connections?</FormLabel>
                        </FormItem>
                    )}
                />
                {watchSimultaneous && (
                    <FormField
                        control={form.control}
                        name="simultaneousCount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>How many connections?</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                            </FormItem>
                        )}
                    />
                )}
                <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={onBack}>Back</Button>
                    <Button type="submit">Finish</Button>
                </div>
            </form>
        </Form>
    );
}
