// src/types/maps.ts

export interface Pop {
    id: string;
    name: string;
  }
  
  export interface MapProject {
    id: string;
    project_name: string;
    pop_id: string;
    pop_name?: string; // from join
    status: 'Active' | 'Planned' | 'Completed' | 'On Hold';
  }