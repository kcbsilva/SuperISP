// src/app/maps/map/page.tsx
'use client';

import * as React from 'react';
import { Layers, Plus, Minus, Maximize, Cable, Warehouse, Box, Power, TowerControl, Building, Search } from 'lucide-react'; // Added Power, TowerControl, Building, Search icons
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Import Input component
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useLocale } from '@/contexts/LocaleContext';
import { MapComponent } from '@/components/map-component';

export default function MapPage() {
  const { t } = useLocale();
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [searchTerm, setSearchTerm] = React.useState('');

  // Placeholder function for handling address search
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent page reload
    console.log('Searching for address:', searchTerm);
    // In a real app, you would integrate with Google Maps Geocoding API here
    // to find coordinates for the searched address and pan/zoom the map.
    // Example: const coordinates = await geocodeAddress(searchTerm);
    // mapRef.current?.panTo(coordinates);
  };

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
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10"> {/* Keep on left */}
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
                  {/* Added Hydro Polls Button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="bg-background">
                        <Power className="h-4 w-4" />
                        <span className="sr-only">{t('maps_page.add_poll_tooltip', 'Add Hydro Poll')}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{t('maps_page.add_poll_tooltip', 'Add Hydro Poll')}</p>
                    </TooltipContent>
                  </Tooltip>
                  {/* Added Tower Button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="bg-background">
                        <TowerControl className="h-4 w-4" />
                        <span className="sr-only">{t('maps_page.add_tower_tooltip', 'Add Tower')}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{t('maps_page.add_tower_tooltip', 'Add Tower')}</p>
                    </TooltipContent>
                  </Tooltip>
                  {/* Added PoP Button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="bg-background">
                        <Building className="h-4 w-4" />
                        <span className="sr-only">{t('maps_page.add_pop_tooltip', 'Add PoP')}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{t('maps_page.add_pop_tooltip', 'Add PoP')}</p>
                    </TooltipContent>
                  </Tooltip>
                  {/* Add more buttons for PEDs, Accessories etc. if needed */}
              </div>

             {/* Address Search Bar Overlay (Top Center) */}
             <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-full max-w-md px-4"> {/* Center using left-1/2 and translate, add padding */}
                 <form onSubmit={handleSearch} className="relative">
                     <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                     <Input
                         type="search"
                         placeholder={t('maps_page.search_address_placeholder', 'Search address...')}
                         className="pl-8 w-full bg-background shadow-md" // Added shadow for better visibility
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                     />
                      {/* Hidden submit button to allow form submission on enter */}
                     <button type="submit" className="hidden" aria-hidden="true">Search</button>
                 </form>
             </div>

          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
