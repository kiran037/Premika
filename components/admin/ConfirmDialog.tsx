import React from "react";
import { AdminModal } from "./AdminModal";
import { AdminButton } from "./AdminButton";
import { AlertTriangle } from "lucide-react";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDangerous = false,
  isLoading = false,
}) => {
  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4 pt-2">
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 p-3.5 rounded-xl">
          <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-xs text-amber-900 leading-relaxed">{message}</p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <AdminButton variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </AdminButton>
          <AdminButton
            variant={isDangerous ? "danger" : "primary"}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </AdminButton>
        </div>
      </div>
    </AdminModal>
  );
};
