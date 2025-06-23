// src/app/admin/inventory/dashboard/page.tsx
'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocale } from '@/contexts/LocaleContext';
import { inventoryCategories, manufacturers, suppliers, products } from '@/data/inventory';

export default function InventoryDashboardPage() {
  const { t } = useLocale();
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('inventory_dashboard.total_categories', 'Total Categories')}</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">{inventoryCategories.length}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('inventory_dashboard.total_manufacturers', 'Total Manufacturers')}</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">{manufacturers.length}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('inventory_dashboard.total_suppliers', 'Total Suppliers')}</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">{suppliers.length}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('inventory_dashboard.total_products', 'Total Products')}</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">{products.length}</CardContent>
      </Card>
    </div>
  );
}