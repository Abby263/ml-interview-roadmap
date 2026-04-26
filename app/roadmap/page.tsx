import type { Metadata } from "next";

import RoadmapView from "@/components/RoadmapView";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "Your ML interview prep, visualized from statistics through ML system design with progress tracking, calendar, and streak.",
};

export default function RoadmapPage() {
  return <RoadmapView />;
}
