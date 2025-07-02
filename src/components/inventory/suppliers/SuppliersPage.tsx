// src/components/inventory/suppliers/SuppliersPageContent.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Supplier } from '@/types/inventory';

import { AddSupplierModal, AddSupplierFormData } from './AddSupplierModal';
import { UpdateSupplierModal } from './UpdateSupplierModal';
import { ListSuppliers } from './ListSuppliers';
import { RemoveSupplierDialog } from './RemoveSupplierDialog';
import { Button } from '@/components/ui/button';

export function SuppliersPageContent() {
  const { toast } = useToast();

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filtered, setFiltered] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [deleting, setDeleting] = useState<Supplier | null>(null);
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

  const handleAdd = async (data: AddSupplierFormData) => {
    try {
      const res = await fetch('/api/inventory/suppliers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      await fetchSuppliers();
      toast({
        title: 'Supplier Added',
        description: `Supplier "${data.name}" added.`,
      });
    } catch {
      toast({ title: 'Error', description: 'Failed to add supplier', variant: 'destructive' });
    }
  };

  const handleUpdate = async (data: AddSupplierFormData) => {
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
      toast({ title: 'Supplier Updated', description: `Supplier "${data.name}" updated.` });
    } catch {
      toast({ title: 'Error', description: 'Failed to update supplier', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      const res = await fetch(`/api/inventory/suppliers/remove/${deleting.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      await fetchSuppliers();
      toast({
        title: 'Supplier Deleted',
        description: `Supplier "${deleting.businessName}" deleted.`,
        variant: 'destructive',
      });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete supplier', variant: 'destructive' });
    } finally {
      setDeleting(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-base font-semibold">Suppliers</h1>
        <div className="flex items-center gap-4 w-full md:w-auto flex-1 md:flex-none">
          <Input
            type="search"
            placeholder="Search suppliers..."
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
            currentPage={page}
            totalPages={totalPages}
            loading={loading} // ✅ important for skeletons
            onEdit={(s) => {
              setEditing(s);
              setIsEditOpen(true);
            }}
            onDelete={(s) => setDeleting(s)}
            onPageChange={setPage}
          />

          {/* ✅ move pagination here if needed */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span className="text-xs">Page {page} / {totalPages}</span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <UpdateSupplierModal
        supplier={editing}
        onSubmit={handleUpdate}
        onClose={() => {
          setIsEditOpen(false);
          setEditing(null);
        }}
      />

      <RemoveSupplierDialog
        supplier={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
