"use client";

import { useState } from "react";
import { uploadMedia } from "@/utils/supabase/storage";
import { Loader2, X, Plus } from "lucide-react";

interface MultiImageUploadProps {
  name: string;
  defaultValues?: string[];
  label?: string;
}

export default function MultiImageUpload({ name, defaultValues = [], label = "Upload Images" }: MultiImageUploadProps) {
  const [imageUrls, setImageUrls] = useState<string[]>(defaultValues);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    const newUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const { url, error: uploadError } = await uploadMedia(file);
      if (uploadError) {
        setError(uploadError);
      } else if (url) {
        newUrls.push(url);
      }
    }
    
    setImageUrls(prev => [...prev, ...newUrls]);
    setIsUploading(false);
  };

  const removeImage = (indexToRemove: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs text-white/40 uppercase tracking-wider">{label}</label>
      
      {/* Hidden input to pass value to FormData (as JSON string) */}
      <input type="hidden" name={name} value={JSON.stringify(imageUrls)} />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {imageUrls.map((url, index) => (
          <div key={index} className="relative group rounded-xl overflow-hidden border border-white/[0.08] bg-white/[0.02] aspect-video">
            <img src={url} alt={`Uploaded ${index + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="bg-red-500/80 text-white hover:bg-red-500 p-2 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
        
        {/* Upload Button */}
        <div className="relative border-2 border-dashed border-white/[0.08] rounded-xl p-4 flex flex-col items-center justify-center hover:border-[#b59b54]/30 transition-colors bg-white/[0.02] aspect-video">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          {isUploading ? (
            <>
              <Loader2 className="animate-spin text-[#b59b54] mb-2" size={20} />
              <p className="text-[10px] text-[#b59b54]">Uploading...</p>
            </>
          ) : (
            <>
              <Plus size={20} className="text-white/20 mb-2" />
              <p className="text-[10px] text-white/40">Add More</p>
            </>
          )}
        </div>
      </div>
      
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}
