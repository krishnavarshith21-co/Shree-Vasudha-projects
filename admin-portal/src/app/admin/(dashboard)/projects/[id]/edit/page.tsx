import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import EditProjectForm from "@/components/admin/EditProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !project) {
    console.error("Error fetching project:", error);
    notFound();
  }

  return <EditProjectForm project={project} />;
}
