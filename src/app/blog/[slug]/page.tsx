import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getBlogBySlug, getBlogPosts } from "@/lib/content";
import { blogPosts as fallbackBlog, site } from "@/content/site";
import { SubpageNav } from "@/components/SubpageNav";
import { isValidPublicSlug, slugify } from "@/lib/slugify";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = new Set<string>(fallbackBlog.map((p) => p.slug));
  try {
    const posts = await getBlogPosts();
    for (const p of posts) slugs.add(p.slug);
  } catch {
    /* fallbackBlog stačí */
  }
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return { title: "Článek" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) notFound();

  // Staré odkazy s háčky/mezerami → kanonická URL bez 404
  if (!isValidPublicSlug(slug) || post.slug !== slug) {
    redirect(`/blog/${post.slug}`);
  }

  return (
    <article className="prose-blog">
      <SubpageNav
        backHref="/blog"
        backLabel="Zpět na články"
        extra={[{ href: "/", label: "Na úvod" }]}
      />
      <p className="svc-label">Blog</p>
      <h1 className="font-display text-3xl font-bold leading-tight md:text-4xl">{post.title}</h1>
      <p className="mt-3 text-sm text-[var(--muted)]">
        <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("cs-CZ")}</time>
        {" · "}
        {site.brandName}, {site.place}
      </p>
      {post.body.map((para) => (
        <p key={para.slice(0, 24)}>{para}</p>
      ))}
      <p className="mt-6 text-sm text-[var(--muted)]">
        Související:{" "}
        <Link href="/sluzby" className="font-semibold text-[var(--accent)]">
          služby
        </Link>
        {" · "}
        <Link href="/lesteni-laku-praha" className="font-semibold text-[var(--accent)]">
          leštění laku
        </Link>
        {" · "}
        <Link
          href="/keramicka-ochrana-praha"
          className="font-semibold text-[var(--accent)]"
        >
          keramická ochrana
        </Link>
        {" · "}
        <Link href="/faq" className="font-semibold text-[var(--accent)]">
          FAQ
        </Link>
        {" · "}
        <Link href="/detailing-praha-9" className="font-semibold text-[var(--accent)]">
          detailing Praha 9
        </Link>
      </p>
      <p className="mt-10">
        <Link href="/#objednat" className="btn-primary inline-flex">
          Domluvit termín
        </Link>
      </p>
      <SubpageNav
        place="bottom"
        backHref="/blog"
        backLabel="Zpět na články"
        extra={[{ href: "/", label: "Na úvod" }]}
      />
    </article>
  );
}
