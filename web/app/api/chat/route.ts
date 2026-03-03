import { anthropic } from "@ai-sdk/anthropic";
import { streamText, type UIMessage, convertToModelMessages } from "ai";
import { selectChunks } from "@/lib/context";
import { buildSystemPrompt } from "@/lib/system-prompt";
import { getChunks } from "@/lib/materials";
import { COURSES, type CourseId } from "@/lib/courses";
import { tools } from "@/lib/tools";

export const maxDuration = 60;

function detectMode(message: string): string | undefined {
  const lower = message.toLowerCase().trim();
  // Quiz: explicit command, direct mentions, quiz-answer follow-ups, or structured test instructions
  if (
    lower.startsWith("/quiz") ||
    lower.includes("quiz") ||
    lower.includes("next question") ||
    lower.startsWith("my answer:") ||
    /\btest\b/.test(lower) ||
    /\bexam\b/.test(lower)
  ) return "quiz";
  if (lower.startsWith("/explain") || lower.includes("explain")) return "explain";
  if (lower.startsWith("/cases") || lower.includes("case breakdown")) return "cases";
  if (lower.startsWith("/review") || lower.includes("review session")) return "review";
  if (lower.startsWith("/discuss") || lower.includes("discussion board") || lower.includes("discussion post")) return "discuss";
  if (lower.startsWith("/draft") || lower.includes("paper outline") || lower.includes("write a paper")) return "draft";
  return undefined;
}

function getTextFromUIMessage(message: UIMessage): string {
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join(" ");
}

export async function POST(req: Request) {
  const { messages, courseId } = (await req.json()) as {
    messages: UIMessage[];
    courseId?: CourseId;
  };

  const config = COURSES[courseId || "coun5553"];
  const chunks = await getChunks(config.id);

  // Get the latest user message text
  const lastUserMessage = [...messages]
    .reverse()
    .find((m) => m.role === "user");
  const messageText = lastUserMessage ? getTextFromUIMessage(lastUserMessage) : "";

  // Get recent user message texts for context
  const recentMessages = messages
    .filter((m) => m.role === "user")
    .slice(-3)
    .map((m) => getTextFromUIMessage(m));

  // Detect mode and select relevant chunks
  const mode = detectMode(messageText);
  // Skip context loading for quiz answer follow-ups — the conversation history
  // already carries all needed context, and re-loading materials on every answer
  // adds ~37K tokens and causes slow responses.
  const isQuizAnswer = messageText.toLowerCase().startsWith("my answer:");
  const selectedChunks = isQuizAnswer
    ? []
    : selectChunks(config, chunks, messageText, recentMessages);

  // Build system prompt with selected chunks
  const systemPrompt = buildSystemPrompt(config, selectedChunks, mode);

  // Cap history to prevent unbounded token growth in long quiz sessions
  const MAX_HISTORY = 20;
  const trimmedMessages = messages.length > MAX_HISTORY
    ? messages.slice(-MAX_HISTORY)
    : messages;
  const modelMessages = await convertToModelMessages(trimmedMessages);

  // Route to Haiku for quiz answer turns — they only need brief feedback + tool call
  const model = isQuizAnswer
    ? anthropic("claude-haiku-4-5-20251001")
    : anthropic("claude-sonnet-4-5-20250929");

  const result = streamText({
    model,
    system: systemPrompt,
    messages: modelMessages,
    tools,
    onFinish: ({ usage }) => {
      const inTok = usage.inputTokens ?? 0;
      const outTok = usage.outputTokens ?? 0;
      const inputCost = (inTok / 1_000_000) * (isQuizAnswer ? 0.80 : 3.00);
      const outputCost = (outTok / 1_000_000) * (isQuizAnswer ? 4.00 : 15.00);
      console.log(
        `[tokens] ${courseId ?? "coun5553"} | ${isQuizAnswer ? "haiku" : "sonnet"} | ` +
        `in=${inTok} out=${outTok} | ~$${(inputCost + outputCost).toFixed(4)}`
      );
    },
  });

  return result.toUIMessageStreamResponse();
}
