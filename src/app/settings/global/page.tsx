// src/app/settings/global/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card"; // Removed CardDescription, CardHeader, CardTitle
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label'; // No longer directly used, FormLabel is used
import { Save } from 'lucide-react'; // Removed Globe as it's not used
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
} from "@/components/ui/select";
import { useLocale, type Locale } from '@/contexts/LocaleContext';

const globalSettingsSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  companyLogoUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
  defaultCurrency: z.string().length(3, 'Currency code must be 3 letters (e.g., USD)'),
  timezone: z.string().min(1, 'Timezone is required'),
  language: z.enum(['en', 'fr', 'pt'], {
    required_error: "Please select a default language.",
  }).default('en'),
});

type GlobalSettingsFormData = z.infer<typeof globalSettingsSchema>;

// Simulated initial settings load
let initialSettings: GlobalSettingsFormData = {
  companyName: 'NetHub ISP',
  companyLogoUrl: '',
  defaultCurrency: 'USD',
  timezone: 'America/New_York',
  language: 'en',
};

const loadGlobalSettings = async (): Promise<GlobalSettingsFormData> => {
  console.log("Simulating loading global settings...");
  // In a real app, this would fetch from a persistent store
  // For now, it returns a copy of the current `initialSettings`
  return { ...initialSettings };
};

const saveGlobalSettings = async (data: GlobalSettingsFormData): Promise<void> => {
  console.log("Simulating saving global settings:", data);
  // In a real app, this would save to a persistent store
  // For now, it updates the `initialSettings` in memory
  initialSettings = { ...data };
};


export default function GlobalSettingsPage() {
  const { toast } = useToast();
  const { t, setLocale } = useLocale(); // Removed locale as it's not directly used here, only t and setLocale
  const iconSize = "h-3 w-3"; // Reduced icon size

  const form = useForm<GlobalSettingsFormData>({
    resolver: zodResolver(globalSettingsSchema),
    defaultValues: { // Ensure all fields, especially optional strings, have initial defined values
      companyName: '',
      companyLogoUrl: '',
      defaultCurrency: '',
      timezone: '',
      language: 'en', // Default language
    },
  });

  React.useEffect(() => {
    // Load settings only once on component mount
    loadGlobalSettings().then(settings => {
      // Ensure all loaded settings are defined or default to empty strings for form control
      const validatedSettings = {
        companyName: settings.companyName || '',
        companyLogoUrl: settings.companyLogoUrl || '',
        defaultCurrency: settings.defaultCurrency || '',
        timezone: settings.timezone || '',
        language: settings.language || 'en',
      };
      form.reset(validatedSettings);
      // Set initial locale from loaded settings
      if (validatedSettings.language && typeof window !== 'undefined') {
         setLocale(validatedSettings.language as Locale);
      }
    }).catch(error => {
      toast({
        title: t('global_settings.load_error_title'),
        description: t('global_settings.load_error_description'),
        variant: 'destructive',
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array: run only on mount

  const onSubmit = async (data: GlobalSettingsFormData) => {
    try {
      await saveGlobalSettings(data);
      if (typeof window !== 'undefined') {
        setLocale(data.language as Locale); // Update locale context after saving
      }
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
      <h1 className="text-base font-semibold">{t('global_settings.title')}</h1>
      <Card>
        {/* CardHeader and CardDescription removed */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6"> {/* Added pt-6 to CardContent */}
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

              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('global_settings.timezone_label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('global_settings.timezone_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormField
                 control={form.control}
                 name="language"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>{t('global_settings.language_label')}</FormLabel>
                     <Select
                        onValueChange={(value) => {
                            field.onChange(value);
                            // Optionally, update locale context immediately on select change,
                            // or wait for form submission. For now, we wait for submission.
                        }}
                        value={field.value || 'en'} // Ensure value is controlled
                     >
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
                {form.formState.isSubmitting ? t('global_settings.saving_button') : <><Save className={`mr-2 ${iconSize}`} /> {t('global_settings.save_button')}</>}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

