"use client";

import { motion } from "framer-motion";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createAmenity, updateAmenity } from "@/app/admin/actions/amenities";

export default function AmenityForm({ amenity }: { amenity?: any }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isEdit = !!amenity;

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      let result;
      if (isEdit) {
        result = await updateAmenity(amenity.id, formData);
      } else {
        result = await createAmenity(formData);
      }
      
      if (result.error) {
        alert("Error: " + result.error);
      } else {
        router.push("/admin/amenities");
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/amenities"
          className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/50 hover:text-white/80 transition-all"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1
            className="text-3xl font-light text-white tracking-wide"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            {isEdit ? "Edit Amenity" : "New Amenity"}
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {isEdit ? "Update amenity details" : "Add a new global amenity"}
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6 space-y-5"
      >
        <div>
          <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">
            Amenity Title *
          </label>
          <input
            name="title"
            required
            defaultValue={amenity?.title}
            placeholder="e.g. Skyline Infinity Pool"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#b59b54]/50 transition-colors"
          />
        </div>
        
        <div>
          <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">
            Emoji / Lucide Icon
          </label>
          <input
            name="icon"
            defaultValue={amenity?.icon}
            placeholder="e.g. 🏊 or wifi"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#b59b54]/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">
            Image URL
          </label>
          <input
            name="image_url"
            defaultValue={amenity?.image_url}
            placeholder="e.g. assets/images/amenities/pool.png"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#b59b54]/50 transition-colors"
          />
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end pt-4 border-t border-white/[0.06]">
        <button type="submit" disabled={isPending} className="flex items-center gap-2 bg-gradient-to-r from-[#b59b54] to-[#9a8347] text-black text-sm font-semibold px-6 py-2.5 rounded-xl hover:from-[#c9ae6a] hover:to-[#b59b54] transition-all shadow-[0_0_20px_rgba(181,155,84,0.25)] disabled:opacity-50">
          {isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          {isPending ? "Saving..." : "Save Amenity"}
        </button>
      </div>
    </form>
  );
}
