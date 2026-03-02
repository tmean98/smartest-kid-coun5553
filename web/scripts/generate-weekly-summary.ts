import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { config } from "dotenv";

// Load .env.local from web/
config({ path: join(__dirname, "../.env.local") });

interface Chunk {
  id: string;
  source: string;
  title: string;
  content: string;
  keywords: string[];
}

interface ClassDateInfo {
  date: string;
  videoDatePrefixes?: string[];
}

// Inline course metadata (matches courses.ts structure)
const COURSE_META: Record<
  string,
  {
    code: string;
    title: string;
    instructor: string;
    classDates: Record<number, ClassDateInfo>;
    classSlideMap: Record<number, string[]>;
  }
> = {
  coun5553: {
    code: "COUN 5553",
    title: "Professional Orientation, Law & Ethics",
    instructor: "Dr. Rachel Kerrigan",
    classDates: {
      1: { date: "2026-01-15", videoDatePrefixes: ["Jan_15_2026", "Jan 15 2026"] },
      2: { date: "2026-01-22", videoDatePrefixes: ["Jan_22_2026", "Jan 22 2026"] },
      3: { date: "2026-01-29", videoDatePrefixes: ["Jan_29_2026", "Jan 29 2026"] },
      4: { date: "2026-02-12", videoDatePrefixes: ["Feb_12_2026", "Feb 12 2026"] },
      5: { date: "2026-02-19", videoDatePrefixes: ["Feb_19_2026", "Feb 19 2026"] },
    },
    classSlideMap: {
      1: ["ethics_class_1", "class_1"],
      2: ["class_2"],
      3: ["class_3"],
      4: ["class_4"],
      5: ["class_5", "evidence_based", "washington_state_reporting", "volk"],
    },
  },
  coun5773: {
    code: "COUN 5773",
    title: "Theology and Counseling",
    instructor: "Dr. Marty Folsom",
    classDates: {
      1: { date: "2026-01-06" },
      2: { date: "2026-01-20" },
      3: { date: "2026-02-03" },
      4: { date: "2026-02-17" },
      5: { date: "2026-03-03" },
      6: { date: "2026-03-17" },
      7: { date: "2026-03-31" },
      8: { date: "2026-04-14" },
    },
    classSlideMap: {},
  },
  coun5453: {
    code: "COUN 5453",
    title: "Psychopathology and Diagnosis",
    instructor: "Dr. Robert Campbell",
    classDates: {
      1: { date: "2026-01-09" },
      2: { date: "2026-01-13" },
      3: { date: "2026-01-27" },
      4: { date: "2026-02-10" },
      5: { date: "2026-02-24" },
      6: { date: "2026-03-10" },
      7: { date: "2026-03-24" },
      8: { date: "2026-04-07" },
    },
    classSlideMap: {},
  },
  coun5173: {
    code: "COUN 5173",
    title: "Crisis Counseling and Abuse",
    instructor: "Dr. Esther McCartney",
    classDates: {
      1: { date: "2026-01-08" },
      2: { date: "2026-02-05" },
      3: { date: "2026-02-26" },
      4: { date: "2026-03-05" },
      5: { date: "2026-03-19" },
      6: { date: "2026-04-02" },
      7: { date: "2026-04-09" },
    },
    classSlideMap: {},
  },
};

// Accept --course <id> or --all
const args = process.argv.slice(2);
let courseArg = "coun5553";
if (args.includes("--all")) {
  courseArg = "all";
} else {
  const idx = args.indexOf("--course");
  if (idx !== -1 && args[idx + 1]) {
    courseArg = args[idx + 1];
  }
}

const VALID_COURSES = ["coun5553", "coun5773", "coun5453", "coun5173"];
const coursesToProcess = courseArg === "all" ? VALID_COURSES : [courseArg];

function getMostRecentWeek(
  classDates: Record<number, ClassDateInfo>
): { weekNum: number; date: string } | null {
  const today = new Date();
  today.setHours(23, 59, 59); // include today

  let mostRecent: { weekNum: number; date: string } | null = null;

  for (const [num, info] of Object.entries(classDates)) {
    const classDate = new Date(info.date + "T12:00:00");
    if (classDate <= today) {
      if (!mostRecent || classDate > new Date(mostRecent.date + "T12:00:00")) {
        mostRecent = { weekNum: parseInt(num), date: info.date };
      }
    }
  }

  return mostRecent;
}

