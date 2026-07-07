import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import AmenityForm from "@/components/admin/AmenityForm";

export default async function EditAmenityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: amenity, error } = await supabase
    .from("amenities")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !amenity) {
    notFound();
  }

  return <AmenityForm amenity={amenity} />;
}
