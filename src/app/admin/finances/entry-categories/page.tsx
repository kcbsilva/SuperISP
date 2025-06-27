// src/app/finances/entry-categories/page.tsx
'use client';

import * as React from 'react';
import { PlusCircle, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';

import { ListCategories } from '@/components/finances/entry-categories/ListCategories';
import { AddCategoryModal } from '@/components/finances/entry-categories/AddCategoryModal';
import { UpdateCategoryModal } from '@/components/finances/entry-categories/UpdateCategoryModal';
import { RemoveCategoryDialog } from '@/components/finances/entry-categories/RemoveCategoryDialog';
import { EntryCategory } from '@/components/finances/entry-categories/types';

const STATIC_INCOME_ID = 'static-income-root';
const STATIC_EXPENSE_ID = 'static-expense-root';

const mockCategories: EntryCategory[] = [
  { id: STATIC_INCOME_ID, name: 'Income', type: 'Income', createdAt: new Date('2023-01-01') },
  { id: STATIC_EXPENSE_ID, name: 'Expense', type: 'Expense', createdAt: new Date('2023-01-01') },
  { id: 'cat-1', name: 'Subscriptions', type: 'Income', parentCategoryId: STATIC_INCOME_ID, createdAt: new Date() },
  { id: 'cat-2', name: 'Office', type: 'Expense', parentCategoryId: STATIC_EXPENSE_ID, createdAt: new Date() },
];

export default function EntryCategoriesPage() {
  const { t } = useLocale();
  const { toast } = useToast();

  const [categories, setCategories] = React.useState<EntryCategory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');

  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<EntryCategory | null>(null);

  React.useEffect(() => {
    // Simulate loading from API
    const timer = setTimeout(() => {
      setCategories(mockCategories);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAdd = (data: Omit<EntryCategory, 'id' | 'createdAt'>) => {
    const newCat: EntryCategory = {
      id: `cat-${Date.now()}`,
      ...data,
      createdAt: new Date(),
    };
    setCategories(prev => [...prev, newCat]);
    toast({ title: 'Category added', description: newCat.name });
    setIsAddOpen(false);
  };

  const handleUpdate = (data: Omit<EntryCategory, 'id' | 'createdAt'>) => {
    if (!editingCategory) return;
    setCategories(prev =>
      prev.map(cat => cat.id === editingCategory.id ? { ...cat, ...data } : cat)
    );
    toast({ title: 'Category updated', description: data.name });
    setEditingCategory(null);
  };

  const handleDelete = (cat: EntryCategory) => {
    setCategories(prev => prev.filter(c => c.id !== cat.id));
    toast({ title: 'Category deleted', description: cat.name });
  };

  const getCategoryNumber = React.useCallback((cat: EntryCategory, all: EntryCategory[]) => {
    if (cat.id === STATIC_INCOME_ID) return '1';
    if (cat.id === STATIC_EXPENSE_ID) return '2';

    const path: string[] = [];
    let current: EntryCategory | undefined = cat;
    const visited = new Set<string>();

    while (current && current.parentCategoryId && !visited.has(current.id)) {
      visited.add(current.id);
      const parent = all.find(c => c.id === current!.parentCategoryId);
      if (parent) {
        const siblings = all
          .filter(s => s.parentCategoryId === parent.id && s.type === current!.type)
          .sort((a, b) => a.name.localeCompare(b.name));
        const index = siblings.findIndex(s => s.id === current!.id) + 1;
        path.unshift(index.toString());
        current = parent;
      } else {
        break;
      }
    }

    if (current?.type === 'Income') path.unshift('1');
    if (current?.type === 'Expense') path.unshift('2');
    return path.join('.');
  }, []);

  const getIndentationLevel = React.useCallback((cat: EntryCategory, all: EntryCategory[]) => {
    let level = 0;
    let current = cat;
    const visited = new Set<string>();

    while (current.parentCategoryId && !visited.has(current.id)) {
      visited.add(current.id);
      const parent = all.find(c => c.id === current.parentCategoryId);
      if (!parent) break;
      level++;
      current = parent;
    }
    return level;
  }, []);

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) =>
    getCategoryNumber(a, categories).localeCompare(getCategoryNumber(b, categories), undefined, { numeric: true })
  );

  const availableParents = React.useMemo(() => categories.sort((a, b) =>
    getCategoryNumber(a, categories).localeCompare(getCategoryNumber(b, categories), undefined, { numeric: true })
  ), [categories, getCategoryNumber]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-base font-semibold">{t('entry_categories.title', 'Entry Categories')}</h1>
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-3 w-3 text-muted-foreground" />
          <Input
            type="search"
            className="pl-8 w-full"
            placeholder={t('entry_categories.search_placeholder', 'Search categories...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setLoading(true)}>
            <RefreshCw className="mr-2 h-3 w-3" />
            {t('entry_categories.refresh_button', 'Refresh')}
          </Button>
          <Button onClick={() => setIsAddOpen(true)} className="bg-green-600 text-white">
            <PlusCircle className="mr-2 h-3 w-3" />
            {t('entry_categories.add_category_button', 'Add Entry')}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <ListCategories
            categories={filteredCategories}
            loading={loading}
            onEdit={(cat) => setEditingCategory(cat)}
            onDelete={(cat) => handleDelete(cat)}
            getCategoryNumber={getCategoryNumber}
            getIndentationLevel={getIndentationLevel}
          />
        </CardContent>
      </Card>

      <AddCategoryModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
        availableParents={availableParents}
        getCategoryNumber={getCategoryNumber}
      />

      {editingCategory && (
        <UpdateCategoryModal
          open={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          onSubmit={handleUpdate}
          editingCategory={editingCategory}
          availableParents={availableParents.filter(c => c.id !== editingCategory.id)}
          getCategoryNumber={getCategoryNumber}
        />
      )}
    </div>
  );
}
