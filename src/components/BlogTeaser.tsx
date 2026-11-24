import Link from "next/link";
import type { BlogPostItem } from "@/lib/content/types";

export function BlogTeaser({ posts }: { posts: BlogPostItem[] }) {
  return (
    <section className="after-film after-film--blog" aria-label="Blog a rady">
      <div className="after-film-inner">
        <p className="svc-label">Blog</p>
        <h2 className="font-display text-3xl font-bold md:text-4xl">Rady k detailingu</h2>
        <p className="mt-3 max-w-xl text-[var(--muted)]">
          Články o leštění, keramice a péči o auto — abyste věděli, co objednáváte.
        </p>

        <ul className="blog-grid mt-8">
          {posts
            .filter((post, i, all) => all.findIndex((p) => p.slug === post.slug) === i)
            .map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="blog-card">
                <time className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                  {new Date(post.date).toLocaleDateString("cs-CZ")}
                </time>
                <h3 className="mt-2 font-display text-lg font-bold leading-snug">{post.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{post.excerpt}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-[var(--accent)]">
                  Číst článek →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-8">
          <Link href="/blog" className="text-sm font-semibold text-[var(--accent)]">
            Všechny články
          </Link>
        </p>
      </div>
    </section>
  );
}
