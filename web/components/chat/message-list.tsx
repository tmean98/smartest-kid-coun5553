"use client";

import { useEffect, useRef } from "react";
import type { UIMessage } from "ai";
import { MessageBubble } from "./message-bubble";

interface MessageListProps {
  messages: UIMessage[];
  isLoading: boolean;
  onConfidenceSubmit?: (ratings: Record<string, string>) => void;
  onQuizAnswer?: (answer: string, correct: boolean) => void;
}

export function MessageList({
  messages,
  isLoading,
  onConfidenceSubmit,
  onQuizAnswer,
}: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-4">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            onConfidenceSubmit={onConfidenceSubmit}
            onQuizAnswer={onQuizAnswer}
            isLoading={isLoading && index === messages.length - 1}
          />
        ))}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 py-2 text-muted-foreground">
              <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0ms]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:150ms]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:300ms]" />
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>
    </div>
  );
}
