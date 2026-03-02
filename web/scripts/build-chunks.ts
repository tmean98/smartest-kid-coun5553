import { readFileSync, readdirSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

interface Chunk {
  id: string;
  source: string;
  title: string;
  content: string;
  keywords: string[];
}

// Accept --course <id> or --all
const args = process.argv.slice(2);
let courseArg = "coun5553"; // default
if (args.includes("--all")) {
  courseArg = "all";
} else {
  const idx = args.indexOf("--course");
  if (idx !== -1 && args[idx + 1]) {
    courseArg = args[idx + 1];
  }
}

const VALID_COURSES = ["coun5553", "coun5773", "coun5453", "coun5173"];
const coursesToBuild = courseArg === "all" ? VALID_COURSES : [courseArg];

const COURSE_DIRS: Record<string, string> = {
  coun5553: "Coun 5553 Professional orientaion",
  coun5773: "coun5773 theology",
  coun5453: "Psychopathology Diagnosis",
  coun5173: "Coun 5173 Crisis",
};

function getExtractedDir(courseId: string): string {
  const dirName = COURSE_DIRS[courseId] || courseId;
  return join(__dirname, "../../materials", dirName, "extracted");
}

function getOutputPath(courseId: string): string {
  return join(__dirname, "../lib/chunks", `${courseId}.json`);
}

const MIN_FILE_SIZE = 500;
const SKIP_FILES = ["textbooks_ETHICA~1.txt"];

function extractKeywords(text: string): string[] {
  // Extract meaningful terms — proper nouns, legal terms, concepts
  const words = text
    .replace(/[^a-zA-Z\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .map((w) => w.toLowerCase());

  const freq = new Map<string, number>();
  for (const w of words) {
    freq.set(w, (freq.get(w) || 0) + 1);
  }

  // Return top 30 most frequent words (excluding very common ones)
  const stopwords = new Set([
    "that",
    "this",
    "with",
    "from",
    "have",
    "been",
    "will",
    "would",
    "could",
    "should",
    "their",
    "there",
    "they",
    "them",
    "than",
    "then",
    "when",
    "what",
    "which",
    "where",
    "were",
    "your",
    "about",
    "into",
    "more",
    "also",
    "each",
    "other",
    "some",
    "such",
    "only",
    "very",
    "does",
    "being",
    "these",
    "those",
    "most",
    "make",
    "like",
    "over",
    "many",
    "well",
    "back",
    "just",
    "because",
    "before",
    "after",
    "through",
    "between",
    "under",
    "during",
    "without",
    "however",
    "while",
    "both",
    "same",
    "another",
  ]);

  return Array.from(freq.entries())
    .filter(([word]) => !stopwords.has(word))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([word]) => word);
}

function splitByPages(text: string): string[][] {
  const pages: string[] = [];
  const parts = text.split(
    /={50,}\nPAGE \d+\n={50,}/
  );
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed) pages.push(trimmed);
  }
  return [pages]; // Return as single group for further splitting
}

