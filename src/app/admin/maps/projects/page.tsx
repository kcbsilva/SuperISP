// src/app/admin/maps/projects/page.tsx
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Card, CardContent,
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { FileCode, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from '@/components/ui/select';

interface Pop {
  id: string;
  name: string;
}

interface MapProject {
  id: string;
  project_name: string;
  pop_id: string;
  pop_name?: string; // from join
  status: 'Active' | 'Planned' | 'Completed' | 'On Hold';
}

export default function ProjectsPage() {
  const { t } = useLocale();
  const router = useRouter();
  const [projects, setProjects] = React.useState<MapProject[]>([]);
  const [pops, setPops] = React.useState<Pop[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [createOpen, setCreateOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<MapProject | null>(null);

  const [projectName, setProjectName] = React.useState('');
  const [popId, setPopId] = React.useState('');
  const [status, setStatus] = React.useState<'Active' | 'Planned' | 'Completed' | 'On Hold'>('Planned');

  React.useEffect(() => {
    async function loadData() {
      const [projectRes, popRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/pops'),
      ]);

      const [projectData, popData] = await Promise.all([
        projectRes.json(),
        popRes.json(),
      ]);

      setProjects(projectData);
      setPops(popData);
      setLoading(false);
    }

    loadData();
  }, []);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Planned': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-primary/10 text-primary';
      case 'On Hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const resetForm = () => {
    setProjectName('');
    setPopId('');
    setStatus('Planned');
  };

  const openEditModal = (project: MapProject) => {
    setEditingProject(project);
    setProjectName(project.project_name);
    setPopId(project.pop_id);
    setStatus(project.status);
    setEditOpen(true);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/projects', {
      method: 'POST',
      body: JSON.stringify({ project_name: projectName, pop_id: popId, status }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      const created = await res.json();
      toast({ title: 'Project created' });
      setProjects([created, ...projects]);
      resetForm();
      setCreateOpen(false);
    } else {
      toast({ title: 'Error creating project' });
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    const res = await fetch(`/api/projects/${editingProject.id}`, {
      method: 'PUT',
      body: JSON.stringify({ project_name: projectName, pop_id: popId, status }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      const updated = await res.json();
      toast({ title: 'Project updated' });

      setProjects((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );

      setEditingProject(null);
      setEditOpen(false);
    } else {
      toast({ title: 'Error updating project' });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <FileCode className="h-4 w-4 text-primary" />
          {t('maps_elements.projects_page_title', 'Projects')}
        </h1>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white" size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('maps_elements.add_project_button', 'Add Project')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateProject} className="space-y-4 mt-4">
              <ProjectFormFields
                projectName={projectName}
                popId={popId}
                status={status}
                setProjectName={setProjectName}
                setPopId={setPopId}
                setStatus={setStatus}
                pops={pops}
              />
              <Button type="submit" className="bg-green-600 text-white">Create</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <p className="text-center text-sm text-muted-foreground">Loading projects...</p>
          ) : projects.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">ID</TableHead>
                    <TableHead className="text-center">Name</TableHead>
                    <TableHead className="text-center">PoP</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id} className="hover:bg-muted/30">
                      <TableCell className="text-center text-xs font-mono">{project.id}</TableCell>
                      <TableCell className="text-center text-sm">{project.project_name}</TableCell>
                      <TableCell className="text-center text-sm">{project.pop_name || '—'}</TableCell>
                      <TableCell className="text-center text-sm">
                        <Badge className={`text-xs ${getStatusBadgeClass(project.status)} border-transparent`}>
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center space-x-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditModal(project)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-6">No projects found.</p>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateProject} className="space-y-4 mt-4">
            <ProjectFormFields
              projectName={projectName}
              popId={popId}
              status={status}
              setProjectName={setProjectName}
              setPopId={setPopId}
              setStatus={setStatus}
              pops={pops}
            />
            <Button type="submit" className="bg-blue-600 text-white">Save Changes</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProjectFormFields({
  projectName,
  popId,
  status,
  setProjectName,
  setPopId,
  setStatus,
  pops,
}: {
  projectName: string;
  popId: string;
  status: string;
  setProjectName: (v: string) => void;
  setPopId: (v: string) => void;
  setStatus: (v: 'Active' | 'Planned' | 'Completed' | 'On Hold') => void;
  pops: Pop[];
}) {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="projectName">Project Name</Label>
        <Input id="projectName" value={projectName} onChange={(e) => setProjectName(e.target.value)} required />
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
        <Select value={status} onValueChange={(val) => setStatus(val as 'Active' | 'Planned' | 'Completed' | 'On Hold')}>
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
