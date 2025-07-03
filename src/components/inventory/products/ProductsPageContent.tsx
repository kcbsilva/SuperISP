// /src/components/inventory/products/ProductsPageContent.tsx
'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw, Search } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { products as productsData, inventoryCategories, manufacturers as manufacturersData, suppliers as suppliersData } from '@/data/inventory';
import type { Product } from '@/types/inventory';
import { ListProducts } from './ListProducts';
import { AddProductModal } from './AddProductModal';
import { UpdateProductModal } from './UpdateProductModal';
import { RemoveProductDialog } from './RemoveProductDialog';

export function ProductsPageContent() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [products, setProducts] = React.useState<Product[]>(productsData);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [editProduct, setEditProduct] = React.useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = React.useState<Product | null>(null);
  const pageSize = 10;

  const iconSize = 'h-3 w-3';

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.patrimonialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(filteredProducts.length / pageSize);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleAdd = (product: Product) => {
    setProducts((prev) => [...prev, product]);
  };

  const handleUpdate = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDelete = (target: Product) => {
    setProducts((prev) => prev.filter((p) => p.id !== target.id));
    toast({
      title: t('inventory_products.delete_success_title', 'Product Deleted'),
      description: t('inventory_products.delete_success_description', 'Product "{name}" deleted.').replace('{name}', target.name),
      variant: 'destructive',
    });
  };

  const canAddProduct =
    inventoryCategories.length > 0 &&
    manufacturersData.length > 0 &&
    suppliersData.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-base font-semibold">
          {t('inventory_products.title', 'Products')}
        </h1>
        <div className="relative flex-1">
          <Search className={`absolute left-2.5 top-2.5 ${iconSize} text-muted-foreground`} />
          <Input
            type="search"
            placeholder={t('inventory_products.search_placeholder', 'Search products...')}
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="default"
            className="bg-primary hover:bg-primary/90"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 ${iconSize} ${loading ? 'animate-spin' : ''}`} />
            {t('inventory_products.refresh_button', 'Refresh')}
          </Button>
          <AddProductModal open={isAddOpen} setOpen={setIsAddOpen} onAddProduct={handleAdd} />
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <ListProducts
            products={paginatedProducts}
            setEditingProduct={setEditProduct}
            setProductToDelete={setDeleteProduct}
            loading={loading}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={filteredProducts.length}
          />
        </CardContent>
      </Card>

      <UpdateProductModal
        product={editProduct}
        open={!!editProduct}
        setOpen={(v) => !v && setEditProduct(null)}
        onUpdateProduct={handleUpdate}
      />

      <RemoveProductDialog
        product={deleteProduct}
        open={!!deleteProduct}
        setOpen={(v) => !v && setDeleteProduct(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}