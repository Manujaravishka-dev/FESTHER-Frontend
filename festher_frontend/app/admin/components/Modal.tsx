"use client";

import { useEffect, useLayoutEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  kicker?: string;
  subtitle?: string;
  wide?: boolean;
  children: ReactNode;
  footer?: ReactNode;
}

export function AdminModal({
  open,
  onClose,
  title,
  kicker,
  subtitle,
  wide,
  children,
  footer,
}: ModalProps) {
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="adm-overlay" role="dialog" aria-modal="true" aria-label={title}>
      <button
        className="adm-overlay-blank"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div className={`adm-modal${wide ? " adm-modal--wide" : ""}`}>
        <button className="adm-modal-close" aria-label="Close" onClick={onClose}>
          &times;
        </button>
        {kicker && <p className="adm-modal-kicker">{kicker}</p>}
        <h2 className="adm-modal-title">{title}</h2>
        {subtitle && <p className="adm-modal-sub">{subtitle}</p>}
        <div className="adm-modal-body">{children}</div>
        {footer && <div className="adm-modal-footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

function useBodyScrollLock(active: boolean) {
  useLayoutEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);
}