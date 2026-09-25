"use client";

import { AdminModal } from "./Modal";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  busy,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AdminModal
      open={open}
      onClose={busy ? () => undefined : onCancel}
      title={title}
      kicker="Please confirm"
      footer={
        <div className="adm-form-actions adm-form-actions--right">
          <button
            type="button"
            className="adm-btn adm-btn--ghost"
            onClick={onCancel}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            type="button"
            className="adm-btn adm-btn--danger"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "Working…" : confirmLabel}
          </button>
        </div>
      }
    >
      <p className="adm-confirm-message">{message}</p>
    </AdminModal>
  );
}