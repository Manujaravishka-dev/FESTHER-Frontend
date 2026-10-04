"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

type ToastKind = "success" | "error";

interface ToastItem {
  id: number;
  message: string;
  kind: ToastKind;
}

interface ToastContextValue {
  toast: (message: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const seq = useRef(0);

  const dismiss = useCallback((id: number) => {
    setItems((list) => list.filter((i) => i.id !== id));
  }, []);

  const toast = useCallback((message: string, kind: ToastKind = "success") => {
    const id = ++seq.current;
    setItems((list) => [...list, { id, message, kind }]);
    window.setTimeout(() => {
      setItems((list) => list.filter((i) => i.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="adm-toasts" aria-live="polite">
        {items.map((item) => (
          <div key={item.id} className={`adm-toast adm-toast--${item.kind}`}>
            <span className="adm-toast-dot" aria-hidden="true" />
            <span className="adm-toast-msg">{item.message}</span>
            <button
              className="adm-toast-close"
              aria-label="Dismiss notification"
              onClick={() => dismiss(item.id)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): { toast: (message: string, kind?: ToastKind) => void } {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider.");
  return ctx;
}