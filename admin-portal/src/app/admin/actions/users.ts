"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  const admin = createAdminClient();
  
  // Get all auth users
  const { data: authData, error: authError } = await admin.auth.admin.listUsers();
  if (authError) return { error: authError.message };

  // Get user roles
  const { data: rolesData, error: rolesError } = await admin
    .from("user_roles")
    .select("*");
  if (rolesError) return { error: rolesError.message };

  const rolesMap = new Map(rolesData?.map((r) => [r.id, r]) || []);

  const users = authData.users.map((u) => {
    const roleRecord = rolesMap.get(u.id);
    return {
      id: u.id,
      email: u.email || "",
      name: roleRecord?.name || (u.email ? u.email.split("@")[0] : "Unknown"),
      role: roleRecord?.role || "Viewer",
      lastLogin: u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : "Never",
    };
  });

  return { users };
}

export async function createUser(data: { email: string; name: string; role: string; password?: string }) {
  const admin = createAdminClient();

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: data.email,
    password: data.password || "Vasudha@123", // Default password if none provided
    email_confirm: true,
  });

  if (authError) return { error: authError.message };
  if (!authData.user) return { error: "Failed to create user" };

  const { error: roleError } = await admin
    .from("user_roles")
    .insert([{ id: authData.user.id, name: data.name, role: data.role }]);

  if (roleError) return { error: roleError.message };

  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(id: string) {
  const admin = createAdminClient();

  const { error: authError } = await admin.auth.admin.deleteUser(id);
  if (authError) return { error: authError.message };

  // Note: user_roles should delete via CASCADE, but we can delete manually just in case
  await admin.from("user_roles").delete().eq("id", id);

  revalidatePath("/admin/users");
  return { success: true };
}
