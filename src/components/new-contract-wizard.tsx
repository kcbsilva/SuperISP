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
// Calendar and Popover for billing date are no longer needed as it's a select now
// import { Calendar } from '@/components/ui/calendar';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarIcon, Loader2, PlusCircle, Trash2, Check, Wifi, Tv, Phone as PhoneIcon, Smartphone, Combine as CombineIcon, Package as PackageIcon, DollarSign } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { getPops } from '@/services/mysql/pops';
import type { Pop } from '@/types/pops';
import { useLocale } from '@/contexts/LocaleContext';
// import { format } from 'date-fns'; // Not needed for select
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';


// Simulate fetching billing dates from financial configurations
// In a real app, this would come from a service or shared state
const placeholderBillingDaysFromConfig: { id: string; dayOfMonth: number | 'Last Day'; status: boolean }[] = [
  { id: 'bd-1', dayOfMonth: 1, status: true },
  { id: 'bd-2', dayOfMonth: 15, status: true },
  { id: 'bd-3', dayOfMonth: 'Last Day', status: false },
  { id: 'bd-4', dayOfMonth: 10, status: true },
];


const dayOfMonthSchema = z.union([
  z.coerce.number().int().min(1).max(31),
  z.literal('Last Day')
]);

// Main contract schema (Step 1)
const contractStep1Schema = z.object({
  billingDate: dayOfMonthSchema, // Changed from z.date
  popId: z.string().min(1, "PoP selection is required."),
  hasInstallationFee: z.boolean().default(false),
  installationFee: z.coerce.number().min(0, "Installation fee cannot be negative.").optional(),
  paymentMethod: z.string().min(1, "Payment method is required."),
  billingType: z.enum(['Prepaid', 'Postpaid'], { required_error: "Billing type is required."}),
  contractTermMonths: z.coerce.number().int().min(1, "Contract term must be at least 1 month."),
}).refine(data => !data.hasInstallationFee || (data.installationFee !== undefined && data.installationFee >= 0), {
    message: "Installation fee is required if the 'Has Installation Fee' box is checked.",
    path: ["installationFee"],
});
type ContractStep1FormData = z.infer<typeof contractStep1Schema>;

// Schema for the "Add Service to Contract" modal
const serviceTypeEnum = z.enum(['Internet', 'TV', 'Phone', 'Mobile', 'Combo', 'Other']);
const addServiceToContractSchema = z.object({
  serviceType: serviceTypeEnum,
  technology: z.string().optional(),
  planId: z.string().min(1, "Plan selection is required."),
}).refine(data => data.serviceType !== 'Internet' || (data.technology && data.technology.length > 0), {
  message: "Technology is required for Internet service.",
  path: ["technology"],
});
type AddServiceToContractFormData = z.infer<typeof addServiceToContractSchema>;

const paymentMethods = ['Credit Card', 'Bank Transfer', 'Cash', 'Pix', 'Boleto'] as const;
const technologies = ['UTP', 'Fiber Optic', 'Radio', 'Satellite'] as const;

interface Plan {
  id: string;
  name: string;
  popId: string;
  technology?: string; // For Internet plans
  serviceType: z.infer<typeof serviceTypeEnum>;
  price: number;
}

