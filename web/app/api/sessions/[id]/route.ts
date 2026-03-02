import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, unlink } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

const HISTORY_DIR = join(process.cwd(), "..", "notes", "chat-history");
const INDEX_PATH = join(HISTORY_DIR, "index.json");

interface SessionMeta {
  id: string;
  courseId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const filePath = join(HISTORY_DIR, `${id}.json`);

  if (!existsSync(filePath)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data = await readFile(filePath, "utf-8");
  return NextResponse.json(JSON.parse(data));
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const filePath = join(HISTORY_DIR, `${id}.json`);

  if (!existsSync(filePath)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const existing = JSON.parse(await readFile(filePath, "utf-8"));
  const body = await req.json();
  const now = new Date().toISOString();

  if (body.messages !== undefined) existing.messages = body.messages;
  if (body.title !== undefined) existing.title = body.title;
  existing.updatedAt = now;

  await writeFile(filePath, JSON.stringify(existing, null, 2));

  // Update index
  const index = await readIndex();
  const entry = index.find((s) => s.id === id);
  if (entry) {
    if (body.title !== undefined) entry.title = body.title;
    entry.updatedAt = now;
    await writeIndex(index);
  }

  return NextResponse.json({ updatedAt: now });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const filePath = join(HISTORY_DIR, `${id}.json`);

  if (existsSync(filePath)) {
    await unlink(filePath);
  }

  const index = await readIndex();
  const filtered = index.filter((s) => s.id !== id);
  await writeIndex(filtered);

  return NextResponse.json({ ok: true });
}
