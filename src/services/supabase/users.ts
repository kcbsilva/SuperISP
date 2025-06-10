// src/services/supabase/users.ts
'use server'; // Or remove if you intend to call these client-side only after initial fetch

import { supabase } from './db';
import type { Role, Permission, UserTemplate, UserTemplateData, UserProfile } from '@/types/users';

// --- Roles ---
export async function getRoles(): Promise<Role[]> {
  console.log('Supabase service: getRoles called');
  const { data, error } = await supabase.from('roles').select('*').order('name');
  if (error) {
    console.error('Error fetching roles:', error);
    throw new Error(error.message);
  }
  return data || [];
}

export async function addRole(roleData: Pick<Role, 'name' | 'description'>): Promise<Role> {
  console.log('Supabase service: addRole called with', roleData);
  const { data, error } = await supabase.from('roles').insert(roleData).select().single();
  if (error) {
    console.error('Error adding role:', error);
    throw new Error(error.message);
  }
  return data;
}

// --- Permissions ---
export async function getPermissions(): Promise<Permission[]> {
  console.log('Supabase service: getPermissions called');
  const { data, error } = await supabase.from('permissions').select('*').order('group_name').order('slug');
  if (error) {
    console.error('Error fetching permissions:', error);
    throw new Error(error.message);
  }
  return data || [];
}

// --- User Templates ---
export async function getUserTemplates(): Promise<UserTemplate[]> {
  console.log('Supabase service: getUserTemplates called');
  // This is a simplified fetch. In reality, you'd likely want to fetch related permissions too.
  const { data, error } = await supabase
    .from('user_templates')
    .select(`
      id,
      template_name,
      description,
      default_role_id,
      created_at,
      template_permissions ( permission_id )
    `)
    .order('template_name');

  if (error) {
    console.error('Error fetching user templates:', error);
    throw new Error(error.message);
  }
  return (data?.map(template => ({
    ...template,
    permissions: template.template_permissions.map((tp: any) => tp.permission_id)
  })) || []) as UserTemplate[];
}

export async function addUserTemplate(templateData: UserTemplateData): Promise<UserTemplate> {
  console.log('Supabase service: addUserTemplate called with', templateData);
  const { permission_ids, ...restOfTemplateData } = templateData;

  const { data: newTemplate, error: templateError } = await supabase
    .from('user_templates')
    .insert(restOfTemplateData)
    .select()
    .single();

  if (templateError) {
    console.error('Error adding user template:', templateError);
    throw new Error(templateError.message);
  }
  if (!newTemplate) {
    throw new Error('Failed to create template, no data returned.');
  }

  if (permission_ids && permission_ids.length > 0) {
    const templatePermissions = permission_ids.map(pid => ({
      template_id: newTemplate.id,
      permission_id: pid,
    }));
    const { error: permissionsError } = await supabase.from('template_permissions').insert(templatePermissions);
    if (permissionsError) {
      console.error('Error adding template permissions:', permissionsError);
      // Potentially delete the template if permissions fail? Or log and let user fix.
      throw new Error(permissionsError.message);
    }
  }
  return { ...newTemplate, permissions: permission_ids } as UserTemplate;
}

export async function updateUserTemplate(templateId: string, templateData: UserTemplateData): Promise<UserTemplate> {
  console.log('Supabase service: updateUserTemplate called for ID', templateId, 'with data', templateData);
  const { permission_ids, ...restOfTemplateData } = templateData;

  const { data: updatedTemplate, error: templateError } = await supabase
    .from('user_templates')
    .update(restOfTemplateData)
    .eq('id', templateId)
    .select()
    .single();

  if (templateError) {
    console.error('Error updating user template:', templateError);
    throw new Error(templateError.message);
  }
  if (!updatedTemplate) {
    throw new Error('Failed to update template, no data returned.');
  }

  // Manage permissions: delete existing, then add new ones
  const { error: deletePermError } = await supabase.from('template_permissions').delete().eq('template_id', templateId);
  if (deletePermError) {
    console.error('Error deleting old template permissions:', deletePermError);
    throw new Error(deletePermError.message);
  }

  if (permission_ids && permission_ids.length > 0) {
    const templatePermissions = permission_ids.map(pid => ({
      template_id: updatedTemplate.id,
      permission_id: pid,
    }));
    const { error: permissionsError } = await supabase.from('template_permissions').insert(templatePermissions);
    if (permissionsError) {
      console.error('Error adding updated template permissions:', permissionsError);
      throw new Error(permissionsError.message);
    }
  }
  return { ...updatedTemplate, permissions: permission_ids } as UserTemplate;
}

export async function deleteUserTemplate(templateId: string): Promise<void> {
  console.log('Supabase service: deleteUserTemplate called for ID', templateId);
  // Note: template_permissions will be deleted by CASCADE if set up in DB.
  // If not, delete them manually first:
  // await supabase.from('template_permissions').delete().eq('template_id', templateId);
  const { error } = await supabase.from('user_templates').delete().eq('id', templateId);
  if (error) {
    console.error('Error deleting user template:', error);
    throw new Error(error.message);
  }
}

// --- User Profiles ---
export async function getUserProfiles(): Promise<UserProfile[]> {
  console.log('Supabase service: getUserProfiles called');
  const { data, error } = await supabase
    .from('user_profiles')
    .select(`
      id,
      full_name,
      avatar_url,
      role_id,
      roles ( id, name, description ), 
      created_at,
      updated_at,
      users (email)
    `); // Fetch related role name

  if (error) {
    console.error('Error fetching user profiles:', error);
    throw new Error(error.message);
  }
  return (data?.map(profile => ({
    ...profile,
    email: (profile as any).users?.email, // Supabase returns joined tables as nested objects
    role: profile.roles ? {id: profile.roles.id, name: profile.roles.name, description: profile.roles.description, created_at: '' } : undefined
  })) || []) as UserProfile[];
}

// Placeholder for adding/updating user roles/profiles
// This is more complex as it involves auth.users and user_profiles
// For now, users are managed via Supabase Auth UI or API directly for creation.
// This function would be for updating profile details like role or full_name.
export async function updateUserProfile(userId: string, profileData: Partial<Pick<UserProfile, 'full_name' | 'role_id' | 'avatar_url'>>): Promise<UserProfile> {
    console.log('Supabase service: updateUserProfile called for ID', userId, 'with data', profileData);
    const { data, error } = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('id', userId)
        .select()
        .single();
    if (error) {
        console.error('Error updating user profile:', error);
        throw new Error(error.message);
    }
    return data as UserProfile;
}
