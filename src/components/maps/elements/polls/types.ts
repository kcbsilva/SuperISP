// src/components/maps/elements/polls/types.ts

export type PollType = 'Circular' | 'Square';

export interface HydroPoll {
  id: string;
  description: string;
  height: string;
  type: PollType;
  address: string;
  gpsCoordinates: string;
  transformer: 'Yes' | 'No';
  project?: string;
  cablesPassed?: { id: string; name: string; fiberCount?: number }[];
  attachedFoscs?: string[];
  attachedFdhs?: string[];
  history?: { id: string; date: string; user: string; description: string; details?: string }[];
}

export interface PollTemplate {
  id: string;
  manufacturer?: string;
  material: string;
  height: string;
  type: PollType;
}
