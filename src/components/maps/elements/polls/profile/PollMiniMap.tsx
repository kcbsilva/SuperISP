// src/components/maps/elements/polls/profile/PollMiniMap.tsx
'use client';

import React from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

interface PollMiniMapProps {
  coordinates: string; // Format: "-3.745, -38.523"
}

const containerStyle = {
  width: '100%',
  height: '192px', // 48 * 4
  borderRadius: '0.375rem', // rounded-md
};

export function PollMiniMap({ coordinates }: PollMiniMapProps) {
  const parts = coordinates.split(',').map((val) => parseFloat(val.trim()));
  const [lat, lng] = parts;

  const isValidCoords = parts.length === 2 && !isNaN(lat) && !isNaN(lng);
  const center = { lat, lng };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  if (!isValidCoords) {
    return <div className="text-xs text-destructive">Invalid coordinates</div>;
  }

  if (!isLoaded) {
    return <div className="text-xs text-muted-foreground">Loading map...</div>;
  }

  return (
    <div className="rounded-md overflow-hidden border border-muted">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={16}
        options={{
          disableDefaultUI: true,
          gestureHandling: 'none',
          clickableIcons: false,
        }}
      >
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
}
