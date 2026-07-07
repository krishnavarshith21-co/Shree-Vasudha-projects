import { createClient } from "./client";

/**
 * Uploads a file to the Supabase 'media' bucket.
 * Returns the public URL of the uploaded file.
 */
export async function uploadMedia(file: File): Promise<{ url: string | null; error: string | null }> {
  const supabase = createClient();
  
  // Generate a unique file name to prevent collisions
  const fileExtension = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
  const filePath = `uploads/${fileName}`;

  const { data, error } = await supabase.storage
    .from('media')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error("Storage upload error:", error);
    return { url: null, error: error.message };
  }

  // Get the public URL
  const { data: publicUrlData } = supabase.storage
    .from('media')
    .getPublicUrl(filePath);

  return { url: publicUrlData.publicUrl, error: null };
}
