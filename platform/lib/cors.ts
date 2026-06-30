import { NextResponse } from "next/server";

export function websiteOrigin(): string {
  return (process.env.NEXT_PUBLIC_WEBSITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    ""
  );
}

export function isAllowedWebsiteOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return origin.replace(/\/$/, "") === websiteOrigin();
}

export function withWebsiteCors(
  response: NextResponse,
  origin: string | null
): NextResponse {
  if (!isAllowedWebsiteOrigin(origin)) return response;
  response.headers.set("Access-Control-Allow-Origin", websiteOrigin());
  response.headers.set("Access-Control-Allow-Credentials", "true");
  return response;
}

export function websiteCorsPreflightResponse(origin: string | null): NextResponse {
  if (!isAllowedWebsiteOrigin(origin)) {
    return new NextResponse(null, { status: 403 });
  }
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": websiteOrigin(),
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
