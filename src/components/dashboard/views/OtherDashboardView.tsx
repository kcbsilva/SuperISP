// src/components/dashboard/views/OtherDashboardView.tsx
import * as React from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { Card, CardContent } from '@/components/ui/card';

type Props = {
  currentView: 'Network' | 'Technician';
};

export default function OtherDashboardView({ currentView }: Props) {
  const { t } = useLocale();

  return (
    <Card className="h-64 flex items-center justify-center">
      <CardContent>
        <p className="text-sm text-muted-foreground text-center">
          {t(
            'dashboard.other_view_placeholder',
            'Displaying {view} Dashboard Content (Not Implemented)'
          ).replace('{view}', currentView)}
        </p>
      </CardContent>
    </Card>
  );
}
