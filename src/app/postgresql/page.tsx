// src/app/mysql/page.tsx
'use client';

import * as React from 'react';
import { useLocale } from '@/contexts/LocaleContext';

export default function MysqlManagementPage() {
  const { t } = useLocale();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold">{t('mysql_page.title', 'MySQL Management')}</h1>
      </div>
       <p className="text-muted-foreground text-xs">
        {t('mysql_page.select_option_prompt', 'Please select an option from the sidebar to manage MySQL databases or tables, or use the CLI.')}
      </p>
    </div>
  );
}
