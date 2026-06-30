import type { SessionUser } from "@/context/PlatformContext";

/** Post-login destination for dealers and admins. */
export function homePathForUser(user: SessionUser): string {
  if (user.role === "admin") return "/admin";
  if (user.firstTime) return "/onboarding";
  return "/dashboard";
}

export function isOnboardingPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname === "/onboarding" || pathname.startsWith("/onboarding/");
}
