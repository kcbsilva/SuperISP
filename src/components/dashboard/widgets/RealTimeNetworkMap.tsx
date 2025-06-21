// src/components/dashboard/widgets/RealTimeNetworkMap.tsx
'use client';

import * as React from 'react';
import { MapPin } from 'lucide-react';

export default function RealTimeNetworkMap() {
  return (
    <div className="flex flex-col h-full w-full items-center justify-center text-center p-4 border border-dashed rounded-lg">
      <MapPin className="h-6 w-6 text-primary mb-2" />
      <h3 className="text-sm font-semibold">Real-time Network Map</h3>
      <p className="text-xs text-muted-foreground">Map integration coming soon. This panel will visualize network nodes, PoPs, and live alerts.</p>
    </div>
  );
}
