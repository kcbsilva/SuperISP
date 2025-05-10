// src/app/finances/cash-book/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardFooter
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
import { PlusCircle, RefreshCw, ArrowUpDown, DollarSign, Edit, Trash2, Loader2, CalendarIcon } from 'lucide-react';
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
  { id: 'entry-5', date: parseISO('2024-07-21'), description: 'Consulting Fee', category: 'Service Revenue', type: 'Income', amount: 500.00 }, // Added type for consistency
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

  const handleSort = (column: 'date' | 'amount') => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

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
    return amount.toLocaleString(currencyLocale, { style: 'currency', currency: 'USD' });
  };

  const iconSize = "h-3 w-3"; // Reduced icon size
  const smallIconSize = "h-2.5 w-2.5"; // For smaller icons like sort arrows, reduced

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-base font-semibold">{t('cash_book.title', 'Cash Book')}</h1>

        <div className="flex flex-1 items-center gap-4">
            <div className="relative flex-1">
              <DollarSign className={`absolute left-2.5 top-2.5 ${smallIconSize} text-muted-foreground`} />
              <Input
                type="search"
                placeholder={t('cash_book.search_placeholder', 'Search by description, category, reference...')}
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={(value) => setFilterType(value as 'All' | 'Income' | 'Expense')}>
                <SelectTrigger className="w-full sm:w-[180px] shrink-0">
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
            <Button variant="default" className="bg-primary hover:bg-primary/90">
                <RefreshCw className={`mr-2 ${iconSize}`} /> {t('cash_book.refresh_button', 'Refresh')}
            </Button>
             <Dialog open={isAddEntryDialogOpen} onOpenChange={setIsAddEntryDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                        <PlusCircle className={`mr-2 ${iconSize}`} /> {t('cash_book.add_entry_button', 'Add Entry')}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-sm">{t('cash_book.add_entry_dialog_title', 'Add New Cash Book Entry')}</DialogTitle> {/* Reduced title size */}
                        <DialogDescription className="text-xs">{t('cash_book.add_entry_dialog_description', 'Fill in the details for the new entry.')}</DialogDescription> 
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleAddEntrySubmit)} className="grid gap-4 py-4">
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
                                                        className={cn(
                                                            "pl-3 text-left font-normal text-xs", 
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? format(field.value, "PPP", { locale: dateLocales[locale] || enUS }) : <span>{t('cash_book.form_date_placeholder', 'Pick a date')}</span>}
                                                        <CalendarIcon className={`ml-auto ${smallIconSize} opacity-50`} />
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
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('cash_book.form_description_label', 'Description')}</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder={t('cash_book.form_description_placeholder', 'e.g., Payment for services')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('cash_book.form_category_label', 'Category')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('cash_book.form_category_placeholder', 'e.g., Subscription Revenue')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('cash_book.form_type_label', 'Type')}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t('cash_book.form_type_placeholder', 'Select entry type')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Income">{t('cash_book.form_type_income', 'Income')}</SelectItem>
                                                <SelectItem value="Expense">{t('cash_book.form_type_expense', 'Expense')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('cash_book.form_amount_label', 'Amount')}</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="reference"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('cash_book.form_reference_label', 'Reference (Optional)')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('cash_book.form_reference_placeholder', 'e.g., INV-001, Check #123')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline" disabled={form.formState.isSubmitting}>{t('cash_book.form_cancel_button', 'Cancel')}</Button>
                                </DialogClose>
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
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
        <CardContent className="pt-6"> {/* Adjusted padding since CardHeader is removed */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="w-[120px] cursor-pointer hover:bg-muted/80"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-1">
                        {t('cash_book.table_header_date', 'Date')}
                        {sortColumn === 'date' && <ArrowUpDown className={smallIconSize} />}
                    </div>
                  </TableHead>
                  <TableHead>{t('cash_book.table_header_description', 'Description')}</TableHead>
                  <TableHead>{t('cash_book.table_header_category', 'Category')}</TableHead>
                  <TableHead>{t('cash_book.table_header_type', 'Type')}</TableHead>
                  <TableHead
                     className="text-right cursor-pointer hover:bg-muted/80"
                     onClick={() => handleSort('amount')}
                  >
                     <div className="flex items-center justify-end gap-1">
                        {t('cash_book.table_header_amount', 'Amount')}
                        {sortColumn === 'amount' && <ArrowUpDown className={smallIconSize} />}
                    </div>
                  </TableHead>
                  <TableHead>{t('cash_book.table_header_reference', 'Reference')}</TableHead>
                  <TableHead className="text-right w-28">{t('cash_book.table_header_actions', 'Actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedEntries.length > 0 ? (
                  filteredAndSortedEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{format(entry.date, 'PP', { locale: dateLocales[locale] || enUS })}</TableCell>
                      <TableCell className="font-medium">{entry.description}</TableCell>
                      <TableCell className="text-muted-foreground">{entry.category}</TableCell>
                      <TableCell>
                        <Badge variant={entry.type === 'Income' ? 'default' : 'secondary'}
                          className={entry.type === 'Income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        >
                          {t(`cash_book.entry_type_${entry.type.toLowerCase()}` as any, entry.type)}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right font-semibold ${entry.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(entry.amount)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{entry.reference || '-'}</TableCell>
                       <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className={iconSize} />
                                <span className="sr-only">{t('cash_book.action_edit', 'Edit')}</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                <Trash2 className={iconSize} />
                                <span className="sr-only">{t('cash_book.action_delete', 'Delete')}</span>
                            </Button>
                        </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      {t('cash_book.no_entries_found', 'No entries found matching your criteria.')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-xs w-full sm:w-auto"> 
                <div className="font-medium text-green-600">{t('cash_book.total_income_label', 'Total Income')}:</div>
                <div className="col-span-2 text-right sm:text-left text-green-600 font-semibold">{formatCurrency(totalIncome)}</div>

                <div className="font-medium text-red-600">{t('cash_book.total_expenses_label', 'Total Expenses')}:</div>
                <div className="col-span-2 text-right sm:text-left text-red-600 font-semibold">{formatCurrency(totalExpenses)}</div>

                <div className="font-medium">{t('cash_book.net_balance_label', 'Net Balance')}:</div>
                <div className={`col-span-2 text-right sm:text-left font-bold ${netBalance >= 0 ? 'text-green-700' : 'text-red-700'}`}>{formatCurrency(netBalance)}</div>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
