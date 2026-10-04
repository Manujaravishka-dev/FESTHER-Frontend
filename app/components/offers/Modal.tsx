"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  onClose: () => void;
  kicker?: string;
  title?: string;
  subtitle?: string;
  wide?: boolean;
  children: ReactNode;
}

export default function Modal({ onClose, kicker, title, subtitle, wide, children }: ModalProps) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return createPortal(
    <div className="of-overlay" onClick={onClose} role="presentation">
      <div
        className={`of-modal${wide ? " of-modal--wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="of-modal-close" type="button" onClick={onClose} aria-label="Close">
          ×
        </button>
        {kicker ? <p className="of-modal-kicker">{kicker}</p> : null}
        {title ? <h3 className="of-modal-title">{title}</h3> : null}
        {subtitle ? <p className="of-modal-sub">{subtitle}</p> : null}
        {children}
      </div>
    </div>,
    document.body,
  );
}