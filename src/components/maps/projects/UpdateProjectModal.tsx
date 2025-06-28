// src/components/maps/projects/UpdateProjectModal.tsx
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { ProjectFormFields } from './ProjectFormFields';
import type { Pop, MapProject } from '@/types/maps';

interface UpdateProjectModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  pops: Pop[];
  project: MapProject | null;
  onUpdated: (updated: MapProject) => void;
}

export function UpdateProjectModal({ open, setOpen, pops, project, onUpdated }: UpdateProjectModalProps) {
  const [projectName, setProjectName] = React.useState('');
  const [popId, setPopId] = React.useState('');
  const [status, setStatus] = React.useState<'Active' | 'Planned' | 'Completed' | 'On Hold'>('Planned');
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (project) {
      setProjectName(project.project_name);
      setPopId(project.pop_id);
      setStatus(project.status);
    }
  }, [project]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    setSubmitting(true);

    const res = await fetch(`/api/maps/projects/${project.id}`, {
      method: 'PUT',
      body: JSON.stringify({ project_name: projectName, pop_id: popId, status }),
      headers: { 'Content-Type': 'application/json' },
    });

    setSubmitting(false);
    if (res.ok) {
      const updated = await res.json();
      toast({ title: 'Project updated' });
      onUpdated(updated);
      setOpen(false);
    } else {
      toast({ title: 'Error updating project' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpdate} className="space-y-4 mt-4">
          <ProjectFormFields
            projectName={projectName}
            popId={popId}
            status={status}
            setProjectName={setProjectName}
            setPopId={setPopId}
            setStatus={setStatus}
            pops={pops}
          />
          <Button type="submit" className="bg-blue-600 text-white" disabled={submitting}>
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}