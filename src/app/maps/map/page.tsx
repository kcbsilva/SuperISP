// src/app/maps/map/page.tsx
'use client';

import * as React from 'react';
import { Layers, Plus, Minus, Maximize, Cable, Warehouse, Box } from 'lucide-react'; // Removed MapPin, added element icons
import { Card, CardContent } from '@/components/ui/card'; // Removed CardDescription, CardHeader, CardTitle
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useLocale } from '@/contexts/LocaleContext';
import { MapComponent } from '@/components/map-component'; // Import the new MapComponent

export default function MapPage() {
  const { t } = useLocale();
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <TooltipProvider>
      {/* Adjust height to be full screen */}
      <div className="flex flex-col h-screen"> {/* Changed to h-screen */}

        {/* Ensure card takes remaining space and allows content to fill */}
        <Card className="flex-1 flex flex-col overflow-hidden border-0 rounded-none shadow-none"> {/* Removed border, radius, shadow */}
          {/* Removed CardHeader */}
          {/* Ensure content area fills remaining space and remove padding */}
          <CardContent className="flex-1 p-0 relative"> {/* Removed p-0 */}

            {/* Integrate the actual MapComponent */}
            <MapComponent apiKey={googleMapsApiKey} />

             {/* Map Controls Overlay (Right Side) */}
             <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
               <Tooltip>
                 <TooltipTrigger asChild>
                   {/* Placeholder button, real map controls would be part of MapComponent or library */}
                   <Button variant="outline" size="icon" className="bg-background">
                     <Plus className="h-4 w-4" />
                      <span className="sr-only">{t('maps_page.zoom_in_tooltip', 'Zoom In')}</span>
                   </Button>
                 </TooltipTrigger>
                 <TooltipContent side="left">
                    <p>{t('maps_page.zoom_in_tooltip', 'Zoom In')}</p>
                 </TooltipContent>
               </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {/* Placeholder button */}
                    <Button variant="outline" size="icon" className="bg-background">
                      <Minus className="h-4 w-4" />
                      <span className="sr-only">{t('maps_page.zoom_out_tooltip', 'Zoom Out')}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                     <p>{t('maps_page.zoom_out_tooltip', 'Zoom Out')}</p>
                  </TooltipContent>
                </Tooltip>
                 <Tooltip>
                   <TooltipTrigger asChild>
                     {/* Placeholder button */}
                     <Button variant="outline" size="icon" className="bg-background">
                       <Maximize className="h-4 w-4" />
                       <span className="sr-only">{t('maps_page.fullscreen_tooltip', 'Toggle Fullscreen')}</span>
                     </Button>
                   </TooltipTrigger>
                   <TooltipContent side="left">
                     <p>{t('maps_page.fullscreen_tooltip', 'Toggle Fullscreen')}</p>
                   </TooltipContent>
                 </Tooltip>
                 {/* Layers button moved here */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="bg-background">
                        <Layers className="h-4 w-4" />
                        <span className="sr-only">{t('maps_page.layers_tooltip', 'Manage Layers')}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>{t('maps_page.layers_tooltip', 'Manage Layers')}</p>
                    </TooltipContent>
                  </Tooltip>
             </div>

             {/* Element Addition Buttons Overlay (Left Side) */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                 <Tooltip>
                   <TooltipTrigger asChild>
                     <Button variant="outline" size="icon" className="bg-background">
                       <Cable className="h-4 w-4" />
                       <span className="sr-only">{t('maps_page.add_cable_tooltip', 'Add Cable')}</span>
                     </Button>
                   </TooltipTrigger>
                   <TooltipContent side="right">
                     <p>{t('maps_page.add_cable_tooltip', 'Add Cable')}</p>
                   </TooltipContent>
                 </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="bg-background">
                        <Warehouse className="h-4 w-4" /> {/* Using Warehouse for FOSC */}
                        <span className="sr-only">{t('maps_page.add_fosc_tooltip', 'Add FOSC')}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{t('maps_page.add_fosc_tooltip', 'Add FOSC')}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="bg-background">
                        <Box className="h-4 w-4" /> {/* Using Box for FDH */}
                        <span className="sr-only">{t('maps_page.add_fdh_tooltip', 'Add FDH')}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{t('maps_page.add_fdh_tooltip', 'Add FDH')}</p>
                    </TooltipContent>
                  </Tooltip>
                  {/* Add more buttons for PEDs, Accessories, Towers etc. if needed */}
              </div>

          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
