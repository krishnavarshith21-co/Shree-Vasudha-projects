"use client";

import { useState } from "react";
import { uploadMedia } from "@/utils/supabase/storage";
import { File, Loader2, X, FileText, Video } from "lucide-react";

interface FileUploadProps {
  name: string;
  defaultValue?: string;
  label?: string;
  accept?: string;
  type?: "pdf" | "video" | "any";
}

export default function FileUpload({ name, defaultValue, label = "Upload File", accept = "*/*", type = "any" }: FileUploadProps) {
  const [fileUrl, setFileUrl] = useState<string>(defaultValue || "");
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
      setFileUrl(url);
    }
    
    setIsUploading(false);
  };

  const getIcon = () => {
    if (type === "pdf") return <FileText size={24} className="text-white/20 mb-2" />;
    if (type === "video") return <Video size={24} className="text-white/20 mb-2" />;
    return <File size={24} className="text-white/20 mb-2" />;
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs text-white/40 uppercase tracking-wider">{label}</label>
      
      {/* Hidden input to pass value to FormData */}
      <input type="hidden" name={name} value={fileUrl} />

      {fileUrl ? (
        <div className="relative group rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-[#b59b54]/10 flex items-center justify-center shrink-0">
               {getIcon()}
            </div>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-white/80 hover:text-[#b59b54] truncate transition-colors">
              {fileUrl.split('/').pop()}
            </a>
          </div>
          <button
            type="button"
            onClick={() => setFileUrl("")}
            className="text-white/40 hover:text-red-500 p-2 rounded-lg transition-colors shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="relative border-2 border-dashed border-white/[0.08] rounded-xl p-8 text-center hover:border-[#b59b54]/30 transition-colors bg-white/[0.02]">
          <input
            type="file"
            accept={accept}
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
              {getIcon()}
              <p className="text-xs text-white/40">Click to upload or drag & drop</p>
            </div>
          )}
        </div>
      )}
      
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}
