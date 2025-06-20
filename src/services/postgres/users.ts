// src/services/postgres/users.ts
'use server';
import { query } from './db';
import type { Role, Permission, UserTemplate, UserTemplateData, UserProfile } from '@/types/users';

// --- Roles ---
export async function getRoles(): Promise<Role[]> {
  console.log('PostgreSQL service: getRoles called');
  const { rows } = await query('SELECT * FROM roles ORDER BY name');
  return rows.map(row => ({
    ...row,
    id: row.id.toString(), // Ensure ID is string
    created_at: new Date(row.created_at).toISOString(),
  }));
}

export async function addRole(roleData: Pick<Role, 'name' | 'description'>): Promise<Role> {
  console.log('PostgreSQL service: addRole called with', roleData);
  const sql = 'INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING *;';
  const { rows } = await query(sql, [roleData.name, roleData.description]);
  return {
    ...rows[0],
    id: rows[0].id.toString(),
    created_at: new Date(rows[0].created_at).toISOString(),
  };
}

// --- Permissions ---
export async function getPermissions(): Promise<Permission[]> {
  console.log('PostgreSQL service: getPermissions called');
  // Using a static list as permissions are often predefined or managed differently
  const staticPermissions: Permission[] = [
    { id: 'perm_sub_view', slug: 'subscribers.view', group_name: 'Subscribers', created_at: new Date().toISOString(), description: 'Can view subscriber information' },
    { id: 'perm_sub_add', slug: 'subscribers.add', group_name: 'Subscribers', created_at: new Date().toISOString(), description: 'Can add new subscribers' },
    // Add other permissions as needed
  ];
  // In a real scenario, you might fetch these from a 'permissions' table:
  // const { rows } = await query('SELECT * FROM permissions ORDER BY group_name, slug');
  // return rows.map(row => ({ ...row, id: row.id.toString(), created_at: new Date(row.created_at).toISOString() }));
  return staticPermissions;
}

// --- User Templates ---
export async function getUserTemplates(): Promise<UserTemplate[]> {
  console.log('PostgreSQL service: getUserTemplates called');
  const { rows: templates } = await query(`
    SELECT ut.id, ut.template_name, ut.description, ut.default_role_id, ut.created_at,
           array_agg(tp.permission_id) FILTER (WHERE tp.permission_id IS NOT NULL) as permission_ids
    FROM user_templates ut
    LEFT JOIN template_permissions tp ON ut.id = tp.template_id
    GROUP BY ut.id, ut.template_name, ut.description, ut.default_role_id, ut.created_at
    ORDER BY ut.template_name;
  `);
  return templates.map(t => ({
    id: t.id.toString(),
    template_name: t.template_name,
    description: t.description,
    default_role_id: t.default_role_id ? t.default_role_id.toString() : null,
    created_at: new Date(t.created_at).toISOString(),
    permissions: t.permission_ids || [], // Ensure permissions is an array
  }));
}

export async function addUserTemplate(templateData: UserTemplateData): Promise<UserTemplate> {
  console.log('PostgreSQL service: addUserTemplate called with', templateData);
  const { permission_ids, ...restOfTemplateData } = templateData;

  const insertTemplateSql = 'INSERT INTO user_templates (template_name, description, default_role_id) VALUES ($1, $2, $3) RETURNING *;';
  const { rows: newTemplates } = await query(insertTemplateSql, [restOfTemplateData.template_name, restOfTemplateData.description, restOfTemplateData.default_role_id]);
  const newTemplate = newTemplates[0];

  if (!newTemplate) {
    throw new Error('Failed to create template, no data returned.');
  }

  if (permission_ids && permission_ids.length > 0) {
    const insertPermValues = permission_ids.map((pid, index) => `($${index * 2 + 1}, $${index * 2 + 2})`).join(',');
    const insertPermSql = `INSERT INTO template_permissions (template_id, permission_id) VALUES ${insertPermValues};`;
    const permValues = permission_ids.flatMap(pid => [newTemplate.id, pid]);
    await query(insertPermSql, permValues);
  }
  return {
    id: newTemplate.id.toString(),
    template_name: newTemplate.template_name,
    description: newTemplate.description,
    default_role_id: newTemplate.default_role_id ? newTemplate.default_role_id.toString() : null,
    created_at: new Date(newTemplate.created_at).toISOString(),
    permissions: permission_ids || [],
  };
}

export async function updateUserTemplate(templateId: string, templateData: UserTemplateData): Promise<UserTemplate> {
  console.log('PostgreSQL service: updateUserTemplate called for ID', templateId, 'with data', templateData);
  const { permission_ids, ...restOfTemplateData } = templateData;

  const updateTemplateSql = 'UPDATE user_templates SET template_name = $1, description = $2, default_role_id = $3, updated_at = NOW() WHERE id = $4 RETURNING *;';
  const { rows: updatedTemplates } = await query(updateTemplateSql, [restOfTemplateData.template_name, restOfTemplateData.description, restOfTemplateData.default_role_id, templateId]);
  const updatedTemplate = updatedTemplates[0];

  if (!updatedTemplate) {
    throw new Error('Failed to update template, no data returned.');
  }

  await query('DELETE FROM template_permissions WHERE template_id = $1;', [templateId]);

  if (permission_ids && permission_ids.length > 0) {
    const insertPermValues = permission_ids.map((pid, index) => `($${index * 2 + 1}, $${index * 2 + 2})`).join(',');
    const insertPermSql = `INSERT INTO template_permissions (template_id, permission_id) VALUES ${insertPermValues};`;
    const permValues = permission_ids.flatMap(pid => [updatedTemplate.id, pid]);
    await query(insertPermSql, permValues);
  }
  return {
    id: updatedTemplate.id.toString(),
    template_name: updatedTemplate.template_name,
    description: updatedTemplate.description,
    default_role_id: updatedTemplate.default_role_id ? updatedTemplate.default_role_id.toString() : null,
    created_at: new Date(updatedTemplate.created_at).toISOString(),
    permissions: permission_ids || [],
  };
}

