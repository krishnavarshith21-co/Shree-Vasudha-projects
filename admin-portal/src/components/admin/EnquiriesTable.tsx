"use client";

import { motion } from "framer-motion";
import { Search, Download, Mail, Phone, Eye, Archive, Trash2, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useState, useEffect, useTransition } from "react";
import { updateLeadStatus, deleteLead } from "@/app/admin/actions/leads";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  project_interest: string;
  message: string;
  status: "new" | "contacted" | "closed";
  created_at: string;
};

const statusConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  new: { color: "#b59b54", icon: AlertCircle, label: "New" },
  contacted: { color: "#4CAF50", icon: Clock, label: "Contacted" },
  closed: { color: "#666", icon: CheckCircle2, label: "Closed" },
};

export default function EnquiriesTable({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStatusChange = (id: string, newStatus: string) => {
    startTransition(async () => {
      const result = await updateLeadStatus(id, newStatus);
      if (result.success) {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus as any } : l)));
      } else {
        alert("Error updating lead status: " + result.error);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    startTransition(async () => {
      const result = await deleteLead(id);
      if (result.success) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
      } else {
        alert("Error deleting lead: " + result.error);
      }
    });
  };

  const filtered = leads
    .filter((e) => e.name.toLowerCase().includes(search.toLowerCase()) || (e.project_interest && e.project_interest.toLowerCase().includes(search.toLowerCase())))
    .filter((e) => selectedStatus === "all" || e.status === selectedStatus);

  const counts = {
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    closed: leads.filter((l) => l.status === "closed").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { key: "new", label: "New", count: counts.new, color: "#b59b54" },
          { key: "contacted", label: "Contacted", count: counts.contacted, color: "#4CAF50" },
          { key: "closed", label: "Closed", count: counts.closed, color: "#666" },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setSelectedStatus(selectedStatus === s.key ? "all" : s.key)}
            className={`p-4 rounded-xl border transition-all text-left ${
              selectedStatus === s.key
                ? "bg-white/[0.04] border-white/[0.12]"
                : "bg-[#141414] border-white/[0.06] hover:border-white/[0.1]"
            }`}
          >
            <p className="text-2xl text-white font-semibold">{s.count}</p>
            <p className="text-xs mt-1" style={{ color: s.color }}>
              {s.label} Enquiries
            </p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            type="text"
            placeholder="Search by name or project..."
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
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap min-w-[800px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Name", "Contact", "Project", "Message", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-semibold tracking-[0.15em] uppercase text-white/30 px-5 py-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((enq, i) => {
                const config = statusConfig[enq.status];
                const StatusIcon = config.icon;
                return (
                  <motion.tr
                    key={enq.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm text-white/90 font-medium">{enq.name}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <a href={`mailto:${enq.email}`} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white/80 transition-all">
                          <Mail size={13} />
                        </a>
                        <a href={`tel:${enq.phone.replace(/\s/g, "")}`} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white/80 transition-all">
                          <Phone size={13} />
                        </a>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-white/50">{enq.project_interest || "-"}</td>
                    <td className="px-5 py-4 text-sm text-white/40 max-w-[200px] truncate" title={enq.message}>
                      {enq.message}
                    </td>
                    <td className="px-5 py-4">
                      <div className="relative">
                        <select
                          value={enq.status}
                          onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                          disabled={isPending}
                          className="appearance-none inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg cursor-pointer outline-none pl-6 pr-4"
                          style={{
                            backgroundColor: `${config.color}15`,
                            color: config.color,
                          }}
                        >
                          <option value="new" className="bg-[#141414] text-white">New</option>
                          <option value="contacted" className="bg-[#141414] text-white">Contacted</option>
                          <option value="closed" className="bg-[#141414] text-white">Closed</option>
                        </select>
                        <StatusIcon size={12} className="absolute left-2 top-1/2 -translate-y-1/2" style={{ color: config.color }} />
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-white/30">
                      {mounted ? new Date(enq.created_at).toLocaleDateString("en-GB") : ""}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => alert(`Message from ${enq.name}:\n\n${enq.message}`)}
                          className="p-2 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white/80 transition-all"
                          title="View Message"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(enq.id)}
                          disabled={isPending}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-white/40 text-sm">
                    No enquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
