import { verifyUser } from "@/lib/middleware/verify-user";
import { NextRequest, NextResponse } from "next/server";

// ponytail: free-tier Gemini via REST, no SDK. Override model with GEMINI_MODEL if Google renames it.
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const schema = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    sections: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          heading: { type: "STRING" },
          paragraphs: { type: "ARRAY", items: { type: "STRING" } },
          bullets: { type: "ARRAY", items: { type: "STRING" } },
        },
        required: ["heading", "paragraphs"],
      },
    },
  },
  required: ["title", "sections"],
};

type Section = { heading: string; paragraphs: string[]; bullets?: string[] };

// EditorJS renders block text as HTML
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function toEditorBlocks(title: string, sections: Section[]) {
  const blocks: any[] = [
    { type: "header", data: { text: esc(title), level: 1 } },
  ];
  for (const s of sections) {
    blocks.push({ type: "header", data: { text: esc(s.heading), level: 2 } });
    for (const p of s.paragraphs)
      blocks.push({ type: "paragraph", data: { text: esc(p) } });
    if (s.bullets?.length) {
      blocks.push({
        type: "list",
        data: {
          style: "unordered",
          meta: {},
          items: s.bullets.map((b) => ({
            content: esc(b),
            meta: {},
            items: [],
          })),
        },
      });
    }
  }
  return blocks;
}

export async function POST(request: NextRequest) {
  const { user, error } = await verifyUser(request);
  if (error || !user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { success: false, message: "GEMINI_API_KEY is not set" },
      { status: 500 }
    );
  }

  const { brief } = await request.json().catch(() => ({}));
  if (typeof brief !== "string" || brief.trim().length < 10) {
    return NextResponse.json(
      { success: false, message: "Describe the project in a bit more detail" },
      { status: 400 }
    );
  }

  const prompt = `You are an expert freelance/agency proposal writer. Write a persuasive, professional client proposal based on this brief:

"""${brief.slice(0, 4000)}"""

Include sections: Introduction, Understanding of the Problem, Proposed Solution, Scope & Deliverables, Timeline, Pricing, Why Us, Next Steps.
Use bullets for deliverables, milestones and pricing lines. If the brief lacks a detail (price, dates), make a sensible placeholder in [brackets]. Plain text only, no markdown.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema,
          },
        }),
      }
    );

    if (!res.ok) {
      console.error("Gemini error:", res.status, await res.text());
      const message =
        res.status === 429
          ? "AI rate limit hit, try again in a minute"
          : "AI generation failed";
      return NextResponse.json({ success: false, message }, { status: 502 });
    }

    const json = await res.json();
    const { title, sections } = JSON.parse(
      json.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}"
    );
    if (!title || !Array.isArray(sections))
      throw new Error("Malformed AI response");

    return NextResponse.json({
      success: true,
      data: { time: Date.now(), blocks: toEditorBlocks(title, sections) },
    });
  } catch (err) {
    console.error("generate-proposal failed:", err);
    return NextResponse.json(
      { success: false, message: "AI generation failed" },
      { status: 500 }
    );
  }
}