function chunkTextbook(content: string): Chunk[] {
  const chunks: Chunk[] = [];

  // Find chapter boundaries by looking for chapter headings after the TOC
  // The actual content starts around "1Introduction" or "1 Introduction" pattern
  const lines = content.split("\n");

  // Find where actual chapters start (after TOC/preface, ~line 740+)
  // Look for PAGE markers followed by chapter content
  const chapterRegex =
    /^(\d{1,2})\s*(Introduction|Professional Identity|Multiculturalism|Client Welfare|Confidentiality|Records and Subpoenas|Competence|Malpractice|Boundary Issues|Technology in Counseling|Counseling Children|Counseling Families|Professional Relationships|Issues in Counselor Education|Supervision and Consultation|Professional Writing)/i;

  // Split into pages first
  const pageBlocks: { pageNum: number; text: string }[] = [];
  const pageRegex = /^={50,}$/;
  let i = 0;
  while (i < lines.length) {
    if (pageRegex.test(lines[i]?.trim() || "")) {
      const pageMatch = lines[i + 1]?.match(/^PAGE (\d+)$/);
      if (pageMatch) {
        const pageNum = parseInt(pageMatch[1]);
        i += 3; // skip separator, PAGE N, separator
        const pageLines: string[] = [];
        while (i < lines.length && !pageRegex.test(lines[i]?.trim() || "")) {
          pageLines.push(lines[i]);
          i++;
        }
        pageBlocks.push({ pageNum, text: pageLines.join("\n").trim() });
        continue;
      }
    }
    i++;
  }

  // Chapter titles and their approximate starting pages (from the TOC)
  const chapters = [
    { num: 1, title: "Introduction", startPage: 24 },
    { num: 2, title: "Professional Identity of Counselors", startPage: 51 },
    { num: 3, title: "Multiculturalism, Social Justice, Advocacy, and Values", startPage: 86 },
    { num: 4, title: "Client Welfare and Informed Consent", startPage: 108 },
    { num: 5, title: "Confidentiality and Privileged Communication", startPage: 130 },
    { num: 6, title: "Records and Subpoenas", startPage: 156 },
    { num: 7, title: "Competence, Assessment, and Diagnosis", startPage: 183 },
    { num: 8, title: "Malpractice and Resolving Legal and Ethical Challenges", startPage: 219 },
    { num: 9, title: "Boundary Issues", startPage: 251 },
    { num: 10, title: "Technology in Counseling", startPage: 281 },
    { num: 11, title: "Counseling Children and Vulnerable Adults", startPage: 307 },
    { num: 12, title: "Counseling Families and Groups", startPage: 334 },
    { num: 13, title: "Professional Relationships, Private Practice, and Health Care Plans", startPage: 362 },
    { num: 14, title: "Issues in Counselor Education", startPage: 391 },
    { num: 15, title: "Supervision and Consultation", startPage: 414 },
    { num: 16, title: "Professional Writing, Conducting Research, and Publishing", startPage: 438 },
  ];

  for (let c = 0; c < chapters.length; c++) {
    const ch = chapters[c];
    const nextPage = c < chapters.length - 1 ? chapters[c + 1].startPage : 470; // appendix starts

    const chapterPages = pageBlocks.filter(
      (p) => p.pageNum >= ch.startPage && p.pageNum < nextPage
    );

    const chapterText = chapterPages.map((p) => p.text).join("\n\n");

    if (chapterText.length < 100) continue;

    chunks.push({
      id: `textbook-ch${ch.num}`,
      source: "textbook",
      title: `Chapter ${ch.num}: ${ch.title}`,
      content: chapterText,
      keywords: extractKeywords(chapterText),
    });
  }

  return chunks;
}

function chunkSlides(filename: string, content: string): Chunk[] {
  const chunks: Chunk[] = [];
  const baseName = filename.replace(/^slides_/, "").replace(/\.txt$/, "");

  // Parse a friendly title
  let title = baseName.replace(/_/g, " ");

  // Split into pages
  const pages: string[] = [];
  const parts = content.split(/={50,}\nPAGE \d+\n={50,}/);
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.length > 10) pages.push(trimmed);
  }

  // Group pages into chunks of ~8 pages
  const PAGES_PER_CHUNK = 8;
  for (let i = 0; i < pages.length; i += PAGES_PER_CHUNK) {
    const group = pages.slice(i, i + PAGES_PER_CHUNK);
    const text = group.join("\n\n");
    const chunkNum = Math.floor(i / PAGES_PER_CHUNK) + 1;
    const totalChunks = Math.ceil(pages.length / PAGES_PER_CHUNK);

    const suffix = totalChunks > 1 ? ` (Part ${chunkNum}/${totalChunks})` : "";

    chunks.push({
      id: `slides-${baseName}-${chunkNum}`,
      source: "slides",
      title: `Slides: ${title}${suffix}`,
      content: text,
      keywords: extractKeywords(text),
    });
  }

  return chunks;
}

function chunkACACode(content: string): Chunk[] {
  const chunks: Chunk[] = [];

  // Split by Section headings
  const sectionRegex =
    /Section ([A-I])[\s:]+([^\n]+)/g;

  // Collect all section positions
  const sections: { letter: string; title: string; start: number }[] = [];
  let match;
  // Find sections after the TOC (content area)
  const contentStart = content.indexOf("Section A\nThe Counseling Relationship");
  const mainContent = contentStart > 200 ? content.slice(contentStart) : content;

  const sectionSplitRegex = /\nSection ([A-I])\s*\n/;
  const sectionParts = mainContent.split(sectionSplitRegex);

  // sectionParts alternates: text, letter, text, letter, text...
  let currentText = sectionParts[0] || "";
  for (let i = 1; i < sectionParts.length; i += 2) {
    const letter = sectionParts[i];
    const text = sectionParts[i + 1] || "";

    // Extract title from first line of text
    const firstLine = text.split("\n")[0]?.trim() || "";
    const sectionTitle = firstLine.replace(/^[:\s]+/, "");
    const sectionContent = text.trim();

    if (sectionContent.length < 100) continue;

    chunks.push({
      id: `aca-section-${letter}`,
      source: "aca-code",
      title: `ACA Code of Ethics — Section ${letter}: ${sectionTitle}`,
      content: sectionContent,
      keywords: extractKeywords(sectionContent),
    });
  }

  // If no sections were split, treat the whole thing as one chunk
  if (chunks.length === 0) {
    chunks.push({
      id: "aca-code-full",
      source: "aca-code",
      title: "ACA Code of Ethics (2014)",
      content: mainContent,
      keywords: extractKeywords(mainContent),
    });
  }

  return chunks;
}

