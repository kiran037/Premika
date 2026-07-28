import React, { useState } from "react";
import { AdminInput } from "./AdminInput";
import { AdminButton } from "./AdminButton";
import { AdminModal } from "./AdminModal";
import { SocialLinkInput, socialLinkSchema } from "@/lib/validations/admin-store.schema";
import { Share2, Plus, Edit2, Trash2, ExternalLink, Check, X, MoveUp, MoveDown } from "lucide-react";
import { toast } from "react-hot-toast";

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: string | null;
  isActive: boolean;
  sortOrder: string;
}

export interface SocialLinksManagerProps {
  links: SocialLink[];
  onAdd: (data: SocialLinkInput) => Promise<void>;
  onUpdate: (id: string, data: SocialLinkInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export const SocialLinksManager: React.FC<SocialLinksManagerProps> = ({
  links,
  onAdd,
  onUpdate,
  onDelete,
  isLoading = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [formData, setFormData] = useState<SocialLinkInput>({
    platform: "",
    url: "",
    icon: "",
    isActive: true,
    sortOrder: "0",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAdd = () => {
    setEditingLink(null);
    setFormData({
      platform: "",
      url: "https://",
      icon: "",
      isActive: true,
      sortOrder: String(links.length),
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (link: SocialLink) => {
    setEditingLink(link);
    setFormData({
      platform: link.platform,
      url: link.url,
      icon: link.icon || "",
      isActive: link.isActive,
      sortOrder: link.sortOrder || "0",
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = socialLinkSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingLink) {
        await onUpdate(editingLink.id, validation.data);
        toast.success("Social link updated");
      } else {
        await onAdd(validation.data);
        toast.success("Social link added");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save social link");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (link: SocialLink) => {
    try {
      await onUpdate(link.id, {
        platform: link.platform,
        url: link.url,
        icon: link.icon,
        isActive: !link.isActive,
        sortOrder: link.sortOrder,
      });
      toast.success(`${link.platform} ${!link.isActive ? "activated" : "deactivated"}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string, platform: string) => {
    if (confirm(`Are you sure you want to delete ${platform}?`)) {
      try {
        await onDelete(id);
        toast.success("Social link deleted");
      } catch {
        toast.error("Failed to delete social link");
      }
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-stone-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Share2 size={18} className="text-[#B67B5C]" />
            <span>Social Media Links</span>
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Connect storefront footer and contacts with social profiles.
          </p>
        </div>

        <AdminButton variant="primary" size="sm" onClick={handleOpenAdd}>
          <Plus size={14} className="mr-1" />
          <span>Add Social Link</span>
        </AdminButton>
      </div>

      {links.length === 0 ? (
        <div className="py-8 text-center bg-stone-50 rounded-xl border border-dashed border-stone-200">
          <Share2 size={32} className="mx-auto text-stone-300 mb-2" />
          <p className="text-xs font-semibold text-stone-600">No social media links added yet</p>
          <p className="text-[11px] text-stone-400 mt-0.5">Click &quot;Add Social Link&quot; above to list your profiles.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {links.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between p-3.5 bg-stone-50 hover:bg-stone-100/80 rounded-xl border border-stone-200 transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-8 h-8 rounded-lg bg-stone-200 text-stone-700 font-bold flex items-center justify-center text-xs uppercase">
                  {link.platform.charAt(0)}
                </span>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-stone-900">{link.platform}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        link.isActive ? "bg-emerald-100 text-emerald-700" : "bg-stone-200 text-stone-600"
                      }`}
                    >
                      {link.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-stone-500 hover:text-[#B67B5C] truncate flex items-center gap-1 mt-0.5"
                  >
                    <span className="truncate">{link.url}</span>
                    <ExternalLink size={10} className="flex-shrink-0" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => handleToggleStatus(link)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition ${
                    link.isActive
                      ? "border-stone-300 text-stone-600 hover:bg-stone-200"
                      : "border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                  }`}
                >
                  {link.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => handleOpenEdit(link)}
                  className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition"
                  title="Edit"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(link.id, link.platform)}
                  className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Social Link Form Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLink ? `Edit ${editingLink.platform}` : "Add New Social Link"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <AdminInput
            label="Platform Name *"
            placeholder="e.g. Instagram, Facebook, WhatsApp"
            value={formData.platform}
            onChange={(e) => setFormData((prev) => ({ ...prev, platform: e.target.value }))}
            error={errors.platform}
          />

          <AdminInput
            label="Profile URL *"
            type="url"
            placeholder="https://instagram.com/premika"
            value={formData.url}
            onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
            error={errors.url}
          />

          <div className="grid grid-cols-2 gap-3">
            <AdminInput
              label="Sort Order"
              type="number"
              value={formData.sortOrder}
              onChange={(e) => setFormData((prev) => ({ ...prev, sortOrder: e.target.value }))}
            />

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="social-active"
                checked={formData.isActive}
                onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4 text-[#B67B5C] rounded border-stone-300"
              />
              <label htmlFor="social-active" className="text-xs font-semibold text-stone-800 cursor-pointer">
                Active Status
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-stone-100">
            <AdminButton type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              {editingLink ? "Update Link" : "Add Link"}
            </AdminButton>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};
