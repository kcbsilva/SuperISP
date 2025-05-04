'use client';

import * as React from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow, Pin } from '@vis.gl/react-google-maps';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocale } from '@/contexts/LocaleContext';

interface MapComponentProps {
  apiKey: string | undefined;
}

export function MapComponent({ apiKey }: MapComponentProps) {
  const { toast } = useToast();
  const { t } = useLocale();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [openInfoWindow, setOpenInfoWindow] = React.useState(false);

  const position = { lat: 53.54992, lng: 10.00678 }; // Example position (Hamburg)

  React.useEffect(() => {
    if (!apiKey) {
      const errorMessage = t('maps_page.api_key_missing_error', 'Google Maps API key is missing. Please add it to your .env file.');
      setError(errorMessage);
      toast({
        title: t('maps_page.api_key_error_title', 'Map Error'),
        description: errorMessage,
        variant: 'destructive',
      });
      setLoading(false);
    } else {
      // Simulate map loading time or handle actual library loading state if available
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [apiKey, toast, t]);

  if (error) {
    return (
      <div className="absolute inset-0 bg-destructive/10 flex items-center justify-center border rounded-b-lg">
        <p className="text-destructive text-center p-4">{error}</p>
      </div>
    );
  }

  if (loading || !apiKey) { // Show skeleton while loading or if apiKey is still undefined briefly
    return <Skeleton className="absolute inset-0 rounded-b-lg" />;
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="absolute inset-0 border rounded-b-lg overflow-hidden">
        <Map
          defaultCenter={position}
          defaultZoom={11}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          mapId="nethub-map" // Optional: Add a Map ID for styling
        >
           {/* Example Marker */}
           <AdvancedMarker position={position} onClick={() => setOpenInfoWindow(true)}>
             <Pin background={'hsl(var(--primary))'} glyphColor={'hsl(var(--primary-foreground))'} borderColor={'hsl(var(--primary))'} />
           </AdvancedMarker>

           {/* Example InfoWindow */}
           {openInfoWindow && (
             <InfoWindow position={position} onCloseClick={() => setOpenInfoWindow(false)}>
               <p>{t('maps_page.example_marker_info', 'Example Network Element')}</p>
             </InfoWindow>
           )}
        </Map>
      </div>
    </APIProvider>
  );
}
