"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateLeadStatus(id: string, status: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/contact");
  return { success: true };
}

export async function deleteLead(id: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/contact");
  return { success: true };
}
