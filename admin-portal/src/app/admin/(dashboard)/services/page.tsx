import { createClient } from "@/utils/supabase/server";
import { Plus, GripVertical, Briefcase } from "lucide-react";
import Link from "next/link";
import ServiceActions from "./ServiceActions";

export default async function ServicesPage() {
  const supabase = await createClient();
  const { data: services, error } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: false });

  if (error && error.code !== "42P01") {
    console.error("Error fetching services:", error.message);
  }

  const servicesList = services || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-white tracking-wide" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>Services</h1>
          <p className="text-white/40 text-sm mt-1">Manage website services section</p>
        </div>
        <Link href="/admin/services/new" className="flex items-center gap-2 bg-gradient-to-r from-[#b59b54] to-[#9a8347] text-black text-sm font-semibold px-5 py-2.5 rounded-xl hover:from-[#c9ae6a] hover:to-[#b59b54] transition-all shadow-[0_0_20px_rgba(181,155,84,0.25)]">
          <Plus size={16} /> Add Service
        </Link>
      </div>
      
      {servicesList.length === 0 ? (
        <div className="text-center py-12 border border-white/[0.06] border-dashed rounded-2xl bg-white/[0.02]">
          <Briefcase size={32} className="mx-auto text-white/20 mb-3" />
          <p className="text-white/60 text-sm mb-4">No services created yet.</p>
          <Link href="/admin/services/new" className="text-[#b59b54] text-sm hover:underline">Create your first service</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {servicesList.map((s: any) => (
            <div key={s.id} className="bg-[#141414] border border-white/[0.06] rounded-xl p-5 flex items-center gap-4 hover:border-white/[0.12] transition-all group">
              
              {s.image_url ? (
                <img src={s.image_url} alt={s.title} className="w-10 h-10 rounded-xl object-cover border border-white/[0.06]" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-[#b59b54]/10 flex items-center justify-center"><Briefcase size={18} className="text-[#b59b54]" /></div>
              )}
              
              <div className="flex-1">
                <p className="text-sm text-white/90 font-medium">{s.title}</p>
                <p className="text-xs text-white/35 mt-0.5">{s.description?.substring(0, 80) || "No description"}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${s.published ? "bg-green-500/15 text-green-500" : "bg-white/5 text-white/30"}`}>
                {s.published ? "Active" : "Disabled"}
              </span>
              <ServiceActions service={s} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
