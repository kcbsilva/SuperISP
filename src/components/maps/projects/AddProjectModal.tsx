// src/components/maps/projects/AddProjectModal.tsx
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { ProjectFormFields } from './ProjectFormFields';
import type { Pop, MapProject } from '@/types/maps';

interface AddProjectModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  pops: Pop[];
  onCreated: (project: MapProject) => void;
  children: React.ReactNode;
}

export function AddProjectModal({ open, setOpen, pops, onCreated, children }: AddProjectModalProps) {
  const [projectName, setProjectName] = React.useState('');
  const [popId, setPopId] = React.useState('');
  const [status, setStatus] = React.useState<'Active' | 'Planned' | 'Completed' | 'On Hold'>('Planned');
  const [submitting, setSubmitting] = React.useState(false);

  const resetForm = () => {
    setProjectName('');
    setPopId('');
    setStatus('Planned');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const res = await fetch('/api/maps/projects', {
      method: 'POST',
      body: JSON.stringify({ project_name: projectName, pop_id: popId, status }),
      headers: { 'Content-Type': 'application/json' },
    });

    setSubmitting(false);
    if (res.ok) {
      const created = await res.json();
      toast({ title: 'Project created' });
      onCreated(created);
      resetForm();
      setOpen(false);
    } else {
      toast({ title: 'Error creating project' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreate} className="space-y-4 mt-4">
          <ProjectFormFields
            projectName={projectName}
            popId={popId}
            status={status}
            setProjectName={setProjectName}
            setPopId={setPopId}
            setStatus={setStatus}
            pops={pops}
          />
          <Button type="submit" className="bg-green-600 text-white" disabled={submitting}>
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
