import type { CourseId } from "./courses";

export interface Chunk {
  id: string;
  source: string;
  title: string;
  content: string;
  keywords: string[];
}

const chunkCache = new Map<CourseId, Chunk[]>();

export async function getChunks(courseId: CourseId): Promise<Chunk[]> {
  const cached = chunkCache.get(courseId);
  if (cached) return cached;

  let data: Chunk[];
  switch (courseId) {
    case "coun5553":
      data = (await import("./chunks/coun5553.json")).default as Chunk[];
      break;
    case "coun5773":
      data = (await import("./chunks/coun5773.json")).default as Chunk[];
      break;
    case "coun5453":
      data = (await import("./chunks/coun5453.json")).default as Chunk[];
      break;
    case "coun5173":
      data = (await import("./chunks/coun5173.json")).default as Chunk[];
      break;
    default:
      data = [];
  }

  chunkCache.set(courseId, data);
  return data;
}
