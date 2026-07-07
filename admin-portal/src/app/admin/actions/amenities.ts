"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteAmenity(id: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("amenities")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting amenity:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/amenities");
  return { success: true };
}

export async function createAmenity(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const title = formData.get("title") as string;
  if (!title) return { error: "Title is required." };

  const amenityData = {
    title,
    icon: formData.get("icon") as string,
    image_url: formData.get("image_url") as string,
  };

  const { error } = await supabase.from("amenities").insert([amenityData]);

  if (error) {
    console.error("Error creating amenity:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/amenities");
  return { success: true };
}

export async function updateAmenity(id: string, formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const amenityData = {
    title: formData.get("title") as string,
    icon: formData.get("icon") as string,
    image_url: formData.get("image_url") as string,
  };

  const { error } = await supabase
    .from("amenities")
    .update(amenityData)
    .eq("id", id);

  if (error) {
    console.error("Error updating amenity:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/amenities");
  return { success: true };
}
