'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { NetworkDevice } from '@/types';
import { PlusCircle } from 'lucide-react';

// Validation Schema
const deviceSchema = z.object({
  hostname: z.string().min(1, 'Device name is required'),
  ipAddress: z.string().ip({ message: 'Invalid IP address format' }),
  macAddress: z
    .string()
    .regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, 'Invalid MAC address format (e.g., 00:1A:2B:3C:4D:5E)')
    .optional().or(z.literal('')), // Optional, but must match format if provided
});

type DeviceFormData = z.infer<typeof deviceSchema>;

interface ManualDeviceEntryProps {
  onDeviceAdd: (device: NetworkDevice) => void;
}

export function ManualDeviceEntry({ onDeviceAdd }: ManualDeviceEntryProps) {
  const { toast } = useToast();
  const form = useForm<DeviceFormData>({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      hostname: '',
      ipAddress: '',
      macAddress: '',
    },
  });

  const onSubmit = (data: DeviceFormData) => {
    const newDevice: NetworkDevice = {
      ...data,
      macAddress: data.macAddress || `manual-${Date.now()}`, // Generate a placeholder if empty
      manual: true,
    };
    onDeviceAdd(newDevice);
    toast({
      title: 'Device Added',
      description: `${data.hostname} has been added manually.`,
    });
    form.reset(); // Reset form after successful submission
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Device Entry</CardTitle>
        <CardDescription>Add devices that were not automatically detected.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="hostname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Name / Hostname</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Living Room TV" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ipAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IP Address</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 192.168.1.150" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="macAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MAC Address (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 00:1A:2B:3C:4D:5E" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Device
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
