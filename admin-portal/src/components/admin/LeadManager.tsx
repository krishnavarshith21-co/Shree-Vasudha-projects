"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Calendar, Trash2, CheckCircle, Clock } from "lucide-react";
import { useState, useTransition } from "react";
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

export default function LeadManager({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (id: string, newStatus: string) => {
    startTransition(async () => {
      const result = await updateLeadStatus(id, newStatus);
      if (result.success) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: newStatus as any } : l))
        );
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

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/40">
        <Mail className="w-12 h-12 mb-4 opacity-50" />
        <h3 className="text-xl text-white font-medium mb-1">No inquiries yet</h3>
        <p className="text-sm">When users fill out the contact form, they will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {leads.map((lead, i) => (
        <motion.div
          key={lead.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6 relative group"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">{lead.name}</h3>
              <p className="text-xs text-white/40 font-medium uppercase tracking-wider mt-1">
                Interested in: {lead.project_interest || "General Inquiry"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={lead.status}
                onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                disabled={isPending}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border appearance-none cursor-pointer outline-none transition-colors ${
                  lead.status === "new"
                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                    : lead.status === "contacted"
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    : "bg-green-500/10 text-green-400 border-green-500/20"
                }`}
              >
                <option value="new" className="bg-[#141414] text-white">● New</option>
                <option value="contacted" className="bg-[#141414] text-white">● Contacted</option>
                <option value="closed" className="bg-[#141414] text-white">● Closed</option>
              </select>
              
              <button
                onClick={() => handleDelete(lead.id)}
                disabled={isPending}
                className="text-white/20 hover:text-red-400 transition-colors p-2"
                title="Delete Inquiry"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <p className="text-sm text-white/70 mb-6 bg-white/[0.02] p-4 rounded-xl border border-white/[0.04]">
            {lead.message || "No message provided."}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-white/50">
            <a href={`mailto:${lead.email}`} className="flex items-center gap-2 hover:text-[#b59b54] transition-colors">
              <Mail size={14} /> {lead.email}
            </a>
            <a href={`tel:${lead.phone}`} className="flex items-center gap-2 hover:text-[#b59b54] transition-colors">
              <Phone size={14} /> {lead.phone}
            </a>
            <span className="flex items-center gap-2 ml-auto text-white/30 text-xs">
              <Calendar size={14} /> {new Date(lead.created_at).toLocaleDateString()}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
