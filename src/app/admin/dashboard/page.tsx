// src/app/admin/dashboard/page.tsx
'use client';

import * as React from 'react';
import CustomizableDashboard from '@/components/dashboard/sections/CustomizableDashboard';

export default function AdminDashboardPage() {
  return (
    <div className="p-4">
      <CustomizableDashboard />
    </div>
  );
}
