// src/app/maps/projects/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  // CardTitle, // Removed
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { FileCode, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { Badge } from '@/components/ui/badge'; // For PoP display or status

interface MapProject {
  id: string;
  projectName: string;
  popName: string; // Representing the PoP associated with the project
  status: 'Active' | 'Planned' | 'Completed' | 'On Hold'; // Example statuses
}

// Placeholder data - replace with actual data fetching
const placeholderProjects: MapProject[] = [
  { id: 'proj-001', projectName: 'Downtown Fiber Expansion', popName: 'Central Hub', status: 'Active' },
  { id: 'proj-002', projectName: 'North Suburb FTTH Rollout', popName: 'North Branch', status: 'Planned' },
  { id: 'proj-003', projectName: 'Industrial Park Connectivity', popName: 'Central Hub', status: 'Completed' },
];


export default function ProjectsPage() { // Renamed component to ProjectsPage
  const { t } = useLocale();
  const iconSize = "h-3 w-3";

  const handleAddProject = () => {
    console.log('Add new project clicked');
    // Implement dialog or navigation to add form
  };

  const getStatusBadgeVariant = (status: MapProject['status']) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Planned': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-primary/10 text-primary';
      case 'On Hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
            <FileCode className={`${iconSize} text-primary`} />
            {t('maps_elements.projects_page_title', 'Projects')} {/* Changed title key or default text */}
        </h1>
        <Button onClick={handleAddProject} className="bg-green-600 hover:bg-green-700 text-white" size="sm">
            <PlusCircle className={`mr-2 ${iconSize}`} /> {t('maps_elements.add_project_button', 'Add Project')}
        </Button>
      </div>

      <Card>
        {/* CardHeader and CardTitle removed to eliminate "Project List" */}
        <CardContent className="pt-6"> {/* Added pt-6 to CardContent since CardHeader is removed */}
           {placeholderProjects.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24 text-xs">{t('maps_elements.project_table_header_id', 'ID')}</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.project_table_header_name', 'Project Name')}</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.project_table_header_pop', 'PoP')}</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.project_table_header_status', 'Status')}</TableHead>
                    <TableHead className="text-right w-28 text-xs">{t('maps_elements.project_table_header_actions', 'Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {placeholderProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-mono text-muted-foreground text-xs">{project.id}</TableCell>
                      <TableCell className="font-medium text-xs">{project.projectName}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{project.popName}</TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="outline" className={`text-xs ${getStatusBadgeVariant(project.status)} border-transparent`}>
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Edit className={iconSize} />
                          <span className="sr-only">{t('maps_elements.action_edit_project', 'Edit Project')}</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                          <Trash2 className={iconSize} />
                          <span className="sr-only">{t('maps_elements.action_delete_project', 'Delete Project')}</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8 text-xs">
              {t('maps_elements.no_projects_found', 'No projects found. Click "Add Project" to create one.')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
