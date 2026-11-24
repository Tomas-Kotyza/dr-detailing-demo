import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/content";
import { site } from "@/content/site";
import { SubpageNav } from "@/components/SubpageNav";

export const metadata: Metadata = {
  title: "Blog — rady k detailingu",
  description:
    "Články o leštění karoserie Praha, keramické ochraně laku, rozleštění (cena), čištění interiérů a renovaci světel. Dr Detailing, Praha 9.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndexPage() {
  const blogPosts = await getBlogPosts();

  return (
    <main className="prose-blog">
      <SubpageNav extra={[{ href: "/sluzby", label: "Přehled služeb" }]} />
      <p className="svc-label">Blog</p>
      <h1 className="font-display text-4xl font-bold">Rady k detailingu</h1>
      <p className="mt-3 text-[var(--muted)]">
        {site.brandName} · {site.place}
      </p>
      <ul className="blog-grid mt-10">
        {blogPosts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="blog-card">
              <time className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                {new Date(post.date).toLocaleDateString("cs-CZ")}
              </time>
              <h2 className="mt-2 font-display text-xl font-bold">{post.title}</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">{post.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
      <SubpageNav
        place="bottom"
        extra={[{ href: "/sluzby", label: "Přehled služeb" }]}
      />
    </main>
  );
}
