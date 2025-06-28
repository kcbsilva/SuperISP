// src/components/maps/projects/RemoveProjectDialog.tsx
'use client';

import * as React from 'react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';

interface RemoveProjectDialogProps {
  projectId: string | null;
  onClose: () => void;
  onDeleted: (id: string) => void;
}

export function RemoveProjectDialog({ projectId, onClose, onDeleted }: RemoveProjectDialogProps) {
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    if (!projectId) return;
    setLoading(true);

    const res = await fetch(`/api/maps/projects/${projectId}`, {
      method: 'DELETE',
    });

    setLoading(false);
    if (res.ok) {
      toast({ title: 'Project deleted' });
      onDeleted(projectId);
      onClose();
    } else {
      toast({ title: 'Error deleting project' });
    }
  };

  return (
    <AlertDialog open={!!projectId} onOpenChange={(open) => { if (!open) onClose(); }}>
      <AlertDialogTrigger asChild><span /></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        </AlertDialogHeader>
        <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading} className="bg-red-600 text-white">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}