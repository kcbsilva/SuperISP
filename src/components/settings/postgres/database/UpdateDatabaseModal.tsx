// src/components/settings/postgres/databases/UpdateDatabaseModal.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface Props {
  database: {
    name: string;
    owner: string;
    encoding: string;
  };
}

export function UpdateDatabaseModal({ database }: Props) {
  return (
    <Button variant="ghost" size="icon" title="View/Edit Database">
      <Eye className="h-4 w-4" />
    </Button>
  );
}
