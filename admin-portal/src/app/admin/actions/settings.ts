"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSettings(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const settingsObject = {
    company_name: formData.get("company_name") as string,
    whatsapp: formData.get("whatsapp") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    address: formData.get("address") as string,
    maps_link: formData.get("maps_link") as string,
    instagram: formData.get("instagram") as string,
    facebook: formData.get("facebook") as string,
    youtube: formData.get("youtube") as string,
    linkedin: formData.get("linkedin") as string,
    analytics_id: formData.get("analytics_id") as string,
    brand_color: formData.get("brand_color") as string,
    logo_url: formData.get("logo_url") as string,
    favicon_url: formData.get("favicon_url") as string,
  };

  const { error } = await supabase
    .from("settings")
    .update({ value: settingsObject })
    .eq('key', 'global');

  if (error) {
    console.error("Error updating settings:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/settings");
  return { success: true };
}
