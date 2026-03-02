"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Plus, Trash2, X, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  listSessions,
  deleteSession,
  updateSession,
  type SessionMeta,
} from "@/lib/chat-store";
import type { CourseId } from "@/lib/courses";

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  courseId: CourseId | null;
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  refreshKey: number;
}

export function Sidebar({
  open,
  onClose,
  courseId,
  activeSessionId,
  onSelectSession,
  onNewChat,
  refreshKey,
}: SidebarProps) {
  const [sessions, setSessions] = useState<SessionMeta[]>([]);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const renameInputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(() => {
    if (!courseId) {
      setSessions([]);
      return;
    }
    listSessions(courseId).then(setSessions).catch(() => setSessions([]));
  }, [courseId]);

  useEffect(() => {
    refresh();
  }, [refresh, refreshKey]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteSession(id);
    refresh();
    if (activeSessionId === id) {
      onNewChat();
    }
  };

  const startRename = (e: React.MouseEvent, session: SessionMeta) => {
    e.stopPropagation();
    setRenamingId(session.id);
    setRenameValue(session.title);
    setTimeout(() => renameInputRef.current?.select(), 0);
  };

  const commitRename = async (id: string) => {
    const trimmed = renameValue.trim();
    if (trimmed) {
      await updateSession(id, { title: trimmed });
      refresh();
    }
    setRenamingId(null);
  };

  const cancelRename = () => {
    setRenamingId(null);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "z-40 flex flex-col border-r border-border bg-background transition-all duration-200",
          // Mobile: overlay
          "fixed inset-y-0 left-0 md:relative md:inset-auto",
          open ? "w-64" : "w-0 overflow-hidden border-r-0"
        )}
      >
        <div className="flex items-center justify-between p-2 border-b border-border">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 justify-start gap-2"
            onClick={onNewChat}
          >
            <Plus className="size-4" />
            New Chat
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="md:hidden"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-1">
            {sessions.length === 0 && (
              <p className="text-xs text-muted-foreground p-3 text-center">
                No chats yet
              </p>
            )}
            {sessions.map((session) => {
              const isRenaming = renamingId === session.id;
              return (
                <div
                  key={session.id}
                  role={isRenaming ? undefined : "button"}
                  tabIndex={isRenaming ? undefined : 0}
                  onClick={() => !isRenaming && onSelectSession(session.id)}
                  onKeyDown={(e) => {
                    if (!isRenaming && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      onSelectSession(session.id);
                    }
                  }}
                  className={cn(
                    "sidebar-item relative w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors overflow-hidden",
                    isRenaming ? "cursor-default" : "cursor-pointer",
                    session.id === activeSessionId
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-muted/50 text-muted-foreground"
                  )}
                >
                  {isRenaming ? (
                    <input
                      ref={renameInputRef}
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => commitRename(session.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitRename(session.id);
                        if (e.key === "Escape") cancelRename();
                        e.stopPropagation();
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full bg-transparent outline-none border-b border-border text-sm pr-10"
                      autoFocus
                    />
                  ) : (
                    <span className="block truncate pr-10">{session.title}</span>
                  )}
                  {!isRenaming && (
                    <div className="sidebar-action absolute right-1 top-1/2 -translate-y-1/2 flex gap-0.5">
                      <button
                        onClick={(e) => startRename(e, session)}
                        className="p-0.5 rounded hover:text-foreground text-muted-foreground"
                        title="Rename"
                      >
                        <Pencil className="size-3" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, session.id)}
                        className="p-0.5 rounded hover:text-destructive text-muted-foreground"
                        title="Delete"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}
