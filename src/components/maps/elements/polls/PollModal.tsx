// src/components/maps/elements/polls/PollModal.tsx
'use client';

import * as React from 'react';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogClose
} from '@/components/ui/dialog';
import {
  Tabs, TabsList, TabsTrigger, TabsContent
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, MapPin, Save, X } from 'lucide-react';
import { HydroPoll } from './types';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface PollModalProps {
  poll: HydroPoll | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (pollId: string) => void;
  onDelete?: (pollId: string) => void;
  onSeeInMap?: (pollId: string) => void;
  onSave?: (updatedPoll: HydroPoll) => void;
}

export function PollModal({
  poll,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onSeeInMap,
  onSave
}: PollModalProps) {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-sm">Poll Profile: {formState.id}</DialogTitle>
          <DialogDescription className="text-xs">{isEditing ? 'Editing' : 'Details of'} the selected hydro poll.</DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-grow flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-4 sticky top-0 bg-background z-10">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="cables">Cables</TabsTrigger>
            <TabsTrigger value="enclosures">Enclosures</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="mt-2 flex-grow overflow-y-auto text-xs">
            <div className="grid gap-3 py-2 text-xs">
              <div className="grid grid-cols-3 items-center gap-3">
                <span className="text-muted-foreground col-span-1">ID:</span>
                <span className="col-span-2 font-medium">{formState.id}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-3">
                <Label className="text-muted-foreground col-span-1">Description:</Label>
                <Input
                  className="col-span-2 h-7"
                  disabled={!isEditing}
                  value={formState.description}
                  onChange={e => handleChange('description', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-3">
                <Label className="text-muted-foreground col-span-1">Project:</Label>
                <Input
                  className="col-span-2 h-7"
                  disabled={!isEditing}
                  value={formState.project}
                  onChange={e => handleChange('project', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-3">
                <Label className="text-muted-foreground col-span-1">Height:</Label>
                <Input
                  className="col-span-2 h-7"
                  disabled={!isEditing}
                  value={formState.height}
                  onChange={e => handleChange('height', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-3">
                <Label className="text-muted-foreground col-span-1">Type:</Label>
                <Input
                  className="col-span-2 h-7"
                  disabled={!isEditing}
                  value={formState.type}
                  onChange={e => handleChange('type', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-3">
                <Label className="text-muted-foreground col-span-1">Address:</Label>
                <Input
                  className="col-span-2 h-7"
                  disabled={!isEditing}
                  value={formState.address}
                  onChange={e => handleChange('address', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-3">
                <Label className="text-muted-foreground col-span-1">Transformer:</Label>
                {isEditing ? (
                  <Switch
                    checked={formState.transformer === 'Yes'}
                    onCheckedChange={(val) => handleChange('transformer', val ? 'Yes' : 'No')}
                  />
                ) : (
                  <span className="col-span-2">
                    <Badge variant={formState.transformer === 'Yes' ? 'destructive' : 'default'} className="text-xs">
                      {formState.transformer}
                    </Badge>
                  </span>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="cables" className="mt-2 flex-grow overflow-y-auto text-xs">
            {formState.cablesPassed?.length ? (
              <ul className="list-disc pl-5">
                {formState.cablesPassed.map(c => (
                  <li key={c.id}>{c.name} ({c.fiberCount || '-'})</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No cables passed.</p>
            )}
          </TabsContent>
          <TabsContent value="enclosures" className="mt-2 flex-grow overflow-y-auto text-xs">
            <p>FOSCs: {formState.attachedFoscs?.join(', ') || 'None'}</p>
            <p>FDHs: {formState.attachedFdhs?.join(', ') || 'None'}</p>
          </TabsContent>
          <TabsContent value="history" className="mt-2 flex-grow overflow-y-auto text-xs">
            {formState.history?.length ? (
              <ul className="list-disc pl-5">
                {formState.history.map(entry => (
                  <li key={entry.id}><strong>{entry.date}</strong> - {entry.user}: {entry.description}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No history entries.</p>
            )}
          </TabsContent>
        </Tabs>
        <DialogFooter className="gap-2 sm:justify-end">
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
