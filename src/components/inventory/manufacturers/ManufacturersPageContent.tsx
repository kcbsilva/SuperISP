// src/components/inventory/manufacturers/ManufacturersPageContent.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/LocaleContext';
import { Manufacturer } from '@/types/inventory';
import { AddManufacturerModal, ManufacturerFormData } from './AddManufacturerModal';
import { UpdateManufacturerModal } from './UpdateManufacturerModal';
import { ListManufacturers } from './ListManufacturers';

export function ManufacturersPageContent() {
  const { toast } = useToast();
  const { t: translate } = useLocale();

  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [filtered, setFiltered] = useState<Manufacturer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState<Manufacturer | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const fetchManufacturers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/inventory/manufacturers');
      const data = await res.json();
      setManufacturers(data);
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to load manufacturers', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManufacturers();
  }, []);

  useEffect(() => {
    const filteredResults = manufacturers.filter((m) =>
      m.businessName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(filteredResults);
    setPage(1);
  }, [searchTerm, manufacturers]);

  const handleAdd = async (data: ManufacturerFormData) => {
    try {
      const res = await fetch('/api/inventory/manufacturers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      await fetchManufacturers();
      toast({ title: 'Manufacturer Added', description: `Manufacturer "${data.businessName}" added.` });
    } catch {
      toast({ title: 'Error', description: 'Failed to add manufacturer', variant: 'destructive' });
    }
  };

  const handleUpdate = async (data: ManufacturerFormData) => {
    if (!editing) return;
    try {
      const res = await fetch(`/api/inventory/manufacturers/update/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      await fetchManufacturers();
      setIsEditOpen(false);
      setEditing(null);
      toast({ title: 'Manufacturer Updated', description: `Manufacturer "${data.businessName}" updated.` });
    } catch {
      toast({ title: 'Error', description: 'Failed to update manufacturer', variant: 'destructive' });
    }
  };

  const handleDelete = async (manufacturer: Manufacturer) => {
    try {
      const res = await fetch(`/api/inventory/manufacturers/remove/${manufacturer.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      await fetchManufacturers();
      toast({ title: 'Manufacturer Deleted', description: `Manufacturer "${manufacturer.businessName}" deleted.`, variant: 'destructive' });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete manufacturer', variant: 'destructive' });
    }
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-base font-semibold">
          {translate('inventory_manufacturers.title', 'Manufacturers')}
        </h1>
        <div className="flex items-center gap-4 w-full md:w-auto flex-1 md:flex-none">
          <Input
            type="search"
            placeholder={translate('inventory_manufacturers.search_placeholder', 'Search manufacturers...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64"
          />
          <AddManufacturerModal onSubmit={handleAdd} />
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <ListManufacturers
            manufacturers={paginated}
            loading={loading}
            onEdit={(m) => {
              setEditing(m);
              setIsEditOpen(true);
            }}
            onDelete={handleDelete}
            onRefresh={fetchManufacturers}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>

      <UpdateManufacturerModal
        manufacturer={editing}
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) setEditing(null);
        }}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
