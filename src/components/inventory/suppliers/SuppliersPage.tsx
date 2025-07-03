// src/components/inventory/suppliers/SuppliersPage.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/LocaleContext';
import type { Supplier } from '@/types/inventory';
import { AddSupplierModal, SupplierFormData } from './AddSupplierModal';
import { UpdateSupplierModal } from './UpdateSupplierModal';
import { ListSuppliers } from './ListSuppliers';

export function SuppliersPageContent() {
  const { toast } = useToast();
  const { t: translate } = useLocale();

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filtered, setFiltered] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/inventory/suppliers');
      const data = await res.json();
      setSuppliers(data);
    } catch {
      toast({ title: 'Error', description: 'Failed to load suppliers', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    const filteredResults = suppliers.filter((s) =>
      s.businessName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(filteredResults);
    setPage(1);
  }, [searchTerm, suppliers]);

  const handleAdd = async (data: SupplierFormData) => {
    try {
      const res = await fetch('/api/inventory/suppliers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      await fetchSuppliers();
      toast({ title: 'Supplier Added', description: `Supplier "${data.businessName}" added.` });
    } catch {
      toast({ title: 'Error', description: 'Failed to add supplier', variant: 'destructive' });
    }
  };

  const handleUpdate = async (data: SupplierFormData) => {
    if (!editing) return;
    try {
      const res = await fetch(`/api/inventory/suppliers/update/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      await fetchSuppliers();
      setIsEditOpen(false);
      setEditing(null);
      toast({ title: 'Supplier Updated', description: `Supplier "${data.businessName}" updated.` });
    } catch {
      toast({ title: 'Error', description: 'Failed to update supplier', variant: 'destructive' });
    }
  };

  const handleDelete = async (supplier: Supplier) => {
    try {
      const res = await fetch(`/api/inventory/suppliers/remove/${supplier.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      await fetchSuppliers();
      toast({
        title: 'Supplier Deleted',
        description: `Supplier "${supplier.businessName}" deleted.`,
        variant: 'destructive',
      });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete supplier', variant: 'destructive' });
    }
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-base font-semibold">
          {translate('inventory_suppliers.title', 'Suppliers')}
        </h1>
        <div className="flex items-center gap-4 w-full md:w-auto flex-1 md:flex-none">
          <Input
            type="search"
            placeholder={translate('inventory_suppliers.search_placeholder', 'Search suppliers...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64"
          />
          <AddSupplierModal onSubmit={handleAdd} />
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <ListSuppliers
            suppliers={paginated}
            loading={loading}
            onEdit={(s) => {
              setEditing(s);
              setIsEditOpen(true);
            }}
            onDelete={handleDelete}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>

      <UpdateSupplierModal
        supplier={editing}
        open={isEditOpen}
        onOpenChange={(open: boolean) => {
          setIsEditOpen(open);
          if (!open) setEditing(null);
        }}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
