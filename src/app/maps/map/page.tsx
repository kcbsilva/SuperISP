// src/app/maps/map/page.tsx
'use client';

import * as React from 'react';
import { MapPin, Layers, Plus, Minus, Maximize, Cable, Warehouse, Box } from 'lucide-react'; // Added element icons
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
      {/* Adjust height to be closer to full screen, considering header/padding */}
      <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]"> {/* Increased height */}
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

        {/* Ensure card takes remaining space and allows content to fill */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="border-b p-4"> {/* Reduced padding */}
            <CardTitle className="text-lg">{t('maps_page.map_view_title', 'Map View')}</CardTitle>
            <CardDescription>{t('maps_page.map_view_desc', 'Visualize and manage network elements.')}</CardDescription>
          </CardHeader>
          {/* Ensure content area fills remaining space */}
          <CardContent className="flex-1 p-0 relative">

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