function filterChunksForWeek(
  chunks: Chunk[],
  courseId: string,
  weekNum: number
): Chunk[] {
  const meta = COURSE_META[courseId];
  const dateInfo = meta.classDates[weekNum];
  const slidePatterns = meta.classSlideMap[weekNum] || [];

  const matched: Chunk[] = [];

  for (const chunk of chunks) {
    // Match slides by slide map patterns
    if (chunk.source === "slides" && slidePatterns.length > 0) {
      const idLower = chunk.id.toLowerCase();
      if (slidePatterns.some((p) => idLower.includes(p.toLowerCase()))) {
        matched.push(chunk);
        continue;
      }
    }

    // Match video transcripts by date prefix
    if (chunk.source === "video-transcript" && dateInfo?.videoDatePrefixes) {
      const titleLower = chunk.title.toLowerCase();
      const idLower = chunk.id.toLowerCase();
      if (
        dateInfo.videoDatePrefixes.some(
          (prefix) =>
            titleLower.includes(prefix.toLowerCase()) ||
            idLower.includes(prefix.toLowerCase().replace(/ /g, "_"))
        )
      ) {
        matched.push(chunk);
        continue;
      }
    }

    // Match slides by class number pattern (e.g. "class_3", "class 3")
    if (chunk.source === "slides") {
      const patterns = [`class_${weekNum}`, `class ${weekNum}`, `class${weekNum}`];
      const idLower = chunk.id.toLowerCase();
      if (patterns.some((p) => idLower.includes(p))) {
        matched.push(chunk);
        continue;
      }
    }
  }

  return matched;
}

async function callAnthropic(content: string, courseCode: string, instructor: string, weekNum: number): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not set in web/.env.local");
  }

  const prompt = `You are summarizing Week ${weekNum} of ${courseCode} taught by ${instructor} for a graduate student studying Clinical Mental Health Counseling.

Create a concise study summary with these sections:
## Key Topics
- List the main topics and concepts covered

## Important Terms
- Term: brief definition (for each key term introduced or discussed)

## Main Takeaways
- The most important points a student should remember

## Connections to Practice
- How these concepts connect to clinical counseling practice

Keep it concise and scannable. Use bullet points. Do not use bold or italic formatting in body text. Cite which material (slides, lecture, reading) each point comes from when possible.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `Here are the course materials for Week ${weekNum}:\n\n${content}\n\n${prompt}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${errorText}`);
  }

  const data = (await response.json()) as {
    content: Array<{ type: string; text?: string }>;
  };

  const textBlock = data.content.find((b) => b.type === "text");
  return textBlock?.text || "No summary generated.";
}

async function generateForCourse(courseId: string) {
  const meta = COURSE_META[courseId];
  if (!meta) {
    console.log(`Unknown course: ${courseId}, skipping.`);
    return;
  }

  // Load chunks
  const chunksPath = join(__dirname, "../lib/chunks", `${courseId}.json`);
  if (!existsSync(chunksPath)) {
    console.log(`No chunks file for ${courseId}, skipping.`);
    return;
  }

  const chunks: Chunk[] = JSON.parse(readFileSync(chunksPath, "utf-8"));
  const recentWeek = getMostRecentWeek(meta.classDates);

  if (!recentWeek) {
    console.log(`No past class dates for ${courseId}, skipping.`);
    return;
  }

  console.log(`\n=== ${meta.code}: Week ${recentWeek.weekNum} (${recentWeek.date}) ===`);

  // Check if summary already exists
  const notesDir = join(__dirname, "../../notes", courseId);
  const summaryPath = join(notesDir, `week-${recentWeek.weekNum}-summary.md`);

  if (existsSync(summaryPath)) {
    console.log(`  Summary already exists: ${summaryPath}, skipping.`);
    return;
  }

  // Filter chunks for this week
  const weekChunks = filterChunksForWeek(chunks, courseId, recentWeek.weekNum);

  if (weekChunks.length === 0) {
    console.log(`  No chunks matched for week ${recentWeek.weekNum}, skipping.`);
    return;
  }

  console.log(`  Found ${weekChunks.length} chunk(s) for week ${recentWeek.weekNum}`);

  // Build content string (truncate to ~50k chars to stay within limits)
  let content = "";
  for (const chunk of weekChunks) {
    const section = `### ${chunk.title} (${chunk.source})\n${chunk.content}\n\n`;
    if (content.length + section.length > 50000) break;
    content += section;
  }

  // Call Anthropic API
  console.log(`  Calling Anthropic API (Haiku)...`);
  const summary = await callAnthropic(content, meta.code, meta.instructor, recentWeek.weekNum);

  // Write summary
  mkdirSync(notesDir, { recursive: true });

  const header = `# ${meta.code} — Week ${recentWeek.weekNum} Summary\n\nClass date: ${recentWeek.date} | Generated: ${new Date().toISOString().split("T")[0]}\n\n---\n\n`;
  writeFileSync(summaryPath, header + summary);
  console.log(`  Written to: ${summaryPath}`);
}

async function main() {
  for (const courseId of coursesToProcess) {
    await generateForCourse(courseId);
  }
}

main().catch((err) => {
  console.error("Error generating summaries:", err);
  process.exit(1);
});
