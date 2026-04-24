"use server";

import { redirect } from "next/navigation";

import {
  clearSessionProfile,
  setSessionProfile,
  type DashboardProfile,
} from "@/lib/auth";

export async function createWorkspaceSession(formData: FormData) {
  const profile: DashboardProfile = {
    name: String(formData.get("name") ?? "").trim() || "Candidate",
    role: String(formData.get("role") ?? "AI Engineer"),
    timeline: String(formData.get("timeline") ?? "60") as "30" | "60" | "90",
    dailyHours: String(formData.get("dailyHours") ?? "2"),
    interviewDate: String(formData.get("interviewDate") ?? ""),
    focus: String(formData.get("focus") ?? "System Design"),
  };

  await setSessionProfile(profile);
  redirect("/dashboard");
}

export async function endWorkspaceSession() {
  await clearSessionProfile();
  redirect("/");
}
