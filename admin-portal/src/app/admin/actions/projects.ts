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

  // Fetch the project to get file URLs
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (project) {
    // Collect all possible file URLs
    const urls = [
      project.image_url,
      project.brochure_url,
      project.video_url,
      project.master_plan_url,
      project.meta_image,
      ...(project.gallery_images || []),
      ...(project.floor_plans || [])
    ].filter(Boolean);

    // Extract paths from public URLs
    // URL format: https://[project_ref].supabase.co/storage/v1/object/public/media/uploads/[filename]
    const paths = urls.map(url => {
      if (typeof url !== 'string') return null;
      const parts = url.split('/media/');
      return parts.length > 1 ? parts[1] : null;
    }).filter(Boolean) as string[];

    if (paths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove(paths);
      if (storageError) {
        console.error("Storage delete error:", storageError);
      }
    }
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

  let amenities_json = [];
  try {
    const amenitiesRaw = formData.get("amenities_json") as string;
    if (amenitiesRaw) amenities_json = JSON.parse(amenitiesRaw);
  } catch (e) {}

  let nearby_places_json = [];
  try {
    const nearbyRaw = formData.get("nearby_places_json") as string;
    if (nearbyRaw) nearby_places_json = JSON.parse(nearbyRaw);
  } catch (e) {}

  let timeline_json = [];
  try {
    const timelineRaw = formData.get("timeline_json") as string;
    if (timelineRaw) timeline_json = JSON.parse(timelineRaw);
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
    master_plan_url: formData.get("master_plan_url") as string,
    approvals: formData.get("approvals") as string,
    investment_rating: formData.get("investment_rating") as string,
    seo_title: formData.get("seo_title") as string,
    seo_description: formData.get("seo_description") as string,
    meta_image: formData.get("meta_image") as string,
    amenities_json,
    nearby_places_json,
    timeline_json,
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

  let amenities_json = [];
  try {
    const amenitiesRaw = formData.get("amenities_json") as string;
    if (amenitiesRaw) amenities_json = JSON.parse(amenitiesRaw);
  } catch (e) {}

  let nearby_places_json = [];
  try {
    const nearbyRaw = formData.get("nearby_places_json") as string;
    if (nearbyRaw) nearby_places_json = JSON.parse(nearbyRaw);
  } catch (e) {}

  let timeline_json = [];
  try {
    const timelineRaw = formData.get("timeline_json") as string;
    if (timelineRaw) timeline_json = JSON.parse(timelineRaw);
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
    master_plan_url: formData.get("master_plan_url") as string,
    approvals: formData.get("approvals") as string,
    investment_rating: formData.get("investment_rating") as string,
    seo_title: formData.get("seo_title") as string,
    seo_description: formData.get("seo_description") as string,
    meta_image: formData.get("meta_image") as string,
    amenities_json,
    nearby_places_json,
    timeline_json,
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
