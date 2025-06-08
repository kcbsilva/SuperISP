
// src/app/admin/messenger/flow/page.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Workflow, Edit, Trash2, Loader2 } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription as AlertDialogDescriptionComponent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DaySchedule {
  enabled: boolean;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
}

interface MessengerFlowItem {
  id: string;
  description: string;
  status: 'Active' | 'Inactive';
  channel: 'WhatsApp' | 'Telegram' | 'Facebook' | 'Web' | 'API';
  schedule: {
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
    saturday: DaySchedule;
    sunday: DaySchedule;
  };
}

const defaultDaySchedule: DaySchedule = { enabled: false, startTime: '09:00', endTime: '17:00' };

const placeholderFlows: MessengerFlowItem[] = [
  { id: 'flow-1', description: 'Welcome flow for new WhatsApp users', status: 'Active', channel: 'WhatsApp', schedule: { monday: {...defaultDaySchedule, enabled: true}, tuesday: {...defaultDaySchedule, enabled: true}, wednesday: {...defaultDaySchedule, enabled: true}, thursday: {...defaultDaySchedule, enabled: true}, friday: {...defaultDaySchedule, enabled: true}, saturday: defaultDaySchedule, sunday: defaultDaySchedule } },
  { id: 'flow-2', description: 'Technical support triage for Telegram', status: 'Inactive', channel: 'Telegram', schedule: { monday: defaultDaySchedule, tuesday: defaultDaySchedule, wednesday: defaultDaySchedule, thursday: defaultDaySchedule, friday: defaultDaySchedule, saturday: defaultDaySchedule, sunday: defaultDaySchedule } },
  { id: 'flow-3', description: 'Billing inquiry automation for Web Chat', status: 'Active', channel: 'Web', schedule: { monday: {...defaultDaySchedule, enabled: true}, tuesday: {...defaultDaySchedule, enabled: true}, wednesday: {...defaultDaySchedule, enabled: true}, thursday: {...defaultDaySchedule, enabled: true}, friday: {...defaultDaySchedule, enabled: true}, saturday: {...defaultDaySchedule, enabled: true, startTime: '10:00', endTime: '14:00'}, sunday: defaultDaySchedule } },
];

const placeholderChannels = ['WhatsApp', 'Telegram', 'Facebook', 'Web', 'API'] as const;
const daysOfWeek: (keyof MessengerFlowItem['schedule'])[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];


const flowFormSchema = z.object({
  description: z.string().min(1, "Description is required."),
  status: z.enum(['Active', 'Inactive']),
  channel: z.enum(placeholderChannels, { required_error: "Channel is required." }),
  schedule: z.object({
    monday: z.object({ enabled: z.boolean(), startTime: z.string(), endTime: z.string() }),
    tuesday: z.object({ enabled: z.boolean(), startTime: z.string(), endTime: z.string() }),
    wednesday: z.object({ enabled: z.boolean(), startTime: z.string(), endTime: z.string() }),
    thursday: z.object({ enabled: z.boolean(), startTime: z.string(), endTime: z.string() }),
    friday: z.object({ enabled: z.boolean(), startTime: z.string(), endTime: z.string() }),
    saturday: z.object({ enabled: z.boolean(), startTime: z.string(), endTime: z.string() }),
    sunday: z.object({ enabled: z.boolean(), startTime: z.string(), endTime: z.string() }),
  }),
}).refine(data => {
  for (const day of daysOfWeek) {
    if (data.schedule[day].enabled) {
      if (!data.schedule[day].startTime) return false;
      if (!data.schedule[day].endTime) return false;
      if (data.schedule[day].startTime >= data.schedule[day].endTime) return false;
    }
  }
  return true;
}, {
  message: "Start time must be before end time for enabled days.",
  path: ["schedule"], 
});

type FlowFormData = z.infer<typeof flowFormSchema>;


