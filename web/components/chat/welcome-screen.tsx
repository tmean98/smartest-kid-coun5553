"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useCourse } from "@/lib/course-context";
import { COURSES } from "@/lib/courses";

interface WelcomeScreenProps {
  onPrompt: (text: string) => void;
}

const ALL_MODES: Record<string, { title: string; command: string; description: string; icon: string }> = {
  quiz: {
    title: "Quiz",
    command: "/quiz",
    description: "Test your knowledge with interactive questions",
    icon: "?",
  },
  explain: {
    title: "Explain",
    command: "/explain",
    description: "Get clear explanations of concepts and terms",
    icon: "i",
  },
  cases: {
    title: "Cases",
    command: "/cases",
    description: "Break down cases and scenarios",
    icon: "\u00A7",
  },
  review: {
    title: "Review",
    command: "/review",
    description: "Comprehensive review session for exams",
    icon: "\u2713",
  },
  discuss: {
    title: "Discuss",
    command: "/discuss",
    description: "Prep sources and structure for discussion posts",
    icon: "\u{1F4AC}",
  },
  draft: {
    title: "Draft",
    command: "/draft",
    description: "Build a paper outline with sources and APA cites",
    icon: "\u{1F4DD}",
  },
};

export function WelcomeScreen({ onPrompt }: WelcomeScreenProps) {
  const { courseId } = useCourse();
  const config = courseId ? COURSES[courseId] : null;

  const modes = (config?.modes || ["quiz", "explain", "cases", "review"])
    .map((m) => ALL_MODES[m])
    .filter(Boolean);

  const examples = config?.welcomeExamples || [
    "What are the key concepts from this week?",
    "Quiz me on the readings",
  ];

  const subtitle = config
    ? `${config.code} \u00B7 ${config.title}`
    : "Study Assistant";

  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 max-w-2xl mx-auto">
      <img
        src="/avatar.jpg"
        alt="Smartest Kid"
        className="size-20 rounded-full object-cover mb-4"
      />
      <h1 className="text-3xl font-bold tracking-tight mb-1">Smartest Kid</h1>
      <p className="text-muted-foreground text-sm mb-1">{subtitle}</p>
      <p className="text-muted-foreground text-xs italic mb-8">
        Your AI study partner who actually did the reading
      </p>

      <div
        className={`grid gap-3 w-full mb-8 ${
          modes.length <= 3
            ? "grid-cols-3"
            : modes.length <= 4
              ? "grid-cols-2 sm:grid-cols-4"
              : "grid-cols-2 sm:grid-cols-3"
        }`}
      >
        {modes.map((mode) => (
          <Card
            key={mode.command}
            className="cursor-pointer transition-all border-primary/20 hover:border-primary/50"
            onClick={() => onPrompt(mode.command + " ")}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold mb-1 text-primary">
                {mode.icon}
              </div>
              <p className="text-sm font-semibold">{mode.title}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {mode.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="w-full">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
          Try asking...
        </p>
        <div className="flex flex-col gap-2">
          {examples.map((example) => (
            <button
              key={example}
              className="text-left text-sm px-4 py-2.5 rounded-lg border hover:bg-muted/50 transition-colors"
              onClick={() => onPrompt(example)}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
