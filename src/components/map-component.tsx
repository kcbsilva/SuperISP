// src/components/map-component.tsx
'use client';

import * as React from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow, Pin, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocale } from '@/contexts/LocaleContext';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from './ui/button';

interface MapComponentProps {
  apiKey: string | undefined;
}

interface PlacePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

const position = { lat: 53.54992, lng: 10.00678 }; // Default position

function MapInnerComponent() {
  const { t } = useLocale();
  const map = useMap();
  const places = useMapsLibrary('places');
  const geocoding = useMapsLibrary('geocoding');

  const [openInfoWindow, setOpenInfoWindow] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [predictions, setPredictions] = React.useState<PlacePrediction[]>([]);
  const [showPredictions, setShowPredictions] = React.useState(false);
  const iconSize = "h-3 w-3";

  const autocompleteServiceRef = React.useRef<google.maps.places.AutocompleteService | null>(null);
  const geocoderRef = React.useRef<google.maps.Geocoder | null>(null);

  React.useEffect(() => {
    if (places) {
      autocompleteServiceRef.current = new places.AutocompleteService();
    }
    if (geocoding) {
      geocoderRef.current = new geocoding.Geocoder();
    }
  }, [places, geocoding]);

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
            if (status !== google.maps.places.PlacesServiceStatus.ZERO_RESULTS && status !== google.maps.places.PlacesServiceStatus.REQUEST_DENIED) { // Don't log for these common cases
              console.error('Autocomplete failed:', status);
            }
          }
        }
      );
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handlePredictionSelect = (placeId: string, description: string) => {
    setSearchTerm(description);
    setPredictions([]);
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
          map.setZoom(15);
        } else {
          console.log("Map instance not available or location not found");
        }
      } else {
        console.error('Geocode failed:', status);
        // Toast can't be used directly here as useToast is outside this component's direct context
        // Consider passing toast down or handling error display differently if needed.
      }
    });
  };

  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        <Map
          defaultCenter={position}
          defaultZoom={11}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          mapId="nethub-map"
        >
          <AdvancedMarker position={position} onClick={() => setOpenInfoWindow(true)}>
            <Pin background={'hsl(var(--primary))'} glyphColor={'hsl(var(--primary-foreground))'} borderColor={'hsl(var(--primary))'} />
          </AdvancedMarker>

          {openInfoWindow && (
            <InfoWindow position={position} onCloseClick={() => setOpenInfoWindow(false)}>
              <p className="text-xs">{t('maps_page.example_marker_info', 'Example Network Element')}</p>
            </InfoWindow>
          )}
        </Map>

        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-md px-4">
          <div className="relative">
            <Search className={`absolute left-2.5 top-2.5 ${iconSize} text-muted-foreground`} />
            <Input
              type="search"
              placeholder={t('maps_page.search_address_placeholder', 'Search address...')}
              className="pl-8 w-full bg-background shadow-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => predictions.length > 0 && setShowPredictions(true)}
            />
            {showPredictions && predictions.length > 0 && (
              <div className="absolute mt-1 w-full bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto z-30">
                {predictions.map((prediction) => (
                  <Button
                    key={prediction.place_id}
                    variant="ghost"
                    className="w-full justify-start h-auto px-3 py-2 text-left text-xs"
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
    </>
  );
}


export function MapComponent({ apiKey }: MapComponentProps) {
  const { toast } = useToast();
  const { t } = useLocale();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

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
      // APIProvider will handle loading, this timeout is just for initial skeleton
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [apiKey, toast, t]);

  if (error) {
    return (
      <div className="absolute inset-0 bg-destructive/10 flex items-center justify-center">
        <p className="text-destructive text-center p-4 text-xs">{error}</p>
      </div>
    );
  }

  if (loading || !apiKey) {
    return <Skeleton className="absolute inset-0" />;
  }

  return (
    <APIProvider apiKey={apiKey} libraries={['places', 'geocoding']}>
      <MapInnerComponent />
    </APIProvider>
  );
}
