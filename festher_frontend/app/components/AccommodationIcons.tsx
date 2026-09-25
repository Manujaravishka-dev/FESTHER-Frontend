"use client";

import type { ReactNode } from "react";
import type { AmenityKey } from "@/lib/types";

const icon = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);

const Icons: Record<AmenityKey, ReactNode> = {
  breakfast: icon(<><path d="M4 9h11v4.5A4.5 4.5 0 0 1 10.5 18h-2A4.5 4.5 0 0 1 4 13.5V9Z"/><path d="M15 10h1.4a2.6 2.6 0 0 1 0 5.2H15"/><path d="M7.5 3v2.2M11.5 3v2.2"/></>),
  veranda: icon(<><path d="M5 21V11a7 7 0 0 1 14 0v10"/><path d="M3 21h18"/><path d="M10 21v-5h4v5"/></>),
  garden: icon(<><path d="M12 3 6.5 11.5h3.2L6 17h12l-3.7-5.5h3.2L12 3Z"/><path d="M12 17v4"/></>),
  air: icon(<><path d="M3 8h9.5a2.5 2.5 0 1 0-2.5-2.5"/><path d="M3 12h13a2.5 2.5 0 1 1-2.5 2.5"/><path d="M3 16h7a2.5 2.5 0 1 1-2.5 2.5"/></>),
  family: icon(<><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5.5a3 3 0 0 1 0 5.6"/><path d="M17.5 20a6.2 6.2 0 0 0-2.2-4.4"/></>),
  bed: icon(<><path d="M3 19v-7h18v7"/><path d="M3 19v2M21 19v2"/><path d="M7 12V8.5A1.5 1.5 0 0 1 8.5 7h7A1.5 1.5 0 0 1 17 8.5V12"/></>),
};

export function AmenityIcon({ kind }: { kind: AmenityKey }) {
  return <>{Icons[kind]}</>;
}

export { Icons };