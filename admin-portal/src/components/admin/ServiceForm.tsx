"use client";

import { motion } from "framer-motion";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createService, updateService } from "@/app/admin/actions/services";
import ImageUpload from "@/components/admin/ImageUpload";

export default function ServiceForm({ service }: { service?: any }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isEdit = !!service;

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      let result;
      if (isEdit) {
        result = await updateService(service.id, formData);
      } else {
        result = await createService(formData);
      }
      
      if (result.error) {
        alert("Error: " + result.error);
      } else {
        router.push("/admin/services");
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/services"
          className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/50 hover:text-white/80 transition-all"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1
            className="text-3xl font-light text-white tracking-wide"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            {isEdit ? "Edit Service" : "New Service"}
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {isEdit ? "Update service details" : "Add a new service to your website"}
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">
              Service Title *
            </label>
            <input
              name="title"
              required
              defaultValue={service?.title}
              placeholder="e.g. Property Management"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#b59b54]/50 transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              defaultValue={service?.description}
              placeholder="Describe the service..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#b59b54]/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">
              Lucide Icon Name
            </label>
            <input
              name="icon"
              defaultValue={service?.icon}
              placeholder="e.g. briefcase, shield, key"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#b59b54]/50 transition-colors"
            />
          </div>
        </div>

        <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6">
          <ImageUpload name="image_url" defaultValue={service?.image_url} label="Service Image (Optional)" />
        </div>

        {/* Toggles */}
        <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm text-white/80">Published</p>
              <p className="text-xs text-white/30">Make this service visible on the website</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="published" defaultChecked={isEdit ? service?.published : true} className="sr-only peer" />
              <div className="w-11 h-6 bg-white/[0.08] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end pt-4 border-t border-white/[0.06]">
        <button type="submit" disabled={isPending} className="flex items-center gap-2 bg-gradient-to-r from-[#b59b54] to-[#9a8347] text-black text-sm font-semibold px-6 py-2.5 rounded-xl hover:from-[#c9ae6a] hover:to-[#b59b54] transition-all shadow-[0_0_20px_rgba(181,155,84,0.25)] disabled:opacity-50">
          {isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          {isPending ? "Saving..." : "Save Service"}
        </button>
      </div>
    </form>
  );
}
