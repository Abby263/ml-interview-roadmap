import { cookies } from "next/headers";

export const profileCookieName = "ml-roadmap-profile";

export interface DashboardProfile {
  name: string;
  role: string;
  timeline: "30" | "60" | "90";
  dailyHours: string;
  interviewDate: string;
  focus: string;
}

function encodeProfile(profile: DashboardProfile) {
  return Buffer.from(JSON.stringify(profile)).toString("base64url");
}

function decodeProfile(value: string) {
  return JSON.parse(
    Buffer.from(value, "base64url").toString("utf8")
  ) as DashboardProfile;
}

export async function getSessionProfile() {
  const cookieStore = await cookies();
  const session = cookieStore.get(profileCookieName);

  if (!session?.value) {
    return null;
  }

  try {
    return decodeProfile(session.value);
  } catch {
    return null;
  }
}

export async function setSessionProfile(profile: DashboardProfile) {
  const cookieStore = await cookies();

  cookieStore.set(profileCookieName, encodeProfile(profile), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 120,
  });
}

export async function clearSessionProfile() {
  const cookieStore = await cookies();
  cookieStore.delete(profileCookieName);
}
