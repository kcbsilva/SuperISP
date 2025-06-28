// src/app/admin/maps/projects/page.tsx
'use client';

import * as React from 'react';
import { FileCode, PlusCircle } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AddProjectModal } from '@/components/maps/projects/AddProjectModal';
import { UpdateProjectModal } from '@/components/maps/projects/UpdateProjectModal';
import { ListProjects } from '@/components/maps/projects/ListProjects';
import { RemoveProjectDialog } from '@/components/maps/projects/RemoveProjectDialog';

import type { MapProject, Pop } from '@/types/maps';

export default function ProjectsPage() {
  const { t } = useLocale();

  const [projects, setProjects] = React.useState<MapProject[] | null>(null);
  const [pops, setPops] = React.useState<Pop[]>([]);
  const [editingProject, setEditingProject] = React.useState<MapProject | null>(null);
  const [deletingProjectId, setDeletingProjectId] = React.useState<string | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);

  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [sortBy, setSortBy] = React.useState<'id' | 'name' | 'status'>('id');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);

  React.useEffect(() => {
    async function loadData() {
      try {
        const [projectRes, popRes] = await Promise.all([
          fetch('/api/maps/projects'),
          fetch('/api/pops'),
        ]);

        if (!projectRes.ok) throw new Error('Failed to load projects');
        if (!popRes.ok) throw new Error('Failed to load PoPs');

        const [projectData, popData] = await Promise.all([
          projectRes.json(),
          popRes.json(),
        ]);

        setProjects(projectData);
        setPops(popData);
      } catch (err) {
        console.error('Error loading project data:', err);
        setProjects([]);
        setPops([]);
      }
    }

    loadData();
  }, []);

  const filteredProjects = React.useMemo(() => {
    if (!projects) return null;

    return projects
      .filter((p) =>
        p.project_name.toLowerCase().includes(search.toLowerCase()) &&
        (statusFilter === 'all' || p.status === statusFilter)
      )
      .sort((a, b) => {
        const valA = sortBy === 'name' ? a.project_name : sortBy === 'status' ? a.status : a.id;
        const valB = sortBy === 'name' ? b.project_name : sortBy === 'status' ? b.status : b.id;
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [projects, search, statusFilter, sortBy, sortOrder]);

  const totalPages = filteredProjects ? Math.ceil(filteredProjects.length / perPage) : 1;

  const paginatedProjects = React.useMemo(() => {
    if (!filteredProjects) return null;
    const start = (page - 1) * perPage;
    return filteredProjects.slice(start, start + perPage);
  }, [filteredProjects, page, perPage]);

  const handleSortChange = (field: 'id' | 'name' | 'status') => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <FileCode className="h-4 w-4 text-primary" />
          {t('maps_elements.projects_page_title', 'Projects')}
        </h1>

        <AddProjectModal
          open={createOpen}
          setOpen={setCreateOpen}
          pops={pops}
          onCreated={(project) => setProjects((prev) => (prev ? [project, ...prev] : [project]))}
        >
          <Button className="bg-green-600 hover:bg-green-700 text-white" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('maps_elements.add_project_button', 'Add Project')}
          </Button>
        </AddProjectModal>
      </div>

      <Card>
        <CardContent className="pt-6">
          <ListProjects
            projects={paginatedProjects}
            onEdit={(project) => {
              setEditingProject(project);
              setEditOpen(true);
            }}
            onDelete={(id) => setDeletingProjectId(id)}
            onSortChange={handleSortChange}
            sortBy={sortBy}
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            perPage={perPage}
            setPerPage={setPerPage}
            totalCount={filteredProjects?.length || 0}
          />
        </CardContent>
      </Card>

      <UpdateProjectModal
        open={editOpen}
        setOpen={setEditOpen}
        project={editingProject}
        pops={pops}
        onUpdated={(updated) =>
          setProjects((prev) => (prev ? prev.map((p) => (p.id === updated.id ? updated : p)) : prev))
        }
      />

      <RemoveProjectDialog
        projectId={deletingProjectId}
        onClose={() => setDeletingProjectId(null)}
        onDeleted={(id) =>
          setProjects((prev) => (prev ? prev.filter((p) => p.id !== id) : prev))
        }
      />
    </div>
  );
}