function chunkGeneric(
  filename: string,
  content: string,
  source: string,
  targetSize: number = 10000
): Chunk[] {
  const chunks: Chunk[] = [];
  const baseName = filename.replace(/\.txt$/, "");
  const title = baseName.replace(/_/g, " ");

  if (content.length <= targetSize * 1.5) {
    chunks.push({
      id: `${source}-${baseName}`,
      source,
      title,
      content,
      keywords: extractKeywords(content),
    });
  } else {
    // Split into roughly equal segments
    const numChunks = Math.ceil(content.length / targetSize);
    const chunkSize = Math.ceil(content.length / numChunks);

    for (let i = 0; i < numChunks; i++) {
      // Try to split at paragraph boundaries
      let end = Math.min((i + 1) * chunkSize, content.length);
      if (end < content.length) {
        const nextPara = content.indexOf("\n\n", end - 200);
        if (nextPara > 0 && nextPara < end + 500) {
          end = nextPara;
        }
      }
      const start = i === 0 ? 0 : chunks.reduce((acc, c) => acc + c.content.length, 0);
      const text = content.slice(start, end).trim();

      if (text.length < 100) continue;

      const suffix = numChunks > 1 ? ` (Part ${i + 1}/${numChunks})` : "";
      chunks.push({
        id: `${source}-${baseName}-${i + 1}`,
        source,
        title: `${title}${suffix}`,
        content: text,
        keywords: extractKeywords(text),
      });
    }
  }

  return chunks;
}

function buildCourse(courseId: string) {
  const extractedDir = getExtractedDir(courseId);
  const outputPath = getOutputPath(courseId);

  if (!existsSync(extractedDir)) {
    console.log(`\n⚠ No extracted/ directory for ${courseId}, skipping.`);
    return;
  }

  console.log(`\n=== Building chunks for ${courseId} ===`);
  console.log(`  Source: ${extractedDir}`);
  console.log(`  Output: ${outputPath}`);

  const files = readdirSync(extractedDir);
  const allChunks: Chunk[] = [];

  for (const file of files) {
    if (!file.endsWith(".txt")) continue;
    if (SKIP_FILES.includes(file)) {
      console.log(`  Skipping: ${file} (duplicate)`);
      continue;
    }

    const filepath = join(extractedDir, file);
    const stat = require("fs").statSync(filepath);

    if (stat.size < MIN_FILE_SIZE) {
      console.log(`  Skipping: ${file} (${stat.size} bytes — too small)`);
      continue;
    }

    const content = readFileSync(filepath, "utf-8");
    console.log(`Processing: ${file} (${(stat.size / 1024).toFixed(1)} KB)`);

    let chunks: Chunk[];

    if (file.startsWith("textbook_")) {
      chunks = chunkTextbook(content);
    } else if (file.startsWith("textbooks_")) {
      chunks = chunkGeneric(file, content, "textbook", 12000);
    } else if (file.startsWith("readings_")) {
      chunks = chunkGeneric(file, content, "reading", 10000);
    } else if (file.startsWith("slides_")) {
      chunks = chunkSlides(file, content);
    } else if (file.startsWith("aca-code_")) {
      chunks = chunkACACode(content);
    } else if (file.startsWith("syllabus_")) {
      chunks = chunkGeneric(file, content, "syllabus");
    } else if (file.startsWith("video_")) {
      chunks = chunkGeneric(file, content, "video-transcript", 10000);
    } else {
      chunks = chunkGeneric(file, content, "other");
    }

    console.log(`  → ${chunks.length} chunk(s)`);
    allChunks.push(...chunks);
  }

  console.log(`\nTotal chunks: ${allChunks.length}`);
  const totalSize = allChunks.reduce((acc, c) => acc + c.content.length, 0);
  console.log(`Total content size: ${(totalSize / 1024).toFixed(1)} KB`);

  writeFileSync(outputPath, JSON.stringify(allChunks, null, 2));
  console.log(`Written to: ${outputPath}`);
}

function main() {
  for (const courseId of coursesToBuild) {
    buildCourse(courseId);
  }
}

main();
