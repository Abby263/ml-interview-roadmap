import type { Metadata } from "next";

import RoadmapView from "@/components/RoadmapView";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "Your ML Architect prep, visualized: 6 phases across 126 days, with progress tracking, calendar, and streak.",
};

export default function RoadmapPage() {
  return <RoadmapView />;
}
