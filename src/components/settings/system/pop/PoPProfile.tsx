// src/components/system/pop/PoPProfile.tsx
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNowStrict } from 'date-fns';
import { PopData } from '@/types/pops';

// 🔧 Accept props for use in Add/Edit modal
interface PoPProfileProps {
  mode: 'add' | 'edit';
  defaultValues?: Partial<PopData>;
  onSave: (data: PopData) => void;
  onCancel: () => void;
}

export default function PoPProfile({
  mode,
  defaultValues,
  onSave,
  onCancel
}: PoPProfileProps) {
  const { register, watch, handleSubmit, control, setValue } = useForm<PopData>({
    defaultValues: {
      name: defaultValues?.name || '',
      fullAddress: defaultValues?.fullAddress || '',
      latitude: defaultValues?.latitude || 0,
      longitude: defaultValues?.longitude || 0,
      type: defaultValues?.type || 'site',
      ownership: defaultValues?.ownership || 'own',
      monthlyRent: defaultValues?.monthlyRent,
      rentDueDate: defaultValues?.rentDueDate,
      onContract: defaultValues?.onContract || false,
      contractLengthMonths: defaultValues?.contractLengthMonths,
      contractStartDate: defaultValues?.contractStartDate,
      alertRenewal: defaultValues?.alertRenewal || false,
      alertBefore: defaultValues?.alertBefore,
      alertPeriodType: defaultValues?.alertPeriodType,
    },
  });

  const ownership = watch('ownership');
  const onContract = watch('onContract');
  const alertRenewal = watch('alertRenewal');
  const contractStartDate = watch('contractStartDate');
  const contractLengthMonths = watch('contractLengthMonths');

  const contractEnd = contractStartDate && contractLengthMonths
    ? formatDistanceToNowStrict(
        new Date(new Date(contractStartDate).setMonth(new Date(contractStartDate).getMonth() + contractLengthMonths)),
        { addSuffix: true }
      )
    : null;

  const onSubmit = (data: PopData) => {
    onSave(data); // Pass data to modal
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'edit' ? 'Edit PoP' : 'Add PoP'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Form Fields (same as before)... */}

          <div>
            <Label>Name</Label>
            <Input {...register('name')} placeholder="PoP Name" />
          </div>
          <div>
            <Label>Full Address</Label>
            <Input {...register('fullAddress')} placeholder="Address" />
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <Label>Latitude</Label>
              <Input type="number" step="any" {...register('latitude')} placeholder="-23.56" />
            </div>
            <div className="w-1/2">
              <Label>Longitude</Label>
              <Input type="number" step="any" {...register('longitude')} placeholder="-46.66" />
            </div>
          </div>
          <div>
            <Label>Type</Label>
            <Select onValueChange={(val) => setValue('type', val as any)} defaultValue={watch('type')}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="site">Site</SelectItem>
                <SelectItem value="tower">Tower</SelectItem>
                <SelectItem value="presence">Presence</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Ownership</Label>
            <Select onValueChange={(val) => setValue('ownership', val as any)} defaultValue={watch('ownership')}>
              <SelectTrigger><SelectValue placeholder="Select ownership" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="own">Own</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {ownership === 'rent' && (
            <>
              <div>
                <Label>Monthly Rent</Label>
                <Input type="number" {...register('monthlyRent')} placeholder="e.g. 3000" />
              </div>
              <div>
                <Label>Rent Due Date</Label>
                <Input type="date" {...register('rentDueDate')} />
              </div>
              <div className="flex items-center gap-2">
                <Label>On Contract</Label>
                <Switch checked={onContract} onCheckedChange={(val) => setValue('onContract', val)} />
              </div>
              {onContract && (
                <>
                  <div>
                    <Label>Contract Length (months)</Label>
                    <Input type="number" {...register('contractLengthMonths')} />
                  </div>
                  <div>
                    <Label>Contract Start Date</Label>
                    <Input type="date" {...register('contractStartDate')} />
                  </div>
                  {contractEnd && (
                    <p className="text-sm text-muted-foreground">
                      Time left on contract: {contractEnd}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <Label>Alert Renewal</Label>
                    <Switch checked={alertRenewal} onCheckedChange={(val) => setValue('alertRenewal', val)} />
                  </div>
                  {alertRenewal && (
                    <div className="flex gap-2">
                      <div className="w-1/2">
                        <Label>Alert Before</Label>
                        <Input type="number" {...register('alertBefore')} />
                      </div>
                      <div className="w-1/2">
                        <Label>Period</Label>
                        <Select onValueChange={(val) => setValue('alertPeriodType', val as any)} defaultValue={watch('alertPeriodType')}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="days">Days</SelectItem>
                            <SelectItem value="weeks">Weeks</SelectItem>
                            <SelectItem value="months">Months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'edit' ? 'Update PoP' : 'Save PoP'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
