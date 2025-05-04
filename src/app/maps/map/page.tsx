// src/app/maps/map/page.tsx
'use client';

import * as React from 'react';
import { MapPin, Layers, Plus, Minus, Maximize } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useLocale } from '@/contexts/LocaleContext';
import { MapComponent } from '@/components/map-component'; // Import the new MapComponent

export default function MapPage() {
  const { t } = useLocale();
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6 h-[calc(100vh-10rem)]"> {/* Adjust height as needed */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            {t('maps_page.title', 'Network Map')}
          </h1>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Layers className="h-4 w-4" />
                  <span className="sr-only">{t('maps_page.layers_tooltip', 'Manage Layers')}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('maps_page.layers_tooltip', 'Manage Layers')}</p>
              </TooltipContent>
            </Tooltip>
             {/* Add more actions if needed */}
          </div>
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden"> {/* Ensure card takes remaining space */}
          <CardHeader className="border-b p-4"> {/* Reduced padding */}
            <CardTitle className="text-lg">{t('maps_page.map_view_title', 'Map View')}</CardTitle>
            <CardDescription>{t('maps_page.map_view_desc', 'Visualize and manage network elements.')}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0 relative"> {/* Remove padding, make relative for controls */}

            {/* Integrate the actual MapComponent */}
            <MapComponent apiKey={googleMapsApiKey} />

             {/* Map Controls Overlay */}
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
             </div>

             {/* Add Element Button Overlay */}
              <div className="absolute bottom-4 left-4 z-10">
                 <Tooltip>
                   <TooltipTrigger asChild>
                     <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">
                       <Plus className="mr-1 h-4 w-4" />
                       {t('maps_page.add_element_button', 'Add Element')}
                     </Button>
                   </TooltipTrigger>
                   <TooltipContent>
                     <p>{t('maps_page.add_element_tooltip', 'Add a new network element to the map')}</p>
                   </TooltipContent>
                 </Tooltip>
              </div>

          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
