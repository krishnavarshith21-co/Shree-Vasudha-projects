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
    meta_pixel: formData.get("meta_pixel") as string,
    brand_color: formData.get("brand_color") as string,
    secondary_color: formData.get("secondary_color") as string,
    button_color: formData.get("button_color") as string,
    accent_color: formData.get("accent_color") as string,
    default_theme: formData.get("default_theme") as string,
    business_hours: formData.get("business_hours") as string,
    copyright: formData.get("copyright") as string,
    footer_text: formData.get("footer_text") as string,
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
