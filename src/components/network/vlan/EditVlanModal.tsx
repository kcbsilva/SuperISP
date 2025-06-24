// src/components/network/vlan/EditVlanModal.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateVlan, fetchPops, fetchParticipants, fetchNasByPopId, fetchInterfacesByNas } from './actions';
import { Vlan } from '@/types/vlan';
import { toast } from '@/hooks/use-toast';

interface EditVlanModalProps {
  vlan: Vlan;
  onVlanUpdated: (vlan: Vlan) => void;
}

const schema = z.object({
  vlanId: z.coerce.number().min(1).max(4094),
  description: z.string().optional(),
  popId: z.string().min(1),
  isTagged: z.boolean().default(true),
  status: z.enum(['Active', 'Inactive']),
  availableInHub: z.boolean().default(false),
  assignedTo: z.string().optional(),
  participantId: z.string().optional(),
  nasIdentifier: z.string().min(1, 'RADIUS/NAS is required'),
  interfaceName: z.string().optional(),
  allowAsInterface: z.boolean().default(false),
});

export function EditVlanModal({ vlan, onVlanUpdated }: EditVlanModalProps) {
  const [open, setOpen] = useState(false);
  const [pops, setPops] = useState<{ id: string; name: string }[]>([]);
  const [participants, setParticipants] = useState<{ id: string; companyName: string }[]>([]);
  const [nasOptions, setNasOptions] = useState<{ id: string; identifier: string }[]>([]);
  const [interfaces, setInterfaces] = useState<string[]>([]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      vlanId: vlan.vlanId,
      description: vlan.description || '',
      popId: vlan.popId,
      isTagged: vlan.isTagged,
      status: vlan.status,
      availableInHub: vlan.availableInHub,
      assignedTo: vlan.assignedTo || '',
      participantId: vlan.participantId || '',
      nasIdentifier: vlan.nasIdentifier || '',
      interfaceName: vlan.interfaceName || '',
      allowAsInterface: vlan.allowAsInterface || false,
    },
  });

  const availableInHub = form.watch('availableInHub');
  const participantId = form.watch('participantId');
  const selectedPopId = form.watch('popId');
  const selectedNas = form.watch('nasIdentifier');

  useEffect(() => {
    if (availableInHub && participantId) {
      const selected = participants.find((p) => p.id === participantId);
      form.setValue('assignedTo', selected?.companyName || 'Your Company Name');
    } else {
      form.setValue('assignedTo', 'Your Company Name');
    }
  }, [availableInHub, participantId, participants, form]);

  useEffect(() => {
    (async () => {
      setPops(await fetchPops());
      setParticipants(await fetchParticipants());
    })();
  }, []);

  useEffect(() => {
    if (selectedPopId) {
      fetchNasByPopId(selectedPopId).then(setNasOptions);
      form.setValue('nasIdentifier', '');
      form.setValue('interfaceName', '');
      setInterfaces([]);
    }
  }, [selectedPopId, form]);

  useEffect(() => {
    if (selectedNas) {
      fetchInterfacesByNas(selectedNas).then(setInterfaces);
    }
  }, [selectedNas]);

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      const updated = await updateVlan(vlan.id, data);
      onVlanUpdated(updated);
      toast({ title: 'VLAN Updated', description: `VLAN ${data.vlanId} successfully updated.` });
      await fetch('/api/systemlog/create', {
        method: 'POST',
        body: JSON.stringify({ action: `Updated VLAN ${data.vlanId} on NAS ${data.nasIdentifier}` }),
      });
      await fetch(`/api/nas/run-script?vlan=${data.vlanId}&nas=${data.nasIdentifier}`);
      setOpen(false);
    } catch {
      toast({ title: 'Error', description: 'Failed to update VLAN.', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit VLAN {vlan.vlanId}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField name="vlanId" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>VLAN ID</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="description" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField name="popId" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>PoP</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select PoP" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {pops.map(pop => <SelectItem key={pop.id} value={pop.id}>{pop.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="nasIdentifier" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>RADIUS/NAS</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select NAS" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {nasOptions.map(nas => <SelectItem key={nas.id} value={nas.identifier}>{nas.identifier}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            {interfaces.length > 0 && (
              <FormField name="interfaceName" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Interface</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select Interface" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {interfaces.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            )}
            <FormField name="allowAsInterface" control={form.control} render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <FormLabel>Allow as Interface</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField name="status" control={form.control} render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Switch checked={field.value === 'Active'} onCheckedChange={checked => field.onChange(checked ? 'Active' : 'Inactive')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="isTagged" control={form.control} render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Tagged</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField name="availableInHub" control={form.control} render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <FormLabel>Available in Hub</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {availableInHub && (
              <FormField name="participantId" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Participant</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select Participant" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {participants.map(p => <SelectItem key={p.id} value={p.id}>{p.companyName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Update VLAN</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
