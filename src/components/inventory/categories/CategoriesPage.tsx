// src/components/inventory/categories/CategoriesPage.tsx
'use client';

import React from 'react';
import { AddCategoryModal } from './AddCategoryModal';
import { UpdateCategoryModal } from './UpdateCategoryModal';
import { DeleteCategoryDialog } from './DeleteCategoryDialog';
import { ListCategories } from './ListCategories';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/LocaleContext';
import type { InventoryCategory } from '@/types/inventory';

export default function CategoriesPage() {
  const { toast } = useToast();
  const { t: translate } = useLocale();

  const [categories, setCategories] = React.useState<InventoryCategory[]>([]);
  const [editingCategory, setEditingCategory] = React.useState<InventoryCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = React.useState<InventoryCategory | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/inventory/categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      toast({ title: 'Failed to load categories', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (category: InventoryCategory) => {
    try {
      const res = await fetch('/api/inventory/categories/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: category.name }),
      });
      const newCategory = await res.json();
      setCategories(prev => [...prev, newCategory]);
    } catch {
      toast({ title: 'Failed to add category', variant: 'destructive' });
    }
  };

  const handleUpdate = async (updated: InventoryCategory) => {
    try {
      const res = await fetch(`/api/inventory/categories/update/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: updated.name }),
      });
      const data = await res.json();
      setCategories(prev => prev.map(c => (c.id === data.id ? data : c)));
    } catch {
      toast({ title: 'Failed to update category', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/inventory/categories/remove/${id}`, {
        method: 'DELETE',
      });
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch {
      toast({ title: 'Failed to delete category', variant: 'destructive' });
    }
  };

  const filtered = categories.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-base font-semibold whitespace-nowrap">
          {translate('inventory_categories.title', 'Categories')}
        </h1>
        <div className="relative w-full max-w-xs flex-1">
          <input
            type="search"
            placeholder={translate('inventory_categories.search_placeholder', 'Search categories...')}
            className="pl-8 w-full border border-gray-300 rounded px-3 py-2 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <AddCategoryModal onAdd={handleAdd} />
      </div>

      <div className="bg-white rounded-md shadow">
        <ListCategories
          categories={paginated}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onEdit={setEditingCategory}
          onDelete={setDeletingCategory}
          loading={loading}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onRefresh={fetchCategories}
        />
      </div>

      {editingCategory && (
        <UpdateCategoryModal
          category={editingCategory}
          onUpdate={handleUpdate}
          onClose={() => setEditingCategory(null)}
        />
      )}
      {deletingCategory && (
        <DeleteCategoryDialog
          category={deletingCategory}
          onConfirm={() => {
            handleDelete(deletingCategory.id);
            setDeletingCategory(null);
          }}
          onCancel={() => setDeletingCategory(null)}
        />
      )}
    </div>
  );
}
