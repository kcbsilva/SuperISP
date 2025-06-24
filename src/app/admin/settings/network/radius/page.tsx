// src/app/settings/network/radius/page.tsx
'use client';

import * as React from 'react';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlusCircle, Server } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { NasTable, NasType } from '@/components/network-radius/NasTable';
import { NasFormModal } from '@/components/network-radius/NasFormModal';
import { DeleteNasDialog } from '@/components/network-radius/DeleteNasDialog';
import { Pop } from '@/types/pops';

export default function NetworkRadiusPage() {
  const { t } = useLocale();
  const iconSize = "h-2.5 w-2.5";

  const [nasList, setNasList] = React.useState<NasType[]>([]);
  const [pops, setPops] = React.useState<Pop[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Modal state
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [selectedNas, setSelectedNas] = React.useState<NasType | undefined>(undefined);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [nasRes, popsRes] = await Promise.all([
        fetch('/api/network-radius/list'),
        fetch('/api/pops/list'), // You must have this or mock it
      ]);
      const nasData = await nasRes.json();
      const popsData = await popsRes.json();
      setNasList(nasData);
      setPops(popsData);
    } catch (err) {
      console.error('Failed to load NAS or PoP data', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setSelectedNas(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (nas: NasType) => {
    setSelectedNas(nas);
    setIsFormOpen(true);
  };

  const handleDelete = (nas: NasType) => {
    setSelectedNas(nas);
    setIsDeleteOpen(true);
  };

  const handleSubmitNas = async (form: Partial<NasType>) => {
    const isEdit = !!form.id;
    const url = isEdit ? '/api/network-radius/update' : '/api/network-radius/create';
    try {
      await fetch(url, {
        method: 'POST',
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' },
      });
      fetchData();
    } catch (err) {
      console.error('Failed to save NAS', err);
    }
  };

  const confirmDelete = async () => {
    try {
      await fetch('/api/network-radius/delete', {
        method: 'POST',
        body: JSON.stringify({ id: selectedNas?.id }),
        headers: { 'Content-Type': 'application/json' },
      });
      setIsDeleteOpen(false);
      fetchData();
    } catch (err) {
      console.error('Failed to delete NAS', err);
    }
  };

  const handleRefreshStatus = async (nasId: number) => {
    try {
      await fetch(`/api/network-radius/status-check/${nasId}`);
      fetchData();
    } catch (err) {
      console.error('Status check failed', err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
          <Server className={`${iconSize} text-primary`} />
          {t('sidebar.network_radius', 'RADIUS / NAS')}
        </h1>
        <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700 text-white">
          <PlusCircle className={`mr-2 ${iconSize}`} /> {t('network_radius_page.add_nas_button', 'Add NAS / RADIUS Server')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('network_radius_page.configured_nas_title', 'Configured NAS / RADIUS Servers')}</CardTitle>
          <CardDescription className="text-xs">{t('network_radius_page.configured_nas_description', 'Manage your Network Access Servers and RADIUS authentication settings.')}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-xs text-muted-foreground">Loading NAS list...</p>
          ) : nasList.length > 0 ? (
            <NasTable
              data={nasList}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRefreshStatus={handleRefreshStatus}
            />
          ) : (
            <p className="text-muted-foreground text-xs">
              {t('network_radius_page.no_nas_found', 'No NAS or RADIUS servers configured yet. Click "Add NAS / RADIUS Server" to create one.')}
            </p>
          )}
        </CardContent>
      </Card>

      <NasFormModal
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitNas}
        pops={pops}
        defaultValues={selectedNas}
      />

      <DeleteNasDialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        nas={selectedNas}
      />
    </div>
  );
}
