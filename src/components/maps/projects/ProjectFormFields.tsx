// src/components/maps/projects/ProjectFormFields.tsx
'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import type { Pop } from '@/types/maps';

interface ProjectFormFieldsProps {
  projectName: string;
  popId: string;
  status: 'Active' | 'Planned' | 'Completed' | 'On Hold';
  setProjectName: (val: string) => void;
  setPopId: (val: string) => void;
  setStatus: (val: 'Active' | 'Planned' | 'Completed' | 'On Hold') => void;
  pops: Pop[];
}

export function ProjectFormFields({
  projectName,
  popId,
  status,
  setProjectName,
  setPopId,
  setStatus,
  pops,
}: ProjectFormFieldsProps) {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="projectName">Project Name</Label>
        <Input
          id="projectName"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label>Select PoP</Label>
        <Select value={popId} onValueChange={setPopId}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a PoP" />
          </SelectTrigger>
          <SelectContent>
            {pops.map((pop) => (
              <SelectItem key={pop.id} value={pop.id}>
                {pop.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label>Status</Label>
        <Select
          value={status}
          onValueChange={(val) =>
            setStatus(val as 'Active' | 'Planned' | 'Completed' | 'On Hold')
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Planned">Planned</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="On Hold">On Hold</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
