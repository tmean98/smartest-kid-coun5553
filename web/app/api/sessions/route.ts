import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { nanoid } from "nanoid";
import type { CourseId } from "@/lib/courses";

const HISTORY_DIR = join(process.cwd(), "..", "notes", "chat-history");
const INDEX_PATH = join(HISTORY_DIR, "index.json");

interface SessionMeta {
  id: string;
  courseId: CourseId;
  title: string;
  createdAt: string;
  updatedAt: string;
}

async function ensureDir() {
  if (!existsSync(HISTORY_DIR)) {
    await mkdir(HISTORY_DIR, { recursive: true });
  }
}

async function readIndex(): Promise<SessionMeta[]> {
  try {
    const data = await readFile(INDEX_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeIndex(index: SessionMeta[]) {
  await writeFile(INDEX_PATH, JSON.stringify(index, null, 2));
}

export async function GET(req: NextRequest) {
  const courseId = req.nextUrl.searchParams.get("courseId");
  const index = await readIndex();
  const filtered = courseId
    ? index.filter((s) => s.courseId === courseId)
    : index;
  // Most recent first
  filtered.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  return NextResponse.json(filtered);
}

export async function POST(req: NextRequest) {
  await ensureDir();
  const body = await req.json();
  const { courseId, title, messages } = body as {
    courseId: CourseId;
    title: string;
    messages: unknown[];
  };

  const id = nanoid();
  const now = new Date().toISOString();

  const session = {
    id,
    courseId,
    title,
    messages,
    createdAt: now,
    updatedAt: now,
  };

  await writeFile(
    join(HISTORY_DIR, `${id}.json`),
    JSON.stringify(session, null, 2)
  );

  const index = await readIndex();
  index.push({ id, courseId, title, createdAt: now, updatedAt: now });
  await writeIndex(index);

  return NextResponse.json({ id, createdAt: now, updatedAt: now });
}
