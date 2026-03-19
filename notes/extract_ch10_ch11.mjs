import fs from 'fs';
import { PDFParse } from 'pdf-parse';

const PDF_PATH = '/Users/thomasmeaney/Coding Praccy/smartest-kid-coun5553/Books/Spring 2026/Psychopathology from Science to Clinical Practice.pdf';
const OUT_PATH = '/Users/thomasmeaney/Coding Praccy/smartest-kid-coun5553/notes/castonguay_ch10_ch11.txt';

console.log('Reading PDF...');
const buffer = fs.readFileSync(PDF_PATH);
const parser = new PDFParse({ data: buffer });
console.log('Extracting text (this may take a moment)...');
const result = await parser.getText();
await parser.destroy();

const text = result.text;
console.log(`Total text length: ${text.length} chars`);
console.log(`Total pages: ${result.total}`);

// The book uses spaced-letter chapter headers: "C H A P T E R 1 0"
function findSpacedChapter(text, num) {
  const digits = String(num).split('').join('\\s+');
  const pat = new RegExp(`C\\s+H\\s+A\\s+P\\s+T\\s+E\\s+R\\s+${digits}\\b`);
  const pos = text.search(pat);
  return pos;
}

const ch10Start = findSpacedChapter(text, 10);
const ch12Start = findSpacedChapter(text, 12);

console.log(`Chapter 10 found at: ${ch10Start}`);
console.log(`Chapter 12 found at: ${ch12Start}`);

if (ch10Start === -1) {
  console.error('ERROR: Could not find Chapter 10 heading');
  process.exit(1);
}

// The chapter boundary: some books have a lead-in paragraph before the spaced chapter header.
// Find the page marker that immediately precedes ch12 header, and cut there.
let endPos;
if (ch12Start !== -1) {
  // Walk backward from ch12Start to find the preceding page marker (-- N of 498 --)
  const before = text.slice(0, ch12Start);
  const lastPageMarker = before.lastIndexOf('-- ');
  const lastPageMarkerEnd = before.indexOf('\n', lastPageMarker);
  // Cut at the start of the last page marker before ch12 (inclusive of the \n after it)
  endPos = lastPageMarker;
  console.log(`Cutting at page marker before ch12: pos ${endPos}`);
  console.log(`Context: "${text.slice(endPos - 50, endPos + 100)}"`);
} else {
  endPos = text.length;
}

// Print context around chapter 10 start for verification
console.log(`\n--- Context around Chapter 10 start (500 chars) ---`);
console.log(text.slice(Math.max(0, ch10Start - 30), ch10Start + 500));
console.log('--- end context ---');

// Extract chapters 10 and 11
const extracted = text.slice(ch10Start, endPos).trim();
console.log(`\nExtracted ${extracted.length} chars (chapters 10 and 11)`);

// Extract titles — the title comes on the next line after the chapter header
function extractTitle(str, chNum) {
  const digits = String(chNum).split('').join('\\s+');
  const pat = new RegExp(`C\\s+H\\s+A\\s+P\\s+T\\s+E\\s+R\\s+${digits}\\s*\\n([^\\n]+)`, 'i');
  const match = str.match(pat);
  if (match) return match[1].trim();
  return 'Unknown Title';
}

const ch11Start = findSpacedChapter(text, 11);
const ch10Title = extractTitle(extracted, 10);
const ch11Offset = ch11Start - ch10Start;
const ch11Title = ch11Offset > 0 ? extractTitle(extracted.slice(ch11Offset), 11) : 'Unknown Title';

console.log(`Chapter 10 title: "${ch10Title}"`);
console.log(`Chapter 11 title: "${ch11Title}"`);

const header = `CASTONGUAY, OLTMANNS & LOTT — Psychopathology: From Science to Clinical Practice (2nd ed.)
Chapter 10: ${ch10Title}
Chapter 11: ${ch11Title}
================================================================================

`;

fs.writeFileSync(OUT_PATH, header + extracted);
console.log(`\nSaved to: ${OUT_PATH}`);
console.log(`File size: ${fs.statSync(OUT_PATH).size} bytes`);

console.log('\n--- First 500 chars of extracted content ---');
console.log(extracted.slice(0, 500));
console.log('\n--- Last 300 chars of extracted content ---');
console.log(extracted.slice(-300));
