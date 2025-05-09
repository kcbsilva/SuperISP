// src/components/new-contract-wizard.tsx
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { getPops } from '@/services/mysql/pops';
import type { Pop } from '@/types/pops';
import { useLocale } from '@/contexts/LocaleContext';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Check } from 'lucide-react';

const contractStep1Schema = z.object({
  billingDate: z.date({ required_error: "Billing date is required." }),
  popId: z.string().min(1, "PoP selection is required."),
  services: z.array(z.enum(['Internet', 'TV', 'Phone', 'Mobile', 'Combo', 'Other'])).min(1, "At least one service must be selected."),
  installationFee: z.coerce.number().min(0, "Installation fee cannot be negative.").optional(),
  isFreeInstallation: z.boolean().default(false),
  paymentMethod: z.string().min(1, "Payment method is required."),
  billingType: z.enum(['Prepaid', 'Postpaid'], { required_error: "Billing type is required."}),
  contractTermMonths: z.coerce.number().int().min(1, "Contract term must be at least 1 month."),
}).refine(data => data.isFreeInstallation || (data.installationFee !== undefined && data.installationFee >= 0), {
    message: "Installation fee is required if installation is not free.",
    path: ["installationFee"],
});

type ContractStep1FormData = z.infer<typeof contractStep1Schema>;

const serviceOptions = ['Internet', 'TV', 'Phone', 'Mobile', 'Combo', 'Other'] as const;
const paymentMethods = ['Credit Card', 'Bank Transfer', 'Cash', 'Pix', 'Boleto'] as const;


interface NewContractWizardProps {
  isOpen: boolean;
  onClose: () => void;
  subscriberId: string;
}

export function NewContractWizard({ isOpen, onClose, subscriberId }: NewContractWizardProps) {
  const { t, locale } = useLocale();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = React.useState(1);
  const iconSize = "h-3 w-3";

  const form = useForm<ContractStep1FormData>({
    resolver: zodResolver(contractStep1Schema),
    defaultValues: {
      billingDate: new Date(),
      popId: '',
      services: [],
      installationFee: 0,
      isFreeInstallation: false,
      paymentMethod: undefined,
      billingType: undefined,
      contractTermMonths: 12,
    },
  });

  const { data: pops = [], isLoading: isLoadingPops, error: popsError } = useQuery<Pop[], Error>({
    queryKey: ['pops'],
    queryFn: getPops,
  });

  const watchIsFreeInstallation = form.watch('isFreeInstallation');
  const watchInstallationFee = form.watch('installationFee');

  const handleSubmitStep1 = (data: ContractStep1FormData) => {
    console.log('Step 1 Data:', data);
    // For now, just log. Later, this will advance to step 2.
    toast({
      title: t('new_contract_wizard.step1_saved_title'),
      description: t('new_contract_wizard.step1_saved_desc'),
    });
    // setCurrentStep(2); // Placeholder for next step
  };

  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitStep1)} className="space-y-4">
            {/* Billing Date */}
            <FormField
              control={form.control}
              name="billingDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t('new_contract_wizard.billing_date_label')}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal text-xs",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(field.value, "PPP") : <span>{t('new_contract_wizard.billing_date_placeholder')}</span>}
                          <CalendarIcon className={`ml-auto ${iconSize} opacity-50`} />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PoP Selection */}
            <FormField
              control={form.control}
              name="popId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('new_contract_wizard.pop_label')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingPops || !!popsError}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingPops ? t('new_contract_wizard.pop_loading') : popsError ? t('new_contract_wizard.pop_error') : t('new_contract_wizard.pop_placeholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {!isLoadingPops && !popsError && pops.map((pop) => (
                        <SelectItem key={pop.id.toString()} value={pop.id.toString()}>
                          {pop.name} ({pop.location})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Services Selection */}
            <FormField
              control={form.control}
              name="services"
              render={() => (
                <FormItem>
                  <FormLabel>{t('new_contract_wizard.services_label')}</FormLabel>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {serviceOptions.map((service) => (
                      <FormField
                        key={service}
                        control={form.control}
                        name="services"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(service)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), service])
                                    : field.onChange(
                                        (field.value || []).filter(
                                          (value) => value !== service
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal text-xs">
                              {t(`new_contract_wizard.service_type_${service.toLowerCase()}` as any, service)}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Installation Fee */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <FormField
                control={form.control}
                name="installationFee"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('new_contract_wizard.installation_fee_label')}</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="0.00" {...field} disabled={watchIsFreeInstallation} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="isFreeInstallation"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 pb-2">
                    <FormControl>
                        <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (checked) {
                                form.setValue('installationFee', 0);
                            }
                        }}
                        />
                    </FormControl>
                    <FormLabel className="text-xs font-normal">
                        {t('new_contract_wizard.free_installation_label')}
                    </FormLabel>
                    </FormItem>
                )}
                />
            </div>
            {!watchIsFreeInstallation && (watchInstallationFee || 0) > 0 && (
                 <p className="text-xs text-muted-foreground">
                    {t('new_contract_wizard.installation_fee_category_info')} 1.2 {t('new_contract_wizard.income_category_installation')}
                 </p>
            )}


            {/* Payment Method */}
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('new_contract_wizard.payment_method_label')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('new_contract_wizard.payment_method_placeholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentMethods.map(method => (
                        <SelectItem key={method} value={method}>{t(`new_contract_wizard.payment_method_${method.toLowerCase().replace(/\s+/g, '_')}` as any, method)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Billing Type */}
            <FormField
              control={form.control}
              name="billingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('new_contract_wizard.billing_type_label')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('new_contract_wizard.billing_type_placeholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Prepaid">{t('new_contract_wizard.billing_type_prepaid')}</SelectItem>
                      <SelectItem value="Postpaid">{t('new_contract_wizard.billing_type_postpaid')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

             <p className="text-xs text-muted-foreground">
                {t('new_contract_wizard.monthly_fee_category_info')} 1.1 {t('new_contract_wizard.income_category_monthly')}
            </p>

            {/* Contract Term */}
            <FormField
              control={form.control}
              name="contractTermMonths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('new_contract_wizard.contract_term_label')}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder={t('new_contract_wizard.contract_term_placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={onClose} disabled={form.formState.isSubmitting}>
                  {t('new_contract_wizard.cancel_button')}
                </Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                {t('new_contract_wizard.next_button')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      );
    }
    // Add cases for step 2 and 3 here
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-sm">
            {t('new_contract_wizard.title')} - {t('new_contract_wizard.step')} {currentStep}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {t('new_contract_wizard.step1_description')}
          </DialogDescription>
        </DialogHeader>
        {/* Simple Step Indicator */}
        <div className="flex justify-center items-center space-x-2 my-4">
            {[1, 2, 3].map(step => (
                <div key={step} className="flex flex-col items-center">
                    <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs border",
                        currentStep === step ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border",
                        currentStep > step ? "bg-green-500 text-white border-green-500" : ""
                    )}>
                        {currentStep > step ? <Check className="h-3 w-3" /> : step}
                    </div>
                    <span className="text-xs mt-1 text-muted-foreground">
                        {t(`new_contract_wizard.step${step}_title_short` as any)}
                    </span>
                </div>
            ))}
        </div>

        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
}