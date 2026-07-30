"use client";

import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import Image from "next/image";
import { Upload, Trash2, Loader2, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import { uploadImage } from "@/lib/supabase/storage";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface SingleImageUploaderProps {
  value?: string;
  onChange?: (url: string) => void;
  bucket?: string;
  folder?: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  required?: boolean;
  aspectRatio?: "square" | "landscape" | "portrait" | "auto";
  className?: string;
}

export const SingleImageUploader: React.FC<SingleImageUploaderProps> = ({
  value = "",
  onChange,
  bucket = "general",
  folder = "",
  label,
  description,
  disabled = false,
  required = false,
  aspectRatio = "auto",
  className = "",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Invalid file type. Please upload PNG, JPG, JPEG, or WEBP.");
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 5MB limit.");
      return false;
    }
    return true;
  };

  const handleUpload = async (file: File) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    try {
      const result = await uploadImage(file, bucket, folder);
      if (onChange) {
        onChange(result.url);
      }
      toast.success("Image uploaded successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUpload(files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleUpload(files[0]);
    }
  };

  const handleTriggerPicker = () => {
    if (disabled || isUploading) return;
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChange) {
      onChange("");
    }
  };

  const isValidUrl =
    typeof value === "string" &&
    (value.startsWith("http://") ||
      value.startsWith("https://") ||
      value.startsWith("/"));

  const aspectRatioClasses = {
    square: "aspect-square max-w-xs",
    landscape: "aspect-video w-full",
    portrait: "aspect-[3/4] max-w-xs",
    auto: "h-52 w-full",
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-stone-800">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {description && (
        <p className="text-[11px] text-stone-500">{description}</p>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="hidden"
        disabled={disabled || isUploading}
      />

      <div
        onClick={handleTriggerPicker}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative ${
          aspectRatioClasses[aspectRatio]
        } rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none group ${
          disabled
            ? "opacity-50 cursor-not-allowed border-stone-200 bg-stone-100"
            : isDragging
            ? "border-[#B67B5C] bg-[#B67B5C]/10 ring-2 ring-[#B67B5C]/20"
            : isValidUrl
            ? "border-stone-200 bg-stone-50 hover:border-[#B67B5C]"
            : "border-stone-300 bg-stone-50 hover:border-[#B67B5C] hover:bg-stone-100/80"
        }`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center justify-center text-stone-600 gap-2 p-4">
            <Loader2 className="w-6 h-6 animate-spin text-[#B67B5C]" />
            <span className="text-xs font-semibold">Uploading Image...</span>
          </div>
        ) : isValidUrl ? (
          <>
            <Image
              src={value}
              alt="Uploaded Preview"
              fill
              className="object-contain p-2"
            />
            {/* Hover Actions Bar */}
            {!disabled && (
              <div className="absolute inset-0 bg-stone-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3 backdrop-blur-2xs">
                <button
                  type="button"
                  onClick={handleTriggerPicker}
                  className="px-3 py-1.5 bg-white text-stone-900 rounded-xl text-xs font-bold shadow-sm hover:bg-stone-100 flex items-center gap-1.5 transition-transform active:scale-95"
                >
                  <RefreshCw size={14} />
                  <span>Replace</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-3 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-rose-700 flex items-center gap-1.5 transition-transform active:scale-95"
                >
                  <Trash2 size={14} />
                  <span>Remove</span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6 gap-2">
            <div className="w-12 h-12 rounded-2xl bg-[#B67B5C]/10 text-[#B67B5C] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload size={22} />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-800">
                Click to upload <span className="font-normal text-stone-500">or drag & drop</span>
              </p>
              <p className="text-[10px] text-stone-400 mt-0.5">
                PNG, JPG, WEBP up to 5MB
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleImageUploader;
