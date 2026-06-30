import type { SupabaseClient } from "@supabase/supabase-js";
import type { SessionUser, UserRole } from "@/context/PlatformContext";
import { KPI as DEFAULT_KPI } from "@/lib/platform/data/kpi";
import { getStage } from "@/lib/platform/utils/format";

export interface OnboardingData {
  displayName: string;
  businessName: string;
  businessType: string;
  annualRevenue: number;
}

export interface DbProfile {
  id: string;
  email: string;
  role: UserRole;
  display_name: string;
  business_name: string;
  tier: number;
  stage: string;
  first_time: boolean;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((s) => s[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export async function fetchProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<DbProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, role, display_name, business_name, tier, stage, first_time")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return data as DbProfile;
}

/** Load profile, creating one from auth metadata if the signup trigger was missed. */
export async function ensureProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<DbProfile | null> {
  const existing = await fetchProfile(supabase, userId);
  if (existing) return existing;

  const { data, error } = await supabase.rpc("ensure_own_profile");
  if (error || !data) return null;
  return data as DbProfile;
}

export function profileToSessionUser(profile: DbProfile): SessionUser {
  const yearRev = DEFAULT_KPI.Year.tsr;
  return {
    id: profile.id,
    email: profile.email,
    role: profile.role === "admin" ? "admin" : "dealer",
    name: profile.display_name || profile.email.split("@")[0],
    biz: profile.business_name || "Your Business",
    initials: initials(profile.display_name || profile.email),
    tier: profile.tier ?? 1,
    stage: profile.stage || getStage(yearRev),
    firstTime: profile.first_time ?? false,
  };
}

export async function persistOnboarding(
  supabase: SupabaseClient,
  userId: string,
  data: OnboardingData
): Promise<DbProfile | null> {
  const stage = getStage(data.annualRevenue);
  const displayName = data.displayName.trim();
  const businessName = data.businessName.trim();

  const { data: rpcProfile, error: rpcError } = await supabase.rpc(
    "complete_onboarding",
    {
      p_display_name: displayName,
      p_business_name: businessName,
      p_stage: stage,
    }
  );

  if (!rpcError && rpcProfile) {
    return rpcProfile as DbProfile;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName,
      business_name: businessName,
      stage,
      first_time: false,
    })
    .eq("id", userId)
    .select("id, email, role, display_name, business_name, tier, stage, first_time")
    .single();

  if (error || !profile) {
    console.error("persistOnboarding failed:", rpcError?.message ?? error?.message);
    return null;
  }
  return profile as DbProfile;
}
