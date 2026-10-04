"use client";

import type { ReactNode } from "react";

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  span?: boolean;
  children: ReactNode;
}

export default function Field({ id, label, error, span, children }: FieldProps) {
  return (
    <div className={`of-field${span ? " of-span-2" : ""}`}>
      <label className="of-label" htmlFor={id}>
        {label}
      </label>
      {children}
      {error ? <span className="of-field-error">{error}</span> : null}
    </div>
  );
}