// Placeholder Plan Data - In a real app, this would be fetched
const placeholderPlans: Plan[] = [
  { id: 'plan-int-fiber-100-popA', name: 'Fiber 100 Basic (PoP A)', popId: 'sim-1', technology: 'Fiber Optic', serviceType: 'Internet', price: 50 },
  { id: 'plan-int-fiber-500-popA', name: 'Fiber 500 Pro (PoP A)', popId: 'sim-1', technology: 'Fiber Optic', serviceType: 'Internet', price: 80 },
  { id: 'plan-int-radio-popA', name: 'Radio Connect (PoP A)', popId: 'sim-1', technology: 'Radio', serviceType: 'Internet', price: 40 },
  { id: 'plan-int-utp-popA', name: 'UTP Business (PoP A)', popId: 'sim-1', technology: 'UTP', serviceType: 'Internet', price: 60 },
  { id: 'plan-int-sat-popB', name: 'Satellite Remote (PoP B)', popId: 'sim-2', technology: 'Satellite', serviceType: 'Internet', price: 70 },
  { id: 'plan-tv-basic-popA', name: 'Basic TV Package (PoP A)', popId: 'sim-1', serviceType: 'TV', price: 25 },
  { id: 'plan-tv-premium-popB', name: 'Premium TV Channels (PoP B)', popId: 'sim-2', serviceType: 'TV', price: 45 },
  { id: 'plan-phone-local-popA', name: 'Local Landline (PoP A)', popId: 'sim-1', serviceType: 'Phone', price: 15 },
  { id: 'plan-mobile-5gb-popC', name: 'Mobile 5GB (PoP C)', popId: 'sim-3', serviceType: 'Mobile', price: 30 },
  { id: 'plan-combo-inttv-popA', name: 'Internet + Basic TV (PoP A)', popId: 'sim-1', serviceType: 'Combo', price: 70 },
  { id: 'plan-other-hosting-popA', name: 'Web Hosting Basic (PoP A)', popId: 'sim-1', serviceType: 'Other', price: 10 },
];

interface AddedService {
  id: string;
  serviceType: z.infer<typeof serviceTypeEnum>;
  planId: string;
  planName: string;
  technology?: string;
  price: number;
}

interface NewContractWizardProps {
  isOpen: boolean;
  onClose: () => void;
  subscriberId: string;
}

