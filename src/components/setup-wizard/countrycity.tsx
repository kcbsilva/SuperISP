// src/components/setup-wizard/countrycity.tsx
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { AddItemModal } from './AddItemModal';

export const step1Schema = z.object({
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
});

export type Step1Data = z.infer<typeof step1Schema>;

interface CountryCityStepProps {
  defaultValues?: Step1Data;
  onBack: () => void;
  onNext: (data: Step1Data) => void;
  tenantId: string;
}

export function CountryCityStep({
  defaultValues,
  onBack,
  onNext,
  tenantId,
}: CountryCityStepProps) {
  const [loading, setLoading] = React.useState(false);
  const [countries, setCountries] = React.useState<string[]>([]);
  const [cities, setCities] = React.useState<string[]>([]);
  const [showCountryModal, setShowCountryModal] = React.useState(false);
  const [showCityModal, setShowCityModal] = React.useState(false);

  const form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: defaultValues ?? {
      country: '',
      city: '',
    },
  });

  React.useEffect(() => {
    const saved = localStorage.getItem('setupStep1');
    if (saved) form.reset(JSON.parse(saved));

    fetch(`/api/countries/${tenantId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCountries(data.map((c: any) => c.description));
        } else {
          console.error('Invalid countries data:', data);
          setCountries([]);
        }
      })
      .catch(console.error);

    fetch(`/api/cities/${tenantId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCities(data.map((c: any) => c.name));
        } else {
          console.error('Invalid cities data:', data);
          setCities([]);
        }
      })
      .catch(console.error);
  }, [form, tenantId]);

  const handleSubmit = (data: Step1Data) => {
    setLoading(true);
    localStorage.setItem('setupStep1', JSON.stringify(data));
    setTimeout(() => {
      setLoading(false);
      onNext(data);
    }, 500);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 animate-fade-in-left">
          {/* Country */}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <div className="flex gap-2 items-center">
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.length > 0 ? (
                          countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-sm text-muted-foreground">
                            No countries found.{' '}
                            <span
                              className="underline cursor-pointer"
                              onClick={() => setShowCountryModal(true)}
                            >
                              Add one!
                            </span>
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <Button
                    size="icon"
                    variant="outline"
                    type="button"
                    onClick={() => setShowCountryModal(true)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* City */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <div className="flex gap-2 items-center">
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.length > 0 ? (
                          cities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-sm text-muted-foreground">
                            No cities found.{' '}
                            <span
                              className="underline cursor-pointer"
                              onClick={() => setShowCityModal(true)}
                            >
                              Add one!
                            </span>
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <Button
                    size="icon"
                    variant="outline"
                    type="button"
                    onClick={() => setShowCityModal(true)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Footer buttons */}
          <div className="flex justify-between pt-2">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Next'}
            </Button>
          </div>
        </form>
      </Form>

      {/* Modals */}
      <AddItemModal
        open={showCountryModal}
        onClose={() => setShowCountryModal(false)}
        onAdd={(value) => setCountries((prev) => [...prev, value])}
        title="Add Country"
        label="Country"
        placeholder="Enter country name"
        apiPath="/api/countries"
        tenantId={tenantId}
      />

      <AddItemModal
        open={showCityModal}
        onClose={() => setShowCityModal(false)}
        onAdd={(value) => setCities((prev) => [...prev, value])}
        title="Add City"
        label="City"
        placeholder="Enter city name"
        apiPath="/api/cities"
        tenantId={tenantId}
      />
    </>
  );
}
