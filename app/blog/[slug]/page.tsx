import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  formatContentDate,
  getBlogPost,
  getBlogStaticParams,
  listBlogPosts,
} from "@/lib/content";

export async function generateStaticParams() {
  return getBlogStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const posts = await listBlogPosts();
  const post = posts.find((entry) => entry.slug === slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug).catch(() => null);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-12">
      <section className="mx-auto max-w-4xl space-y-6">
        <p className="eyebrow">Editorial</p>
        <h1 className="hero-title text-[3.3rem] md:text-[4rem]">
          {post.frontmatter.title}
        </h1>
        <p className="hero-copy">{post.frontmatter.description}</p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="data-chip">
            {formatContentDate(post.frontmatter.publishedAt)}
          </span>
          <span className="data-chip">{post.frontmatter.readTime}</span>
          {post.frontmatter.tags.map((tag) => (
            <span key={tag} className="data-chip">
              {tag}
            </span>
          ))}
        </div>
      </section>

      <article className="section-card article-prose mx-auto max-w-4xl rounded-[2rem] p-6 md:p-10">
        {post.content}
      </article>
    </div>
  );
}
