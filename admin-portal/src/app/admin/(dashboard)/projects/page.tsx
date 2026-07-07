import { createClient } from "@/utils/supabase/server";
import { Plus } from "lucide-react";
import Link from "next/link";
import ProjectsTable from "@/components/admin/ProjectsTable";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error && error.code !== "42P01") { // 42P01 means table does not exist
    console.log("Error fetching projects:", JSON.stringify(error, null, 2));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-light text-white tracking-wide"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            Projects
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Manage all real estate projects
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 bg-gradient-to-r from-[#b59b54] to-[#9a8347] text-black text-sm font-semibold px-5 py-2.5 rounded-xl hover:from-[#c9ae6a] hover:to-[#b59b54] transition-all shadow-[0_0_20px_rgba(181,155,84,0.25)]"
        >
          <Plus size={16} />
          Add Project
        </Link>
      </div>

      {error?.code === "42P01" ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl">
          <h3 className="font-semibold text-red-400 mb-2">Database Setup Required</h3>
          <p className="text-sm">Please run the SQL script provided in the implementation plan to create the 'projects' table.</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl">
          <h3 className="font-semibold text-red-400 mb-2">Database Error</h3>
          <p className="text-sm">There was an error fetching projects from Supabase. Make sure you ran the SQL script!</p>
          <pre className="mt-4 p-4 bg-black/20 rounded-xl text-xs overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      ) : (
        <ProjectsTable projects={projects || []} />
      )}
    </div>
  );
}
