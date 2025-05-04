'use client';

import * as React from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow, Pin, useMap } from '@vis.gl/react-google-maps';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocale } from '@/contexts/LocaleContext';
import { Input } from '@/components/ui/input'; // Import Input
import { Search } from 'lucide-react'; // Import Search icon
import { Button } from './ui/button'; // Import Button for suggestions

interface MapComponentProps {
  apiKey: string | undefined;
}

// Define prediction type based on Google Maps API
interface PlacePrediction {
    description: string;
    place_id: string;
    structured_formatting: {
        main_text: string;
        secondary_text: string;
    };
    // Add other properties if needed
}

export function MapComponent({ apiKey }: MapComponentProps) {
  const { toast } = useToast();
  const { t } = useLocale();
  const map = useMap(); // Hook to get map instance
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [openInfoWindow, setOpenInfoWindow] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [predictions, setPredictions] = React.useState<PlacePrediction[]>([]);
  const [showPredictions, setShowPredictions] = React.useState(false);

  const position = { lat: 53.54992, lng: 10.00678 }; // Example position (Hamburg)

  // Refs for services
  const autocompleteServiceRef = React.useRef<google.maps.places.AutocompleteService | null>(null);
  const geocoderRef = React.useRef<google.maps.Geocoder | null>(null);

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
      // Check if google.maps is available before initializing services
      if (typeof google !== 'undefined' && google.maps && google.maps.places) {
          autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
          geocoderRef.current = new google.maps.Geocoder();
      }
      const timer = setTimeout(() => setLoading(false), 1000); // Simulate map ready time
      return () => clearTimeout(timer);
    }
  }, [apiKey, toast, t]);

  // Fetch predictions when searchTerm changes (debounced for performance)
  React.useEffect(() => {
    if (!autocompleteServiceRef.current || searchTerm.length < 3) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    const debounceTimer = setTimeout(() => {
        autocompleteServiceRef.current?.getPlacePredictions(
            { input: searchTerm },
            (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    setPredictions(results);
                    setShowPredictions(true);
                } else {
                    setPredictions([]);
                    setShowPredictions(false);
                    if (status !== google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                        console.error('Autocomplete failed:', status);
                    }
                }
            }
        );
    }, 300); // Debounce time in ms

    return () => clearTimeout(debounceTimer);

  }, [searchTerm]);

  const handlePredictionSelect = (placeId: string, description: string) => {
    setSearchTerm(description); // Update input field
    setPredictions([]); // Clear predictions
    setShowPredictions(false);

    if (!geocoderRef.current) {
      console.error('Geocoder service not initialized.');
      return;
    }

    geocoderRef.current.geocode({ placeId }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        const location = results[0].geometry.location;
        if (map && location) {
          map.panTo(location);
          map.setZoom(15); // Zoom in on the selected location
        } else {
           console.log("Map instance not available or location not found");
        }
      } else {
        console.error('Geocode failed:', status);
        toast({
            title: t('maps_page.geocode_error_title', 'Geocode Error'),
            description: t('maps_page.geocode_error_desc', 'Could not find location coordinates.'),
            variant: 'destructive',
        });
      }
    });
  };


  if (error) {
    return (
      <div className="absolute inset-0 bg-destructive/10 flex items-center justify-center">
        <p className="text-destructive text-center p-4">{error}</p>
      </div>
    );
  }

  if (loading || !apiKey) {
    return <Skeleton className="absolute inset-0" />;
  }

  return (
    // APIProvider now wraps the search bar as well
    <APIProvider apiKey={apiKey} libraries={['places', 'geocoding']}>
       <div className="absolute inset-0 overflow-hidden">

         {/* Map Component */}
         <Map
           defaultCenter={position}
           defaultZoom={11}
           gestureHandling={'greedy'}
           disableDefaultUI={true}
           mapId="nethub-map"
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

          {/* Address Search Bar Overlay (Top Center) - Integrated Here */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-md px-4">
              <div className="relative">
                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input
                     type="search"
                     placeholder={t('maps_page.search_address_placeholder', 'Search address...')}
                     className="pl-8 w-full bg-background shadow-md"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     onFocus={() => predictions.length > 0 && setShowPredictions(true)}
                     // onBlur={() => setTimeout(() => setShowPredictions(false), 150)} // Delay hide to allow click
                 />
                 {/* Suggestions Dropdown */}
                 {showPredictions && predictions.length > 0 && (
                     <div className="absolute mt-1 w-full bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto z-30">
                         {predictions.map((prediction) => (
                             <Button
                                 key={prediction.place_id}
                                 variant="ghost"
                                 className="w-full justify-start h-auto px-3 py-2 text-left text-sm"
                                 onClick={() => handlePredictionSelect(prediction.place_id, prediction.description)}
                             >
                                 <div>
                                     <div className="font-medium">{prediction.structured_formatting.main_text}</div>
                                     <div className="text-xs text-muted-foreground">{prediction.structured_formatting.secondary_text}</div>
                                 </div>
                             </Button>
                         ))}
                     </div>
                 )}
              </div>
          </div>
       </div>
    </APIProvider>
  );
}
