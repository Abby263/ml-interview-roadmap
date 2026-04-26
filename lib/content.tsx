import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import type { Difficulty } from "@/lib/site-data";

const CONTENT_ROOT = path.join(process.cwd(), "content");

export interface CaseStudyFrontmatter {
  title: string;
  description: string;
  track: "ML System Design" | "Generative AI";
  difficulty: Difficulty;
  prompt: string;
  concepts: string[];
  evaluationLens: string[];
}

export interface CaseStudySummary extends CaseStudyFrontmatter {
  slug: string;
}

function getCollectionPath(collection: "case-studies") {
  return path.join(CONTENT_ROOT, collection);
}

async function listMdxSlugs(collection: "case-studies") {
  const files = await fs.readdir(getCollectionPath(collection));

  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""))
    .sort();
}

async function readCollectionFile(
  collection: "case-studies",
  slug: string
) {
  return fs.readFile(path.join(getCollectionPath(collection), `${slug}.mdx`), "utf8");
}

function extractFrontmatter<T>(source: string) {
  const { data } = matter(source);
  return data as T;
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

export async function getCaseStudyStaticParams() {
  return (await listMdxSlugs("case-studies")).map((slug) => ({ slug }));
}
