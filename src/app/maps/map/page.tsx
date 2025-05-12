// src/app/maps/map/page.tsx
'use client';

import * as React from 'react';
import { Layers, Plus, Minus, Maximize, Cable, Warehouse, Box, Power, TowerControl, Building, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useLocale } from '@/contexts/LocaleContext';
import { MapComponent } from '@/components/map-component';

export default function MapPage() {
  const { t } = useLocale();
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const iconSize = "h-3 w-3"; // Reduced icon size
  const smallIconSize = "h-2.5 w-2.5"; // For smaller icons inside buttons if needed, reduced

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen">

        <Card className="flex-1 flex flex-col overflow-hidden border-0 rounded-none shadow-none">
          <CardContent className="flex-1 p-0 relative">

            <MapComponent apiKey={googleMapsApiKey} />

             <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
               <Tooltip>
                 <TooltipTrigger asChild>
                   <Button variant="outline" size="icon" className="bg-background border border-border">
                     <Plus className={iconSize} />
                      <span className="sr-only">{t('maps_page.zoom_in_tooltip', 'Zoom In')}</span>
                   </Button>
                 </TooltipTrigger>
                 <TooltipContent side="left">
                    <p className="text-xs">{t('maps_page.zoom_in_tooltip', 'Zoom In')}</p> 
                 </TooltipContent>
               </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="bg-background border border-border">
                      <Minus className={iconSize} />
                      <span className="sr-only">{t('maps_page.zoom_out_tooltip', 'Zoom Out')}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                     <p className="text-xs">{t('maps_page.zoom_out_tooltip', 'Zoom Out')}</p>
                  </TooltipContent>
                </Tooltip>
                 <Tooltip>
                   <TooltipTrigger asChild>
                     <Button variant="outline" size="icon" className="bg-background border border-border">
                       <Maximize className={iconSize} />
                       <span className="sr-only">{t('maps_page.fullscreen_tooltip', 'Toggle Fullscreen')}</span>
                     </Button>
                   </TooltipTrigger>
                   <TooltipContent side="left">
                     <p className="text-xs">{t('maps_page.fullscreen_tooltip', 'Toggle Fullscreen')}</p>
                   </TooltipContent>
                 </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="bg-background border border-border">
                        <Layers className={iconSize} />
                        <span className="sr-only">{t('maps_page.layers_tooltip', 'Manage Layers')}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p className="text-xs">{t('maps_page.layers_tooltip', 'Manage Layers')}</p>
                    </TooltipContent>
                  </Tooltip>
             </div>

              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                 <Tooltip>
                   <TooltipTrigger asChild>
                     <Button variant="outline" size="icon" className="bg-background border border-border">
                       <Cable className={iconSize} />
                       <span className="sr-only">{t('maps_page.add_cable_tooltip', 'Add Cable')}</span>
                     </Button>
                   </TooltipTrigger>
                   <TooltipContent side="right">
                     <p className="text-xs">{t('maps_page.add_cable_tooltip', 'Add Cable')}</p>
                   </TooltipContent>
                 </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="bg-background border border-border">
                        <Warehouse className={iconSize} />
                        <span className="sr-only">{t('maps_page.add_fosc_tooltip', 'Add FOSC')}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="text-xs">{t('maps_page.add_fosc_tooltip', 'Add FOSC')}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="bg-background border border-border">
                        <Box className={iconSize} />
                        <span className="sr-only">{t('maps_page.add_fdh_tooltip', 'Add FDH')}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="text-xs">{t('maps_page.add_fdh_tooltip', 'Add FDH')}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="bg-background border border-border">
                        <Power className={iconSize} />
                        <span className="sr-only">{t('maps_page.add_poll_tooltip', 'Add Hydro Poll')}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="text-xs">{t('maps_page.add_poll_tooltip', 'Add Hydro Poll')}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="bg-background border border-border">
                        <TowerControl className={iconSize} />
                        <span className="sr-only">{t('maps_page.add_tower_tooltip', 'Add Tower')}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="text-xs">{t('maps_page.add_tower_tooltip', 'Add Tower')}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="bg-background border border-border">
                        <Building className={iconSize} />
                        <span className="sr-only">{t('maps_page.add_pop_tooltip', 'Add PoP')}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="text-xs">{t('maps_page.add_pop_tooltip', 'Add PoP')}</p>
                    </TooltipContent>
                  </Tooltip>
              </div>


          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}

