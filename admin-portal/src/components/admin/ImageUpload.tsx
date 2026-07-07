"use client";

import { useState } from "react";
import { uploadMedia } from "@/utils/supabase/storage";
import { Image as ImageIcon, Loader2, X } from "lucide-react";

interface ImageUploadProps {
  name: string;
  defaultValue?: string;
  label?: string;
}

export default function ImageUpload({ name, defaultValue, label = "Upload Image" }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState<string>(defaultValue || "");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const { url, error } = await uploadMedia(file);

    if (error) {
      setError(error);
    } else if (url) {
      setImageUrl(url);
    }
    
    setIsUploading(false);
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs text-white/40 uppercase tracking-wider">{label}</label>
      
      {/* Hidden input to pass value to FormData */}
      <input type="hidden" name={name} value={imageUrl} />

      {imageUrl ? (
        <div className="relative group rounded-xl overflow-hidden border border-white/[0.08] bg-white/[0.02]">
          <img src={imageUrl} alt="Uploaded" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={() => setImageUrl("")}
              className="bg-red-500/20 text-red-500 hover:bg-red-500/40 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <X size={16} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="relative border-2 border-dashed border-white/[0.08] rounded-xl p-8 text-center hover:border-[#b59b54]/30 transition-colors bg-white/[0.02]">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          {isUploading ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-[#b59b54] mb-2" size={24} />
              <p className="text-xs text-[#b59b54]">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pointer-events-none">
              <ImageIcon size={24} className="text-white/20 mb-2" />
              <p className="text-xs text-white/40">Click to upload or drag & drop</p>
            </div>
          )}
        </div>
      )}
      
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}