export function NewContractWizard({ isOpen, onClose, subscriberId }: NewContractWizardProps) {
  const { t, locale } = useLocale();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = React.useState(false);
  const [addedServices, setAddedServices] = React.useState<AddedService[]>([]);
  const iconSize = "h-3 w-3";

  const mainForm = useForm<ContractStep1FormData>({
    resolver: zodResolver(contractStep1Schema),
    defaultValues: {
      billingDate: 1, // Default to 1st day, will be string or number
      popId: '',
      hasInstallationFee: false,
      installationFee: 0,
      paymentMethod: undefined,
      billingType: undefined,
      contractTermMonths: 12,
    },
  });

  const addServiceToContractForm = useForm<AddServiceToContractFormData>({
    resolver: zodResolver(addServiceToContractSchema),
    defaultValues: {
      serviceType: undefined,
      technology: undefined,
      planId: '',
    },
  });

  const { data: pops = [], isLoading: isLoadingPops } = useQuery<Pop[], Error>({
    queryKey: ['pops'],
    queryFn: getPops,
  });

  const watchHasInstallationFee = mainForm.watch('hasInstallationFee');
  const watchSelectedPopId = mainForm.watch('popId');

  const watchServiceTypeForAddModal = addServiceToContractForm.watch('serviceType');
  const watchTechnologyForAddModal = addServiceToContractForm.watch('technology');

  const totalMonthlyCost = React.useMemo(() => {
    return addedServices.reduce((sum, service) => sum + service.price, 0);
  }, [addedServices]);

  const currencyLocale = locale === 'pt' ? 'pt-BR' : locale === 'fr' ? 'fr-FR' : 'en-US';
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString(currencyLocale, { style: 'currency', currency: 'USD' }); // Assuming USD for now
  };

  React.useEffect(() => {
    if (!watchHasInstallationFee) {
      mainForm.setValue('installationFee', 0);
    }
  }, [watchHasInstallationFee, mainForm]);

  // Filter active billing days from config for the dropdown
  const activeBillingDays = React.useMemo(() => {
    return placeholderBillingDaysFromConfig
      .filter(bd => bd.status)
      .map(bd => bd.dayOfMonth)
      .sort((a,b) => (a === 'Last Day' ? 32 : a) - (b === 'Last Day' ? 32 : b) ); // Sort numerically, 'Last Day' at end
  }, []);


  const handleSubmitStep1: SubmitHandler<ContractStep1FormData> = (data) => {
    const finalData = {
      ...data,
      installationFee: data.hasInstallationFee ? data.installationFee : 0,
    };
    console.log('Step 1 Data (Main Contract):', finalData);
    console.log('Added Services:', addedServices);
    if (addedServices.length === 0) {
        toast({
            title: t('new_contract_wizard.no_services_title'),
            description: t('new_contract_wizard.no_services_desc'),
            variant: 'destructive',
        });
        return;
    }
    toast({
      title: t('new_contract_wizard.step1_saved_title'),
      description: t('new_contract_wizard.step1_saved_desc'),
    });
    onClose();
  };

  const handleOpenAddServiceModal = () => {
    if (!watchSelectedPopId) {
        toast({
            title: t('new_contract_wizard.select_pop_first_title'),
            description: t('new_contract_wizard.select_pop_first_desc'),
            variant: 'destructive',
        });
        return;
    }
    addServiceToContractForm.reset({ serviceType: undefined, technology: undefined, planId: '' });
    setIsAddServiceModalOpen(true);
  };

  const handleAddServiceToContractSubmit: SubmitHandler<AddServiceToContractFormData> = (data) => {
    const selectedPlan = placeholderPlans.find(p => p.id === data.planId);
    if (selectedPlan) {
      setAddedServices(prev => [...prev, {
        id: `service-${Date.now()}`,
        serviceType: data.serviceType,
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        technology: data.serviceType === 'Internet' ? data.technology : undefined,
        price: selectedPlan.price,
      }]);
      toast({
        title: t('new_contract_wizard.service_added_to_contract_title'),
        description: t('new_contract_wizard.service_added_to_contract_desc', '{planName} added.').replace('{planName}', selectedPlan.name),
      });
      setIsAddServiceModalOpen(false);
    } else {
        toast({
            title: t('new_contract_wizard.error_finding_plan_title'),
            description: t('new_contract_wizard.error_finding_plan_desc'),
            variant: 'destructive'
        });
    }
  };

  const handleRemoveService = (serviceIdToRemove: string) => {
    setAddedServices(prev => prev.filter(s => s.id !== serviceIdToRemove));
  };

  const filteredPlansForModal = React.useMemo(() => {
    if (!watchSelectedPopId || !watchServiceTypeForAddModal) return [];
    return placeholderPlans.filter(plan =>
      plan.popId === watchSelectedPopId &&
      plan.serviceType === watchServiceTypeForAddModal &&
      (watchServiceTypeForAddModal !== 'Internet' || plan.technology === watchTechnologyForAddModal)
    );
  }, [watchSelectedPopId, watchServiceTypeForAddModal, watchTechnologyForAddModal]);


  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <Form {...mainForm}>
          <form onSubmit={mainForm.handleSubmit(handleSubmitStep1)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={mainForm.control}
                name="billingDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('new_contract_wizard.billing_date_label')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('new_contract_wizard.billing_date_placeholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {activeBillingDays.map(day => (
                          <SelectItem key={day.toString()} value={day.toString()}>
                            {day === 'Last Day' ? t('financial_configs.day_last', 'Last Day') : day}
                          </SelectItem>
                        ))}
                        {activeBillingDays.length === 0 && <SelectItem value="" disabled>{t('new_contract_wizard.no_billing_dates_configured')}</SelectItem>}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={mainForm.control}
                name="popId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('new_contract_wizard.pop_label')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingPops}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingPops ? t('new_contract_wizard.pop_loading') : t('new_contract_wizard.pop_placeholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pops.map((pop) => (
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
            </div>

            {/* Services Section */}
            <FormItem>
              <div className="flex justify-between items-center mb-1">
                <FormLabel>{t('new_contract_wizard.services_label')}</FormLabel>
                <div className="text-right">
                    <Button type="button" variant="outline" size="sm" onClick={handleOpenAddServiceModal} className="shrink-0">
                        <PlusCircle className={`mr-2 ${iconSize}`} /> {t('new_contract_wizard.add_service_button')}
                    </Button>
                </div>
              </div>
              <div className="min-h-[100px] border border-input rounded-md p-3 bg-background">
                {addedServices.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">{t('new_contract_wizard.no_services_added_yet')}</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">{t('new_contract_wizard.service_description_header', 'Service Description')}</TableHead>
                        <TableHead className="text-xs text-right">{t('new_contract_wizard.service_cost_header', 'Cost')}</TableHead>
                        <TableHead className="w-10 text-xs text-right">{t('new_contract_wizard.service_actions_header', 'Actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {addedServices.map(service => (
                        <TableRow key={service.id}>
                          <TableCell className="text-xs">
                            <span className="font-medium">{t(`new_contract_wizard.service_type_${service.serviceType.toLowerCase()}` as any, service.serviceType)}</span>: {service.planName}
                            {service.technology && <span className="text-muted-foreground ml-1">({service.technology})</span>}
                          </TableCell>
                          <TableCell className="text-xs text-right">{formatCurrency(service.price)}</TableCell>
                          <TableCell className="text-right">
                            <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleRemoveService(service.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
              {addedServices.length > 0 && (
                <div className="text-right text-sm font-semibold mt-2">
                    {t('new_contract_wizard.total_monthly_cost_label', 'Total Monthly Cost:')} {formatCurrency(totalMonthlyCost)}
                </div>
              )}
            </FormItem>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
                 <FormField
                    control={mainForm.control}
                    name="hasInstallationFee"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 pt-5"> {/* Adjusted pt-5 to align with input */}
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-xs font-normal cursor-pointer mt-0!"> {/* Removed default margin top from label */}
                          {t('new_contract_wizard.has_installation_fee_label', 'Charge Installation Fee?')}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                <FormField
                    control={mainForm.control}
                    name="installationFee"
                    render={({ field }) => (
                    <FormItem className={!watchHasInstallationFee ? 'invisible' : ''}> {/* Use invisible to keep layout stable */}
                        <FormLabel>{t('new_contract_wizard.installation_fee_label')}</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="0.00" {...field} disabled={!watchHasInstallationFee} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            {watchHasInstallationFee && (mainForm.getValues('installationFee') || 0) > 0 && (
              <p className="text-xs text-muted-foreground">
                {t('new_contract_wizard.installation_fee_category_info')} 1.2 {t('new_contract_wizard.income_category_installation')}
              </p>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField
                control={mainForm.control}
                name="paymentMethod"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('new_contract_wizard.payment_method_label')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder={t('new_contract_wizard.payment_method_placeholder')} /></SelectTrigger></FormControl>
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
                <FormField
                control={mainForm.control}
                name="contractTermMonths"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('new_contract_wizard.contract_term_label')}</FormLabel>
                    <FormControl><Input type="number" placeholder={t('new_contract_wizard.contract_term_placeholder')} {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={mainForm.control}
                name="billingType"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('new_contract_wizard.billing_type_label')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder={t('new_contract_wizard.billing_type_placeholder')} /></SelectTrigger></FormControl>
                        <SelectContent>
                        <SelectItem value="Prepaid">{t('new_contract_wizard.billing_type_prepaid')}</SelectItem>
                        <SelectItem value="Postpaid">{t('new_contract_wizard.billing_type_postpaid')}</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <p className="text-xs text-muted-foreground">
              {t('new_contract_wizard.monthly_fee_category_info')} 1.1 {t('new_contract_wizard.income_category_monthly')}
            </p>
            
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline" onClick={onClose} disabled={mainForm.formState.isSubmitting}>{t('new_contract_wizard.cancel_button')}</Button></DialogClose>
              <Button type="submit" disabled={mainForm.formState.isSubmitting}>
                {mainForm.formState.isSubmitting && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                {t('new_contract_wizard.next_button')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      );
    }
    return <p className="text-center text-sm py-8">{t('new_contract_wizard.step_content_placeholder', 'Step {currentStep} content goes here.').replace('{currentStep}', currentStep.toString())}</p>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); setCurrentStep(1); setAddedServices([]); mainForm.reset(); } }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-sm">{t('new_contract_wizard.title')} - {t('new_contract_wizard.step')} {currentStep}</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center items-center space-x-2 my-4">
          {[1, 2, 3].map(step => (
            <div key={step} className="flex flex-col items-center">
              <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs border", currentStep === step ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border", currentStep > step ? "bg-green-500 text-white border-green-500" : "")}>
                {currentStep > step ? <Check className="h-3 w-3" /> : step}
              </div>
              <span className="text-xs mt-1 text-muted-foreground">{t(`new_contract_wizard.step${step}_title_short` as any)}</span>
            </div>
          ))}
        </div>
        {renderStepContent()}

        <Dialog open={isAddServiceModalOpen} onOpenChange={setIsAddServiceModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm">{t('new_contract_wizard.add_service_modal_title')}</DialogTitle>
              <DialogDescription className="text-xs">{t('new_contract_wizard.add_service_modal_desc')}</DialogDescription>
            </DialogHeader>
            <Form {...addServiceToContractForm}>
              <form onSubmit={addServiceToContractForm.handleSubmit(handleAddServiceToContractSubmit)} className="space-y-4 py-4">
                <FormField
                  control={addServiceToContractForm.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('new_contract_wizard.service_type_label')}</FormLabel>
                      <Select onValueChange={(value) => {
                          field.onChange(value);
                          if (value !== 'Internet') addServiceToContractForm.setValue('technology', undefined);
                          addServiceToContractForm.setValue('planId', '');
                      }} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder={t('new_contract_wizard.service_type_placeholder')} /></SelectTrigger></FormControl>
                        <SelectContent>
                          {(['Internet', 'TV', 'Phone', 'Mobile', 'Combo', 'Other'] as const).map(st => (
                            <SelectItem key={st} value={st}>{t(`new_contract_wizard.service_type_${st.toLowerCase()}` as any, st)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {watchServiceTypeForAddModal === 'Internet' && (
                  <FormField
                    control={addServiceToContractForm.control}
                    name="technology"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('new_contract_wizard.technology_label')}</FormLabel>
                        <Select onValueChange={(value) => {
                            field.onChange(value);
                            addServiceToContractForm.setValue('planId', '');
                        }} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder={t('new_contract_wizard.technology_placeholder')} /></SelectTrigger></FormControl>
                          <SelectContent>
                            {technologies.map(tech => (
                              <SelectItem key={tech} value={tech}>{t(`new_contract_wizard.technology_${tech.toLowerCase().replace(/\s+/g, '_')}` as any, tech)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={addServiceToContractForm.control}
                  name="planId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('new_contract_wizard.plan_label')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={filteredPlansForModal.length === 0}>
                        <FormControl><SelectTrigger><SelectValue placeholder={
                            filteredPlansForModal.length === 0 ?
                            (watchServiceTypeForAddModal === 'Internet' && !watchTechnologyForAddModal ? t('new_contract_wizard.select_technology_first') : t('new_contract_wizard.no_plans_available'))
                            : t('new_contract_wizard.plan_placeholder')} /></SelectTrigger></FormControl>
                        <SelectContent>
                          {filteredPlansForModal.map(plan => (
                            <SelectItem key={plan.id} value={plan.id}>{plan.name} ({formatCurrency(plan.price)})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild><Button type="button" variant="outline" onClick={() => setIsAddServiceModalOpen(false)}>{t('new_contract_wizard.cancel_button')}</Button></DialogClose>
                  <Button type="submit" disabled={addServiceToContractForm.formState.isSubmitting || !addServiceToContractForm.formState.isValid}>
                    {addServiceToContractForm.formState.isSubmitting && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                    {t('new_contract_wizard.add_to_contract_button')}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
