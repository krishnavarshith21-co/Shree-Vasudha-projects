import { createClient } from "@/utils/supabase/server";
import { Plus, GripVertical, TreePalm } from "lucide-react";
import Link from "next/link";
import AmenityActions from "./AmenityActions";

export default async function AmenitiesPage() {
  const supabase = await createClient();
  const { data: amenities, error } = await supabase
    .from("amenities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error && error.code !== "42P01") {
    console.error("Error fetching amenities:", error.message);
  }

  const amenitiesList = amenities || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-white tracking-wide" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>Amenities</h1>
          <p className="text-white/40 text-sm mt-1">Manage project amenities</p>
        </div>
        <Link href="/admin/amenities/new" className="flex items-center gap-2 bg-gradient-to-r from-[#b59b54] to-[#9a8347] text-black text-sm font-semibold px-5 py-2.5 rounded-xl hover:from-[#c9ae6a] hover:to-[#b59b54] transition-all shadow-[0_0_20px_rgba(181,155,84,0.25)]">
          <Plus size={16} /> Add Amenity
        </Link>
      </div>

      {amenitiesList.length === 0 ? (
        <div className="text-center py-12 border border-white/[0.06] border-dashed rounded-2xl bg-white/[0.02]">
          <TreePalm size={32} className="mx-auto text-white/20 mb-3" />
          <p className="text-white/60 text-sm mb-4">No amenities created yet.</p>
          <Link href="/admin/amenities/new" className="text-[#b59b54] text-sm hover:underline">Create your first amenity</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {amenitiesList.map((a: any) => (
            <div key={a.id} className="bg-[#141414] border border-white/[0.06] rounded-xl p-5 hover:border-white/[0.12] transition-all group">
              <div className="flex items-start justify-between mb-3">
                {a.image_url ? (
                  <img src={`/${a.image_url}`} alt={a.title} className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                  <span className="text-2xl">{a.icon || "✨"}</span>
                )}
                <div className="flex gap-1">
                  <AmenityActions amenity={a} />
                </div>
              </div>
              <p className="text-sm text-white/90 font-medium">{a.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
