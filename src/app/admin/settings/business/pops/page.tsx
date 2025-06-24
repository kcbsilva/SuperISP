// src/app/settings/business/pops/page.tsx
'use client';

import * as React from 'react';
import { PlusCircle, Pencil, Trash2, Loader2, RefreshCw } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/LocaleContext';
import type { Pop, PopData } from '@/types/pops';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const popSchema = z.object({
  name: z.string().min(1, 'PoP name is required'),
  location: z.string().min(1, 'Location is required'),
  status: z.enum(['Active', 'Inactive', 'Planned']).default('Active'),
});

type PopFormData = z.infer<typeof popSchema>;

export default function PoPsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingPop, setEditingPop] = React.useState<Pop | null>(null);
  const [popToDelete, setPopToDelete] = React.useState<Pop | null>(null);
  const [pops, setPops] = React.useState<Pop[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const { toast } = useToast();
  const { t } = useLocale();
  const iconSize = "h-2.5 w-2.5";

  const form = useForm<PopFormData>({
    resolver: zodResolver(popSchema),
    defaultValues: {
      name: '',
      location: '',
      status: 'Active',
    },
  });

  const refetchPops = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/pops/list');
      if (!res.ok) throw new Error('Failed to fetch PoPs');
      const data = await res.json();
      const transformed = data.map((p: any): Pop => ({
        id: p.id,
        name: p.name,
        location: p.location,
        status: p.status,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      }));
      setPops(transformed);
    } catch (err) {
      console.error('Failed to fetch PoPs', err);
      toast({
        variant: 'destructive',
        title: 'Error loading PoPs',
        description: 'Please check your server or database connection.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    refetchPops();
  }, []);

  const getStatusBadgeVariant = (status: string | undefined) => {
    if (!status) return 'secondary';
    switch (status.toLowerCase()) {
      case 'active': return 'default';
      case 'planned': return 'outline';
      case 'inactive': return 'destructive';
      default: return 'secondary';
    }
  };

  function safeToDate(value: any): Date | null {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (typeof value.toDate === 'function') return value.toDate();
    try {
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold">{t('pops.title')}</h1>
        <div className="flex items-center gap-2">
          <Button variant="default" size="sm" onClick={refetchPops} disabled={isLoading} className="bg-primary hover:bg-primary/90">
            {isLoading ? <Loader2 className={`mr-2 ${iconSize} animate-spin`} /> : <RefreshCw className={`mr-2 ${iconSize}`} />}
            {t('pops.refresh_button')}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('pops.table_title')}</CardTitle>
          <CardDescription className="text-xs">{t('pops.table_description')}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading && pops.length === 0 ? (
            <div className="space-y-3 py-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : pops.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24 text-xs text-center">{t('pops.table_header_id')}</TableHead>
                    <TableHead className="text-xs text-center">{t('pops.table_header_name')}</TableHead>
                    <TableHead className="text-xs text-center">{t('pops.table_header_location')}</TableHead>
                    <TableHead className="text-xs text-center">{t('pops.table_header_status')}</TableHead>
                    <TableHead className="w-32 text-xs text-center">{t('pops.table_header_created')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pops.map((pop) => (
                    <TableRow key={pop.id}>
                      <TableCell className="font-mono text-muted-foreground text-xs text-center">{(pop.id as string).toString().substring(0, 8)}</TableCell>
                      <TableCell className="font-medium text-xs text-center">{pop.name}</TableCell>
                      <TableCell className="text-muted-foreground text-xs text-center">{pop.location}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={getStatusBadgeVariant(pop.status)} className="text-xs">
                          {pop.status ? t(`pops.form_status_${pop.status.toLowerCase()}` as any, pop.status) : t('pops.status_unknown')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs text-center">
                        {safeToDate(pop.createdAt)?.toLocaleDateString() ?? 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4 text-xs">{t('pops.no_pops_found')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
