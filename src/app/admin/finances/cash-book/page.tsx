// src/app/finances/cash-book/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { PlusCircle, RefreshCw, ArrowUpDown, DollarSign, Edit, Trash2, Loader2, CalendarIcon, Search } from 'lucide-react';
import { useLocale, type Locale as AppLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, parseISO } from 'date-fns';
import { enUS, fr, ptBR } from 'date-fns/locale';
import { cn } from "@/lib/utils";


// Validation Schema for a new entry
const entrySchema = z.object({
  date: z.date({ required_error: "Date is required." }),
  description: z.string().min(1, "Description is required."),
  category: z.string().min(1, "Category is required."),
  type: z.enum(['Income', 'Expense'], { required_error: "Entry type is required." }),
  amount: z.coerce.number().positive("Amount must be positive."),
  reference: z.string().optional(),
});

type EntryFormData = z.infer<typeof entrySchema>;

interface CashBookEntry extends EntryFormData {
  id: string;
}

const placeholderEntries: CashBookEntry[] = [
  { id: 'entry-1', date: parseISO('2024-07-25'), description: 'Payment from Client X', category: 'Subscription Revenue', type: 'Income', amount: 150.00, reference: 'INV-001' },
  { id: 'entry-2', date: parseISO('2024-07-24'), description: 'Office Supplies', category: 'Operational Costs', type: 'Expense', amount: 45.50 },
  { id: 'entry-3', date: parseISO('2024-07-23'), description: 'Internet Bill', category: 'Utilities', type: 'Expense', amount: 75.00 },
  { id: 'entry-4', date: parseISO('2024-07-22'), description: 'New Equipment Purchase', category: 'Capital Expenditure', type: 'Expense', amount: 1200.00, reference: 'PO-005' },
  { id: 'entry-5', date: parseISO('2024-07-21'), description: 'Consulting Fee', category: 'Service Revenue', type: 'Income', amount: 500.00 },
];

const dateLocales: Record<AppLocale, typeof enUS> = {
    en: enUS,
    fr: fr,
    pt: ptBR,
};

