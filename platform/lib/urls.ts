export const WEBSITE_URL = (
  process.env.NEXT_PUBLIC_WEBSITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export function isWebsiteReferral(from: string | null) {
  return from === "website";
}
