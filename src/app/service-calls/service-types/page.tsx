// src/app/service-calls/service-types/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { List as ServiceTypesIcon, PlusCircle } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';

// Placeholder for service type data structure
interface ServiceType {
  id: string;
  name: string;
  description?: string;
  // Add other relevant fields like default_duration, required_skills, etc.
}

const placeholderServiceTypes: ServiceType[] = [
  { id: 'st-001', name: 'Internet Installation', description: 'New fiber or radio internet setup.' },
  { id: 'st-002', name: 'Signal Repair', description: 'Troubleshooting and fixing signal issues.' },
  { id: 'st-003', name: 'Equipment Swap', description: 'Replacing faulty customer premises equipment.' },
];

export default function ServiceTypesPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const iconSize = "h-3 w-3";

  const handleAddServiceType = () => {
    toast({
      title: t('service_types.add_type_not_implemented_title'),
      description: t('service_types.add_type_not_implemented_desc'),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
            <ServiceTypesIcon className={`${iconSize} text-primary`} />
            {t('sidebar.service_calls_service_types', 'Service Types')}
        </h1>
        <Button onClick={handleAddServiceType} className="bg-green-600 hover:bg-green-700 text-white">
            <PlusCircle className={`mr-2 ${iconSize}`} /> {t('service_types.add_type_button', 'Add Service Type')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('service_types.list_title', 'Configured Service Types')}</CardTitle>
        </CardHeader>
        <CardContent>
          {placeholderServiceTypes.length > 0 ? (
            <ul className="space-y-2">
              {placeholderServiceTypes.map((type) => (
                <li key={type.id} className="text-xs p-2 border rounded-md">
                  <p className="font-medium">{type.name}</p>
                  {type.description && <p className="text-muted-foreground text-xs">{type.description}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted-foreground py-8 text-xs">
              {t('service_types.no_types_configured', 'No service types configured yet. Click "Add Service Type" to create one.')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
