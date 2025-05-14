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
import { addPop, getPops, updatePop, removePop } from '@/services/mysql/pops';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


const popSchema = z.object({
  name: z.string().min(1, 'PoP name is required'),
  location: z.string().min(1, 'Location is required'),
  status: z.enum(['Active', 'Inactive', 'Planned']).default('Active'),
});

type PopFormData = z.infer<typeof popSchema>;


export default function PoPsPage() {
  const queryClientReact = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false); // For Bootstrap modal
  const [editingPop, setEditingPop] = React.useState<Pop | null>(null);
  const [popToDelete, setPopToDelete] = React.useState<Pop | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);


  const { toast } = useToast();
  const { t } = useLocale();
  const iconSize = "h-3 w-3"; // text-xs equivalent for icons


  const { data: pops = [], isLoading: isLoadingPops, error: popsError, refetch: refetchPops } = useQuery<Pop[], Error>({
    queryKey: ['pops'],
    queryFn: getPops,
  });

  const addPopMutation = useMutation({
    mutationFn: addPop,
    onSuccess: (newPopId) => {
      queryClientReact.invalidateQueries({ queryKey: ['pops'] });
      toast({
        title: t('pops.add_success_toast_title'),
        description: t('pops.add_success_toast_description', '{name} has been added successfully.').replace('{name}', form.getValues('name')),
      });
      form.reset();
      setIsAddModalOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: t('pops.add_error_toast_title'),
        description: error.message || t('pops.add_error_toast_description'),
        variant: 'destructive',
      });
    },
  });

  const updatePopMutation = useMutation({
    mutationFn: (variables: { id: number | string; data: PopFormData }) => updatePop(variables.id, variables.data),
    onSuccess: () => {
        queryClientReact.invalidateQueries({ queryKey: ['pops'] });
        toast({
            title: t('pops.update_success_toast_title'),
            description: t('pops.update_success_toast_description'),
        });
        form.reset();
        setEditingPop(null);
        setIsAddModalOpen(false);
    },
    onError: (error: any) => {
        toast({
            title: t('pops.update_error_toast_title'),
            description: error.message || t('pops.update_error_toast_description'),
            variant: 'destructive',
        });
    },
  });

  const removePopMutation = useMutation({
    mutationFn: removePop,
    onSuccess: () => {
        queryClientReact.invalidateQueries({ queryKey: ['pops'] });
        toast({
            title: t('pops.delete_success_toast_title'),
            description: t('pops.delete_success_toast_description'),
            variant: 'destructive'
        });
        setPopToDelete(null);
        setShowDeleteConfirm(false);
    },
    onError: (error: any) => {
        toast({
            title: t('pops.delete_error_toast_title'),
            description: error.message || t('pops.delete_error_toast_description'),
            variant: 'destructive',
        });
        setPopToDelete(null);
        setShowDeleteConfirm(false);
    },
  });


  const form = useForm<PopFormData>({
    resolver: zodResolver(popSchema),
    defaultValues: {
      name: '',
      location: '',
      status: 'Active',
    },
  });

  const handleFormSubmit = (data: PopFormData) => {
    if (editingPop) {
        updatePopMutation.mutate({ id: editingPop.id, data });
    } else {
        addPopMutation.mutate(data);
    }
  };

  const handleEditPop = (pop: Pop) => {
     setEditingPop(pop);
     form.reset(pop);
     setIsAddModalOpen(true);
   };

  const handleDeleteClick = (pop: Pop) => {
    setPopToDelete(pop);
    setShowDeleteConfirm(true);
  }

  const handleRemovePopConfirm = () => {
    if (popToDelete) {
      removePopMutation.mutate(popToDelete.id);
    }
  };

  const handleRefresh = () => {
      refetchPops();
      toast({
        title: t('pops.refreshing_toast_title'),
        description: t('pops.refreshing_toast_description'),
      });
    };

  const getStatusBadgeClass = (status: string | undefined) => {
    if (!status) return 'bg-secondary text-secondary-content';
    switch (status.toLowerCase()) {
        case 'active': return 'bg-success-subtle text-success';
        case 'planned': return 'bg-warning-subtle text-warning';
        case 'inactive': return 'bg-danger-subtle text-danger';
        default: return 'bg-light text-dark';
    }
  };


  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="h5 mb-0">{t('pops.title')}</h1>

        <div className="d-flex align-items-center gap-2">
          <button
              type="button"
              className="btn btn-primary btn-sm d-flex align-items-center"
              onClick={handleRefresh}
              disabled={isLoadingPops || addPopMutation.isPending || updatePopMutation.isPending || removePopMutation.isPending}
          >
              {isLoadingPops ? <Loader2 style={{width: iconSize.width, height: iconSize.height}} className="me-2 spinner-border spinner-border-sm" /> : <RefreshCw style={iconSize} className="me-2" />}
              {t('pops.refresh_button')}
          </button>

          <button type="button" className="btn btn-success btn-sm d-flex align-items-center text-white" onClick={() => { setEditingPop(null); form.reset({ name: '', location: '', status: 'Active'}); setIsAddModalOpen(true); }}>
            <PlusCircle style={iconSize} className="me-2" /> {t('pops.add_button')}
          </button>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-light">
          <h6 className="card-title mb-0 small">{t('pops.table_title')}</h6>
          <p className="card-text small text-muted mb-0">{t('pops.table_description')}</p>
        </div>
        <div className="card-body p-0"> {/* Remove padding for table to fit better */}
          {isLoadingPops ? (
            <div className="p-4">
                <div className="skeleton-text mb-2" style={{height: '1.5rem', width: '100%'}}></div>
                <div className="skeleton-text mb-2" style={{height: '1.5rem', width: '100%'}}></div>
                <div className="skeleton-text" style={{height: '1.5rem', width: '100%'}}></div>
            </div>
          ) : popsError ? (
             <div className="text-center text-danger p-4 small">{t('pops.loading_error', { message: popsError.message })}</div>
          ) : pops.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover table-sm mb-0">
                <thead className="table-light">
                  <tr>
                     <th scope="col" className="text-center small" style={{width: '80px'}}>{t('pops.table_header_id')}</th>
                     <th scope="col" className="text-center small">{t('pops.table_header_name')}</th>
                    <th scope="col" className="text-center small">{t('pops.table_header_location')}</th>
                    <th scope="col" className="text-center small">{t('pops.table_header_status')}</th>
                     <th scope="col" className="text-center small" style={{width: '120px'}}>{t('pops.table_header_created')}</th>
                    <th scope="col" className="text-center small" style={{width: '100px'}}>{t('pops.table_header_actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {pops.map((pop) => (
                    <tr key={pop.id}>
                       <td className="text-center small text-muted font-monospace">{(pop.id as string).substring(0,8)}</td>
                      <td className="text-center small fw-medium">{pop.name}</td>
                      <td className="text-center small text-muted">{pop.location}</td>
                      <td className="text-center small">
                        <span className={`badge small ${getStatusBadgeClass(pop.status)}`}>
                          {pop.status ? t(`pops.form_status_${pop.status.toLowerCase()}` as any, pop.status) : t('pops.status_unknown')}
                        </span>
                      </td>
                       <td className="text-center small text-muted">
                         {pop.createdAt instanceof Date ? pop.createdAt.toLocaleDateString() : 'N/A'}
                       </td>
                      <td className="text-center">
                        <button className="btn btn-link btn-sm p-1" onClick={() => handleEditPop(pop)} disabled={updatePopMutation.isPending} data-bs-toggle="tooltip" title="Edit PoP">
                           <Pencil style={iconSize} />
                        </button>
                        <button className="btn btn-link btn-sm p-1 text-danger" onClick={() => handleDeleteClick(pop)} disabled={removePopMutation.isPending} data-bs-toggle="tooltip" title="Remove PoP">
                           <Trash2 style={iconSize} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted p-4 small">{t('pops.no_pops_found')}</p>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <div className={`modal fade ${isAddModalOpen ? 'show d-block' : ''}`} tabIndex={-1} style={{backgroundColor: isAddModalOpen ? 'rgba(0,0,0,0.4)' : 'transparent'}}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title h6">{editingPop ? t('pops.edit_dialog_title') : t('pops.add_dialog_title')}</h5>
              <button type="button" className="btn-close btn-sm" onClick={() => setIsAddModalOpen(false)} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p className="small text-muted mb-3">{editingPop ? t('pops.edit_dialog_description') : t('pops.add_dialog_description')}</p>
              <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                <div className="mb-3">
                  <label htmlFor="popName" className="form-label small">{t('pops.form_name_label')}</label>
                  <input type="text" className={`form-control form-control-sm ${form.formState.errors.name ? 'is-invalid' : ''}`} id="popName" placeholder={t('pops.form_name_placeholder')} {...form.register('name')} />
                  {form.formState.errors.name && <div className="invalid-feedback small">{form.formState.errors.name.message}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="popLocation" className="form-label small">{t('pops.form_location_label')}</label>
                  <input type="text" className={`form-control form-control-sm ${form.formState.errors.location ? 'is-invalid' : ''}`} id="popLocation" placeholder={t('pops.form_location_placeholder')} {...form.register('location')} />
                  {form.formState.errors.location && <div className="invalid-feedback small">{form.formState.errors.location.message}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="popStatus" className="form-label small">{t('pops.form_status_label')}</label>
                  <select className={`form-select form-select-sm ${form.formState.errors.status ? 'is-invalid' : ''}`} id="popStatus" {...form.register('status')}>
                    <option value="Active">{t('pops.form_status_active')}</option>
                    <option value="Inactive">{t('pops.form_status_inactive')}</option>
                    <option value="Planned">{t('pops.form_status_planned')}</option>
                  </select>
                  {form.formState.errors.status && <div className="invalid-feedback small">{form.formState.errors.status.message}</div>}
                </div>
                <div className="modal-footer p-0 pt-3">
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setIsAddModalOpen(false)} disabled={addPopMutation.isPending || updatePopMutation.isPending}>{t('pops.form_cancel_button')}</button>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={addPopMutation.isPending || updatePopMutation.isPending}>
                    {(addPopMutation.isPending || updatePopMutation.isPending) && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>}
                    {editingPop ? t('pops.form_update_button') : t('pops.form_save_button')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

       {/* Delete Confirmation Modal */}
       <div className={`modal fade ${showDeleteConfirm ? 'show d-block' : ''}`} tabIndex={-1} style={{backgroundColor: showDeleteConfirm ? 'rgba(0,0,0,0.4)' : 'transparent'}}>
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title h6">{t('pops.delete_alert_title')}</h5>
                <button type="button" className="btn-close btn-sm" onClick={() => setShowDeleteConfirm(false)} aria-label="Close"></button>
            </div>
            <div className="modal-body small">
                {t('pops.delete_alert_description', 'This action cannot be undone. This will permanently delete the PoP named "{name}" (ID: {id}).')
                .replace('{name}', popToDelete?.name || '')
                .replace('{id}', popToDelete?.id.toString() || '')}
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowDeleteConfirm(false)}>{t('pops.delete_alert_cancel')}</button>
                <button type="button" className="btn btn-danger btn-sm" onClick={handleRemovePopConfirm} disabled={removePopMutation.isPending}>
                {removePopMutation.isPending ? <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> : null}
                {t('pops.delete_alert_delete')}
                </button>
            </div>
            </div>
        </div>
      </div>

    </div>
  );
}
