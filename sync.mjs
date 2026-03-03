import 'dotenv/config';
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── Config ──────────────────────────────────────────────────────────────────

const { LMS_USERNAME, LMS_PASSWORD } = process.env;
if (!LMS_USERNAME || !LMS_PASSWORD) {
  console.error('Missing .env variables. Set LMS_USERNAME, LMS_PASSWORD');
  process.exit(1);
}

const COURSE_MAP = {
  coun5553: {
    url: process.env.COURSE_URL_COUN5553 || process.env.COURSE_URL,
    dir: 'Coun 5553 Professional orientaion',
  },
  coun5773: {
    url: process.env.COURSE_URL_COUN5773,
    dir: 'coun5773 theology',
  },
  coun5453: {
    url: process.env.COURSE_URL_COUN5453,
    dir: 'Psychopathology Diagnosis',
  },
  coun5173: {
    url: process.env.COURSE_URL_COUN5173,
    dir: 'Coun 5173 Crisis',
  },
};

// Parse --course <id> or default to all configured courses
const args = process.argv.slice(2);
let coursesToSync;
const courseIdx = args.indexOf('--course');
if (courseIdx !== -1 && args[courseIdx + 1]) {
  coursesToSync = [args[courseIdx + 1]];
} else {
  coursesToSync = Object.keys(COURSE_MAP).filter(id => COURSE_MAP[id].url);
}

// DIRS is set per-course during the sync loop
let DIRS = {};

function setDirsForCourse(courseId) {
  const courseDir = COURSE_MAP[courseId].dir;
  DIRS = {
    slides:    join(__dirname, 'materials', courseDir, 'slides'),
    readings:  join(__dirname, 'materials', courseDir, 'readings'),
    syllabus:  join(__dirname, 'materials', courseDir, 'syllabus'),
    acaCode:   join(__dirname, 'materials', courseDir, 'aca-code'),
    textbooks: join(__dirname, 'materials', courseDir, 'textbooks'),
    html:      join(__dirname, 'materials', courseDir, 'html'),
    videos:    join(__dirname, 'materials', courseDir, 'videos'),
    extracted: join(__dirname, 'materials', courseDir, 'extracted'),
  };
  for (const dir of Object.values(DIRS)) mkdirSync(dir, { recursive: true });
}

const AUTH_DIR = join(__dirname, '.auth');
const SESSION_FILE = join(AUTH_DIR, 'session.json');
mkdirSync(AUTH_DIR, { recursive: true });

// ─── Helpers ─────────────────────────────────────────────────────────────────

function log(msg) {
  const ts = new Date().toISOString().slice(0, 19).replace('T', ' ');
  console.log(`[${ts}] ${msg}`);
}

function categorize(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes('syllabus'))                          return 'syllabus';
  if (lower.includes('aca') || lower.includes('code of ethics')) return 'acaCode';
  if (lower.includes('textbook'))                          return 'textbooks';
  if (lower.includes('reading') || lower.includes('article'))    return 'readings';
  if (lower.includes('class') || lower.includes('slide'))        return 'slides';
  return 'slides'; // default
}

function categoryDirName(category) {
  const map = { slides: 'slides', readings: 'readings', syllabus: 'syllabus', acaCode: 'aca-code', textbooks: 'textbooks' };
  return map[category] || 'slides';
}

function extractedName(category, filename) {
  const stem = filename.replace(/\.(pdf|pptx|docx|doc)$/i, '');
  const dirName = categoryDirName(category);
  return `${dirName}_${stem.replace(/ /g, '_')}.txt`;
}

