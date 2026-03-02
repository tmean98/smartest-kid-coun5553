import type { UIMessage } from "ai";
import type { CourseId } from "./courses";

export interface SessionMeta {
  id: string;
  courseId: CourseId;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatSession extends SessionMeta {
  messages: UIMessage[];
}

const INDEX_KEY = "sk-sessions-index";
const sessionKey = (id: string) => `sk-session-${id}`;

function readIndex(): SessionMeta[] {
  try {
    const data = localStorage.getItem(INDEX_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function writeIndex(index: SessionMeta[]) {
  localStorage.setItem(INDEX_KEY, JSON.stringify(index));
}

export async function listSessions(courseId: CourseId): Promise<SessionMeta[]> {
  const index = readIndex();
  return index
    .filter((s) => s.courseId === courseId)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
}

export async function createSession(
  courseId: CourseId,
  title: string,
  messages: UIMessage[]
): Promise<{ id: string }> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const session: ChatSession = {
    id,
    courseId,
    title,
    messages,
    createdAt: now,
    updatedAt: now,
  };
  localStorage.setItem(sessionKey(id), JSON.stringify(session));
  const index = readIndex();
  index.push({ id, courseId, title, createdAt: now, updatedAt: now });
  writeIndex(index);
  return { id };
}

export async function getSession(id: string): Promise<ChatSession> {
  const data = localStorage.getItem(sessionKey(id));
  if (!data) throw new Error("Session not found");
  return JSON.parse(data);
}

export async function updateSession(
  id: string,
  data: { messages?: UIMessage[]; title?: string }
): Promise<void> {
  const session = await getSession(id);
  const now = new Date().toISOString();
  const updated = { ...session, ...data, updatedAt: now };
  localStorage.setItem(sessionKey(id), JSON.stringify(updated));
  const index = readIndex();
  const idx = index.findIndex((s) => s.id === id);
  if (idx >= 0) {
    index[idx] = { ...index[idx], ...data, updatedAt: now };
    writeIndex(index);
  }
}

export async function deleteSession(id: string): Promise<void> {
  localStorage.removeItem(sessionKey(id));
  const index = readIndex().filter((s) => s.id !== id);
  writeIndex(index);
}
