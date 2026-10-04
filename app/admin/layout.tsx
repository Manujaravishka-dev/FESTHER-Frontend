import type { Metadata } from "next";
import AdminShell from "./admin-shell";
import "./admin.css";

export const metadata: Metadata = {
  title: "FESTHER Admin",
  description: "FESTHER Estate administration — gallery, comments and offers management.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <AdminShell>{children}</AdminShell>;
}