function fileExistsInAnyDir(filename) {
  for (const dir of Object.values(DIRS)) {
    if (existsSync(join(dir, filename))) return true;
  }
  return false;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

async function login(browser, headless) {
  log('Logging in to OpenLMS...');
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  await page.goto('https://discovery.northwestu.edu/login/index.php', { waitUntil: 'networkidle' });

  // Check for Microsoft SSO button or standard Moodle login
  const msLoginBtn = page.locator('a[href*="auth/oidc"], a[href*="microsoft"], a[title*="Microsoft"], .potentialidp a').first();
  if (await msLoginBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    log('Found Microsoft SSO login, clicking...');
    await msLoginBtn.click();
    await page.waitForLoadState('networkidle');

    // Microsoft login page
    const emailInput = page.locator('input[type="email"], input[name="loginfmt"]').first();
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailInput.fill(LMS_USERNAME);
      await page.locator('input[type="submit"], button[type="submit"]').first().click();
      await page.waitForLoadState('networkidle');

      const passInput = page.locator('input[type="password"], input[name="passwd"]').first();
      if (await passInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await passInput.fill(LMS_PASSWORD);
        await page.locator('input[type="submit"], button[type="submit"]').first().click();
        await page.waitForLoadState('networkidle');
      }

      // "Stay signed in?" prompt
      const staySignedIn = page.locator('input[type="submit"][value="Yes"], button:has-text("Yes")').first();
      if (await staySignedIn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await staySignedIn.click();
        await page.waitForLoadState('networkidle');
      }

      // MFA — if prompted, wait for the user to approve on their device
      const mfaIndicator = page.locator('text=/approve|authenticator|verify|code/i').first();
      if (await mfaIndicator.isVisible({ timeout: 3000 }).catch(() => false)) {
        log('MFA detected — approve on your device. Waiting up to 120s...');
        await page.waitForURL('**/discovery.northwestu.edu/**', { timeout: 120000 });
      }
    }
  } else {
    // Standard Moodle login
    log('Using standard Moodle login...');
    await page.fill('#username', LMS_USERNAME);
    await page.fill('#password', LMS_PASSWORD);
    await page.click('#loginbtn');
    await page.waitForLoadState('networkidle');
  }

  // Verify we're logged in
  const loggedIn = await page.url().includes('discovery.northwestu.edu') &&
    !(await page.url().includes('/login/'));
  if (!loggedIn) {
    throw new Error('Login failed — check credentials or handle MFA manually on first run');
  }

  log('Login successful');

  // Save session
  const storage = await context.storageState();
  writeFileSync(SESSION_FILE, JSON.stringify(storage, null, 2));
  log('Session saved');

  return { context, page };
}

async function getAuthContext(browser, testUrl) {
  // Try reusing saved session
  if (existsSync(SESSION_FILE)) {
    log('Reusing saved session...');
    const storage = JSON.parse(readFileSync(SESSION_FILE, 'utf-8'));
    const context = await browser.newContext({ storageState: storage, acceptDownloads: true });
    const page = await context.newPage();

    await page.goto(testUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000); // let Moodle JS settle

    // Check if session is still valid (not redirected to login)
    if (!page.url().includes('/login/')) {
      log('Session still valid');
      return { context, page };
    }

    log('Session expired, re-logging in...');
    await context.close();
  }

  return login(browser);
}

// ─── Course Scraping ─────────────────────────────────────────────────────────

