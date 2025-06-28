// src/components/maps/elements/polls/PollProfile.tsx
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, MapPin, Save, X, Info, Cable, Boxes, History } from 'lucide-react';
import { HydroPoll } from './types';

import { PollDetails } from './profile/PollDetails';
import { PollCables } from './profile/PollCables';
import { PollEnclosures } from './profile/PollEnclosures';
import { PollHistory } from './profile/PollHistory';
import { Badge } from '@/components/ui/badge';

interface PollProfileProps {
  poll: HydroPoll | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (pollId: string) => void;
  onDelete?: (pollId: string) => void;
  onSeeInMap?: (pollId: string) => void;
  onSave?: (updatedPoll: HydroPoll) => void;
}

export function PollProfile({
  poll,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onSeeInMap,
  onSave
}: PollProfileProps) {
  const [activeTab, setActiveTab] = React.useState('details');
  const [isEditing, setIsEditing] = React.useState(false);
  const [formState, setFormState] = React.useState<HydroPoll | null>(poll);

  React.useEffect(() => {
    if (poll) setFormState(poll);
    setIsEditing(false);
  }, [poll]);

  if (!formState) return null;

  const handleChange = (field: keyof HydroPoll, value: any) => {
    setFormState(prev => prev ? { ...prev, [field]: value } : prev);
  };

  const handleSave = () => {
    if (onSave && formState) onSave(formState);
    setIsEditing(false);
  };

  const handleMapClick = () => {
    onSeeInMap?.(formState.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-4xl max-h-[57vh] flex flex-col justify-between">
        <DialogHeader>
          <DialogTitle>
            <button onClick={handleMapClick} className="hover:underline text-sm text-left">
              {formState.id}
            </button>
          </DialogTitle>
          <DialogDescription className="text-xs">
            <button onClick={handleMapClick} className="hover:underline text-left">
              {formState.description || 'No description'} / {formState.gpsCoordinates || 'No coordinates'}
            </button>
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full flex-grow flex flex-col overflow-hidden"
        >
          <TabsList className="grid w-full grid-cols-4 sticky top-0 bg-background z-10">
            <TabsTrigger value="details" className="group">
              <Info className="w-4 h-4 mr-1 group-data-[state=active]:text-[#fca311]" /> Details
            </TabsTrigger>
            <TabsTrigger value="cables" className="group flex items-center gap-1">
              <Cable className="w-4 h-4 group-data-[state=active]:text-[#fca311]" /> Cables
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                {formState.cablesPassed?.length || 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="enclosures" className="flex items-center gap-1">
              <Boxes className="w-4 h-4 group-data-[state=active]:text-[#fca311]" /> Enclosures
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0.5"
              >
                {(formState.attachedFoscs?.length || 0) + (formState.attachedFdhs?.length || 0)}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="history" className="group flex items-center gap-1">
              <History className="w-4 h-4 group-data-[state=active]:text-[#fca311]" /> History
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                {formState.history?.length || 0}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="text-xs p-4 overflow-y-auto h-[calc(70vh-300px)] bg-white dark:bg-muted border rounded-md shadow-sm">
            <PollDetails poll={formState} isEditing={isEditing} onChange={handleChange} />
          </TabsContent>

          <TabsContent value="cables" className="text-xs p-4 overflow-y-auto h-[calc(70vh-300px)] bg-white dark:bg-muted border rounded-md shadow-sm">
            <PollCables cables={formState.cablesPassed} />
          </TabsContent>

          <TabsContent value="enclosures" className="text-xs p-4 overflow-y-auto h-[calc(70vh-300px)] bg-white dark:bg-muted border rounded-md shadow-sm">
            <PollEnclosures 
              pollId={formState.id}
              onSeeInMap={onSeeInMap}
            />
          </TabsContent>

          <TabsContent value="history" className="text-xs p-4 overflow-y-auto h-[calc(70vh-300px)] bg-white dark:bg-muted border rounded-md shadow-sm">
            <PollHistory history={formState.history} />
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 sm:justify-end sticky bottom-0 bg-background border-t px-6 pt-3 pb-0">
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                <X className="mr-2 h-3 w-3" /> Cancel
              </Button>
              <Button variant="default" size="sm" onClick={handleSave}>
                <Save className="mr-2 h-3 w-3" /> Save
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-3 w-3" /> Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete?.(formState.id)}>
                <Trash2 className="mr-2 h-3 w-3" /> Delete
              </Button>
              <Button variant="secondary" size="sm" onClick={() => onSeeInMap?.(formState.id)}>
                <MapPin className="mr-2 h-3 w-3" /> See in Map
              </Button>
            </>
          )}
          <DialogClose asChild>
            <Button variant="ghost" size="sm">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}