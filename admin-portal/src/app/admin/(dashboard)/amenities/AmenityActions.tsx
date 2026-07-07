"use client";

import { Edit3, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { deleteAmenity } from "@/app/admin/actions/amenities";

export default function AmenityActions({ amenity }: { amenity: any }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this amenity?")) {
      startTransition(async () => {
        const result = await deleteAmenity(amenity.id);
        if (result?.error) {
          alert("Error: " + result.error);
        }
      });
    }
  };

  return (
    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {isPending ? (
        <div className="p-1.5 text-[#b59b54]"><Loader2 size={14} className="animate-spin" /></div>
      ) : (
        <>
          <Link href={`/admin/amenities/${amenity.id}/edit`} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white/80 transition-all">
            <Edit3 size={14} />
          </Link>
          <button onClick={handleDelete} className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all">
            <Trash2 size={14} />
          </button>
        </>
      )}
    </div>
  );
}
