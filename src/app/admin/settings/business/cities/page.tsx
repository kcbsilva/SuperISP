// src/app/settings/business/cities/page.tsx
'use client';

import * as React from 'react';
import { PlusCircle, Pencil, Trash2, Loader2, RefreshCw, MapPin as CityIcon } from "lucide-react"; // Using MapPin as CityIcon
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/LocaleContext';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription as DialogDescriptionComponent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface City {
  id: string;
  name: string;
  state_province: string;
  country: string;
  status: 'Active' | 'Inactive';
  createdAt: Date;
}

const citySchema = z.object({
  name: z.string().min(1, 'City name is required'),
  state_province: z.string().min(1, 'State/Province is required'),
  country: z.string().min(1, 'Country is required'),
  status: z.enum(['Active', 'Inactive']).default('Active'),
});

type CityFormData = z.infer<typeof citySchema>;

const placeholderCities: City[] = [];

export default function CitiesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingCity, setEditingCity] = React.useState<City | null>(null);
  const [cityToDelete, setCityToDelete] = React.useState<City | null>(null);
  const [cities, setCities] = React.useState<City[]>(placeholderCities);
  const [isLoading, setIsLoading] = React.useState(false); // Simulate loading

  const { toast } = useToast();
  const { t } = useLocale();
  const iconSize = "h-2.5 w-2.5";

  const form = useForm<CityFormData>({
    resolver: zodResolver(citySchema),
    defaultValues: {
      name: '',
      state_province: '',
      country: '',
      status: 'Active',
    },
  });

  const refetchCities = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCities(placeholderCities);
      setIsLoading(false);
      toast({
        title: t('settings_business_cities.refreshing_toast_title', 'Refreshing Cities...'),
        description: t('settings_business_cities.refreshing_toast_description', 'Fetching the latest list of cities.'),
      });
    }, 500);
  };

  React.useEffect(() => {
    refetchCities();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleFormSubmit = (data: CityFormData) => {
    setIsLoading(true);
    setTimeout(() => {
      if (editingCity) {
        setCities(prevCities => prevCities.map(c => c.id === editingCity.id ? { ...editingCity, ...data } : c));
        toast({
          title: t('settings_business_cities.update_success_toast_title', 'City Updated'),
          description: t('settings_business_cities.update_success_toast_description', 'City "{name}" has been updated.').replace('{name}', data.name),
        });
      } else {
        const newCity: City = {
          id: `city-${Date.now()}`,
          ...data,
          createdAt: new Date(),
        };
        setCities(prevCities => [newCity, ...prevCities]);
        toast({
          title: t('settings_business_cities.add_success_toast_title', 'City Added'),
          description: t('settings_business_cities.add_success_toast_description', '{name} has been added successfully.').replace('{name}', data.name),
        });
      }
      form.reset();
      setEditingCity(null);
      setIsAddModalOpen(false);
      setIsLoading(false);
    }, 500);
  };

  const handleEditCity = (city: City) => {
     setEditingCity(city);
     form.reset(city);
     setIsAddModalOpen(true);
   };

  const handleDeleteClick = (city: City) => {
    setCityToDelete(city);
  }

  const handleRemoveCityConfirm = () => {
    if (cityToDelete) {
      setIsLoading(true);
      setTimeout(() => {
        setCities(prevCities => prevCities.filter(c => c.id !== cityToDelete.id));
        toast({
          title: t('settings_business_cities.delete_success_toast_title', 'City Deleted'),
          description: t('settings_business_cities.delete_success_toast_description', 'City "{name}" has been removed.').replace('{name}', cityToDelete.name),
          variant: 'destructive'
        });
        setCityToDelete(null);
        setIsLoading(false);
      }, 500);
    }
  };

  const getStatusBadgeVariant = (status: string | undefined) => {
    if (!status) return 'secondary';
    switch (status.toLowerCase()) {
        case 'active': return 'default'; 
        case 'inactive': return 'destructive';
        default: return 'secondary';
    }
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
            <CityIcon className={`${iconSize} text-primary`} />
            {t('settings_business_cities.title', 'Cities / Regions')}
        </h1>

        <div className="flex items-center gap-2">
          <Button
              variant="default"
              size="sm"
              onClick={refetchCities}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
          >
              {isLoading ? <Loader2 className={`mr-2 ${iconSize} animate-spin`} /> : <RefreshCw className={`mr-2 ${iconSize}`} />}
              {t('settings_business_cities.refresh_button', 'Refresh')}
          </Button>

          <Dialog open={isAddModalOpen} onOpenChange={(isOpen) => {
            setIsAddModalOpen(isOpen);
            if (!isOpen) {
              setEditingCity(null);
              form.reset({ name: '', state_province: '', country: '', status: 'Active'});
            }
          }}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                <PlusCircle className={`mr-2 ${iconSize}`} /> {t('settings_business_cities.add_button', 'Add City')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-sm">{editingCity ? t('settings_business_cities.edit_dialog_title', 'Edit City') : t('settings_business_cities.add_dialog_title', 'Add New City')}</DialogTitle>
                  <DialogDescriptionComponent className="text-xs">{editingCity ? t('settings_business_cities.edit_dialog_description', 'Update the city details.') : t('settings_business_cities.add_dialog_description', "Enter the details for the new city. Click save when you're done.")}</DialogDescriptionComponent>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="grid gap-4 py-4">
                        <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>{t('settings_business_cities.form_name_label', 'City Name')}</FormLabel><FormControl><Input placeholder={t('settings_business_cities.form_name_placeholder', 'e.g., Anytown')} {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="state_province" render={({ field }) => (<FormItem><FormLabel>{t('settings_business_cities.form_state_province_label', 'State/Province')}</FormLabel><FormControl><Input placeholder={t('settings_business_cities.form_state_province_placeholder', 'e.g., California')} {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="country" render={({ field }) => (<FormItem><FormLabel>{t('settings_business_cities.form_country_label', 'Country')}</FormLabel><FormControl><Input placeholder={t('settings_business_cities.form_country_placeholder', 'e.g., USA')} {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="status" render={({ field }) => (<FormItem><FormLabel>{t('settings_business_cities.form_status_label', 'Status')}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('settings_business_cities.form_status_placeholder', 'Select status')} /></SelectTrigger></FormControl><SelectContent><SelectItem value="Active">{t('settings_business_cities.form_status_active', 'Active')}</SelectItem><SelectItem value="Inactive">{t('settings_business_cities.form_status_inactive', 'Inactive')}</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="outline" disabled={isLoading}>{t('settings_business_cities.form_cancel_button', 'Cancel')}</Button></DialogClose>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                                {editingCity ? t('settings_business_cities.form_update_button', 'Update City') : t('settings_business_cities.form_save_button', 'Save City')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('settings_business_cities.table_title', 'Registered Cities')}</CardTitle>
          <CardDescription className="text-xs">{t('settings_business_cities.table_description', 'Manage cities and regions where your services are available.')}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading && cities.length === 0 ? (
            <div className="space-y-3 py-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
          ) : cities.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                     <TableHead className="text-xs text-center">{t('settings_business_cities.table_header_name', 'City Name')}</TableHead>
                    <TableHead className="text-xs text-center">{t('settings_business_cities.table_header_state_province', 'State/Province')}</TableHead>
                    <TableHead className="text-xs text-center">{t('settings_business_cities.table_header_country', 'Country')}</TableHead>
                    <TableHead className="text-xs text-center">{t('settings_business_cities.table_header_status', 'Status')}</TableHead>
                    <TableHead className="w-28 text-xs text-center">{t('settings_business_cities.table_header_actions', 'Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cities.map((city) => (
                    <TableRow key={city.id}>
                      <TableCell className="font-medium text-xs text-center">{city.name}</TableCell>
                      <TableCell className="text-muted-foreground text-xs text-center">{city.state_province}</TableCell>
                      <TableCell className="text-muted-foreground text-xs text-center">{city.country}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={getStatusBadgeVariant(city.status)} className="text-xs">
                          {city.status ? t(`settings_business_cities.status_${city.status.toLowerCase()}` as any, city.status) : t('settings_business_cities.status_unknown', 'Unknown')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditCity(city)} disabled={isLoading}>
                           <Pencil className={iconSize} />
                        </Button>
                        <AlertDialog open={!!cityToDelete && cityToDelete.id === city.id} onOpenChange={(open) => !open && setCityToDelete(null)}>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDeleteClick(city)} disabled={isLoading}>
                                    <Trash2 className={iconSize} />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{t('settings_business_cities.delete_alert_title', 'Are you sure?')}</AlertDialogTitle>
                                    <AlertDialogDescription className="text-xs">
                                        {t('settings_business_cities.delete_alert_description', 'This action cannot be undone. This will permanently delete the city "{name}".')
                                        .replace('{name}', city.name || '')}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setCityToDelete(null)}>{t('settings_business_cities.delete_alert_cancel', 'Cancel')}</AlertDialogCancel>
                                    <AlertDialogAction
                                        className={buttonVariants({ variant: "destructive" })}
                                        onClick={handleRemoveCityConfirm}
                                        disabled={isLoading}
                                    >
                                    {isLoading ? <Loader2 className={`mr-2 ${iconSize} animate-spin`} /> : null}
                                    {t('settings_business_cities.delete_alert_delete', 'Delete')}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4 text-xs">{t('settings_business_cities.no_cities_found', 'No cities found. Click "Add City" to create one.')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
