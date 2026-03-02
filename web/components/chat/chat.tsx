"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import { MessageList } from "./message-list";
import { InputBar } from "./input-bar";
import { WelcomeScreen } from "./welcome-screen";
import { Sidebar } from "./sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useCourse } from "@/lib/course-context";
import { COURSES } from "@/lib/courses";
import { createSession, updateSession, getSession } from "@/lib/chat-store";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Menu } from "lucide-react";

function extractTitle(messages: UIMessage[]): string {
  const first = messages.find((m) => m.role === "user");
  if (!first) return "New chat";
  const text = first.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join(" ");
  return text.slice(0, 50) || "New chat";
}

export function Chat() {
  const [inputValue, setInputValue] = useState("");
  const { courseId, setCourseId } = useCourse();
  const prevCourseId = useRef(courseId);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);
  const savingRef = useRef(false);

  const config = courseId ? COURSES[courseId] : null;

  const transport = useMemo(
    () => new DefaultChatTransport({ body: () => ({ courseId }) }),
    [courseId]
  );

  const { messages, sendMessage, status, setMessages } = useChat({
    transport,
  });

  const prevStatus = useRef(status);

  // Clear messages and session when course changes
  useEffect(() => {
    if (prevCourseId.current && prevCourseId.current !== courseId) {
      setMessages([]);
      setSessionId(null);
    }
    prevCourseId.current = courseId;
  }, [courseId, setMessages]);

  // Save session when streaming completes
  useEffect(() => {
    const wasStreaming =
      prevStatus.current === "streaming" || prevStatus.current === "submitted";
    const isNowReady = status === "ready";
    prevStatus.current = status;

    if (!wasStreaming || !isNowReady || messages.length === 0 || !courseId)
      return;
    if (savingRef.current) return;

    savingRef.current = true;

    const save = async () => {
      try {
        if (!sessionId) {
          const title = extractTitle(messages);
          const result = await createSession(courseId, title, messages);
          setSessionId(result.id);
        } else {
          await updateSession(sessionId, { messages });
        }
        setSidebarRefreshKey((k) => k + 1);
      } catch (err) {
        console.error("Failed to save session:", err);
      } finally {
        savingRef.current = false;
      }
    };

    save();
  }, [status, messages, sessionId, courseId]);

  const isLoading = status === "streaming" || status === "submitted";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    const text = inputValue.trim();
    setInputValue("");
    sendMessage({ text });
  };

  const handlePrompt = (text: string) => {
    if (text.endsWith(" ")) {
      setInputValue(text);
      return;
    }
    sendMessage({ text });
  };

  const handleModeClick = (command: string) => {
    setInputValue(command);
  };

  const handleConfidenceSubmit = (ratings: Record<string, string>) => {
    const summary = Object.entries(ratings)
      .map(([topic, level]) => `${topic}: ${level}`)
      .join(", ");
    sendMessage({
      text: `My confidence ratings: ${summary}. Please focus on my weak areas first.`,
    });
  };

  const handleQuizAnswer = (answer: string, correct: boolean) => {
    const text = `My answer: ${answer}. ${correct ? "I got it right." : "I got it wrong."}`;
    sendMessage({ text });
  };

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setSessionId(null);
  }, [setMessages]);

  const handleSelectSession = useCallback(
    async (id: string) => {
      if (id === sessionId) return;
      try {
        const session = await getSession(id);
        setSessionId(id);
        setMessages(session.messages);
        // Close sidebar on mobile after selecting
        if (window.innerWidth < 768) {
          setSidebarOpen(false);
        }
      } catch (err) {
        console.error("Failed to load session:", err);
      }
    },
    [sessionId, setMessages]
  );

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-dvh">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        courseId={courseId}
        activeSessionId={sessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        refreshKey={sidebarRefreshKey}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <Menu className="size-4" />
            </Button>
            {config ? (
              <button
                onClick={() => setCourseId(null)}
                className="text-xs font-mono px-2 py-1 rounded border border-primary/20 hover:border-primary/50 hover:bg-muted/50 transition-colors text-muted-foreground"
              >
                {config.code}
              </button>
            ) : null}
          </div>
          <ThemeToggle />
        </div>
        {hasMessages ? (
          <MessageList
            messages={messages}
            isLoading={isLoading}
            onConfidenceSubmit={handleConfidenceSubmit}
            onQuizAnswer={handleQuizAnswer}
          />
        ) : (
          <div className="flex-1 overflow-y-auto">
            <WelcomeScreen onPrompt={handlePrompt} />
          </div>
        )}

        <InputBar
          input={inputValue}
          setInput={setInputValue}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onModeClick={handleModeClick}
          modes={config?.modes}
        />
      </div>
    </div>
  );
}
