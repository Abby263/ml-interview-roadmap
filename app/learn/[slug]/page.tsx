import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PillarPage from "@/components/PillarPage";
import { getPillarBySlug, pillars, type PillarSlug } from "@/lib/site-data";

export function generateStaticParams() {
  return pillars.map((pillar) => ({ slug: pillar.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pillar = getPillarBySlug(slug as PillarSlug);

  if (!pillar) {
    return {};
  }

  return {
    title: pillar.title,
    description: pillar.summary,
  };
}

export default async function LearnPillarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!getPillarBySlug(slug as PillarSlug)) {
    notFound();
  }

  return <PillarPage slug={slug as PillarSlug} />;
}
