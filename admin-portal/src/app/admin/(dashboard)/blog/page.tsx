"use client";
import { motion } from "framer-motion";
import { Plus, Edit3, Trash2, Eye, EyeOff, FileEdit } from "lucide-react";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
      if (data) setBlogs(data);
      setLoading(false);
    };
    fetchBlogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-white tracking-wide" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>Blog</h1>
          <p className="text-white/40 text-sm mt-1">Manage articles and content</p>
        </div>
        <button onClick={() => alert("Blog creation is coming soon!")} className="flex items-center gap-2 bg-gradient-to-r from-[#b59b54] to-[#9a8347] text-black text-sm font-semibold px-5 py-2.5 rounded-xl hover:from-[#c9ae6a] hover:to-[#b59b54] transition-all shadow-[0_0_20px_rgba(181,155,84,0.25)]">
          <Plus size={16} /> New Article
        </button>
      </div>
      <div className="space-y-3">
        {loading ? (
          <div className="text-center text-white/40 text-sm py-10">Loading blogs...</div>
        ) : blogs.length === 0 ? (
          <div className="text-center text-white/40 text-sm py-10">No articles found.</div>
        ) : blogs.map((b, i) => (
          <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-[#141414] border border-white/[0.06] rounded-xl p-5 flex items-center gap-4 hover:border-white/[0.12] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-[#b59b54]/10 flex items-center justify-center"><FileEdit size={18} className="text-[#b59b54]" /></div>
            <div className="flex-1">
              <p className="text-sm text-white/90 font-medium">{b.title}</p>
              <p className="text-xs text-white/35 mt-0.5">{new Date(b.created_at).toLocaleDateString("en-GB")}</p>
            </div>
            <span className={`text-[10px] px-2.5 py-1 rounded-full ${b.status === "Published" ? "bg-green-500/15 text-green-500" : "bg-yellow-500/15 text-yellow-500"}`}>{b.status}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
