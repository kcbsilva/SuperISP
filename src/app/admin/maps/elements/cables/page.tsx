// src/app/maps/elements/cables/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Cable, FileText as FileTextIcon } from 'lucide-react'; // Removed PlusCircle, Added FileTextIcon
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast'; // Added useToast

export default function CablesPage() {
  const { t } = useLocale();
  const { toast } = useToast(); // Added toast
  const iconSize = "h-3 w-3";

  const handleOpenTemplatesModal = () => {
    toast({
      title: t('maps_elements.template_modal_not_implemented_title', 'Template Management (Not Implemented)'),
      description: t('maps_elements.cable_template_modal_not_implemented_desc', 'Managing templates for Cables is not yet available.'),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
            <Cable className={`${iconSize} text-primary`} />
            {t('sidebar.maps_elements_cables', 'Cables')}
        </h1>
        <Button size="sm" variant="outline" onClick={handleOpenTemplatesModal}>
            <FileTextIcon className={`mr-2 ${iconSize}`} /> {t('maps_elements.cable_template_button', 'Cable Templates')}
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm">{t('maps_elements.list_title_cables', 'Cable List')}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-center text-muted-foreground py-8 text-xs">
              {t('maps_elements.no_cables_found', 'No cables found. They are typically added via the map interface.')}
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
