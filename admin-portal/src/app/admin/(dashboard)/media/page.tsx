"use client";
import { motion } from "framer-motion";
import { Upload, Search, FolderOpen, Image, FileVideo, FileText, Trash2, Grid3X3, List } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { uploadMedia } from "@/utils/supabase/storage";

const typeIcons: Record<string, React.ElementType> = { image: Image, video: FileVideo, pdf: FileText };

export default function MediaPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchMedia = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.storage.from('media').list('uploads', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (data) {
      // Filter out empty folder placeholder if any
      const files = data.filter(f => f.name !== '.emptyFolderPlaceholder');
      setMediaItems(files);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    for (let i = 0; i < files.length; i++) {
      await uploadMedia(files[i]);
    }
    await fetchMedia();
    setIsUploading(false);
  };

  const handleDelete = async (name: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    
    const { error } = await supabase.storage.from('media').remove([`uploads/${name}`]);
    if (!error) {
      await fetchMedia();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-white tracking-wide" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>Media Library</h1>
          <p className="text-white/40 text-sm mt-1">Upload and manage files</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-[#b59b54] to-[#9a8347] text-black text-sm font-semibold px-5 py-2.5 rounded-xl hover:from-[#c9ae6a] hover:to-[#b59b54] transition-all shadow-[0_0_20px_rgba(181,155,84,0.25)]">
          <Upload size={16} /> Upload Files
        </button>
      </div>
      {/* Upload Area */}
      <div className="relative border-2 border-dashed border-white/[0.08] rounded-2xl p-12 text-center hover:border-[#b59b54]/30 transition-colors bg-white/[0.02]">
        <input 
          type="file" 
          multiple 
          onChange={handleUpload}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10" 
        />
        {isUploading ? (
          <div className="flex flex-col items-center">
            <Upload size={32} className="mx-auto text-[#b59b54] mb-3 animate-bounce" />
            <p className="text-sm text-[#b59b54]">Uploading files...</p>
          </div>
        ) : (
          <>
            <Upload size={32} className="mx-auto text-white/20 mb-3" />
            <p className="text-sm text-white/50">Drag & drop files here or click to upload</p>
            <p className="text-xs text-white/25 mt-1">PNG, JPG, PDF, MP4 up to 50MB</p>
          </>
        )}
      </div>
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 min-w-[300px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
            <input type="text" placeholder="Search files..." className="w-full bg-[#141414] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/[0.12] transition-colors" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#141414] border border-white/[0.06] rounded-xl text-white/50 text-sm hover:border-white/[0.12] transition-colors"><FolderOpen size={14} /> All Files</button>
        </div>
        <div className="flex items-center gap-1 bg-[#141414] border border-white/[0.06] rounded-xl p-1">
          <button onClick={() => setView("grid")} className={`p-2 rounded-lg transition-colors ${view === "grid" ? "bg-white/[0.08] text-white" : "text-white/40"}`}><Grid3X3 size={14} /></button>
          <button onClick={() => setView("list")} className={`p-2 rounded-lg transition-colors ${view === "list" ? "bg-white/[0.08] text-white" : "text-white/40"}`}><List size={14} /></button>
        </div>
      </div>
      {/* Grid */}
      {isLoading ? (
        <div className="text-center text-white/30 py-12">Loading media...</div>
      ) : mediaItems.length === 0 ? (
        <div className="text-center text-white/30 py-12">No media found. Upload something to get started.</div>
      ) : (
        <div className={view === "grid" ? "grid grid-cols-2 md:grid-cols-4 gap-4" : "space-y-2"}>
          {mediaItems.map((item, i) => {
            const ext = item.name.split('.').pop()?.toLowerCase();
            const type = ext === 'pdf' ? 'pdf' : ['mp4', 'webm'].includes(ext || '') ? 'video' : 'image';
            const TypeIcon = typeIcons[type] || Image;
            const publicUrl = supabase.storage.from('media').getPublicUrl(`uploads/${item.name}`).data.publicUrl;
            
            return view === "grid" ? (
              <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
                className="bg-[#141414] border border-white/[0.06] rounded-xl overflow-hidden hover:border-white/[0.12] transition-all group relative">
                {type === 'image' ? (
                  <img src={publicUrl} alt={item.name} className="w-full h-32 object-cover" />
                ) : (
                  <div className="h-32 bg-white/[0.02] flex items-center justify-center"><TypeIcon size={32} className="text-white/15" /></div>
                )}
                <div className="p-3">
                  <p className="text-xs text-white/70 truncate">{item.name}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">{(item.metadata?.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button onClick={() => handleDelete(item.name)} className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg hover:bg-red-500/80 text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={12} /></button>
              </motion.div>
            ) : (
              <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="bg-[#141414] border border-white/[0.06] rounded-xl p-4 flex items-center gap-4 hover:border-white/[0.12] transition-all group">
                {type === 'image' ? (
                  <img src={publicUrl} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                ) : (
                  <TypeIcon size={18} className="text-white/30 w-10 h-10" />
                )}
                <p className="text-sm text-white/70 flex-1 truncate">{item.name}</p>
                <p className="text-xs text-white/30">{(item.metadata?.size / 1024 / 1024).toFixed(2)} MB</p>
                <p className="text-xs text-white/20">{new Date(item.created_at).toLocaleDateString()}</p>
                <button onClick={() => handleDelete(item.name)} className="p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
