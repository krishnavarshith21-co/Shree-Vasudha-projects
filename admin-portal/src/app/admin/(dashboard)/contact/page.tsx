"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Check } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function ContactCMSPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // State for form fields
  const [formData, setFormData] = useState({
    phone: "+91 77024 36052",
    email: "shreevasudhaprojects@gmail.com",
    whatsapp: "+91 77024 36052",
    maps_link: "",
    address: "Plot - 285, 5th Floor, H.No. 5-6-190, Vaidhehi Nagar, BN Reddy Nagar, Telangana – 500070",
    business_hours: "Monday – Saturday, 9:30 AM – 7:00 PM"
  });

  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'global')
        .single();
        
      if (data && data.value) {
        setFormData(prev => ({ ...prev, ...data.value }));
      }
    }
    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Fetch existing settings first so we don't overwrite other fields
    const { data: existingData } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'global')
      .single();
      
    const mergedValue = { 
      ...(existingData?.value || {}), 
      ...formData 
    };

    const { error } = await supabase
      .from('settings')
      .update({ value: mergedValue })
      .eq('key', 'global');

    setIsSaving(false);
    
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      console.error("Save error:", error);
      alert("Failed to save changes");
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-light text-white tracking-wide" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>Contact Page</h1>
        <p className="text-white/40 text-sm mt-1">Edit contact information displayed on the website</p>
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6 space-y-5">
        <h3 className="text-white text-sm font-semibold border-b border-white/[0.06] pb-3">Contact Details</h3>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Phone</label>
            <input name="phone" value={formData.phone || ""} onChange={handleChange} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Email</label>
            <input name="email" value={formData.email || ""} onChange={handleChange} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">WhatsApp</label>
            <input name="whatsapp" value={formData.whatsapp || ""} onChange={handleChange} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Google Maps Link</label>
            <input name="maps_link" value={formData.maps_link || ""} onChange={handleChange} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors" />
          </div>
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Office Address</label>
          <textarea name="address" rows={3} value={formData.address || ""} onChange={handleChange} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors" />
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Business Hours</label>
          <input name="business_hours" value={formData.business_hours || ""} onChange={handleChange} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors" />
        </div>
      </motion.div>
      <div className="flex justify-end">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-gradient-to-r from-[#b59b54] to-[#9a8347] text-black text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(181,155,84,0.25)] disabled:opacity-70"
        >
          {isSaving ? (
            <div className="h-4 w-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
          ) : saved ? (
            <Check size={16} />
          ) : (
            <Save size={16} />
          )}
          {isSaving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}