"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteService(id: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting service:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/services");
  return { success: true };
}

export async function createService(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const title = formData.get("title") as string;
  if (!title) return { error: "Title is required." };

  const serviceData = {
    title,
    description: formData.get("description") as string,
    icon: formData.get("icon") as string,
    image_url: formData.get("image_url") as string,
    published: formData.get("published") === "on",
  };

  const { error } = await supabase.from("services").insert([serviceData]);

  if (error) {
    console.error("Error creating service:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/services");
  return { success: true };
}

export async function updateService(id: string, formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const serviceData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    icon: formData.get("icon") as string,
    image_url: formData.get("image_url") as string,
    published: formData.get("published") === "on",
  };

  const { error } = await supabase
    .from("services")
    .update(serviceData)
    .eq("id", id);

  if (error) {
    console.error("Error updating service:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/services");
  return { success: true };
}

export async function toggleServiceStatus(id: string, published: boolean) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("services")
    .update({ published })
    .eq("id", id);

  if (error) {
    console.error("Error toggling service:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/services");
  return { success: true };
}
