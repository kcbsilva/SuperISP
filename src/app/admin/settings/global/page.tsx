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
  language: z.enum(['en', 'pt'], { // Removed 'fr'
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
  return { ...initialSettings };
};

const saveGlobalSettings = async (data: GlobalSettingsFormData): Promise<void> => {
  console.log("Simulating saving global settings:", data);
  initialSettings = { ...data };
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
      language: 'en',
    },
  });

  React.useEffect(() => {
    loadGlobalSettings().then(settings => {
      const validatedSettings = {
        companyName: settings.companyName || '',
        companyLogoUrl: settings.companyLogoUrl || '',
        defaultCurrency: settings.defaultCurrency || '',
        timezone: settings.timezone || '',
        language: settings.language || 'en',
      };
      form.reset(validatedSettings);
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
  }, []);

  const onSubmit = async (data: GlobalSettingsFormData) => {
    try {
      await saveGlobalSettings(data);
      if (typeof window !== 'undefined') {
        setLocale(data.language as Locale);
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
                            field.onChange(value);
                        }}
                        value={field.value || 'en'}
                     >
                       <FormControl>
                         <SelectTrigger>
                           <SelectValue placeholder={t('global_settings.language_placeholder')} />
                         </SelectTrigger>
                       </FormControl>
                       <SelectContent>
                         <SelectItem value="en">{t('global_settings.language_english')}</SelectItem>
                         {/* Removed French option */}
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
