import type { Chunk } from "./materials";
import type { CourseConfig } from "./courses";

const MAX_CHUNKS = 8;
const MAX_CONTEXT_CHARS = 150_000; // ~37K tokens

interface ScoredChunk {
  chunk: Chunk;
  score: number;
}

/**
 * Detect explicit references in the user's message.
 */
function detectExplicitReferences(
  message: string,
  config: CourseConfig
): {
  chapters: number[];
  acaSections: string[];
  weeks: number[];
  termMatches: string[];
  classNumbers: number[];
  wantsTranscript: boolean;
  wantsRecent: boolean;
} {
  const lower = message.toLowerCase();

  // Chapter references: "chapter 4", "ch 4", "chapters 8-9", "ch. 4"
  const chapters: number[] = [];
  const chapterMatch = lower.matchAll(/chapters?\s*\.?\s*(\d+)(?:\s*[-–&,]\s*(\d+))?/g);
  for (const m of chapterMatch) {
    const start = parseInt(m[1]);
    const end = m[2] ? parseInt(m[2]) : start;
    for (let i = start; i <= end; i++) chapters.push(i);
  }

  // ACA code sections: "B.1.c", "Section A", "section F.1"
  const acaSections: string[] = [];
  const acaMatch = lower.matchAll(/(?:aca\s+)?(?:code\s+)?section\s+([a-i])/gi);
  for (const m of acaMatch) acaSections.push(m[1].toUpperCase());
  const acaCodeMatch = lower.matchAll(/\b([a-i])\.\d+/gi);
  for (const m of acaCodeMatch) acaSections.push(m[1].toUpperCase());

  // Week references: "week 1", "weeks 1-4"
  const weeks: number[] = [];
  const weekMatch = lower.matchAll(/weeks?\s*(\d+)(?:\s*[-–&,]\s*(\d+))?/g);
  for (const m of weekMatch) {
    const start = parseInt(m[1]);
    const end = m[2] ? parseInt(m[2]) : start;
    for (let i = start; i <= end; i++) weeks.push(i);
  }

  // Class session numbers: "class 1", "class 2", "lecture 3"
  const classNumbers: number[] = [];
  const classMatch = lower.matchAll(/(?:class|lecture|session)\s*(\d+)/g);
  for (const m of classMatch) classNumbers.push(parseInt(m[1]));

  // Known terms from config
  const termMatches: string[] = [];
  for (const term of config.knownTerms) {
    if (lower.includes(term)) termMatches.push(term);
  }

  // Does the user want transcript/lecture content specifically?
  const wantsTranscript = config.instructorRefPattern.test(lower);

  // Does the user want recent/latest/this week's content?
  const wantsRecent =
    /\b(recent|latest|last class|this week|most recent|newest|current|today)\b/.test(lower);

  return { chapters, acaSections, weeks, termMatches, classNumbers, wantsTranscript, wantsRecent };
}

/**
 * Score a chunk based on keyword overlap with the query.
 */
function scoreKeywordOverlap(chunk: Chunk, queryWords: Set<string>): number {
  let score = 0;

  // Title word matches (weighted higher)
  const titleWords = chunk.title
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 2);
  for (const w of titleWords) {
    if (queryWords.has(w)) score += 3;
  }

  // Keyword matches
  for (const kw of chunk.keywords) {
    if (queryWords.has(kw)) score += 2;
  }

  // Direct content substring matches for multi-word terms
  const lowerContent = chunk.content.toLowerCase();
  for (const word of queryWords) {
    if (word.length > 5 && lowerContent.includes(word)) {
      score += 1;
    }
  }

  return score;
}

/**
 * Check if a chunk matches a class number (slides or video transcripts).
 */
