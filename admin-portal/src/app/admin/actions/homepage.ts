"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getHomepageContent() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("homepage_content")
    .select("*")
    .eq("id", 1)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching homepage content:", error);
  }
  return data;
}

export async function updateHomepageContent(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const payload: any = { id: 1 };
  const fields = [
    "hero_headline", "hero_subtitle", "hero_image_url", "hero_video_url", "hero_cta_text", "hero_cta_link",
    "stat_years", "stat_projects", "stat_families", "stat_area",
    "about_title", "about_description", "about_image_url",
    "why_feature_1", "why_feature_2", "why_feature_3", "why_feature_4",
    "cta_headline", "cta_description", "cta_button_text", "cta_button_link"
  ];

  fields.forEach(field => {
    payload[field] = formData.get(field) as string;
  });

  const { error } = await supabase
    .from("homepage_content")
    .upsert(payload, { onConflict: 'id' });

  if (error) {
    console.error("Error updating homepage content:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/homepage");
  return { success: true };
}
