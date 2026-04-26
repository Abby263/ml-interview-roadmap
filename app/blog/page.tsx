import Link from "next/link";

import { formatContentDate, listBlogPosts } from "@/lib/content";

export default async function BlogPage() {
  const blogPosts = await listBlogPosts();

  return (
    <div className="space-y-16">
      <section className="space-y-6">
        <p className="eyebrow">Blog</p>
        <h1 className="hero-title">SEO-driven content around ML interview preparation.</h1>
        <p className="hero-copy">
          The blog layer extends the learning plan into search-friendly entry points:
          ML system design, RAG interview prep, feature stores, LLM evaluation,
          and role-based prep guides.
        </p>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="section-card rounded-[28px] p-6 transition hover:-translate-y-1 hover:border-primary"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {formatContentDate(post.publishedAt)}
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold text-foreground">
              {post.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              {post.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-line px-3 py-1 text-xs font-medium text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm font-semibold text-foreground">
              {post.readTime}
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
