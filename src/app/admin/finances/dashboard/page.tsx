// src/app/admin/finances/dashboard/page.tsx
'use client';

import * as React from 'react';
import FinanceDashboard from '@/components/finances/dashboard/views/FinanceDashboard';

export default function FinanceDashboardPage() {
  return (
    <div className="p-4">
      <FinanceDashboard />
    </div>
  );
}