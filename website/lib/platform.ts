const PLATFORM_URL = (
  process.env.NEXT_PUBLIC_PLATFORM_URL ?? "http://localhost:3001"
).replace(/\/$/, "");

/** Platform onboarding URL after signup auto-sign-in. */
export function platformOnboardingUrl() {
  return `${PLATFORM_URL}/onboarding`;
}

/** Platform dashboard URL after onboarding is complete. */
export function platformDashboardUrl() {
  return `${PLATFORM_URL}/dashboard`;
}

/** Platform sign-in URL. Defaults `from=website` for marketing-site traffic. */
export function platformSignInUrl(opts?: {
  email?: string;
  from?: string;
  signedup?: boolean;
}) {
  const params = new URLSearchParams();
  params.set("from", opts?.from ?? "website");
  if (opts?.email) params.set("email", opts.email);
  if (opts?.signedup) params.set("signedup", "1");
  return `${PLATFORM_URL}/login?${params.toString()}`;
}

export { PLATFORM_URL };
