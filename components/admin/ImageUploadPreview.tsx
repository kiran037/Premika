import React from "react";
import Image from "next/image";
import { Plus, Trash2, ArrowUp, ArrowDown, Star, Image as ImageIcon } from "lucide-react";
import { AdminButton } from "./AdminButton";

export interface ImageUploadPreviewProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({
  images,
  onChange,
}) => {
  const handleAdd = () => {
    onChange([...images, ""]);
  };

  const handleRemove = (index: number) => {
    if (images.length === 1) return;
    onChange(images.filter((_, i) => i !== index));
  };

  const handleUrlChange = (index: number, value: string) => {
    const updated = [...images];
    updated[index] = value;
    onChange(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return;
    const updated = [...images];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const selected = updated[index];
    updated.splice(index, 1);
    updated.unshift(selected);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {images.map((url, idx) => {
          const isValidUrl = url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/");

          return (
            <div
              key={idx}
              className={`relative bg-stone-50 border rounded-2xl p-3 flex flex-col justify-between transition-all ${
                idx === 0 ? "border-[#B67B5C] ring-1 ring-[#B67B5C]/30 shadow-xs" : "border-stone-200"
              }`}
            >
              {/* Thumbnail Preview Box */}
              <div className="relative w-full h-36 bg-stone-200 rounded-xl overflow-hidden mb-3 border border-stone-200/80 flex items-center justify-center">
                {isValidUrl && url ? (
                  <Image src={url} alt={`Product ${idx + 1}`} fill className="object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-stone-400 text-xs">
                    <ImageIcon size={28} />
                    <span className="mt-1 text-[11px]">Enter Image URL</span>
                  </div>
                )}

                {/* Primary Badge */}
                {idx === 0 ? (
                  <span className="absolute top-2 left-2 bg-[#B67B5C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <Star size={10} fill="currentColor" />
                    <span>Primary</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(idx)}
                    className="absolute top-2 left-2 bg-stone-900/70 hover:bg-[#B67B5C] text-white text-[10px] font-medium px-2 py-0.5 rounded-full transition shadow-xs"
                  >
                    Set as Primary
                  </button>
                )}
              </div>

              {/* URL Input */}
              <div className="space-y-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={url}
                  onChange={(e) => handleUrlChange(idx, e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-[#B67B5C]"
                />

                {/* Reorder & Action Controls */}
                <div className="flex items-center justify-between text-stone-500 pt-1">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveUp(idx)}
                      className="p-1 rounded-md hover:bg-stone-200 hover:text-stone-900 disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => handleMoveDown(idx)}
                      className="p-1 rounded-md hover:bg-stone-200 hover:text-stone-900 disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  {images.length > 1 && (
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

      <AdminButton type="button" variant="outline" size="sm" onClick={handleAdd} className="w-full sm:w-auto">
        <Plus size={14} className="mr-1" />
        <span>Add Another Image URL</span>
      </AdminButton>
    </div>
  );
};