function chunkMatchesClass(chunk: Chunk, classNum: number, config: CourseConfig): boolean {
  // Slides
  if (chunk.source === "slides") {
    const patterns = config.classSlideMap[classNum] || [];
    const lowerId = chunk.id.toLowerCase();
    const lowerTitle = chunk.title.toLowerCase();
    for (const pattern of patterns) {
      if (lowerId.includes(pattern) || lowerTitle.includes(pattern)) return true;
    }
  }

  // Video transcripts — match by date
  if (chunk.source === "video-transcript") {
    const dateInfo = config.classDates[classNum];
    if (dateInfo?.videoDatePrefixes) {
      for (const prefix of dateInfo.videoDatePrefixes) {
        if (chunk.id.includes(prefix) || chunk.title.includes(prefix)) return true;
      }
    }
  }

  return false;
}

/**
 * Select the most relevant chunks for a given query.
 */
export function selectChunks(
  config: CourseConfig,
  chunks: Chunk[],
  message: string,
  recentMessages?: string[]
): Chunk[] {
  const refs = detectExplicitReferences(message, config);
  const fullContext = recentMessages
    ? [message, ...recentMessages].join(" ")
    : message;
  const fullRefs = detectExplicitReferences(fullContext, config);

  // Merge refs
  const allChapters = new Set([...refs.chapters, ...fullRefs.chapters]);
  const allAcaSections = new Set([...refs.acaSections, ...fullRefs.acaSections]);
  const allClassNumbers = new Set([...refs.classNumbers, ...fullRefs.classNumbers]);

  // If user wants "recent" or "latest", add the most recent class
  if (refs.wantsRecent || fullRefs.wantsRecent) {
    allClassNumbers.add(config.mostRecentClass);
  }

  // Build query words
  const queryWords = new Set(
    fullContext
      .toLowerCase()
      .replace(/[^a-z\s'-]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3)
  );

  const scored: ScoredChunk[] = [];

  for (const chunk of chunks) {
    let score = 0;
    const sourceWeight = config.sourceWeights[chunk.source] || 1.0;

    // Explicit chapter match (high boost)
    if (chunk.source === "textbook" && allChapters.size > 0) {
      const chMatch = chunk.id.match(/textbook-ch(\d+)/);
      if (chMatch && allChapters.has(parseInt(chMatch[1]))) {
        score += 50;
      }
    }

    // Explicit ACA section match
    if (chunk.source === "aca-code" && allAcaSections.size > 0) {
      const secMatch = chunk.id.match(/aca-section-([A-I])/);
      if (secMatch && allAcaSections.has(secMatch[1])) {
        score += 50;
      }
    }

    // Class session match (slides AND video transcripts)
    if (allClassNumbers.size > 0) {
      for (const classNum of allClassNumbers) {
        if (chunkMatchesClass(chunk, classNum, config)) {
          score += 40;
        }
      }
    }

    // Boost transcripts when user specifically wants lecture content
    if (chunk.source === "video-transcript" && (refs.wantsTranscript || fullRefs.wantsTranscript)) {
      score += 25;
    }

    // Known term match
    const allTerms = [...refs.termMatches, ...fullRefs.termMatches];
    if (allTerms.length > 0) {
      const lowerContent = chunk.content.toLowerCase();
      for (const term of allTerms) {
        if (lowerContent.includes(term)) {
          score += 30;
        }
      }
    }

    // Keyword overlap scoring
    score += scoreKeywordOverlap(chunk, queryWords);

    // Apply source weight
    score *= sourceWeight;

    if (score > 0) {
      scored.push({ chunk, score });
    }
  }

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Take top chunks, respecting size limit
  const selected: Chunk[] = [];
  let totalSize = 0;

  for (const { chunk } of scored) {
    if (selected.length >= MAX_CHUNKS) break;
    if (totalSize + chunk.content.length > MAX_CONTEXT_CHARS) break;
    selected.push(chunk);
    totalSize += chunk.content.length;
  }

  // If nothing matched well, include syllabus as fallback
  if (selected.length === 0) {
    const syllabus = chunks.find((c) => c.source === "syllabus");
    if (syllabus) selected.push(syllabus);
  }

  return selected;
}
