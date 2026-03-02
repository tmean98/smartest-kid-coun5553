"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface InputBarProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onModeClick: (command: string) => void;
  modes?: string[];
}

const ALL_ACTIONS: Record<string, { label: string; command: string }> = {
  quiz: { label: "Quiz", command: "/quiz " },
  explain: { label: "Explain", command: "/explain " },
  cases: { label: "Cases", command: "/cases " },
  review: { label: "Review", command: "/review " },
  discuss: { label: "Discuss", command: "/discuss " },
  draft: { label: "Draft", command: "/draft " },
};

export function InputBar({
  input,
  setInput,
  onSubmit,
  isLoading,
  onModeClick,
  modes,
}: InputBarProps) {
  const quickActions = (modes || ["quiz", "explain", "cases", "review"])
    .map((m) => ALL_ACTIONS[m])
    .filter(Boolean);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [input]);

  // Focus textarea when input changes from mode buttons
  useEffect(() => {
    if (input && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [input]);

  return (
    <div className="border-t bg-background px-4 pb-4 pt-3">
      <div className="max-w-3xl mx-auto">
        {/* Quick action buttons */}
        <div className="flex gap-2 mb-3">
          {quickActions.map((action) => (
            <Button
              key={action.command}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => onModeClick(action.command)}
            >
              {action.label}
            </Button>
          ))}
        </div>

        {/* Input form */}
        <form onSubmit={onSubmit} className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (input.trim() && !isLoading) {
                  onSubmit(e);
                }
              }
            }}
            placeholder="Ask about course material..."
            className="flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[42px] max-h-[200px]"
            rows={1}
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="sm"
            disabled={!input.trim() || isLoading}
            className="h-[42px] px-4"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M3.105 2.29a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.897 28.897 0 0015.293-7.155.75.75 0 000-1.114A28.897 28.897 0 003.105 2.289z" />
              </svg>
            )}
          </Button>
        </form>

        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          Powered by Claude. Course materials are the source of truth.
        </p>
      </div>
    </div>
  );
}