export async function deleteUserTemplate(templateId: string): Promise<void> {
  console.log('PostgreSQL service: deleteUserTemplate called for ID', templateId);
  // Relies on cascading delete for template_permissions or manual deletion of related permissions first
  await query('DELETE FROM user_templates WHERE id = $1;', [templateId]);
}

// --- User Profiles ---
export async function getUserProfiles(): Promise<UserProfile[]> {
  console.log('PostgreSQL service: getUserProfiles called');
  // Assuming user_profiles references auth.users via a trigger or similar mechanism for email
  // For simplicity, we are not directly querying auth.users table here.
  // In a real system, `email` might come from `auth.users` or be on `user_profiles`.
  // This query assumes `email` is on `user_profiles`.
  const { rows } = await query(`
    SELECT up.id, up.full_name, up.email, up.avatar_url, up.role_id, up.created_at, up.updated_at,
           r.name as role_name, r.description as role_description
    FROM user_profiles up
    LEFT JOIN roles r ON up.role_id = r.id;
  `);
  return rows.map(profile => ({
    id: profile.id.toString(),
    full_name: profile.full_name,
    email: profile.email,
    avatar_url: profile.avatar_url,
    role_id: profile.role_id ? profile.role_id.toString() : null,
    role: profile.role_id ? {
      id: profile.role_id.toString(),
      name: profile.role_name,
      description: profile.role_description,
      created_at: new Date().toISOString(), // Placeholder, role created_at not directly fetched here
    } : undefined,
    created_at: new Date(profile.created_at).toISOString(),
    updated_at: new Date(profile.updated_at).toISOString(),
  }));
}

export async function updateUserProfile(userId: string, profileData: Partial<Pick<UserProfile, 'full_name' | 'role_id' | 'avatar_url'>>): Promise<UserProfile> {
    console.log('PostgreSQL service: updateUserProfile called for ID', userId, 'with data', profileData);
    const { full_name, role_id, avatar_url } = profileData;
    const sql = `
        UPDATE user_profiles 
        SET full_name = COALESCE($1, full_name), 
            role_id = $2,  -- Allow setting role_id to NULL
            avatar_url = COALESCE($3, avatar_url),
            updated_at = NOW()
        WHERE id = $4
        RETURNING *;
    `;
    const { rows } = await query(sql, [full_name, role_id, avatar_url, userId]);
    if (rows.length === 0) {
        throw new Error('Failed to update user profile, user not found or no change made.');
    }
    // Refetch the profile with role details for consistency
    const updatedProfile = await getUserProfiles().then(profiles => profiles.find(p => p.id === userId));
    if (!updatedProfile) {
        throw new Error('Failed to retrieve updated profile details.');
    }
    return updatedProfile;
}

// Placeholder for creating a user in auth.users table if needed,
// usually handled by your auth provider or a separate user management system.
// For this example, we assume user creation in auth.users is handled elsewhere (e.g., by a trigger after insert on user_profiles or manually).
// The 'email' for user_profiles will be assumed to be set by a trigger or manually for now, as direct creation in auth.users is complex.
export async function createAuthUserPlaceholder(email: string, passwordHash: string): Promise<{id: string, email: string}> {
    // THIS IS A PLACEHOLDER. DO NOT USE FOR PRODUCTION AUTH.
    // In a real system, use a proper auth provider or manage users securely in PostgreSQL.
    console.warn("createAuthUserPlaceholder is a non-functional placeholder.");
    return { id: `auth-user-${Date.now()}`, email };
}

// Simplified helper for creating a user profile locally. This does not handle
// password hashing or email verification and merely simulates user creation.
export interface NewUserInput {
  email: string;
  password: string;
  full_name: string;
  role_id?: string | null;
}

export async function createUser(userData: NewUserInput): Promise<UserProfile> {
  console.log('PostgreSQL service: createUser called with', userData);
  // In a real system you would hash the password and store credentials
  const authUser = await createAuthUserPlaceholder(userData.email, userData.password);
  const sql = `
      INSERT INTO user_profiles (id, email, full_name, role_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *;
  `;
  const { rows } = await query(sql, [authUser.id, userData.email, userData.full_name, userData.role_id]);
  const profile = rows[0] || { id: authUser.id, email: userData.email, full_name: userData.full_name, role_id: userData.role_id, avatar_url: null, created_at: new Date(), updated_at: new Date() };
  return {
      id: profile.id.toString(),
      full_name: profile.full_name,
      email: profile.email,
      avatar_url: profile.avatar_url,
      role_id: profile.role_id ? profile.role_id.toString() : null,
      created_at: new Date(profile.created_at).toISOString(),
      updated_at: new Date(profile.updated_at).toISOString(),
  };
}

// Placeholder for sending a password reset email.
export async function sendPasswordResetEmail(email: string): Promise<void> {
  console.warn('sendPasswordResetEmail placeholder for', email);
}

// Placeholder for updating a password using a reset token.
export async function updatePasswordWithToken(token: string, newPassword: string): Promise<void> {
  console.warn('updatePasswordWithToken placeholder called for token', token);
}
