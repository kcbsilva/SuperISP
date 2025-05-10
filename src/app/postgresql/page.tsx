// src/app/postgresql/page.tsx
'use client';

import * as React from 'react';
import { useLocale } from '@/contexts/LocaleContext';

export default function PostgreSQLPage() {
  const { t } = useLocale();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold">{t('postgresql_page.title', 'PostgreSQL Management')}</h1>
      </div>
       <p className="text-muted-foreground text-xs">
        {t('postgresql_page.select_option_prompt', 'Please select an option from the sidebar to manage PostgreSQL databases or tables, or use the CLI.')}
      </p>
    </div>
  );
}
