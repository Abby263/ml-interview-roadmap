import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import type { Difficulty, RoadmapSlug } from "@/lib/site-data";

const CONTENT_ROOT = path.join(process.cwd(), "content");

export interface BlogFrontmatter {
  title: string;
  description: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
}

export interface CaseStudyFrontmatter {
  title: string;
  description: string;
  track: "ML System Design" | "Generative AI";
  difficulty: Difficulty;
  prompt: string;
  concepts: string[];
  evaluationLens: string[];
}

export interface RoadmapGuideFrontmatter {
  title: string;
  summary: string;
  updatedAt: string;
}

export interface BlogSummary extends BlogFrontmatter {
  slug: string;
}

export interface CaseStudySummary extends CaseStudyFrontmatter {
  slug: string;
}

function getCollectionPath(collection: "blog" | "case-studies" | "roadmaps") {
  return path.join(CONTENT_ROOT, collection);
}

async function listMdxSlugs(collection: "blog" | "case-studies" | "roadmaps") {
  const files = await fs.readdir(getCollectionPath(collection));

  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""))
    .sort();
}

async function readCollectionFile(
  collection: "blog" | "case-studies" | "roadmaps",
  slug: string
) {
  return fs.readFile(path.join(getCollectionPath(collection), `${slug}.mdx`), "utf8");
}

function extractFrontmatter<T>(source: string) {
  const { data } = matter(source);
  return data as T;
}

export function formatContentDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}

export async function listBlogPosts(): Promise<BlogSummary[]> {
  const slugs = await listMdxSlugs("blog");

  const entries = await Promise.all(
    slugs.map(async (slug) => {
      const source = await readCollectionFile("blog", slug);
      return {
        slug,
        ...extractFrontmatter<BlogFrontmatter>(source),
      };
    })
  );

  return entries.sort(
    (left, right) =>
      new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()
  );
}

export async function getBlogPost(slug: string) {
  const source = await readCollectionFile("blog", slug);

  return compileMDX<BlogFrontmatter>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });
}

export async function listCaseStudyEntries(): Promise<CaseStudySummary[]> {
  const slugs = await listMdxSlugs("case-studies");

  const entries = await Promise.all(
    slugs.map(async (slug) => {
      const source = await readCollectionFile("case-studies", slug);
      return {
        slug,
        ...extractFrontmatter<CaseStudyFrontmatter>(source),
      };
    })
  );

  return entries.sort((left, right) => left.title.localeCompare(right.title));
}

export async function getCaseStudyEntry(slug: string) {
  const source = await readCollectionFile("case-studies", slug);

  return compileMDX<CaseStudyFrontmatter>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });
}

export async function getRoadmapGuide(slug: RoadmapSlug) {
  try {
    const source = await readCollectionFile("roadmaps", slug);

    return await compileMDX<RoadmapGuideFrontmatter>({
      source,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
      },
    });
  } catch {
    return null;
  }
}

export async function getBlogStaticParams() {
  return (await listMdxSlugs("blog")).map((slug) => ({ slug }));
}

export async function getCaseStudyStaticParams() {
  return (await listMdxSlugs("case-studies")).map((slug) => ({ slug }));
}
