"use client";

import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  full?: boolean;
}

export function Field({ label, htmlFor, error, required, children, full }: FieldProps) {
  return (
    <div className={`adm-field${full ? " adm-span-2" : ""}`}>
      <label className="adm-label" htmlFor={htmlFor}>
        {label}
        {required && <span className="adm-label-req"> *</span>}
      </label>
      {children}
      {error && <span className="adm-field-error">{error}</span>}
    </div>
  );
}