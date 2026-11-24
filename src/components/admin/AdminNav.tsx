"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Přehled" },
  { href: "/admin/poptavky", label: "Poptávky" },
  { href: "/admin/galerie", label: "Galerie" },
  { href: "/admin/predavaci-list", label: "Předání" },
  { href: "/admin/faktury", label: "Faktury" },
  { href: "/admin/plan", label: "Plán" },
  { href: "/admin/akce", label: "Akce" },
  { href: "/admin/sezona", label: "Sezóna" },
  { href: "/admin/novinky", label: "Novinky" },
  { href: "/admin/reviews", label: "Recenze" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/prices", label: "Ceník" },
  { href: "/admin/about", label: "O mně" },
  { href: "/admin/logo", label: "Logo" },
  { href: "/admin/vizitka", label: "Vizitky" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return null;

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <nav className="admin-nav" aria-label="Admin menu">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={
            l.href === "/admin"
              ? pathname === "/admin"
                ? "active"
                : undefined
              : pathname === l.href || pathname.startsWith(`${l.href}/`)
                ? "active"
                : undefined
          }
        >
          {l.label}
        </Link>
      ))}
      <button type="button" className="admin-logout" onClick={() => void logout()}>
        Odhlásit
      </button>
    </nav>
  );
}
