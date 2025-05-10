// src/app/postgresql/cli/page.tsx (Placeholder)
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TerminalSquare } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

export default function CliPagePlaceholder() {
  const { t } = useLocale();
  const iconSize = "h-3 w-3";

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-base font-semibold">{t('sidebar.postgresql_cli', 'MySQL CLI')}</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <TerminalSquare className={iconSize} />
            {t('postgresql_page.cli_title', 'SQL Command Line Interface')}
          </CardTitle>
          <CardDescription className="text-xs">
            {t('postgresql_page.cli_description', 'Execute SQL commands directly on the MySQL database. Use with caution.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs">
            MySQL CLI functionality is not yet implemented.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
