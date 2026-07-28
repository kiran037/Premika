"use client";

import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import Image from "next/image";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Star,
  Image as ImageIcon,
  Upload,
  Loader2,
} from "lucide-react";
import { AdminButton } from "./AdminButton";
import { toast } from "react-hot-toast";
import { uploadImage } from "@/lib/supabase/storage";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface ImageUploaderProps {
  bucket?: string;
  value?: string;
  images?: string[];
  onChange?: (val: any) => void;
  folder?: string;
  label?: string;
  description?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  bucket = "products",
  value,
  images: imagesProp,
  onChange,
  folder = "products",
  label,
  description,
}) => {
  // Determine image list (supports both single `value` and array `images` props)
  const isMulti = Array.isArray(imagesProp);
  const images = isMulti
    ? imagesProp
    : typeof value === "string"
      ? [value]
      : [""];

  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [activePickerIdx, setActivePickerIdx] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateImages = (newImages: string[]) => {
    if (!onChange) return;
    if (isMulti) {
      onChange(newImages);
    } else {
      onChange(newImages[0] || "");
    }
  };

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Invalid file type. Please upload PNG, JPEG, or WEBP.");
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 5MB limit.");
      return false;
    }
    return true;
  };

  const handleUploadFile = async (file: File, index: number) => {
    if (!validateFile(file)) return;

    setUploadingIdx(index);
    try {
      const result = await uploadImage(file, bucket, folder);
      const updated = [...images];
      updated[index] = result.url;
      updateImages(updated);
      toast.success("Image uploaded successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to upload image to Supabase.");
    } finally {
      setUploadingIdx(null);
    }
  };

  const triggerPicker = (index: number) => {
    setActivePickerIdx(index);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUploadFile(files[0], activePickerIdx);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingIdx(index);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingIdx(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingIdx(null);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleUploadFile(files[0], index);
    }
  };

  const handleAdd = () => {
    updateImages([...images, ""]);
  };

  const handleRemove = (index: number) => {
    if (images.length === 1 && !isMulti) {
      updateImages([""]);
      return;
    }
    if (images.length === 1 && isMulti) {
      updateImages([]);
      return;
    }
    updateImages(images.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    updateImages(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return;
    const updated = [...images];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    updateImages(updated);
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const selected = updated[index];
    updated.splice(index, 1);
    updated.unshift(selected);
    updateImages(updated);
  };

  return (
    <div className="space-y-4">
      {label && (
        <label className="block text-xs font-semibold text-stone-800">
          {label}
        </label>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {images.map((url, idx) => {
          const isValidUrl =
            url.startsWith("http://") ||
            url.startsWith("https://") ||
            url.startsWith("/");

          return (
            <div
              key={idx}
              className={`relative bg-stone-50 border rounded-2xl p-3 flex flex-col justify-between transition-all ${idx === 0
                ? "border-[#B67B5C] ring-1 ring-[#B67B5C]/30 shadow-xs"
                : "border-stone-200"
                }`}
            >
              {/* Thumbnail Preview Box with Click & Drag/Drop Upload */}
              <div
                onClick={() => triggerPicker(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, idx)}
                className={`relative w-full h-36 bg-stone-200 rounded-xl overflow-hidden mb-3 border border-stone-200/80 flex items-center justify-center cursor-pointer group transition ${draggingIdx === idx
                  ? "border-[#B67B5C] bg-[#B67B5C]/20 ring-2 ring-[#B67B5C]"
                  : ""
                  }`}
              >
                {uploadingIdx === idx ? (
                  <div className="flex flex-col items-center justify-center text-stone-600 text-xs gap-1">
                    <Loader2 size={24} className="animate-spin text-[#B67B5C]" />
                    <span className="text-[11px] font-medium">Uploading...</span>
                  </div>
                ) : isValidUrl && url ? (
                  <>
                    <Image
                      src={url}
                      alt={`Product ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                      <span className="bg-white/95 text-stone-900 text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                        <Upload size={12} />
                        <span>Change</span>
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-stone-400 text-xs group-hover:text-[#B67B5C] transition">
                    <Upload size={24} className="mb-1 text-stone-400 group-hover:text-[#B67B5C] transition" />
                    <span className="text-[11px] font-medium text-stone-600 group-hover:text-[#B67B5C] transition">
                      Upload Image
                    </span>
                  </div>
                )}

                {/* Primary Badge / Set Primary Button */}
                {idx === 0 ? (
                  <span className="absolute top-2 left-2 bg-[#B67B5C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 pointer-events-none z-10">
                    <Star size={10} fill="currentColor" />
                    <span>Primary</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetPrimary(idx);
                    }}
                    className="absolute top-2 left-2 bg-stone-900/70 hover:bg-[#B67B5C] text-white text-[10px] font-medium px-2 py-0.5 rounded-full transition shadow-xs z-10"
                  >
                    Set as Primary
                  </button>
                )}
              </div>

              {/* Upload Action / URL Display */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => triggerPicker(idx)}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 hover:border-[#B67B5C] rounded-lg text-xs text-stone-700 flex items-center justify-between transition group focus:outline-none"
                >
                  <span className="truncate text-[11px] font-medium">
                    {uploadingIdx === idx
                      ? "Uploading..."
                      : url
                        ? url.split("/").pop() || "Uploaded Image"
                        : "Choose file or drag here"}
                  </span>
                  <Upload
                    size={12}
                    className="text-stone-400 group-hover:text-[#B67B5C] transition flex-shrink-0"
                  />
                </button>

                {/* Reorder & Action Controls */}
                <div className="flex items-center justify-between text-stone-500 pt-1">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveUp(idx)}
                      className="p-1 rounded-md hover:bg-stone-200 hover:text-stone-900 disabled:opacity-30 transition"
                      title="Move Up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => handleMoveDown(idx)}
                      className="p-1 rounded-md hover:bg-stone-200 hover:text-stone-900 disabled:opacity-30 transition"
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  {(images.length > 1 || url !== "") && (
                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      className="p-1 text-stone-400 hover:text-red-600 rounded-md hover:bg-red-50 transition"
                      title="Remove Image"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {description && <p className="text-[11px] text-stone-400">{description}</p>}

      <AdminButton
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAdd}
        className="w-full sm:w-auto"
      >
        <Plus size={14} className="mr-1" />
        <span>Add Another Image</span>
      </AdminButton>
    </div>
  );
};
