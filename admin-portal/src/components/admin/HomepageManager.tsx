"use client";

import { motion } from "framer-motion";
import { Save, Image as ImageIcon, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { updateHomepageContent } from "@/app/admin/actions/homepage";
import { createClient } from "@/utils/supabase/client";

export default function HomepageManager({ initialData }: { initialData: any }) {
  const [formData, setFormData] = useState({
    hero_headline: initialData?.hero_headline || "",
    hero_subtitle: initialData?.hero_subtitle || "",
    hero_image_url: initialData?.hero_image_url || "",
    hero_video_url: initialData?.hero_video_url || "",
    hero_cta_text: initialData?.hero_cta_text || "",
    hero_cta_link: initialData?.hero_cta_link || "",
    stat_years: initialData?.stat_years || "",
    stat_projects: initialData?.stat_projects || "",
    stat_families: initialData?.stat_families || "",
    stat_area: initialData?.stat_area || "",
    about_title: initialData?.about_title || "",
    about_description: initialData?.about_description || "",
    about_image_url: initialData?.about_image_url || "",
    why_feature_1: initialData?.why_feature_1 || "",
    why_feature_2: initialData?.why_feature_2 || "",
    why_feature_3: initialData?.why_feature_3 || "",
    why_feature_4: initialData?.why_feature_4 || "",
    cta_headline: initialData?.cta_headline || "",
    cta_description: initialData?.cta_description || "",
    cta_button_text: initialData?.cta_button_text || "",
    cta_button_link: initialData?.cta_button_link || "",
  });

  const [isPending, startTransition] = useTransition();
  const [uploadingState, setUploadingState] = useState<Record<string, boolean>>({});
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingState(prev => ({ ...prev, [field]: true }));

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `homepage/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("media").getPublicUrl(filePath);
      setFormData(prev => ({ ...prev, [field]: data.publicUrl }));
    } catch (error: any) {
      alert("Error uploading file: " + error.message);
    } finally {
      setUploadingState(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });

      const res = await updateHomepageContent(form);
      if (res.success) {
        alert("Homepage content updated successfully!");
      } else {
        alert("Error updating: " + res.error);
      }
    });
  };

  const renderInput = (field: string, label: string, isTextArea = false) => (
    <div>
      <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">{label}</label>
      {isTextArea ? (
        <textarea rows={3} value={(formData as any)[field]} onChange={e => setFormData({...formData, [field]: e.target.value})} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors" />
      ) : (
        <input type="text" value={(formData as any)[field]} onChange={e => setFormData({...formData, [field]: e.target.value})} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors" />
      )}
    </div>
  );

  const renderMediaUpload = (field: string, label: string) => {
    const isUploading = uploadingState[field];
    const value = (formData as any)[field];

    return (
      <div>
        <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">{label}</label>
        {value ? (
          <div className="relative w-full h-[120px] rounded-xl overflow-hidden mb-2 border border-white/[0.12]">
            {field.includes('video') ? (
              <video src={value} className="w-full h-full object-cover" muted loop autoPlay playsInline />
            ) : (
              <img src={value} alt={label} className="w-full h-full object-cover" />
            )}
            <button type="button" onClick={() => setFormData({...formData, [field]: ""})} className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-lg hover:bg-black/80 text-xs">Remove</button>
          </div>
        ) : (
          <label className="w-full h-[80px] bg-white/[0.04] border border-dashed border-white/[0.12] rounded-xl flex items-center justify-center text-white/30 text-xs cursor-pointer hover:border-[#b59b54]/50 transition-colors relative">
            <input type="file" className="hidden" accept={field.includes('video') ? "video/*" : "image/*"} onChange={(e) => handleUpload(e, field)} disabled={isUploading} />
            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <><ImageIcon size={14} className="mr-2" /> Upload {field.includes('video') ? 'Video' : 'Image'}</>}
          </label>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-light text-white tracking-wide" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>Homepage</h1>
        <p className="text-white/40 text-sm mt-1">Edit all homepage sections</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6">
        <h3 className="text-white text-sm font-semibold border-b border-white/[0.06] pb-3 mb-5">Hero Section</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">{renderInput("hero_headline", "Headline", true)}</div>
          <div className="col-span-2">{renderInput("hero_subtitle", "Subtitle", true)}</div>
          {renderMediaUpload("hero_image_url", "Hero Image")}
          {renderMediaUpload("hero_video_url", "Background Video")}
          {renderInput("hero_cta_text", "CTA Text")}
          {renderInput("hero_cta_link", "CTA Link")}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6">
        <h3 className="text-white text-sm font-semibold border-b border-white/[0.06] pb-3 mb-5">Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          {renderInput("stat_years", "Years")}
          {renderInput("stat_projects", "Projects")}
          {renderInput("stat_families", "Families")}
          {renderInput("stat_area", "Area Developed")}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6">
        <h3 className="text-white text-sm font-semibold border-b border-white/[0.06] pb-3 mb-5">About Section</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">{renderInput("about_title", "Title")}</div>
          <div className="col-span-2">{renderInput("about_description", "Description", true)}</div>
          <div className="col-span-2">{renderMediaUpload("about_image_url", "Image")}</div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6">
        <h3 className="text-white text-sm font-semibold border-b border-white/[0.06] pb-3 mb-5">Why Choose Us</h3>
        <div className="grid grid-cols-2 gap-4">
          {renderInput("why_feature_1", "Feature 1")}
          {renderInput("why_feature_2", "Feature 2")}
          {renderInput("why_feature_3", "Feature 3")}
          {renderInput("why_feature_4", "Feature 4")}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6">
        <h3 className="text-white text-sm font-semibold border-b border-white/[0.06] pb-3 mb-5">Call to Action</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">{renderInput("cta_headline", "Headline")}</div>
          <div className="col-span-2">{renderInput("cta_description", "Description", true)}</div>
          {renderInput("cta_button_text", "Button Text")}
          {renderInput("cta_button_link", "Button Link")}
        </div>
      </motion.div>

      <div className="flex justify-end">
        <button type="submit" disabled={isPending} className="flex items-center gap-2 bg-gradient-to-r from-[#b59b54] to-[#9a8347] text-black text-sm font-semibold px-6 py-3 rounded-xl hover:from-[#c9ae6a] hover:to-[#b59b54] transition-all shadow-[0_0_20px_rgba(181,155,84,0.25)] disabled:opacity-50">
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