export default function CashBookPage() {
  const { t, locale } = useLocale();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState<'All' | 'Income' | 'Expense'>('All');
  const [sortColumn, setSortColumn] = React.useState<'date' | 'amount' | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');
  const [isAddEntryDialogOpen, setIsAddEntryDialogOpen] = React.useState(false);

  const form = useForm<EntryFormData>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      date: new Date(),
      description: '',
      category: '',
      type: undefined,
      amount: 0,
      reference: '',
    },
  });

  const handleAddEntrySubmit = (data: EntryFormData) => {
    console.log("New Entry Data:", data);
    toast({
      title: t('cash_book.add_entry_success_title'),
      description: t('cash_book.add_entry_success_description', '{type} entry "{description}" added.').replace('{type}', data.type).replace('{description}', data.description),
    });
    form.reset();
    setIsAddEntryDialogOpen(false);
  };

  const handleSort = (column: 'date' | 'amount') => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedEntries = React.useMemo(() => {
    let entries = placeholderEntries.filter(entry => {
      const searchTermMatch = entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (entry.reference && entry.reference.toLowerCase().includes(searchTerm.toLowerCase())) ||
                              entry.category.toLowerCase().includes(searchTerm.toLowerCase());
      const typeMatch = filterType === 'All' || entry.type === filterType;
      return searchTermMatch && typeMatch;
    });

    if (sortColumn) {
      entries.sort((a, b) => {
        let comparison = 0;
        if (sortColumn === 'date') {
          comparison = a.date.getTime() - b.date.getTime();
        } else if (sortColumn === 'amount') {
          comparison = a.amount - b.amount;
        }
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }
    return entries;
  }, [searchTerm, filterType, sortColumn, sortDirection]);

  const totalIncome = React.useMemo(() =>
    filteredAndSortedEntries
      .filter(e => e.type === 'Income')
      .reduce((sum, e) => sum + e.amount, 0),
  [filteredAndSortedEntries]);

  const totalExpenses = React.useMemo(() =>
    filteredAndSortedEntries
      .filter(e => e.type === 'Expense')
      .reduce((sum, e) => sum + e.amount, 0),
  [filteredAndSortedEntries]);

  const netBalance = React.useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);

  const currencyLocale = locale === 'pt' ? 'pt-BR' : locale === 'fr' ? 'fr-FR' : 'en-US';
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString(currencyLocale, { style: 'currency', currency: 'USD' }); // Assuming USD, adjust as needed
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-xl font-semibold">{t('cash_book.title', 'Cash Book')}</h1>
        <div className="flex flex-col sm:flex-row flex-grow items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-grow w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('cash_book.search_placeholder', 'Search by description, category, reference...')}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={(value) => setFilterType(value as 'All' | 'Income' | 'Expense')}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder={t('cash_book.filter_type_placeholder', 'Filter by type')} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">{t('cash_book.filter_type_all', 'All Types')}</SelectItem>
                    <SelectItem value="Income">{t('cash_book.filter_type_income', 'Income')}</SelectItem>
                    <SelectItem value="Expense">{t('cash_book.filter_type_expense', 'Expense')}</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm">
                <RefreshCw className="h-3 w-3 mr-2" /> {t('cash_book.refresh_button', 'Refresh')}
            </Button>
             <Dialog open={isAddEntryDialogOpen} onOpenChange={setIsAddEntryDialogOpen}>
                <DialogTrigger asChild>
                    <Button size="sm">
                        <PlusCircle className="h-3 w-3 mr-2" /> {t('cash_book.add_entry_button', 'Add Entry')}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t('cash_book.add_entry_dialog_title', 'Add New Cash Book Entry')}</DialogTitle>
                        <DialogDescription className="text-xs">{t('cash_book.add_entry_dialog_description', 'Fill in the details for the new entry.')}</DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleAddEntrySubmit)} className="grid gap-4 py-3">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>{t('cash_book.form_date_label', 'Date')}</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn("pl-3 text-left font-normal text-xs", !field.value && "text-muted-foreground")}
                                                    >
                                                        {field.value ? format(field.value, "PPP", { locale: dateLocales[locale] || enUS }) : <span>{t('cash_book.form_date_placeholder', 'Pick a date')}</span>}
                                                        <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) => date > new Date()}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>{t('cash_book.form_description_label')}</FormLabel><FormControl><Textarea placeholder={t('cash_book.form_description_placeholder')} {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="category" render={({ field }) => (<FormItem><FormLabel>{t('cash_book.form_category_label')}</FormLabel><FormControl><Input placeholder={t('cash_book.form_category_placeholder')} {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>{t('cash_book.form_type_label')}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('cash_book.form_type_placeholder')} /></SelectTrigger></FormControl><SelectContent><SelectItem value="Income">{t('cash_book.form_type_income')}</SelectItem><SelectItem value="Expense">{t('cash_book.form_type_expense')}</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="amount" render={({ field }) => (<FormItem><FormLabel>{t('cash_book.form_amount_label')}</FormLabel><FormControl><Input type="number" step="0.01" placeholder="0.00" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="reference" render={({ field }) => (<FormItem><FormLabel>{t('cash_book.form_reference_label')}</FormLabel><FormControl><Input placeholder={t('cash_book.form_reference_placeholder')} {...field} /></FormControl><FormMessage /></FormItem>)} />

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline" size="sm" disabled={form.formState.isSubmitting}>{t('cash_book.form_cancel_button', 'Cancel')}</Button>
                                </DialogClose>
                                <Button type="submit" size="sm" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting && <Loader2 className="h-3 w-3 mr-2 animate-spin" />}
                                    {form.formState.isSubmitting ? t('cash_book.form_saving_button', 'Saving...') : t('cash_book.form_save_button', 'Save Entry')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="w-auto text-center cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center justify-center gap-1">
                        {t('cash_book.table_header_date', 'Date')}
                        {sortColumn === 'date' && <ArrowUpDown className="h-3 w-3" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-left">{t('cash_book.table_header_description', 'Description')}</TableHead>
                  <TableHead className="text-left">{t('cash_book.table_header_category', 'Category')}</TableHead>
                  <TableHead className="text-center">{t('cash_book.table_header_type', 'Type')}</TableHead>
                  <TableHead
                     className="text-center cursor-pointer"
                     onClick={() => handleSort('amount')}
                  >
                     <div className="flex items-center justify-center gap-1">
                        {t('cash_book.table_header_amount', 'Amount')}
                        {sortColumn === 'amount' && <ArrowUpDown className="h-3 w-3" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-left">{t('cash_book.table_header_reference', 'Reference')}</TableHead>
                  <TableHead className="w-auto text-center">{t('cash_book.table_header_actions', 'Actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedEntries.length > 0 ? (
                  filteredAndSortedEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="text-center text-xs">{format(entry.date, 'PP', { locale: dateLocales[locale] || enUS })}</TableCell>
                      <TableCell className="font-medium text-xs">{entry.description}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{entry.category}</TableCell>
                      <TableCell className="text-center text-xs">
                        <Badge variant={entry.type === 'Income' ? 'default' : 'destructive'} className={cn(entry.type === 'Income' ? 'bg-green-600/20 text-green-700 hover:bg-green-600/30' : 'bg-red-600/20 text-red-700 hover:bg-red-600/30', 'text-xs')}>
                          {t(`cash_book.entry_type_${entry.type.toLowerCase()}` as any, entry.type)}
                        </Badge>
                      </TableCell>
                      <TableCell className={cn("text-center font-semibold text-xs", entry.type === 'Income' ? 'text-green-600' : 'text-red-600')}>
                        {formatCurrency(entry.amount)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">{entry.reference || '-'}</TableCell>
                       <TableCell className="text-center">
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Edit className="h-3 w-3" />
                                <span className="sr-only">{t('cash_book.action_edit', 'Edit')}</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                                <Trash2 className="h-3 w-3" />
                                <span className="sr-only">{t('cash_book.action_delete', 'Delete')}</span>
                            </Button>
                        </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8 text-xs">
                      {t('cash_book.no_entries_found', 'No entries found matching your criteria.')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap md:items-center gap-x-4 gap-y-1 text-xs w-full">
                <div className="flex items-center gap-1">
                    <span className="font-medium text-green-600">{t('cash_book.total_income_label', 'Total Income')}:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(totalIncome)}</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="font-medium text-red-600">{t('cash_book.total_expenses_label', 'Total Expenses')}:</span>
                    <span className="font-semibold text-red-600">{formatCurrency(totalExpenses)}</span>
                </div>
                <div className="col-span-2 sm:col-span-1 md:col-auto flex items-center gap-1">
                    <span className="font-medium">{t('cash_book.net_balance_label', 'Net Balance')}:</span>
                    <span className={cn("font-bold", netBalance >= 0 ? 'text-green-600' : 'text-red-600')}>{formatCurrency(netBalance)}</span>
                </div>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
