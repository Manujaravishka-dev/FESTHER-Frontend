"use client";

interface EmptyStateProps {
  title: string;
  hint?: string;
  children?: React.ReactNode;
}

export function EmptyState({ title, hint, children }: EmptyStateProps) {
  return (
    <div className="adm-empty">
      <span className="adm-empty-mark" aria-hidden="true">
        ◊
      </span>
      <h3 className="adm-empty-title">{title}</h3>
      {hint && <p className="adm-empty-hint">{hint}</p>}
      {children && <div className="adm-empty-actions">{children}</div>}
    </div>
  );
}