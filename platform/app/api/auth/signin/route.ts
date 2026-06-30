import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import {
  isAllowedWebsiteOrigin,
  websiteCorsPreflightResponse,
  withWebsiteCors,
} from "@/lib/cors";

export async function OPTIONS(request: NextRequest) {
  return websiteCorsPreflightResponse(request.headers.get("origin"));
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!isAllowedWebsiteOrigin(origin)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return withWebsiteCors(
      NextResponse.json({ error: "Auth is not configured." }, { status: 503 }),
      origin
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return withWebsiteCors(
      NextResponse.json({ error: "Invalid request body." }, { status: 400 }),
      origin
    );
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  if (!email || !password) {
    return withWebsiteCors(
      NextResponse.json({ error: "Email and password are required." }, { status: 400 }),
      origin
    );
  }

  let response = NextResponse.json({ ok: true });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return withWebsiteCors(
      NextResponse.json({ error: error.message }, { status: 401 }),
      origin
    );
  }

  return withWebsiteCors(response, origin);
}
