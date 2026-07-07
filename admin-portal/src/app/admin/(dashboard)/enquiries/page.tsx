import { createClient } from "@/utils/supabase/server";
import EnquiriesTable from "@/components/admin/EnquiriesTable";
import { Download } from "lucide-react";

export default async function EnquiriesPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-light text-white tracking-wide"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            Enquiries
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Manage customer enquiries and leads
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#141414] border border-white/[0.06] rounded-xl text-white/50 text-sm hover:border-white/[0.12] transition-colors">
            <Download size={14} />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#141414] border border-white/[0.06] rounded-xl text-white/50 text-sm hover:border-white/[0.12] transition-colors">
            <Download size={14} />
            Export Excel
          </button>
        </div>
      </div>

      <EnquiriesTable initialLeads={leads || []} />
    </div>
  );
}
