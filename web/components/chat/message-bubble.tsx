"use client";

import type { UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import { QuizQuestion } from "@/components/tools/quiz-question";
import { Flashcard } from "@/components/tools/flashcard";
import { CaseBreakdown } from "@/components/tools/case-breakdown";
import { ConfidenceCheck } from "@/components/tools/confidence-check";
import { QuizSessionStart } from "@/components/tools/quiz-session-start";
import { QuizSessionEnd } from "@/components/tools/quiz-session-end";

interface MessageBubbleProps {
  message: UIMessage;
  onConfidenceSubmit?: (ratings: Record<string, string>) => void;
  onQuizAnswer?: (answer: string, correct: boolean) => void;
  isLoading?: boolean;
}

function renderToolPart(
  part: Extract<UIMessage["parts"][number], { type: string }>,
  onConfidenceSubmit?: (ratings: Record<string, string>) => void,
  onQuizAnswer?: (answer: string, correct: boolean) => void,
  isLoading?: boolean
) {
  let toolName: string;
  let args: Record<string, unknown>;
  let state: string;

  if (part.type === "dynamic-tool") {
    const dynamicPart = part as any;
    toolName = dynamicPart.toolName;
    args = dynamicPart.input || {};
    state = dynamicPart.state;
  } else if (part.type.startsWith("tool-")) {
    toolName = part.type.replace("tool-", "");
    const toolPart = part as any;
    args = toolPart.input || {};
    state = toolPart.state;
  } else {
    return null;
  }

  if (state !== "output-available" && state !== "output-error") {
    return (
      <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        Generating...
      </div>
    );
  }

  switch (toolName) {
    case "quiz_question":
      return <QuizQuestion {...(args as any)} onAnswer={onQuizAnswer} disabled={isLoading} />;
    case "flashcard":
      return <Flashcard {...(args as any)} />;
    case "case_breakdown":
      return <CaseBreakdown {...(args as any)} />;
    case "confidence_check":
      return (
        <ConfidenceCheck {...(args as any)} onSubmit={onConfidenceSubmit} />
      );
    case "quiz_session_start":
      return <QuizSessionStart {...(args as any)} />;
    case "quiz_session_end":
      return <QuizSessionEnd {...(args as any)} />;
    default:
      return null;
  }
}

export function MessageBubble({
  message,
  onConfidenceSubmit,
  onQuizAnswer,
  isLoading,
}: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] ${
          isUser
            ? "rounded-2xl rounded-br-md bg-primary text-primary-foreground px-4 py-2.5"
            : "w-full"
        }`}
      >
        {message.parts.map((part, i) => {
          if (part.type === "text") {
            if (isUser) {
              return (
                <div
                  key={i}
                  className="text-sm leading-relaxed whitespace-pre-wrap"
                >
                  {part.text}
                </div>
              );
            }

            return (
              <div key={i} className="text-sm leading-relaxed markdown-content">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-lg font-bold mt-4 mb-2 first:mt-0">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-base font-semibold mt-4 mb-1.5 first:mt-0">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-sm font-semibold mt-3 mb-1 first:mt-0">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="mb-2 last:mb-0">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="mb-2 ml-4 list-disc space-y-0.5">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-2 ml-4 list-decimal space-y-0.5">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="leading-relaxed">{children}</li>
                    ),
                    strong: ({ children }) => (
                      <span>{children}</span>
                    ),
                    em: ({ children }) => (
                      <span>{children}</span>
                    ),
                    blockquote: ({ children }) => (
                      <div className="ml-3 pl-3 border-l-2 border-muted-foreground/30 my-1">
                        {children}
                      </div>
                    ),
                  }}
                >
                  {part.text}
                </ReactMarkdown>
              </div>
            );
          }

          if (
            part.type === "dynamic-tool" ||
            part.type.startsWith("tool-")
          ) {
            return (
              <div key={i}>
                {renderToolPart(part, onConfidenceSubmit, onQuizAnswer, isLoading)}
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
