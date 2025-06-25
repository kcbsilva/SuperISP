// src/components/network/vlan/AddVlanModal.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createVlan, fetchPops, fetchParticipants, fetchNasByPopId, fetchInterfacesByNas } from './actions';
import { Vlan } from '@/types/vlan';
import { toast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface AddVlanModalProps {
  onVlanAdded: (vlan: Vlan) => void;
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

export function AddVlanModal({ onVlanAdded }: AddVlanModalProps) {
  const [open, setOpen] = useState(false);
  const [pops, setPops] = useState<{ id: string; name: string }[]>([]);
  const [participants, setParticipants] = useState<{ id: string; companyName: string }[]>([]);
  const [nasOptions, setNasOptions] = useState<{ id: string; identifier: string }[]>([]);
  const [interfaces, setInterfaces] = useState<string[]>([]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      vlanId: 0,
      description: '',
      popId: '',
      isTagged: true,
      status: 'Active',
      availableInHub: false,
      assignedTo: '',
      participantId: '',
      nasIdentifier: '',
      interfaceName: '',
      allowAsInterface: false,
    },
  });

  const availableInHub = form.watch('availableInHub');
  const participantId = form.watch('participantId');
  const selectedPopId = form.watch('popId');
  const selectedNas = form.watch('nasIdentifier');

  useEffect(() => {
    if (availableInHub && participantId) {
      const selected = participants.find((p) => p.id === participantId);
      if (selected) {
        form.setValue('assignedTo', selected.companyName);
      }
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
      const newVlan = await createVlan(data);
      onVlanAdded(newVlan);
      toast({ title: 'VLAN Added', description: `VLAN ${data.vlanId} successfully created.` });

      await fetch('/api/systemlog/create', {
        method: 'POST',
        body: JSON.stringify({ action: `Created VLAN ${data.vlanId} for NAS ${data.nasIdentifier}` }),
      });
      await fetch(`/api/nas/run-script?vlan=${data.vlanId}&nas=${data.nasIdentifier}`);

      setOpen(false);
      form.reset();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create VLAN.', variant: 'destructive' });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        setOpen(state);
        if (!state) form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-green-600 text-white">
          <PlusCircle className="h-4 w-4 mr-2" /> Add VLAN
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add VLAN</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vlanId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VLAN ID</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="popId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-1.5">PoP</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className={!field.value ? 'text-muted-foreground' : ''}>
                        <SelectValue placeholder="Select PoP" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pops.map((pop) => (
                        <SelectItem key={pop.id} value={pop.id}>{pop.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nasIdentifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-1.5">RADIUS/NAS</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className={!field.value ? 'text-muted-foreground' : ''}>
                        <SelectValue placeholder="Select NAS" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {nasOptions.map((nas) => (
                        <SelectItem key={nas.id} value={nas.identifier}>{nas.identifier}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {interfaces.length > 0 && (
              <FormField
                control={form.control}
                name="interfaceName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-1.5">Interface</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className={!field.value ? 'text-muted-foreground' : ''}>
                          <SelectValue placeholder="Select Interface" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {interfaces.map((iface) => (
                          <SelectItem key={iface} value={iface}>{iface}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="allowAsInterface"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Allow as Interface</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Switch checked={field.value === 'Active'} onCheckedChange={(checked) => field.onChange(checked ? 'Active' : 'Inactive')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isTagged"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel>Tagged</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="availableInHub"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Available in Hub</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {availableInHub && (
              <FormField
                control={form.control}
                name="participantId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-1.5">Participant</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className={!field.value ? 'text-muted-foreground' : ''}>
                          <SelectValue placeholder="Select Participant" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {participants.map((p) => (
                          <SelectItem key={p.id} value={p.id}>{p.companyName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save VLAN</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}