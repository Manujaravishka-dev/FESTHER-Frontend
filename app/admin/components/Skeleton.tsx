"use client";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return <span className={`adm-skeleton ${className}`} aria-hidden="true" />;
}

export function SkeletonCard() {
  return (
    <div className="adm-card adm-gallery-card">
      <span className="adm-skeleton adm-thumb-skeleton" />
      <div className="adm-gallery-card-body">
        <Skeleton className="adm-line adm-line--sm" />
        <Skeleton className="adm-line adm-line--xs" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="adm-list-row adm-list-row--loader">
      <Skeleton className="adm-line adm-line--lg" />
      <Skeleton className="adm-line adm-line--lg" />
      <Skeleton className="adm-line adm-line--md" />
    </div>
  );
}