// src/app/finances/cash-book/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card"; // Will use Bootstrap styled card
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Will use Bootstrap styled table
import { Badge } from "@/components/ui/badge"; // Will use Bootstrap styled badge
import { Button } from "@/components/ui/button"; // Will use Bootstrap styled button
import { Input } from "@/components/ui/input"; // Will use Bootstrap styled input
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Will use Bootstrap styled select
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"; // Will use Bootstrap styled dialog
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea"; // Will use Bootstrap styled textarea
import { Calendar } from "@/components/ui/calendar"; // Calendar styling might need adjustments
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"; // Popover might need Bootstrap styling
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
    return amount.toLocaleString(currencyLocale, { style: 'currency', currency: 'USD' });
  };

  const iconSize = {width: '0.75rem', height: '0.75rem'};
  const smallIconSize = {width: '0.625rem', height: '0.625rem'};

  return (
    // Bootstrap flex container with gaps
    <div className="d-flex flex-column gap-4">
      {/* Bootstrap flex container for header */}
      <div className="d-flex justify-content-between align-items-center gap-3">
        <h1 className="h5 mb-0">{t('cash_book.title', 'Cash Book')}</h1>

        {/* Bootstrap input group for search and filter */}
        <div className="d-flex flex-grow-1 align-items-center gap-3">
            <div className="position-relative flex-grow-1">
              <DollarSign style={smallIconSize} className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" />
              <Input
                type="search"
                placeholder={t('cash_book.search_placeholder', 'Search by description, category, reference...')}
                className="form-control form-control-sm ps-4" // Bootstrap classes
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Select component might need Bootstrap styling or replacement */}
            <Select value={filterType} onValueChange={(value) => setFilterType(value as 'All' | 'Income' | 'Expense')}>
                <SelectTrigger className="form-select form-select-sm w-auto flex-shrink-0"> {/* Bootstrap classes */}
                    <SelectValue placeholder={t('cash_book.filter_type_placeholder', 'Filter by type')} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">{t('cash_book.filter_type_all', 'All Types')}</SelectItem>
                    <SelectItem value="Income">{t('cash_book.filter_type_income', 'Income')}</SelectItem>
                    <SelectItem value="Expense">{t('cash_book.filter_type_expense', 'Expense')}</SelectItem>
                </SelectContent>
            </Select>
        </div>

        {/* Bootstrap button group */}
        <div className="d-flex align-items-center gap-2 flex-shrink-0">
            <Button variant="default" className="btn btn-primary btn-sm d-flex align-items-center"> {/* Bootstrap classes */}
                <RefreshCw style={iconSize} className="me-2" /> {t('cash_book.refresh_button', 'Refresh')}
            </Button>
             <Dialog open={isAddEntryDialogOpen} onOpenChange={setIsAddEntryDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="btn btn-success btn-sm d-flex align-items-center text-white"> {/* Bootstrap classes */}
                        <PlusCircle style={iconSize} className="me-2" /> {t('cash_book.add_entry_button', 'Add Entry')}
                    </Button>
                </DialogTrigger>
                <DialogContent className="modal-dialog modal-dialog-centered modal-md"> {/* Bootstrap modal classes */}
                    <div className="modal-content">
                        <DialogHeader className="modal-header">
                            <DialogTitle className="modal-title h6">{t('cash_book.add_entry_dialog_title', 'Add New Cash Book Entry')}</DialogTitle>
                            <DialogDescription className="small text-muted">{t('cash_book.add_entry_dialog_description', 'Fill in the details for the new entry.')}</DialogDescription> 
                        </DialogHeader>
                        <div className="modal-body">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleAddEntrySubmit)} className="d-grid gap-3 py-3">
                                    <FormField
                                        control={form.control}
                                        name="date"
                                        render={({ field }) => (
                                            <FormItem className="d-flex flex-column">
                                                <FormLabel>{t('cash_book.form_date_label', 'Date')}</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn("btn btn-outline-secondary btn-sm text-start fw-normal small", !field.value && "text-muted")}
                                                            >
                                                                {field.value ? format(field.value, "PPP", { locale: dateLocales[locale] || enUS }) : <span>{t('cash_book.form_date_placeholder', 'Pick a date')}</span>}
                                                                <CalendarIcon style={smallIconSize} className="ms-auto opacity-50" />
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
                                    {/* Other FormFields need similar Bootstrap class application */}
                                    <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>{t('cash_book.form_description_label')}</FormLabel><FormControl><Textarea className="form-control form-control-sm" placeholder={t('cash_book.form_description_placeholder')} {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name="category" render={({ field }) => (<FormItem><FormLabel>{t('cash_book.form_category_label')}</FormLabel><FormControl><Input className="form-control form-control-sm" placeholder={t('cash_book.form_category_placeholder')} {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>{t('cash_book.form_type_label')}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="form-select form-select-sm"><SelectValue placeholder={t('cash_book.form_type_placeholder')} /></SelectTrigger></FormControl><SelectContent><SelectItem value="Income">{t('cash_book.form_type_income')}</SelectItem><SelectItem value="Expense">{t('cash_book.form_type_expense')}</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name="amount" render={({ field }) => (<FormItem><FormLabel>{t('cash_book.form_amount_label')}</FormLabel><FormControl><Input className="form-control form-control-sm" type="number" step="0.01" placeholder="0.00" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name="reference" render={({ field }) => (<FormItem><FormLabel>{t('cash_book.form_reference_label')}</FormLabel><FormControl><Input className="form-control form-control-sm" placeholder={t('cash_book.form_reference_placeholder')} {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    
                                    <DialogFooter className="modal-footer">
                                        <DialogClose asChild>
                                            <Button type="button" variant="outline" className="btn btn-outline-secondary btn-sm" disabled={form.formState.isSubmitting}>{t('cash_book.form_cancel_button', 'Cancel')}</Button>
                                        </DialogClose>
                                        <Button type="submit" className="btn btn-primary btn-sm" disabled={form.formState.isSubmitting}>
                                            {form.formState.isSubmitting && <Loader2 style={iconSize} className="me-2 animate-spin" />}
                                            {form.formState.isSubmitting ? t('cash_book.form_saving_button', 'Saving...') : t('cash_book.form_save_button', 'Save Entry')}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
      </div>

      <Card className="card"> {/* Bootstrap card class */}
        <CardContent className="card-body pt-4"> {/* Bootstrap card-body and padding */}
          <div className="table-responsive"> {/* Bootstrap responsive table wrapper */}
            <Table className="table table-sm table-hover"> {/* Bootstrap table classes */}
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="w-auto text-center cursor-pointer" // Bootstrap classes
                    onClick={() => handleSort('date')}
                  >
                    <div className="d-flex align-items-center justify-content-center gap-1">
                        {t('cash_book.table_header_date', 'Date')}
                        {sortColumn === 'date' && <ArrowUpDown style={smallIconSize} />}
                    </div>
                  </TableHead>
                  <TableHead>{t('cash_book.table_header_description', 'Description')}</TableHead>
                  <TableHead>{t('cash_book.table_header_category', 'Category')}</TableHead>
                  <TableHead className="text-center">{t('cash_book.table_header_type', 'Type')}</TableHead>
                  <TableHead
                     className="text-center cursor-pointer" // Bootstrap classes
                     onClick={() => handleSort('amount')}
                  >
                     <div className="d-flex align-items-center justify-content-center gap-1"> 
                        {t('cash_book.table_header_amount', 'Amount')}
                        {sortColumn === 'amount' && <ArrowUpDown style={smallIconSize} />}
                    </div>
                  </TableHead>
                  <TableHead>{t('cash_book.table_header_reference', 'Reference')}</TableHead>
                  <TableHead className="w-auto text-center">{t('cash_book.table_header_actions', 'Actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedEntries.length > 0 ? (
                  filteredAndSortedEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="text-center small">{format(entry.date, 'PP', { locale: dateLocales[locale] || enUS })}</TableCell>
                      <TableCell className="fw-medium small">{entry.description}</TableCell>
                      <TableCell className="text-muted small">{entry.category}</TableCell>
                      <TableCell className="text-center small">
                        {/* Using Bootstrap badge classes */}
                        <Badge bg={entry.type === 'Income' ? 'success-subtle' : 'danger-subtle'} 
                               text={entry.type === 'Income' ? 'success' : 'danger'} 
                               className="badge small">
                          {t(`cash_book.entry_type_${entry.type.toLowerCase()}` as any, entry.type)}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-center fw-semibold small ${entry.type === 'Income' ? 'text-success' : 'text-danger'}`}>
                        {formatCurrency(entry.amount)}
                      </TableCell>
                      <TableCell className="text-muted small">{entry.reference || '-'}</TableCell>
                       <TableCell className="text-center">
                            <Button variant="ghost" size="icon" className="btn btn-link btn-sm p-1"> {/* Bootstrap classes */}
                                <Edit style={iconSize} />
                                <span className="visually-hidden">{t('cash_book.action_edit', 'Edit')}</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="btn btn-link btn-sm p-1 text-danger"> {/* Bootstrap classes */}
                                <Trash2 style={iconSize} />
                                <span className="visually-hidden">{t('cash_book.action_delete', 'Delete')}</span>
                            </Button>
                        </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted py-5 small">
                      {t('cash_book.no_entries_found', 'No entries found matching your criteria.')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="card-footer border-top pt-3 d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
            <div className="row g-2 small w-100 w-sm-auto"> 
                <div className="col-auto fw-medium text-success">{t('cash_book.total_income_label', 'Total Income')}:</div>
                <div className="col text-sm-start text-end text-success fw-semibold">{formatCurrency(totalIncome)}</div>

                <div className="col-auto fw-medium text-danger">{t('cash_book.total_expenses_label', 'Total Expenses')}:</div>
                <div className="col text-sm-start text-end text-danger fw-semibold">{formatCurrency(totalExpenses)}</div>

                <div className="col-auto fw-medium">{t('cash_book.net_balance_label', 'Net Balance')}:</div>
                <div className={`col text-sm-start text-end fw-bold ${netBalance >= 0 ? 'text-success' : 'text-danger'}`}>{formatCurrency(netBalance)}</div>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
