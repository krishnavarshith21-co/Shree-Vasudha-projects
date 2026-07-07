"use client";

import { motion } from "framer-motion";
import { Save, Image as ImageIcon, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { updateAboutContent } from "@/app/admin/actions/about";
import { createClient } from "@/utils/supabase/client";

export default function AboutManager({ initialData }: { initialData: any }) {
  const [formData, setFormData] = useState({
    mission_statement: initialData?.mission_statement || "",
    vision_statement: initialData?.vision_statement || "",
    story_title: initialData?.story_title || "",
    story_description: initialData?.story_description || "",
    story_image_url: initialData?.story_image_url || "",
    chairman_name: initialData?.chairman_name || "",
    chairman_message: initialData?.chairman_message || "",
    chairman_image_url: initialData?.chairman_image_url || "",
  });
  
  const [isPending, startTransition] = useTransition();
  const [isUploadingStoryImage, setIsUploadingStoryImage] = useState(false);
  const [isUploadingChairmanImage, setIsUploadingChairmanImage] = useState(false);
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "story_image_url" | "chairman_image_url") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (field === "story_image_url") setIsUploadingStoryImage(true);
    else setIsUploadingChairmanImage(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `about/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("media").getPublicUrl(filePath);
      setFormData(prev => ({ ...prev, [field]: data.publicUrl }));
    } catch (error: any) {
      alert("Error uploading image: " + error.message);
    } finally {
      if (field === "story_image_url") setIsUploadingStoryImage(false);
      else setIsUploadingChairmanImage(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });

      const res = await updateAboutContent(form);
      if (res.success) {
        alert("About page updated successfully!");
      } else {
        alert("Error updating: " + res.error);
      }
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-light text-white tracking-wide" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>About Page</h1>
        <p className="text-white/40 text-sm mt-1">Edit About page content</p>
      </div>
      
      {/* Mission & Vision */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6">
        <h3 className="text-white text-sm font-semibold border-b border-white/[0.06] pb-3 mb-5">Mission & Vision</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Mission Statement</label>
            <textarea rows={3} value={formData.mission_statement} onChange={e => setFormData({...formData, mission_statement: e.target.value})} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Vision Statement</label>
            <textarea rows={3} value={formData.vision_statement} onChange={e => setFormData({...formData, vision_statement: e.target.value})} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors" />
          </div>
        </div>
      </motion.div>

      {/* Our Story */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6">
        <h3 className="text-white text-sm font-semibold border-b border-white/[0.06] pb-3 mb-5">Our Story</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Story Title</label>
            <input value={formData.story_title} onChange={e => setFormData({...formData, story_title: e.target.value})} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Story Description</label>
            <textarea rows={5} value={formData.story_description} onChange={e => setFormData({...formData, story_description: e.target.value})} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Company Story Image</label>
            {formData.story_image_url ? (
              <div className="relative w-full h-[200px] rounded-xl overflow-hidden mb-2 border border-white/[0.12]">
                <img src={formData.story_image_url} alt="Story" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setFormData({...formData, story_image_url: ""})} className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-lg hover:bg-black/80">Change</button>
              </div>
            ) : (
              <label className="w-full h-[120px] bg-white/[0.04] border border-dashed border-white/[0.12] rounded-xl flex items-center justify-center text-white/30 text-xs cursor-pointer hover:border-[#b59b54]/50 transition-colors relative">
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, "story_image_url")} disabled={isUploadingStoryImage} />
                {isUploadingStoryImage ? <Loader2 size={16} className="animate-spin" /> : <><ImageIcon size={14} className="mr-2" /> Upload Image</>}
              </label>
            )}
          </div>
        </div>
      </motion.div>

      {/* Chairman's Message */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6">
        <h3 className="text-white text-sm font-semibold border-b border-white/[0.06] pb-3 mb-5">Chairman's Message</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Chairman Name</label>
            <input value={formData.chairman_name} onChange={e => setFormData({...formData, chairman_name: e.target.value})} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Chairman Message</label>
            <textarea rows={4} value={formData.chairman_message} onChange={e => setFormData({...formData, chairman_message: e.target.value})} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Chairman Portrait Image</label>
            {formData.chairman_image_url ? (
              <div className="relative w-48 h-64 rounded-xl overflow-hidden mb-2 border border-white/[0.12]">
                <img src={formData.chairman_image_url} alt="Chairman" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setFormData({...formData, chairman_image_url: ""})} className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-lg hover:bg-black/80">Change</button>
              </div>
            ) : (
              <label className="w-48 h-64 bg-white/[0.04] border border-dashed border-white/[0.12] rounded-xl flex flex-col items-center justify-center text-white/30 text-xs cursor-pointer hover:border-[#b59b54]/50 transition-colors relative">
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, "chairman_image_url")} disabled={isUploadingChairmanImage} />
                {isUploadingChairmanImage ? <Loader2 size={16} className="animate-spin" /> : <><ImageIcon size={18} className="mb-2" /> Upload Portrait</>}
              </label>
            )}
          </div>
        </div>
      </motion.div>

      <div className="flex justify-end">
        <button type="submit" disabled={isPending} className="flex items-center gap-2 bg-gradient-to-r from-[#b59b54] to-[#9a8347] text-black text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(181,155,84,0.25)] hover:from-[#c9ae6a] hover:to-[#b59b54] disabled:opacity-50">
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
