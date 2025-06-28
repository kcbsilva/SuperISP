// src/components/maps/projects/ListProjects.tsx
'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { MapProject } from '@/types/maps';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

interface ListProjectsProps {
  projects: MapProject[] | null;
  onEdit: (project: MapProject) => void;
  onDelete: (id: string) => void;
  onSortChange?: (field: 'id' | 'name' | 'status') => void;
  sortBy?: 'id' | 'name' | 'status';
  search: string;
  setSearch: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  perPage: number;
}

export function ListProjects({
  projects,
  onEdit,
  onDelete,
  onSortChange,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  page,
  setPage,
  totalPages,
  perPage,
}: ListProjectsProps) {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Planned': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-primary/10 text-primary';
      case 'On Hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalResults = projects?.length || 0;
  const startIdx = (page - 1) * perPage + 1;
  const endIdx = Math.min(page * perPage, totalResults);

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-4">
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-xs"
        />

        <div className="flex gap-2 items-center">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Planned">Planned</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={perPage.toString()}
            onValueChange={(v) => {
              setPage(1);
              window.dispatchEvent(new CustomEvent('changePerPage', { detail: parseInt(v) }));
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center cursor-pointer" onClick={() => onSortChange?.('id')}>ID</TableHead>
            <TableHead className="text-center cursor-pointer" onClick={() => onSortChange?.('name')}>Name</TableHead>
            <TableHead className="text-center">PoP</TableHead>
            <TableHead className="text-center cursor-pointer" onClick={() => onSortChange?.('status')}>Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects === null ? (
            Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={5}><Skeleton className="h-10 w-full" /></TableCell>
              </TableRow>
            ))
          ) : projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-6">
                No projects found.
              </TableCell>
            </TableRow>
          ) : (
            projects.map((project) => (
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
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(project)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => onDelete(project.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex flex-col items-center justify-center gap-2 mt-6">
          <p className="text-sm text-muted-foreground">
            Showing {startIdx}–{endIdx} of {totalResults} projects
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                variant={page === i + 1 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
