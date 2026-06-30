import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: "Signup is not configured. Add Supabase env vars." },
      { status: 503 }
    );
  }

  let body: { email?: string; password?: string; businessName?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  const businessName = body.businessName?.trim() ?? "";

  if (!businessName) {
    return NextResponse.json({ error: "Business name is required." }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const displayName = businessName.split(/\s+/)[0] || businessName;

  const { data: created, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      business_name: businessName,
      display_name: displayName,
      first_time: true,
    },
  });

  if (error) {
    const message =
      error.message.includes("already been registered")
        ? "An account with this email already exists."
        : error.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (created.user) {
    await supabase.from("profiles").upsert(
      {
        id: created.user.id,
        email,
        display_name: displayName,
        business_name: businessName,
        role: "dealer",
        first_time: true,
      },
      { onConflict: "id", ignoreDuplicates: true }
    );
  }

  return NextResponse.json({ ok: true });
}