async function discoverResources(page, courseUrl) {
  log('Discovering course resources...');
  await page.goto(courseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000); // let Moodle JS settle

  const resources = await page.evaluate(() => {
    const items = [];

    // Find all resource links on the course page
    const links = document.querySelectorAll('a[href]');
    for (const link of links) {
      const href = link.href;

      // PDF/file downloads from Moodle resource module
      if (href.includes('/mod/resource/') || href.includes('/pluginfile.php')) {
        items.push({
          type: 'file',
          url: href,
          name: link.textContent.trim(),
        });
      }

      // Moodle page resources (HTML content)
      if (href.includes('/mod/page/')) {
        items.push({
          type: 'page',
          url: href,
          name: link.textContent.trim(),
        });
      }

      // Panopto / Kaltura / video links
      if (href.includes('panopto') || href.includes('kaltura') || href.includes('/mod/lti/')) {
        items.push({
          type: 'video',
          url: href,
          name: link.textContent.trim(),
        });
      }

      // Folder resources (contain multiple files)
      if (href.includes('/mod/folder/')) {
        items.push({
          type: 'folder',
          url: href,
          name: link.textContent.trim(),
        });
      }
    }

    // Also check for Panopto iframes embedded directly on the course page
    const iframes = document.querySelectorAll('iframe');
    for (const iframe of iframes) {
      const src = iframe.src || '';
      if (src.includes('panopto') || src.includes('Panopto') || src.includes('kaltura')) {
        items.push({
          type: 'video',
          url: src,
          name: iframe.title || iframe.getAttribute('aria-label') || 'Embedded Video',
        });
      }
    }

    return items;
  });

  log(`Found ${resources.length} resources on course page`);

  // Expand folder resources to find individual files
  const expandedResources = [];
  for (const r of resources) {
    if (r.type === 'folder') {
      log(`Expanding folder: ${r.name}`);
      const folderFiles = await discoverFolderFiles(page, r.url);
      expandedResources.push(...folderFiles);
    } else {
      expandedResources.push(r);
    }
  }

  // Deduplicate by URL
  const seen = new Set();
  const unique = expandedResources.filter(r => {
    if (seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });

  log(`${unique.length} unique resources after expansion/dedup`);
  return unique;
}

async function discoverFolderFiles(page, folderUrl) {
  await page.goto(folderUrl, { waitUntil: 'networkidle' });

  return page.evaluate(() => {
    const items = [];
    const links = document.querySelectorAll('a[href*="pluginfile.php"], a[href*="/mod/resource/"]');
    for (const link of links) {
      items.push({
        type: 'file',
        url: link.href,
        name: link.textContent.trim(),
      });
    }
    return items;
  });
}

// ─── File Downloads ──────────────────────────────────────────────────────────

async function downloadFiles(page, resources) {
  const fileResources = resources.filter(r => r.type === 'file');
  log(`Processing ${fileResources.length} file resources...`);

  let downloaded = 0;
  for (const resource of fileResources) {
    try {
      // Use Playwright's download handling — listen for download event before navigating
      const [download, response] = await Promise.all([
        page.waitForEvent('download', { timeout: 15000 }).catch(() => null),
        page.goto(resource.url, { waitUntil: 'load', timeout: 30000 }).catch(() => null),
      ]);

      if (download) {
        // Browser triggered a download (pptx, docx, doc, etc.)
        const suggestedName = download.suggestedFilename();
        const filename = suggestedName || `${resource.name}`;

        if (fileExistsInAnyDir(filename)) {
          await download.cancel();
          log(`  SKIP (exists): ${filename}`);
          continue;
        }

        const category = categorize(filename);
        const destDir = DIRS[category];
        const destPath = join(destDir, filename);

        await download.saveAs(destPath);
        log(`  DOWNLOADED → ${categoryDirName(category)}/${filename}`);
        downloaded++;

        await extractText(destPath, category, filename);
      } else if (response) {
        // Direct response (PDFs often render inline)
        const contentType = response.headers()?.['content-type'] || '';

        if (contentType.includes('application/pdf') || contentType.includes('octet-stream')) {
          const actualUrl = page.url();
          const urlFilename = decodeURIComponent(actualUrl.split('/').pop().split('?')[0]);
          const filename = urlFilename || `${resource.name}.pdf`;

          if (fileExistsInAnyDir(filename)) {
            log(`  SKIP (exists): ${filename}`);
            continue;
          }

          const category = categorize(filename);
          const destDir = DIRS[category];
          const destPath = join(destDir, filename);

          const buffer = await response.body();
          writeFileSync(destPath, buffer);
          log(`  DOWNLOADED → ${categoryDirName(category)}/${filename}`);
          downloaded++;

          if (filename.toLowerCase().endsWith('.pdf')) {
            await extractText(destPath, category, filename);
          }
        } else {
          // HTML page with a download link inside it
          const downloadUrl = await page.evaluate(() => {
            const link = document.querySelector('a[href*="pluginfile.php"], a[href*="forcedownload"]');
            return link ? link.href : null;
          });

          if (downloadUrl) {
            const [dl2, resp2] = await Promise.all([
              page.waitForEvent('download', { timeout: 15000 }).catch(() => null),
              page.goto(downloadUrl, { waitUntil: 'load', timeout: 30000 }).catch(() => null),
            ]);

            if (dl2) {
              const filename = dl2.suggestedFilename() || resource.name;
              if (fileExistsInAnyDir(filename)) {
                await dl2.cancel();
                log(`  SKIP (exists): ${filename}`);
                continue;
              }
              const category = categorize(filename);
              const destPath = join(DIRS[category], filename);
              await dl2.saveAs(destPath);
              log(`  DOWNLOADED → ${categoryDirName(category)}/${filename}`);
              downloaded++;
              if (filename.toLowerCase().endsWith('.pdf')) {
                await extractText(destPath, category, filename);
              }
            } else if (resp2) {
              const actualUrl = page.url();
              const urlFilename = decodeURIComponent(actualUrl.split('/').pop().split('?')[0]);
              const filename = urlFilename || `${resource.name}.pdf`;
              if (fileExistsInAnyDir(filename)) {
                log(`  SKIP (exists): ${filename}`);
                continue;
              }
              const category = categorize(filename);
              const destPath = join(DIRS[category], filename);
              const buffer = await resp2.body();
              writeFileSync(destPath, buffer);
              log(`  DOWNLOADED → ${categoryDirName(category)}/${filename}`);
              downloaded++;
              if (filename.toLowerCase().endsWith('.pdf')) {
                await extractText(destPath, category, filename);
              }
            }
          }
        }
      }
    } catch (err) {
      log(`  ERROR downloading "${resource.name}": ${err.message}`);
    }
  }

  log(`Downloaded ${downloaded} new files`);
}

// ─── Text Extraction ─────────────────────────────────────────────────────────

async function extractText(filePath, category, filename) {
  try {
    const extractedFilename = extractedName(category, filename);
    const extractedPath = join(DIRS.extracted, extractedFilename);

    if (existsSync(extractedPath)) {
      log(`  SKIP extraction (exists): ${extractedFilename}`);
      return;
    }

    const ext = filename.toLowerCase().split('.').pop();
    let fullText;

    if (ext === 'pdf') {
      const { PDFParse } = await import('pdf-parse');
      const dataBuffer = readFileSync(filePath);
      const pdf = new PDFParse({ data: new Uint8Array(dataBuffer) });
      await pdf.load();
      const result = await pdf.getText();
      fullText = typeof result.text === 'string'
        ? result.text
        : Array.isArray(result.text)
          ? result.text.map(p => p.text).join('\n\n')
          : String(result.text);
    } else if (ext === 'pptx' || ext === 'docx' || ext === 'doc') {
      const { parseOffice } = await import('officeparser');
      const result = await parseOffice(filePath);
      fullText = typeof result === 'string' ? result : result.toText();
    } else {
      log(`  SKIP extraction (unsupported type .${ext}): ${filename}`);
      return;
    }

    writeFileSync(extractedPath, fullText);
    log(`  EXTRACTED → extracted/${extractedFilename}`);
  } catch (err) {
    log(`  ERROR extracting text from "${filename}": ${err.message}`);
  }
}

// ─── HTML Extraction ─────────────────────────────────────────────────────────

async function extractHTMLPages(page, resources) {
  const pageResources = resources.filter(r => r.type === 'page');
  log(`Processing ${pageResources.length} HTML page resources...`);

  const embeddedVideoResources = [];
  let extracted = 0;

  for (const resource of pageResources) {
    const safeName = resource.name.replace(/[/\\?%*:|"<>]/g, '-').trim();
    const filename = `${safeName}.html`;

    try {
      await page.goto(resource.url, { waitUntil: 'networkidle' });

      // Check for embedded Panopto iframes within this page resource
      const embeddedVideos = await page.evaluate((re) => {
        const found = [];
        for (const iframe of document.querySelectorAll('iframe')) {
          const src = iframe.src || '';
          if (src.includes('panopto') || src.includes('Panopto') || src.includes('kaltura') || src.includes('/mod/lti/')) {
            found.push({ url: src, name: iframe.title || iframe.getAttribute('aria-label') || 'Embedded Video' });
          }
        }
        for (const link of document.querySelectorAll('a[href]')) {
          const href = link.href || '';
          if (href.includes('panopto') || href.includes('Panopto') || href.includes('/mod/lti/')) {
            found.push({ url: href, name: link.textContent.trim() || 'Video Link' });
          }
        }
        return found;
      }, SESSION_ID_RE.source);

      for (const v of embeddedVideos) {
        log(`  Found embedded video in page "${resource.name}": ${v.name}`);
        embeddedVideoResources.push({ type: 'video', url: v.url, name: v.name });
      }

      if (existsSync(join(DIRS.html, filename))) {
        log(`  SKIP (exists): ${filename}`);
        continue;
      }

      // Extract the main content area from Moodle page
      const content = await page.evaluate(() => {
        const main = document.querySelector('#region-main .content, [role="main"], #page-content');
        return main ? main.innerHTML : document.body.innerHTML;
      });

      writeFileSync(join(DIRS.html, filename), content);
      log(`  EXTRACTED → html/${filename}`);
      extracted++;
    } catch (err) {
      log(`  ERROR extracting page "${resource.name}": ${err.message}`);
    }
  }

  log(`Extracted ${extracted} new HTML pages`);
  return embeddedVideoResources;
}

// ─── Panopto Transcript Scraping ─────────────────────────────────────────────

const PANOPTO_HOST = 'northwestu.hosted.panopto.com';
const SESSION_ID_RE = /[?&]id=([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;

function parseSRT(srt) {
  return srt
    .split('\n')
    .filter(line => !/^\d+$/.test(line.trim()) && !/^\d{2}:\d{2}:\d{2}/.test(line.trim()) && line.trim())
    .join(' ')
    .replace(/ {2,}/g, ' ')
    .trim();
}

function sanitizeTitle(title) {
  return title.replace(/[/\\?%*:|"<>]/g, '-').replace(/\s+/g, '_').trim();
}

async function extractSessionIds(page) {
  // Check if we landed on a viewer page
  const url = page.url();
  const match = url.match(SESSION_ID_RE);
  if (match) return [match[1]];

  // Check for links and iframes containing Panopto session IDs
  return page.evaluate((re) => {
    const ids = [];
    const seen = new Set();

    const addId = (id) => { if (!seen.has(id)) { seen.add(id); ids.push(id); } };

    // Direct viewer links
    for (const link of document.querySelectorAll('a[href*="Viewer.aspx"]')) {
      const m = link.href.match(new RegExp(re));
      if (m) addId(m[1]);
    }

    // Embedded iframes (Panopto embed or LTI that lands on Panopto)
    for (const iframe of document.querySelectorAll('iframe')) {
      const src = iframe.src || '';
      const m = src.match(new RegExp(re));
      if (m) addId(m[1]);
    }

    return ids;
  }, SESSION_ID_RE.source);
}

async function scrapePanoptoTranscripts(page, resources) {
  const videoResources = resources.filter(r => r.type === 'video' && !r.url.startsWith('javascript:'));
  log(`Processing ${videoResources.length} video resources for transcripts...`);

  const urlsFile = join(DIRS.videos, 'video-urls.txt');
  const existingUrls = new Set(
    existsSync(urlsFile)
      ? readFileSync(urlsFile, 'utf-8').split('\n').filter(Boolean)
      : []
  );

  const seenIds = new Set();
  let transcriptsFound = 0;

  for (const resource of videoResources) {
    try {
      log(`  Navigating to: ${resource.name}`);
      await page.goto(resource.url, { waitUntil: 'networkidle', timeout: 30000 });

      // Wait for any LTI redirects to settle
      await page.waitForTimeout(2000);

      const sessionIds = await extractSessionIds(page);

      if (sessionIds.length === 0) {
        log(`    No Panopto session IDs found for "${resource.name}"`);
        continue;
      }

      for (const sessionId of sessionIds) {
        if (seenIds.has(sessionId)) continue;
        seenIds.add(sessionId);

        const viewerUrl = `https://${PANOPTO_HOST}/Panopto/Pages/Viewer.aspx?id=${sessionId}`;
        existingUrls.add(viewerUrl);

        // If this isn't the page we're already on, navigate via the course page
        // to preserve Panopto auth (direct viewer URLs redirect to login)
        if (!page.url().includes(sessionId)) {
          await page.goto(resource.url, { waitUntil: 'networkidle', timeout: 30000 });
          await page.waitForTimeout(2000);
        }

        // Get the video title from the page we're on
        let title = await page.evaluate(() => {
          const el = document.querySelector('#titleText') || document.querySelector('title');
          return el ? el.textContent.trim() : '';
        }).catch(() => '');

        title = title.replace(/\s*-\s*Panopto$/, '').trim();
        if (!title) title = resource.name;
        const safeName = sanitizeTitle(title);
        const outPath = join(DIRS.extracted, `video_${safeName}.txt`);

        if (existsSync(outPath)) {
          log(`    SKIP (exists): video_${safeName}.txt`);
          continue;
        }

        // Strategy 1: Try SRT endpoint (uses cookies from current Panopto session)
        let transcript = '';
        try {
          const srtUrl = `https://${PANOPTO_HOST}/Panopto/Pages/Transcription/GenerateSRT.ashx?id=${sessionId}`;
          transcript = await page.evaluate(async (url) => {
            const resp = await fetch(url, { credentials: 'include' });
            if (!resp.ok) return '';
            return resp.text();
          }, srtUrl);
          if (transcript) transcript = parseSRT(transcript);
        } catch {
          transcript = '';
        }

        // Strategy 2: DOM scraping — captions are already loaded in the viewer
        if (!transcript) {
          try {
            transcript = await page.evaluate(() => {
              const spans = document.querySelectorAll('[aria-label="Captions"] li.index-event div.event-text span');
              if (spans.length === 0) return '';
              return Array.from(spans).map(s => s.textContent.trim()).filter(Boolean).join(' ');
            });
          } catch {
            transcript = '';
          }
        }

        if (transcript) {
          writeFileSync(outPath, transcript);
          log(`    TRANSCRIPT → extracted/video_${safeName}.txt (${transcript.length} chars)`);
          transcriptsFound++;
        } else {
          log(`    No transcript available for "${title}" (${sessionId})`);
        }
      }
    } catch (err) {
      log(`  ERROR processing video "${resource.name}": ${err.message}`);
    }
  }

  // Save the URL list
  if (existingUrls.size > 0) {
    writeFileSync(urlsFile, Array.from(existingUrls).join('\n') + '\n');
    log(`Saved ${existingUrls.size} video URLs → videos/video-urls.txt`);
  }

  log(`Scraped ${transcriptsFound} new transcripts`);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function syncCourse(page, courseId) {
  const courseConfig = COURSE_MAP[courseId];
  log(`\n>>> Syncing ${courseId} (${courseConfig.dir}) <<<`);
  log(`  URL: ${courseConfig.url}`);

  setDirsForCourse(courseId);

  const resources = await discoverResources(page, courseConfig.url);

  await downloadFiles(page, resources);
  const embeddedVideos = await extractHTMLPages(page, resources);
  await scrapePanoptoTranscripts(page, [...resources, ...embeddedVideos]);
}

async function main() {
  log('=== LMS Sync Starting ===');
  log(`Courses to sync: ${coursesToSync.join(', ')}`);

  // Use headed mode for first run (no session), headless for subsequent
  const headless = existsSync(SESSION_FILE);
  log(`Browser mode: ${headless ? 'headless' : 'headed (first run — you may need to handle MFA)'}`);

  const browser = await chromium.launch({ headless });

  try {
    // Auth once, reuse for all courses
    const firstUrl = COURSE_MAP[coursesToSync[0]].url;
    const { context, page } = await getAuthContext(browser, firstUrl);

    for (const courseId of coursesToSync) {
      if (!COURSE_MAP[courseId]?.url) {
        log(`Skipping ${courseId} — no URL configured`);
        continue;
      }
      try {
        await syncCourse(page, courseId);
      } catch (err) {
        log(`ERROR syncing ${courseId}: ${err.message}`);
        log('Continuing with next course...');
      }
    }

    await context.close();
  } catch (err) {
    log(`FATAL: ${err.message}`);
    console.error(err);
    process.exit(1);
  } finally {
    await browser.close();
  }

  log('=== LMS Sync Complete ===');
}

main();
