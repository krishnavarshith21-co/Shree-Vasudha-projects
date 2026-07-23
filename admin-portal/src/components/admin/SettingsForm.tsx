"use client";

import { motion } from "framer-motion";
import { Save, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { updateSettings } from "@/app/admin/actions/settings";
import ImageUpload from "@/components/admin/ImageUpload";

export default function SettingsForm({ initialSettings }: { initialSettings: any }) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await updateSettings(formData);
      if (result.error) {
        alert("Error: " + result.error);
      } else {
        alert("Settings saved successfully!");
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-light text-white tracking-wide" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>Website Settings</h1>
        <p className="text-white/40 text-sm mt-1">Global configuration for your website</p>
      </div>

      {/* Company Info */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6 space-y-5">
        <h3 className="text-white text-sm font-semibold border-b border-white/[0.06] pb-3">Company Information</h3>
        <div className="grid grid-cols-2 gap-5">
          <div><label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Company Name</label><input name="company_name" defaultValue={initialSettings?.company_name || "Shree Vasudha Projects"} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors" /></div>
          <div><label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">WhatsApp</label><input name="whatsapp" defaultValue={initialSettings?.whatsapp || "+91 77024 36052"} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors" /></div>
          <div><label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Email</label><input name="email" defaultValue={initialSettings?.email || "shreevasudhaprojects@gmail.com"} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors" /></div>
          <div><label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Phone</label><input name="phone" defaultValue={initialSettings?.phone || "+91 77024 36052"} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors" /></div>
        </div>
        <div><label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Office Address</label><textarea name="address" rows={3} defaultValue={initialSettings?.address || "Plot - 285, 5th Floor, H.No. 5-6-190, Vaidhehi Nagar, Saheb Nagar Kalan, BN Reddy Nagar, R.R. Dist., Telangana – 500070"} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors" /></div>
        <div className="grid grid-cols-2 gap-5">
          <div><label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Business Hours</label><textarea name="business_hours" rows={3} defaultValue={initialSettings?.business_hours || "Mon - Sat: 9:00 AM - 6:00 PM\nSun: Closed"} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors" /></div>
          <div><label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Footer Text / Copyright</label><textarea name="footer_text" rows={3} defaultValue={initialSettings?.footer_text || "Building trust through quality and commitment."} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors" /></div>
        </div>
        <div><label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Google Maps Link</label><input name="maps_link" defaultValue={initialSettings?.maps_link || "https://maps.google.com?q=Shree+vasudha+projects"} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors" /></div>
        <div><label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Copyright Notice</label><input name="copyright" defaultValue={initialSettings?.copyright || "© 2026 Shree Vasudha Projects. All Rights Reserved."} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors" /></div>
      </motion.div>

      {/* Social Media */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6 space-y-5">
        <h3 className="text-white text-sm font-semibold border-b border-white/[0.06] pb-3">Social Media Links</h3>
        <div className="grid grid-cols-2 gap-5">
          <div><label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Instagram</label><input name="instagram" defaultValue={initialSettings?.instagram} placeholder="https://instagram.com/..." className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#b59b54]/50 transition-colors" /></div>
          <div><label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Facebook</label><input name="facebook" defaultValue={initialSettings?.facebook} placeholder="https://facebook.com/..." className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#b59b54]/50 transition-colors" /></div>
          <div><label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">YouTube</label><input name="youtube" defaultValue={initialSettings?.youtube} placeholder="https://youtube.com/..." className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#b59b54]/50 transition-colors" /></div>
          <div><label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">LinkedIn</label><input name="linkedin" defaultValue={initialSettings?.linkedin} placeholder="https://linkedin.com/..." className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#b59b54]/50 transition-colors" /></div>
        </div>
      </motion.div>

      {/* Analytics & Branding */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6 space-y-5">
        <h3 className="text-white text-sm font-semibold border-b border-white/[0.06] pb-3">Analytics & Branding</h3>
        <div className="grid grid-cols-2 gap-5">
          <div><label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Google Analytics ID</label><input name="analytics_id" defaultValue={initialSettings?.analytics_id} placeholder="G-XXXXXXXXXX" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#b59b54]/50 transition-colors" /></div>
          <div><label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Meta Pixel ID</label><input name="meta_pixel" defaultValue={initialSettings?.meta_pixel} placeholder="XXXXXXXXXXXXXXXX" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#b59b54]/50 transition-colors" /></div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Default Theme</label>
            <select name="default_theme" defaultValue={initialSettings?.default_theme || "dark"} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors appearance-none">
              <option value="dark" className="bg-[#141414]">Dark Mode (Luxury)</option>
              <option value="light" className="bg-[#141414]">Light Mode</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-5">
          <div><label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Primary Color</label><input name="brand_color" defaultValue={initialSettings?.brand_color || "#b59b54"} type="color" className="w-full h-[46px] bg-white/[0.04] border border-white/[0.08] rounded-xl px-2 cursor-pointer" /></div>
          <div><label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Secondary Color</label><input name="secondary_color" defaultValue={initialSettings?.secondary_color || "#111111"} type="color" className="w-full h-[46px] bg-white/[0.04] border border-white/[0.08] rounded-xl px-2 cursor-pointer" /></div>
          <div><label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Button Color</label><input name="button_color" defaultValue={initialSettings?.button_color || "#b59b54"} type="color" className="w-full h-[46px] bg-white/[0.04] border border-white/[0.08] rounded-xl px-2 cursor-pointer" /></div>
          <div><label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Accent Color</label><input name="accent_color" defaultValue={initialSettings?.accent_color || "#d4af37"} type="color" className="w-full h-[46px] bg-white/[0.04] border border-white/[0.08] rounded-xl px-2 cursor-pointer" /></div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div><ImageUpload name="logo_url" defaultValue={initialSettings?.logo_url} label="Company Logo" /></div>
          <div><ImageUpload name="favicon_url" defaultValue={initialSettings?.favicon_url} label="Favicon" /></div>
        </div>
      </motion.div>

      {/* Save */}
      <div className="flex justify-end">
        <button type="submit" disabled={isPending} className="flex items-center gap-2 bg-gradient-to-r from-[#b59b54] to-[#9a8347] text-black text-sm font-semibold px-6 py-3 rounded-xl hover:from-[#c9ae6a] hover:to-[#b59b54] transition-all shadow-[0_0_20px_rgba(181,155,84,0.25)] disabled:opacity-50">
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isPending ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
