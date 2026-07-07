"use client";

import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Edit3,
  Trash2,
  Copy,
  Eye,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Hammer,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { deleteProject } from "@/app/admin/actions/projects";

type Project = {
  id: string;
  name: string;
  slug: string;
  status: string;
  location: string;
  config: string;
  price: string;
  published: boolean;
};

const statusConfig: Record<string, { color: string; icon: React.ElementType }> = {
  Ongoing: { color: "#4CAF50", icon: Hammer },
  Completed: { color: "#b59b54", icon: CheckCircle2 },
  Upcoming: { color: "#2196F3", icon: Clock },
};

export default function ProjectsTable({ projects }: { projects: Project[] }) {
  const [search, setSearch] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    setIsDeleting(id);
    const result = await deleteProject(id);
    
    if (result.error) {
      alert("Error deleting project: " + result.error);
    }
    setIsDeleting(null);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#141414] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/[0.12] transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#141414] border border-white/[0.06] rounded-2xl overflow-hidden"
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left text-[10px] font-semibold tracking-[0.15em] uppercase text-white/30 px-6 py-4">
                Project
              </th>
              <th className="text-left text-[10px] font-semibold tracking-[0.15em] uppercase text-white/30 px-4 py-4">
                Status
              </th>
              <th className="text-left text-[10px] font-semibold tracking-[0.15em] uppercase text-white/30 px-4 py-4">
                Location
              </th>
              <th className="text-left text-[10px] font-semibold tracking-[0.15em] uppercase text-white/30 px-4 py-4">
                Price Range
              </th>
              <th className="text-left text-[10px] font-semibold tracking-[0.15em] uppercase text-white/30 px-4 py-4">
                Published
              </th>
              <th className="text-right text-[10px] font-semibold tracking-[0.15em] uppercase text-white/30 px-6 py-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-white/40 text-sm">
                  No projects found. Add your first project!
                </td>
              </tr>
            ) : (
              filtered.map((project, i) => {
                const config = statusConfig[project.status] || { color: "#fff", icon: CheckCircle2 };
                const StatusIcon = config.icon;
                return (
                  <motion.tr
                    key={project.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center text-white/30 text-sm font-medium uppercase">
                          {project.name[0]}
                        </div>
                        <div>
                          <p className="text-sm text-white/90 font-medium">{project.name}</p>
                          <p className="text-[10px] text-white/30">{project.config}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg"
                        style={{
                          backgroundColor: `${config.color}15`,
                          color: config.color,
                        }}
                      >
                        <StatusIcon size={12} />
                        {project.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-white/50">{project.location}</td>
                    <td className="px-4 py-4 text-sm text-white/50">{project.price}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          project.published ? "bg-green-500" : "bg-white/20"
                        }`}
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/projects/${project.id}/edit`} className="p-2 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white/80 transition-all" title="Edit">
                          <Edit3 size={14} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(project.id)}
                          disabled={isDeleting === project.id}
                          className={`p-2 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all ${isDeleting === project.id ? "opacity-50 cursor-not-allowed" : ""}`} 
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
