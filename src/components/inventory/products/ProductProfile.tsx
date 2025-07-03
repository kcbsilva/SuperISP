// /src/components/inventory/products/ProductProfile.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@/types/inventory';
import { inventoryCategories, manufacturers, suppliers } from '@/data/inventory';
import { useLocale } from '@/contexts/LocaleContext';

interface Props {
  product: Product;
}

export function ProductProfile({ product }: Props) {
  const { t } = useLocale();

  const category = inventoryCategories.find(c => c.id === product.categoryId)?.name || '-';
  const manufacturer = manufacturers.find(m => m.id === product.manufacturerId)?.businessName || '-';
  const supplier = suppliers.find(s => s.id === product.supplierId)?.businessName || '-';

  return (
    <Card className="max-w-lg w-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          {t('inventory_products.profile_title', 'Product Details')}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 text-sm">
        <div>
          <strong>{t('inventory_products.profile_patrimonial', 'Patrimonial Number')}:</strong> {product.patrimonialNumber}
        </div>
        <div>
          <strong>{t('inventory_products.profile_name', 'Name')}:</strong> {product.name}
        </div>
        <div>
          <strong>{t('inventory_products.profile_category', 'Category')}:</strong> {category}
        </div>
        <div>
          <strong>{t('inventory_products.profile_manufacturer', 'Manufacturer')}:</strong> {manufacturer}
        </div>
        <div>
          <strong>{t('inventory_products.profile_supplier', 'Supplier')}:</strong> {supplier}
        </div>
        <div>
          <strong>{t('inventory_products.profile_quantity', 'Quantity')}:</strong> {product.quantity}
        </div>
      </CardContent>
    </Card>
  );
}
