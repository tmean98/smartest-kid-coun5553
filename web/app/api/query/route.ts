import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { NextResponse } from "next/server";
import { getChunks } from "@/lib/materials";
import { selectChunks } from "@/lib/context";
import { COURSES, type CourseId } from "@/lib/courses";

export const maxDuration = 60;

const SYSTEM_PROMPT = `You are a study assistant for a Clinical Mental Health Counseling graduate student at Northwest University. Answer questions accurately and concisely using only the provided course materials. Ground every claim in those materials. If the materials don't cover the question, say so briefly and note which course or chapter might address it.`;

export async function POST(req: Request) {
  // API key check
  const expectedKey = process.env.QUERY_API_KEY;
  if (!expectedKey) {
    return NextResponse.json({ error: "QUERY_API_KEY not configured" }, { status: 500 });
  }
  if (req.headers.get("x-api-key") !== expectedKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { question, course } = (await req.json()) as {
    question: string;
    course?: string;
  };

  if (!question?.trim()) {
    return NextResponse.json({ error: "question is required" }, { status: 400 });
  }

  // Resolve which courses to search
  const courseIds: CourseId[] =
    course && course in COURSES
      ? [course as CourseId]
      : (Object.keys(COURSES) as CourseId[]);

  // Collect relevant chunks across courses
  const selected: { title: string; courseCode: string; source: string; content: string }[] = [];

  for (const courseId of courseIds) {
    const config = COURSES[courseId];
    const chunks = await getChunks(courseId);
    const matches = selectChunks(config, chunks, question);
    for (const chunk of matches) {
      selected.push({
        title: chunk.title,
        courseCode: config.code,
        source: chunk.source,
        content: chunk.content,
      });
    }
  }

  const sources = selected.map((c) => `[${c.courseCode}] ${c.title}`);

  const context = selected
    .map(
      (c) =>
        `<material course="${c.courseCode}" source="${c.source}" title="${c.title}">\n${c.content}\n</material>`
    )
    .join("\n\n");

  const prompt = context
    ? `Using the following course materials, answer the question.\n\n${context}\n\nQuestion: ${question}`
    : `Question: ${question}\n\n(No matching course materials found — answer from general knowledge if possible.)`;

  const { text } = await generateText({
    model: anthropic("claude-sonnet-4-5-20250929"),
    system: SYSTEM_PROMPT,
    prompt,
  });

  return NextResponse.json({ answer: text, sources });
}
