"use client";
import { motion } from "framer-motion";
import { Save } from "lucide-react";

export default function SEOPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-light text-white tracking-wide" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>SEO Settings</h1>
        <p className="text-white/40 text-sm mt-1">Manage search engine optimization</p>
      </div>
      {["Homepage", "About", "Projects", "Services", "Amenities", "Contact"].map((page, i) => (
        <motion.div key={page} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
          className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6 space-y-4">
          <h3 className="text-white text-sm font-semibold border-b border-white/[0.06] pb-3">{page}</h3>
          <div><label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Meta Title</label><input placeholder={`${page} — Shree Vasudha Projects`} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#b59b54]/50 transition-colors" /></div>
          <div><label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Meta Description</label><textarea rows={2} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors" /></div>
          <div><label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Keywords</label><input placeholder="luxury, real estate, hyderabad..." className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#b59b54]/50 transition-colors" /></div>
          <div><label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Canonical URL</label><input className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors" /></div>
        </motion.div>
      ))}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-gradient-to-r from-[#b59b54] to-[#9a8347] text-black text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(181,155,84,0.25)]"><Save size={16} /> Save SEO Settings</button>
      </div>
    </div>
  );
}
