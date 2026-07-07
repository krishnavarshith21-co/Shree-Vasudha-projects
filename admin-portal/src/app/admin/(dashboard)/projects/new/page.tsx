"use client";

import { motion } from "framer-motion";
import { Save, ArrowLeft, Image, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "@/app/admin/actions/projects";
import ImageUpload from "@/components/admin/ImageUpload";
import MultiImageUpload from "@/components/admin/MultiImageUpload";
import FileUpload from "@/components/admin/FileUpload";

const tabs = ["Details", "Media", "SEO"];

export default function NewProjectPage() {
  const [activeTab, setActiveTab] = useState("Details");
  const [isPending, startTransition] = useTransition();
  const [slugValue, setSlugValue] = useState("");
  const router = useRouter();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setSlugValue(slug);
  };

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await createProject(formData);
      if (result.error) {
        alert("Error: " + result.error);
      } else {
        router.push("/admin/projects");
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/projects"
          className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/50 hover:text-white/80 transition-all"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1
            className="text-3xl font-light text-white tracking-wide"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            New Project
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Add a new real estate project
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#141414] border border-white/[0.06] rounded-xl p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm transition-all ${
              activeTab === tab
                ? "bg-[#b59b54]/15 text-[#b59b54] font-medium"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Details Tab */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`space-y-6 ${activeTab !== "Details" ? "hidden" : ""}`}
      >
          <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6 space-y-5">
            <h3 className="text-white text-sm font-semibold border-b border-white/[0.06] pb-3">
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">
                  Project Name *
                </label>
                <input
                  name="name"
                  required
                  onChange={handleNameChange}
                  placeholder="e.g. Vasudha Serenity"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#b59b54]/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">
                  Slug
                </label>
                <input
                  name="slug"
                  required
                  value={slugValue}
                  onChange={(e) => setSlugValue(e.target.value)}
                  placeholder="vasudha-serenity"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#b59b54]/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">
                  Status *
                </label>
                <select name="status" required className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors appearance-none">
                  <option value="" className="bg-[#141414]">Select Status</option>
                  <option value="Ongoing" className="bg-[#141414]">Ongoing</option>
                  <option value="Upcoming" className="bg-[#141414]">Upcoming</option>
                  <option value="Completed" className="bg-[#141414]">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">
                  Location *
                </label>
                <input
                  name="location"
                  placeholder="e.g. Vanasthalipuram, Hyderabad"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#b59b54]/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">
                  Configuration
                </label>
                <input
                  name="config"
                  placeholder="e.g. 2 & 3 BHK Apartments"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#b59b54]/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">
                  Price Range
                </label>
                <input
                  name="price"
                  placeholder="e.g. ₹45L — ₹85L"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#b59b54]/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">
                  Project Area
                </label>
                <input
                  name="area"
                  placeholder="e.g. 12 Acres"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#b59b54]/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">
                  Possession Date
                </label>
                <input
                  type="date"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">
                  RERA Number
                </label>
                <input
                  placeholder="RERA registration number"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#b59b54]/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">
                  Google Map Location
                </label>
                <input
                  placeholder="Google Maps embed URL"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#b59b54]/50 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                placeholder="Detailed project description..."
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#b59b54]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">
                Highlights (comma separated)
              </label>
              <input
                name="highlights"
                placeholder="Gated Community, 24/7 Security, Club House..."
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#b59b54]/50 transition-colors"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6 space-y-4">
            <h3 className="text-white text-sm font-semibold border-b border-white/[0.06] pb-3">
              Visibility
            </h3>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-white/80">Featured Project</p>
                <p className="text-xs text-white/30">Show on homepage featured section</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="featured" className="sr-only peer" />
                <div className="w-11 h-6 bg-white/[0.08] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#b59b54]"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-white/80">Published</p>
                <p className="text-xs text-white/30">Make this project public</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="published" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-white/[0.08] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
          </div>
        </motion.div>

      {/* Media Tab */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`space-y-6 ${activeTab !== "Media" ? "hidden" : ""}`}
      >
        <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6">
          <ImageUpload name="image_url" label="Primary Project Image (Cover)" />
        </div>
          
        <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6">
          <MultiImageUpload name="gallery_images" label="Project Gallery (Multiple Images)" />
        </div>

        <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6">
          <MultiImageUpload name="floor_plans" label="Floor Plans (Multiple Images)" />
        </div>

        <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6">
          <FileUpload name="brochure_url" label="Brochure (PDF)" accept=".pdf" type="pdf" />
        </div>

        <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6">
          <FileUpload name="video_url" label="Walkthrough Video (MP4)" accept="video/mp4,video/webm" type="video" />
        </div>
      </motion.div>

      {/* SEO Tab */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-[#141414] border border-white/[0.06] rounded-2xl p-6 space-y-5 ${activeTab !== "SEO" ? "hidden" : ""}`}
      >
          <h3 className="text-white text-sm font-semibold border-b border-white/[0.06] pb-3">
            Search Engine Optimization
          </h3>
          <div>
            <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">
              SEO Title
            </label>
            <input
              placeholder="Project title for search engines"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#b59b54]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">
              SEO Description
            </label>
            <textarea
              rows={3}
              placeholder="Meta description for search results"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#b59b54]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">
              Keywords
            </label>
            <input
              placeholder="luxury apartments hyderabad, 2bhk vanasthalipuram..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#b59b54]/50 transition-colors"
            />
          </div>
        </motion.div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
        <button type="button" className="px-5 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white/50 text-sm hover:bg-white/[0.08] transition-all">
          Save Draft
        </button>
        <div className="flex items-center gap-3">
          <button type="button" className="px-5 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white/50 text-sm hover:bg-white/[0.08] transition-all">
            Preview
          </button>
          <button type="submit" disabled={isPending} className="flex items-center gap-2 bg-gradient-to-r from-[#b59b54] to-[#9a8347] text-black text-sm font-semibold px-6 py-2.5 rounded-xl hover:from-[#c9ae6a] hover:to-[#b59b54] transition-all shadow-[0_0_20px_rgba(181,155,84,0.25)] disabled:opacity-50">
            {isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {isPending ? "Publishing..." : "Publish Project"}
          </button>
        </div>
      </div>
    </form>
  );
}
