// src/app/settings/global/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';
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
  language: z.enum(['en'], { // Only 'en' is allowed
    required_error: "Please select a default language.",
  }).default('en'),
});

type GlobalSettingsFormData = z.infer<typeof globalSettingsSchema>;

let initialSettings: GlobalSettingsFormData = {
  companyName: 'NetHub ISP',
  companyLogoUrl: '',
  defaultCurrency: 'USD',
  timezone: 'America/New_York',
  language: 'en',
};

const loadGlobalSettings = async (): Promise<GlobalSettingsFormData> => {
  console.log("Simulating loading global settings...");
  // Ensure loaded settings conform to the new schema (language 'en')
  return { ...initialSettings, language: 'en' };
};

const saveGlobalSettings = async (data: GlobalSettingsFormData): Promise<void> => {
  console.log("Simulating saving global settings:", data);
  initialSettings = { ...data, language: 'en' }; // Ensure language is always 'en' on save
};


export default function GlobalSettingsPage() {
  const { toast } = useToast();
  const { t, setLocale } = useLocale();
  const iconSize = "h-3 w-3";

  const form = useForm<GlobalSettingsFormData>({
    resolver: zodResolver(globalSettingsSchema),
    defaultValues: {
      companyName: '',
      companyLogoUrl: '',
      defaultCurrency: '',
      timezone: '',
      language: 'en', // Default to 'en'
    },
  });

  React.useEffect(() => {
    loadGlobalSettings().then(settings => {
      const validatedSettings = {
        companyName: settings.companyName || '',
        companyLogoUrl: settings.companyLogoUrl || '',
        defaultCurrency: settings.defaultCurrency || '',
        timezone: settings.timezone || '',
        language: 'en' as Locale, // Force language to 'en'
      };
      form.reset(validatedSettings);
      if (typeof window !== 'undefined') {
         setLocale('en'); // Set locale context to 'en'
      }
    }).catch(error => {
      toast({
        title: t('global_settings.load_error_title'),
        description: t('global_settings.load_error_description'),
        variant: 'destructive',
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // form removed from deps to avoid re-triggering on its own reset

  const onSubmit = async (data: GlobalSettingsFormData) => {
    try {
      // Ensure language is 'en' before saving, even if form somehow submitted other value
      const dataToSave = { ...data, language: 'en' as Locale };
      await saveGlobalSettings(dataToSave);
      if (typeof window !== 'undefined') {
        setLocale('en');
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
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
                            if (value === 'en') { // Only allow 'en'
                                field.onChange(value as Locale);
                            }
                        }}
                        value={field.value || 'en'} // Ensure value is always 'en'
                     >
                       <FormControl>
                         <SelectTrigger>
                           <SelectValue placeholder={t('global_settings.language_placeholder')} />
                         </SelectTrigger>
                       </FormControl>
                       <SelectContent>
                         <SelectItem value="en">{t('global_settings.language_english')}</SelectItem>
                         {/* Portuguese option removed */}
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
