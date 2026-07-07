"use client";

import { Edit3, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { deleteService, toggleServiceStatus } from "@/app/admin/actions/services";

export default function ServiceActions({ service }: { service: any }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this service?")) {
      startTransition(async () => {
        const result = await deleteService(service.id);
        if (result?.error) {
          alert("Error: " + result.error);
        }
      });
    }
  };

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleServiceStatus(service.id, !service.published);
      if (result?.error) {
        alert("Error: " + result.error);
      }
    });
  };

  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {isPending ? (
        <div className="p-2 text-[#b59b54]"><Loader2 size={14} className="animate-spin" /></div>
      ) : (
        <>
          <Link href={`/admin/services/${service.id}/edit`} className="p-2 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white/80 transition-all">
            <Edit3 size={14} />
          </Link>
          <button onClick={handleToggle} className="p-2 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white/80 transition-all">
            {service.published ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button onClick={handleDelete} className="p-2 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all">
            <Trash2 size={14} />
          </button>
        </>
      )}
    </div>
  );
}
