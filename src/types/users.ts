// src/types/users.ts

// Describes an individual permission
export interface Permission {
  id: string; // UUID
  slug: string; // e.g., 'subscribers.view'
  description?: string | null;
  group_name?: string | null; // For UI grouping
  created_at: string; // ISO date string
}

// Describes a user role
export interface Role {
  id: string; // UUID
  name: string;
  description?: string | null;
  created_at: string; // ISO date string
  permissions?: Permission[]; // Permissions associated with this role (fetched separately or via join)
}

// Describes a user template
export interface UserTemplate {
  id: string; // UUID
  template_name: string;
  description?: string | null;
  default_role_id?: string | null; // UUID, Foreign Key to roles.id
  created_at: string; // ISO date string
  permissions?: string[]; // Array of permission slugs or IDs associated with this template
}

// Data needed to create or update a user template
export interface UserTemplateData {
  template_name: string;
  description?: string | null;
  default_role_id?: string | null;
  permission_ids: string[]; // Array of permission UUIDs
}

// User profile data extending Supabase auth.users
export interface UserProfile {
  id: string; // UUID, matches auth.users.id
  full_name?: string | null;
  email?: string | null; // Email will now be directly on user_profiles
  role_id?: string | null; // UUID, Foreign Key to roles.id
  avatar_url?: string | null;
  role?: Role; // Populated role object
  created_at: string;
  updated_at: string;
}
