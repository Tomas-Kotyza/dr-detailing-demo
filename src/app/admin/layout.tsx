import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin | Dr Detailing",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <header className="admin-top">
        <Link href="/admin" className="admin-brand">
          Dr Detailing · Admin
        </Link>
        <AdminNav />
      </header>
      <main className="admin-main">{children}</main>
    </div>
  );
}