export default function MessengerFlowListPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const iconSize = "h-3 w-3";

  const [flows, setFlows] = React.useState<MessengerFlowItem[]>(placeholderFlows);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingFlow, setEditingFlow] = React.useState<MessengerFlowItem | null>(null);
  const [flowToDelete, setFlowToDelete] = React.useState<MessengerFlowItem | null>(null);

  const form = useForm<FlowFormData>({
    resolver: zodResolver(flowFormSchema),
    defaultValues: {
      description: '',
      status: 'Active',
      channel: undefined,
      schedule: {
        monday: { ...defaultDaySchedule },
        tuesday: { ...defaultDaySchedule },
        wednesday: { ...defaultDaySchedule },
        thursday: { ...defaultDaySchedule },
        friday: { ...defaultDaySchedule },
        saturday: { ...defaultDaySchedule },
        sunday: { ...defaultDaySchedule },
      },
    },
  });

  const handleAddNewFlow = () => {
    setEditingFlow(null);
    form.reset({
      description: '',
      status: 'Active',
      channel: undefined,
      schedule: {
        monday: { ...defaultDaySchedule },
        tuesday: { ...defaultDaySchedule },
        wednesday: { ...defaultDaySchedule },
        thursday: { ...defaultDaySchedule },
        friday: { ...defaultDaySchedule },
        saturday: { ...defaultDaySchedule },
        sunday: { ...defaultDaySchedule },
      }
    });
    setIsModalOpen(true);
  };

  const handleEditFlowModal = (flow: MessengerFlowItem) => {
    setEditingFlow(flow);
    form.reset({
      description: flow.description,
      status: flow.status,
      channel: flow.channel,
      schedule: { ...flow.schedule },
    });
    setIsModalOpen(true);
  };

  const confirmDeleteFlow = () => {
    if (flowToDelete) {
      setFlows(prevFlows => prevFlows.filter(flow => flow.id !== flowToDelete.id));
      toast({
        title: t('messenger_flow.delete_success_title'),
        description: t('messenger_flow.delete_success_desc', 'Flow "{name}" has been deleted.').replace('{name}', flowToDelete.description),
        variant: 'destructive',
      });
      setFlowToDelete(null);
    }
  };

  const onSubmit = (data: FlowFormData) => {
    if (editingFlow) {
      setFlows(prevFlows => prevFlows.map(flow =>
        flow.id === editingFlow.id ? { ...editingFlow, ...data } : flow
      ));
      toast({
        title: t('messenger_flow.update_success_title'),
        description: t('messenger_flow.update_success_desc', 'Flow "{name}" has been updated.').replace('{name}', data.description),
      });
    } else {
      const newFlow: MessengerFlowItem = {
        id: `flow-${Date.now()}`,
        ...data,
      };
      setFlows(prevFlows => [newFlow, ...prevFlows]);
      toast({
        title: t('messenger_flow.add_success_title'),
        description: t('messenger_flow.add_success_desc', 'Flow "{name}" has been added.').replace('{name}', data.description),
      });
    }
    setIsModalOpen(false);
    setEditingFlow(null);
  };


  const getStatusBadgeVariant = (status: MessengerFlowItem['status']) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="flex flex-col gap-6 p-2 md:p-4 h-full">
      <div className="flex justify-between items-center shrink-0">
        <h1 className="text-base font-semibold flex items-center gap-2">
          <Workflow className="h-4 w-4 text-primary" />
          {t('sidebar.messenger_flow', 'Messenger Flows')}
        </h1>
        <Button onClick={handleAddNewFlow} className="bg-green-600 hover:bg-green-700 text-white">
          <PlusCircle className={`mr-2 ${iconSize}`} />
          {t('messenger_flow.add_new_flow_button', 'Add New Flow')}
        </Button>
      </div>

      <Card className="flex-1">
        <CardContent className="pt-6">
          {flows.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs w-24 text-center">{t('messenger_flow.table_header_id', 'ID')}</TableHead>
                    <TableHead className="text-xs text-center">{t('messenger_flow.table_header_description', 'Description')}</TableHead>
                    <TableHead className="text-xs text-center">{t('messenger_flow.table_header_status', 'Status')}</TableHead>
                    <TableHead className="text-xs text-center">{t('messenger_flow.table_header_channel', 'Channel')}</TableHead>
                    <TableHead className="text-xs text-center w-28">{t('messenger_flow.table_header_actions', 'Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flows.map((flow) => (
                    <TableRow key={flow.id}>
                      <TableCell className="font-mono text-muted-foreground text-xs text-center">{flow.id}</TableCell>
                      <TableCell className="font-medium text-xs text-center">{flow.description}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={`text-xs ${getStatusBadgeVariant(flow.status)} border-transparent`}>
                          {t(`messenger_flow.status_${flow.status.toLowerCase()}` as any, flow.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-center">{flow.channel}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-0.5">
                          <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                            <Link href={`/admin/messenger/flow/${flow.id}/edit`}>
                              <Workflow className={iconSize} />
                              <span className="sr-only">{t('messenger_flow.action_edit_flow_visual', 'Edit Flow Visual')}</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditFlowModal(flow)}>
                            <Edit className={iconSize} />
                            <span className="sr-only">{t('messenger_flow.action_edit', 'Edit')}</span>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                                <Trash2 className={iconSize} />
                                <span className="sr-only">{t('messenger_flow.action_delete', 'Delete')}</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t('messenger_flow.delete_confirm_title')}</AlertDialogTitle>
                                <AlertDialogDescriptionComponent className="text-xs">
                                  {t('messenger_flow.delete_confirm_desc_flow', 'Are you sure you want to delete the flow "{name}"? This action cannot be undone.').replace('{name}', flow.description)}
                                </AlertDialogDescriptionComponent>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setFlowToDelete(null)}>{t('messenger_flow.form_cancel_button')}</AlertDialogCancel>
                                <AlertDialogAction
                                  className={buttonVariants({ variant: "destructive" })}
                                  onClick={() => { setFlowToDelete(flow); confirmDeleteFlow(); }}
                                >
                                  {t('messenger_flow.form_delete_button')}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8 text-xs">
              {t('messenger_flow.no_flows_found', 'No flows configured yet.')}
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={(isOpen) => { if (!isOpen) { setEditingFlow(null); form.reset(); } setIsModalOpen(isOpen); }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-sm">{editingFlow ? t('messenger_flow.edit_flow_modal_title') : t('messenger_flow.add_flow_modal_title')}</DialogTitle>
            <DialogDescription className="text-xs">{t('messenger_flow.edit_flow_modal_desc')}</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <ScrollArea className="max-h-[70vh] p-1 pr-3">
                <div className="space-y-4 p-1">
                  <div className="grid grid-cols-2 gap-4 items-center">
                     <FormField
                      control={form.control}
                      name="channel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('messenger_flow.form_channel_label')}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('messenger_flow.form_channel_placeholder')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {placeholderChannels.map(channel => (
                                <SelectItem key={channel} value={channel}>{channel}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm h-full">
                          <div className="space-y-0.5">
                            <FormLabel>{t('messenger_flow.form_status_label')}</FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value === 'Active'}
                              onCheckedChange={(checked) => field.onChange(checked ? 'Active' : 'Inactive')}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('messenger_flow.form_description_label')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('messenger_flow.form_description_placeholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <fieldset className="border border-input p-3 rounded-md">
                    <legend className="text-xs font-medium text-muted-foreground px-1">{t('messenger_flow.form_schedule_title')}</legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 mt-2">
                      {daysOfWeek.map((day) => (
                        <Card key={day} className="p-3">
                          <FormField
                            control={form.control}
                            name={`schedule.${day}.enabled`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-2 mb-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    id={`schedule-${day}-enabled`}
                                  />
                                </FormControl>
                                <FormLabel htmlFor={`schedule-${day}-enabled`} className="text-xs font-medium cursor-pointer">
                                  {t(`messenger_flow.form_schedule_day_${day}`)}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                          {form.watch(`schedule.${day}.enabled`) && (
                            <div className="grid grid-cols-2 gap-2">
                              <FormField
                                control={form.control}
                                name={`schedule.${day}.startTime`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-xs">{t('messenger_flow.form_schedule_start_time')}</FormLabel>
                                    <FormControl>
                                      <Input type="time" {...field} className="text-xs" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`schedule.${day}.endTime`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-xs">{t('messenger_flow.form_schedule_end_time')}</FormLabel>
                                    <FormControl>
                                      <Input type="time" {...field} className="text-xs" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                     {form.formState.errors.schedule && <p className="text-xs font-medium text-destructive mt-2">{form.formState.errors.schedule.message || form.formState.errors.schedule.root?.message}</p>}
                  </fieldset>
                </div>
              </ScrollArea>
              <DialogFooter className="pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={form.formState.isSubmitting}>{t('messenger_flow.form_cancel_button')}</Button>
                </DialogClose>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                  {form.formState.isSubmitting ? t('messenger_flow.form_saving_button') : (editingFlow ? t('messenger_flow.form_update_button') : t('messenger_flow.form_save_button'))}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

