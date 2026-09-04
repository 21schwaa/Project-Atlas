import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const projectRoot = path.resolve(import.meta.dirname, "..");
const browserCandidates = [
  process.env.CHROME_BIN,
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser"
].filter(Boolean);
const browserPath = browserCandidates.find((candidate) => existsSync(candidate));
const screenshotDir = process.env.ATLAS_SCREENSHOT_DIR
  ? path.resolve(projectRoot, process.env.ATLAS_SCREENSHOT_DIR)
  : null;
const captureSection = process.env.ATLAS_SECTION?.replace(/[^a-z0-9-]/gi, "") || "";

assert.ok(browserPath, "Responsive layout test requires Chrome, Edge, or Chromium.");
if (screenshotDir) await mkdir(screenshotDir, { recursive: true });

const contentTypes = {
  ".css": "text/css",
  ".html": "text/html",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff2": "font/woff2"
};

const server = createServer(async (request, response) => {
  try {
    const requestPath = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
    const relativePath = requestPath === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
    const filePath = path.resolve(projectRoot, relativePath);
    const relativeToRoot = path.relative(projectRoot, filePath);

    if (relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    await stat(filePath);
    const body = await readFile(filePath);
    response.writeHead(200, { "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const address = server.address();

const requestedViewportWidth = Number.parseInt(process.env.ATLAS_VIEWPORT_WIDTH, 10);
const viewports = [
  { width: 1280, height: 800, expectedColumns: 6, desktopNav: true, heroRail: true, headerCta: true, expectHeroMediaAboveFold: true },
  { width: 1280, height: 600, expectedColumns: 6, desktopNav: true, heroRail: true, headerCta: true, railOnly: true },
  { width: 1024, height: 768, expectedColumns: 3, desktopNav: false, heroRail: false, headerCta: true, expectHeroMediaAboveFold: true },
  { width: 768, height: 1024, expectedColumns: 2, desktopNav: false, heroRail: false, headerCta: true },
  { width: 390, height: 844, expectedColumns: 1, desktopNav: false, heroRail: false, headerCta: true },
  { width: 320, height: 700, expectedColumns: 1, desktopNav: false, heroRail: false, headerCta: false }
].filter((viewport) => !Number.isFinite(requestedViewportWidth) || viewport.width === requestedViewportWidth);

assert.ok(viewports.length, `No configured responsive viewport matches ${process.env.ATLAS_VIEWPORT_WIDTH}.`);

try {
  await Promise.all(viewports.map(async (viewport) => {
    const profileDir = await mkdtemp(path.join(tmpdir(), `atlas-responsive-${viewport.width}-`));

    try {
      const sectionQuery = captureSection ? `&section=${encodeURIComponent(captureSection)}` : "";
      const captureQuery = screenshotDir ? "&capture=1" : "";
      const url = `http://127.0.0.1:${address.port}/tests/fixtures/responsive-probe.html?width=${viewport.width}${sectionQuery}${captureQuery}`;
      const { stdout } = await execFileAsync(browserPath, [
        "--headless",
        "--disable-gpu",
        "--disable-background-networking",
        "--hide-scrollbars",
        "--no-first-run",
        "--dump-dom",
        "--virtual-time-budget=4000",
        `--window-size=${viewport.width + 100},${viewport.height}`,
        `--user-data-dir=${profileDir}`,
        url
      ], { maxBuffer: 10 * 1024 * 1024 });
      const encodedResult = stdout.match(/data-json="([^"]+)"/)?.[1];

      assert.ok(encodedResult && encodedResult !== "pending", `Responsive probe did not finish at ${viewport.width}px.`);
      const result = JSON.parse(decodeURIComponent(encodedResult));

      if (viewport.railOnly) {
        assert.deepEqual(result.ariaTreeViolations, [], `ARIA accessibility-tree checks failed at ${viewport.width}px: ${JSON.stringify(result.ariaTreeViolations)}`);
        assert.equal(result.documentFits, true, `Document overflows horizontally at ${viewport.width}px.`);
        assert.equal(result.heroRailVisible, true, `Desktop rail is hidden at ${viewport.width}x${viewport.height}.`);
        assert.equal(result.railContentFits, true, `Desktop rail content overlaps or exceeds the viewport at ${viewport.width}x${viewport.height}: ${JSON.stringify(result.railPartBounds)}`);
        assert.equal(result.inactiveNavColorsConsistent, true, `An inactive navigation item retains active coloring at ${viewport.width}px.`);
        assert.equal(result.phoneLinkCorrect, true, `Contact phone link is missing or incorrect at ${viewport.width}px.`);
        assert.equal(result.googleReviewLinkReady, true, `Google Reviews card is not an interactive link to the verified profile at ${viewport.width}px.`);
        assert.equal(result.googleReviewRatingReady, true, `Google Reviews rating is missing or incomplete at ${viewport.width}px.`);
        assert.equal(result.testimonialFaqReady, true, `Lifter FAQ is missing, inaccessible, or overflowing at ${viewport.width}px: ${JSON.stringify(result.testimonialFaqMetrics)}`);
        assert.equal(result.testimonialInteractionsReady, true, `Lifter FAQ tabs or accordion do not expose the correct content at ${viewport.width}px: ${JSON.stringify(result.testimonialInteractionMetrics)}`);
        assert.equal(result.testimonialFloatingCtaHidden, true, `Floating training CTA remains visible over testimonials at ${viewport.width}px.`);
        assert.equal(result.testimonialControlsClearFloatingCta, true, `Testimonial rail controls overlap the floating training CTA at ${viewport.width}px.`);
        assert.equal(result.assistantHoursHidden, true, `Assistant coaching hours remain visible at ${viewport.width}px.`);
        assert.equal(result.accentGreenIsLighterThanFieldGreen, true, `Atlas accent green is not lighter than its large green fields at ${viewport.width}px: ${JSON.stringify(result.atlasGreenColors)}`);
        assert.equal(result.accentGreenMatchesActiveNavigation, true, `Active navigation does not use the Atlas accent green at ${viewport.width}px: ${JSON.stringify(result.atlasGreenColors)}`);
        assert.equal(result.philosophyBodyTypographyConsistent, true, `Coaching philosophy body typography is inconsistent at ${viewport.width}px: ${JSON.stringify(result.philosophyParagraphStyles)}`);
        return;
      }

      assert.deepEqual(result.ariaTreeViolations, [], `ARIA accessibility-tree checks failed at ${viewport.width}px: ${JSON.stringify(result.ariaTreeViolations)}`);
      assert.equal(result.documentFits, true, `Document overflows horizontally at ${viewport.width}px.`);
      assert.equal(result.brandSingleLine, true, `Header brand wraps at ${viewport.width}px.`);
      assert.equal(result.desktopNavVisible, viewport.desktopNav, `Desktop navigation mode is wrong at requested ${viewport.width}px (measured ${result.viewportWidth}px).`);
      assert.equal(result.mobileNavVisible, !viewport.desktopNav, `Mobile navigation mode is wrong at requested ${viewport.width}px (measured ${result.viewportWidth}px).`);
      assert.equal(result.headerCtaVisible, viewport.headerCta, `Header CTA visibility is wrong at ${viewport.width}px.`);
      assert.equal(result.heroRailVisible, viewport.heroRail, `Hero rail visibility is wrong at ${viewport.width}px.`);
      assert.equal(result.headerFits, true, `Header controls overflow at ${viewport.width}px.`);
      assert.equal(result.headerItemsDoNotOverlap, true, `Header groups overlap at ${viewport.width}px.`);
      assert.equal(result.heroCopyFits, true, `Hero copy overflows its column at ${viewport.width}px.`);
      assert.equal(result.heroContainsContent, true, `Hero clips stacked content at ${viewport.width}px.`);
      assert.equal(result.heroMediaFitsHorizontally, true, `Hero media is pushed outside the viewport at ${viewport.width}px (media ${result.heroMediaLeft} to ${result.heroMediaRight}, equipment ${result.heroEquipmentLeft} to ${result.heroEquipmentRight}, shell ${result.heroShellLeft} to ${result.heroShellRight}, viewport ${result.viewportWidth}).`);
      if (viewport.expectHeroMediaAboveFold) {
        assert.equal(result.heroMediaStartsInViewport, true, `Hero media starts below the laptop viewport at ${viewport.width}px (top ${result.heroMediaTop}px, viewport height ${viewport.height}px).`);
      }
      assert.equal(result.trainingItemsPerRow, viewport.expectedColumns, `Training selector has the wrong column count at ${viewport.width}px.`);
      assert.equal(result.imagePlaceholderCount, 6, `Expected six construction-marked photo areas at ${viewport.width}px.`);
      assert.equal(result.imagePlaceholdersReady, true, `Construction tape is missing or hidden at ${viewport.width}px: ${JSON.stringify(result.imagePlaceholderTapeValues)}`);
      assert.equal(result.postHeroShellsClearRail, true, `Post-hero content overlaps the desktop rail at ${viewport.width}px.`);
      assert.equal(result.railContentFits, true, `Desktop rail content overlaps or exceeds the viewport at ${viewport.width}x${viewport.height}: ${JSON.stringify(result.railPartBounds)}`);
      assert.equal(result.imagePlaceholderMediaRemoved, true, `Photographic media remains inside a construction placeholder at ${viewport.width}px.`);
      assert.equal(result.imagePlaceholdersAreGreen, true, `Construction placeholders are not using Atlas green at ${viewport.width}px: ${JSON.stringify(result.imagePlaceholderColors)}`);
      assert.equal(result.assistantHoursHidden, true, `Assistant coaching hours remain visible at ${viewport.width}px.`);
      assert.equal(result.phoneLinkCorrect, true, `Contact phone link is missing or incorrect at ${viewport.width}px.`);
      assert.equal(result.googleReviewLinkReady, true, `Google Reviews card is not an interactive link to the verified profile at ${viewport.width}px.`);
      assert.equal(result.googleReviewRatingReady, true, `Google Reviews rating is missing or incomplete at ${viewport.width}px.`);
      assert.equal(result.testimonialFaqReady, true, `Lifter FAQ is missing, inaccessible, or overflowing at ${viewport.width}px: ${JSON.stringify(result.testimonialFaqMetrics)}`);
      assert.equal(result.testimonialInteractionsReady, true, `Lifter FAQ tabs or accordion do not expose the correct content at ${viewport.width}px: ${JSON.stringify(result.testimonialInteractionMetrics)}`);
      assert.equal(result.testimonialFloatingCtaHidden, true, `Floating training CTA remains visible over testimonials at ${viewport.width}px.`);
      assert.equal(result.testimonialControlsClearFloatingCta, true, `Testimonial rail controls overlap the floating training CTA at ${viewport.width}px.`);
      assert.equal(result.inactiveNavColorsConsistent, true, `An inactive navigation item retains active coloring at ${viewport.width}px.`);
      assert.equal(result.accentGreenIsLighterThanFieldGreen, true, `Atlas accent green is not lighter than its large green fields at ${viewport.width}px: ${JSON.stringify(result.atlasGreenColors)}`);
      assert.equal(result.accentGreenMatchesActiveNavigation, true, `Active navigation does not use the Atlas accent green at ${viewport.width}px: ${JSON.stringify(result.atlasGreenColors)}`);
      assert.equal(result.philosophyBodyTypographyConsistent, true, `Coaching philosophy body typography is inconsistent at ${viewport.width}px: ${JSON.stringify(result.philosophyParagraphStyles)}`);
      assert.deepEqual(result.overflowingGrids, [], `Major grids overflow at ${viewport.width}px: ${result.overflowingGrids.join(", ")}`);

      if (screenshotDir) {
        const screenshotProfileDir = await mkdtemp(path.join(tmpdir(), `atlas-capture-${viewport.width}-`));
        try {
          await execFileAsync(browserPath, [
            "--headless",
            "--disable-gpu",
            "--disable-background-networking",
            "--hide-scrollbars",
            "--no-first-run",
            "--virtual-time-budget=4000",
            `--window-size=${viewport.width + 100},${viewport.height}`,
            `--screenshot=${path.join(screenshotDir, `atlas-${viewport.width}x${viewport.height}${captureSection ? `-${captureSection}` : ""}.png`)}`,
            `--user-data-dir=${screenshotProfileDir}`,
            url
          ], { maxBuffer: 10 * 1024 * 1024 });
        } finally {
          await rm(screenshotProfileDir, { recursive: true, force: true });
        }
      }
    } finally {
      await rm(profileDir, { recursive: true, force: true });
    }
  }));
} finally {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}

console.log("Responsive layout checks passed.");
