"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAboutContent() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("about_page")
    .select("*")
    .eq("id", 1)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching about page:", error);
  }
  return data;
}

export async function updateAboutContent(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const payload = {
    id: 1,
    mission_statement: formData.get("mission_statement"),
    vision_statement: formData.get("vision_statement"),
    story_title: formData.get("story_title"),
    story_description: formData.get("story_description"),
    story_image_url: formData.get("story_image_url"),
    chairman_name: formData.get("chairman_name"),
    chairman_message: formData.get("chairman_message"),
    chairman_image_url: formData.get("chairman_image_url"),
  };

  // Upsert the content
  const { error } = await supabase
    .from("about_page")
    .upsert(payload, { onConflict: 'id' });

  if (error) {
    console.error("Error updating about page:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/about");
  return { success: true };
}
