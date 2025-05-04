// src/app/settings/global/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Globe } from 'lucide-react'; // Added Globe icon
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Select components
import { useLocale, type Locale } from '@/contexts/LocaleContext'; // Import useLocale and Locale type

// Example schema for global settings
const globalSettingsSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  companyLogoUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
  defaultCurrency: z.string().length(3, 'Currency code must be 3 letters (e.g., USD)'),
  timezone: z.string().min(1, 'Timezone is required'),
  language: z.enum(['en', 'fr', 'pt'], { // Add language field with enum
    required_error: "Please select a default language.",
  }).default('en'),
});

type GlobalSettingsFormData = z.infer<typeof globalSettingsSchema>;

// Placeholder function to load settings (replace with actual API call)
const loadGlobalSettings = async (): Promise<GlobalSettingsFormData> => {
  console.log("Simulating loading global settings...");
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  // Return placeholder data - in a real app, fetch from backend
  return {
    companyName: 'NetHub ISP',
    companyLogoUrl: '',
    defaultCurrency: 'USD',
    timezone: 'America/New_York',
    language: 'en', // Default language
  };
};

// Placeholder function to save settings (replace with actual API call)
const saveGlobalSettings = async (data: GlobalSettingsFormData): Promise<void> => {
  console.log("Simulating saving global settings:", data);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  // In a real app, send data to the backend API
};


export default function GlobalSettingsPage() {
  const { toast } = useToast();
  const { t, setLocale, locale } = useLocale(); // Get translation function and locale state

  const form = useForm<GlobalSettingsFormData>({
    resolver: zodResolver(globalSettingsSchema),
    defaultValues: async () => {
      // Load existing settings when the form mounts
      try {
        const settings = await loadGlobalSettings();
        return settings;
      } catch (error) {
        toast({
          title: t('global_settings.load_error_title'),
          description: t('global_settings.load_error_description'),
          variant: 'destructive',
        });
        // Return defaults if loading fails
        return {
          companyName: '',
          companyLogoUrl: '',
          defaultCurrency: 'USD',
          timezone: '',
          language: 'en',
        };
      }
    },
  });

   // Watch language changes in the form to update context immediately
  const watchedLanguage = form.watch('language');
  React.useEffect(() => {
    if (watchedLanguage) {
      setLocale(watchedLanguage as Locale);
    }
  }, [watchedLanguage, setLocale]);

  const onSubmit = async (data: GlobalSettingsFormData) => {
    try {
      await saveGlobalSettings(data);
      setLocale(data.language as Locale); // Update locale context on save
      toast({
        title: t('global_settings.save_success_title'),
        description: t('global_settings.save_success_description'),
      });
    } catch (error) {
      toast({
        title: t('global_settings.save_error_title'),
        description: t('global_settings.save_error_description'),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">{t('global_settings.title')}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t('global_settings.card_title')}</CardTitle>
          <CardDescription>{t('global_settings.card_description')}</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Name */}
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('global_settings.company_name_label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('global_settings.company_name_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company Logo URL */}
              <FormField
                control={form.control}
                name="companyLogoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('global_settings.company_logo_label')}</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder={t('global_settings.company_logo_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Default Currency */}
              <FormField
                control={form.control}
                name="defaultCurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('global_settings.currency_label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('global_settings.currency_placeholder')} maxLength={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Timezone */}
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('global_settings.timezone_label')}</FormLabel>
                    <FormControl>
                      {/* In a real app, this might be a Select dropdown populated with timezones */}
                      <Input placeholder={t('global_settings.timezone_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               {/* Language Selection */}
               <FormField
                 control={form.control}
                 name="language"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>{t('global_settings.language_label')}</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl>
                         <SelectTrigger>
                           <SelectValue placeholder={t('global_settings.language_placeholder')} />
                         </SelectTrigger>
                       </FormControl>
                       <SelectContent>
                         <SelectItem value="en">{t('global_settings.language_english')}</SelectItem>
                         <SelectItem value="fr">{t('global_settings.language_french')}</SelectItem>
                         <SelectItem value="pt">{t('global_settings.language_portuguese')}</SelectItem>
                       </SelectContent>
                     </Select>
                     <FormMessage />
                   </FormItem>
                 )}
               />
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? t('global_settings.saving_button') : <><Save className="mr-2 h-4 w-4" /> {t('global_settings.save_button')}</>}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
