import { z } from "zod";

// Tools as plain objects matching what AI SDK v6 streamText expects internally:
// { description, inputSchema (not parameters), execute }
export const tools: Record<string, any> = {
  quiz_question: {
    description:
      "Display an interactive quiz question. Use this tool whenever generating quiz questions so they render as clickable, interactive cards. Always include the source material citation.",
    inputSchema: z.object({
      question: z.string().describe("The quiz question text"),
      type: z
        .enum(["multiple_choice", "true_false", "short_answer"])
        .describe("Question type"),
      options: z
        .array(z.string())
        .optional()
        .describe("Answer options for multiple choice (A, B, C, D) or true/false"),
      correct_answer: z
        .string()
        .describe("The correct answer (letter for MC, true/false for TF, or text for short answer)"),
      explanation: z
        .string()
        .describe("Explanation of why this is the correct answer"),
      source: z
        .string()
        .describe("Source material citation (e.g., 'Chapter 5' or 'ACA Code B.1.c')"),
    }),
    execute: async () => ({ displayed: true }),
  },

  flashcard: {
    description:
      "Display a flippable flashcard for a term or concept. Use this when explaining terms, definitions, or key concepts so they render as interactive flip cards.",
    inputSchema: z.object({
      front: z
        .string()
        .describe("The term, concept, or question on the front of the card"),
      back: z
        .string()
        .describe("The definition, explanation, or answer on the back"),
      source: z.string().describe("Source material citation"),
    }),
    execute: async () => ({ displayed: true }),
  },

  case_breakdown: {
    description:
      "Display a structured case law breakdown. Use this when discussing legal cases to show them in a clear, organized format.",
    inputSchema: z.object({
      case_name: z
        .string()
        .describe("Name of the case (e.g., 'Tarasoff v. Regents')"),
      year: z.string().describe("Year of the ruling"),
      facts: z.string().describe("Key facts of the case"),
      legal_question: z.string().describe("The central legal question"),
      ruling: z.string().describe("What the court decided"),
      precedent: z.string().describe("The legal precedent established"),
      impact: z
        .string()
        .describe("How this affects counseling practice today"),
      source: z.string().describe("Source material citation"),
    }),
    execute: async () => ({ displayed: true }),
  },

  confidence_check: {
    description:
      "Display a confidence check for the student to rate their comfort level with topics. Use this at the start of a review session to identify weak areas.",
    inputSchema: z.object({
      topics: z
        .array(
          z.object({
            name: z.string().describe("Topic name"),
            description: z
              .string()
              .describe("Brief description of what this topic covers"),
          })
        )
        .describe("List of topics to rate confidence on"),
    }),
    execute: async () => ({ displayed: true }),
  },

  quiz_session_start: {
    description:
      "Display a Test Brief card before starting a structured quiz session. Call this BEFORE asking Q1 whenever the user provides specific test requirements (question count, topic breakdown, professor instructions). This commits you to the plan — do not deviate from it.",
    inputSchema: z.object({
      title: z.string().describe("Session title, e.g. 'Crisis Theory & PFA Quiz'"),
      instructions_summary: z
        .string()
        .describe("One-sentence paraphrase of what was requested"),
      total_questions: z.number().describe("Total number of questions in the session"),
      topics: z
        .array(
          z.object({
            name: z.string().describe("Topic name"),
            question_count: z.number().describe("Number of questions for this topic"),
          })
        )
        .describe("Topic breakdown with question counts"),
      question_types: z
        .string()
        .describe("Question format note, e.g. 'Multiple choice and short answer'"),
    }),
    execute: async () => ({ displayed: true }),
  },

  quiz_session_end: {
    description:
      "Display a score card after the final question in a structured quiz session. Call this after evaluating the student's last answer to close out the session with a full score summary.",
    inputSchema: z.object({
      total_questions: z.number().describe("Total questions in the session"),
      correct: z.number().describe("Number of correct answers"),
      score_percent: z.number().describe("Score as a percentage (0-100)"),
      topic_breakdown: z
        .array(
          z.object({
            topic: z.string().describe("Topic name"),
            correct: z.number().describe("Correct answers for this topic"),
            total: z.number().describe("Total questions for this topic"),
          })
        )
        .describe("Per-topic score breakdown"),
      strong_areas: z
        .array(z.string())
        .describe("Topics where the student performed well"),
      weak_areas: z
        .array(z.string())
        .describe("Topics that need more work"),
      recommendation: z
        .string()
        .describe("One or two sentences suggesting what to study next"),
    }),
    execute: async () => ({ displayed: true }),
  },
};
