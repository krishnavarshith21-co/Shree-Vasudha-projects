"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteProject(id: string) {
  const supabase = await createClient();

  // First verify user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting project:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/projects");
  return { success: true };
}

export async function createProject(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const status = formData.get("status") as string;
  
  if (!name || !slug || !status) {
    return { error: "Name, Slug, and Status are required." };
  }

  let gallery_images = [];
  try {
    const galleryRaw = formData.get("gallery_images") as string;
    if (galleryRaw) gallery_images = JSON.parse(galleryRaw);
  } catch (e) {}

  let floor_plans = [];
  try {
    const floorPlansRaw = formData.get("floor_plans") as string;
    if (floorPlansRaw) floor_plans = JSON.parse(floorPlansRaw);
  } catch (e) {}

  const projectData = {
    name,
    slug,
    status,
    location: formData.get("location") as string,
    config: formData.get("config") as string,
    price: formData.get("price") as string,
    area: formData.get("area") as string,
    description: formData.get("description") as string,
    highlights: formData.get("highlights") as string,
    image_url: formData.get("image_url") as string,
    gallery_images,
    floor_plans,
    brochure_url: formData.get("brochure_url") as string,
    video_url: formData.get("video_url") as string,
    published: formData.get("published") === "on",
    featured: formData.get("featured") === "on",
  };

  const { error } = await supabase.from("projects").insert([projectData]);

  if (error) {
    console.error("Error creating project:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/projects");
  return { success: true };
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  let gallery_images = [];
  try {
    const galleryRaw = formData.get("gallery_images") as string;
    if (galleryRaw) gallery_images = JSON.parse(galleryRaw);
  } catch (e) {}

  let floor_plans = [];
  try {
    const floorPlansRaw = formData.get("floor_plans") as string;
    if (floorPlansRaw) floor_plans = JSON.parse(floorPlansRaw);
  } catch (e) {}

  const projectData = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    status: formData.get("status") as string,
    location: formData.get("location") as string,
    config: formData.get("config") as string,
    price: formData.get("price") as string,
    area: formData.get("area") as string,
    description: formData.get("description") as string,
    highlights: formData.get("highlights") as string,
    image_url: formData.get("image_url") as string,
    gallery_images,
    floor_plans,
    brochure_url: formData.get("brochure_url") as string,
    video_url: formData.get("video_url") as string,
    published: formData.get("published") === "on",
    featured: formData.get("featured") === "on",
  };

  const { error } = await supabase
    .from("projects")
    .update(projectData)
    .eq("id", id);

  if (error) {
    console.error("Error updating project:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/projects");
  return { success: true };
}
