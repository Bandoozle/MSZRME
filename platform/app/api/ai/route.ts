import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages, system } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages array required" }, { status: 400 });
    }

    const model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";

    const response = await client.messages.create({
      model,
      max_tokens: 1024,
      system: system ?? "You are Tom, an HVAC business coach on the MSZRME platform. Be concise, specific, and data-driven. Reference the dealer's actual KPIs when relevant.",
      messages,
    });

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    return NextResponse.json({ text });
  } catch (err) {
    console.error("AI route error:", err);
    return NextResponse.json(
      { error: "AI request failed. Check ANTHROPIC_API_KEY in .env.local." },
      { status: 500 }
    );
  }
}
