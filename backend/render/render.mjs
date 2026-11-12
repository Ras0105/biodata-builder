// backend/render/render.mjs
//
// Turns { templateId, formData, schema } into the final print-ready HTML
// for that biodata, by importing the FRONTEND's own template modules
// directly — not a ported/duplicated copy. This is the one thing that
// keeps 29 templates (and counting) from needing to be hand-rewritten in a
// second templating language and kept in sync forever:
//
//   frontend/src/templates/catalog/<templateId>/{layout.js,schema.js,style.css}
//   frontend/src/templates/dynamicExtras.js   (custom sections/pages/extra photos)
//   frontend/src/templates/schemaUtils.js     (cloneSchema — adds the
//                                               .sections/.photo compat
//                                               getters every layout.js relies on)
//
// are read straight out of the sibling frontend/ folder at render time, so
// a template design change on the frontend is automatically reflected in
// the next PDF generated — nothing to port, nothing that can drift out of
// sync. This assumes backend/ and frontend/ are deployed from the same
// commit of this repo, which the project structure already guarantees.
//
// Called by app/services/pdf_generator.py as a subprocess: JSON in via
// stdin, full HTML document out via stdout, errors + a non-zero exit code
// on failure.
//
// IMAGES (changed in the frontend restructure): template background images
// used to be base64 blobs embedded in style.css / themes.js / layout.js.
// They are now real files next to the template that owns them
// (background.*, continuation-bg.*, frame.*). The browser loads those by
// URL, but Playwright prints this HTML via page.set_content() with no base
// URL, so any file path would fail to load and the PDF would silently come
// out without its background. inlineLocalImages() below therefore converts
// every reference back into a data: URI before the HTML leaves this script —
// the PDF is byte-for-byte the same document it was before the restructure.
//
// The ONE deliberate behavioral difference from the live preview: extra
// photos' edit affordances (pencil icon, resize handle) are visual-editor
// chrome with no place in a downloaded PDF, so they're hidden via CSS
// here — see HIDE_EDITOR_CHROME_CSS below. The watermark is handled by
// dynamicExtras.js itself via the { watermark: false } option (see that
// file's renderExtras docstring) — never rendered here in the first place,
// rather than rendered then stripped.

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_TEMPLATES_DIR = path.join(__dirname, "..", "..", "frontend", "src", "templates");

const PAGE_WIDTH = 735;   // must match PAGE_WIDTH in dynamicExtras.js / livePreview.js
const PAGE_HEIGHT = 1040; // must match PAGE_MIN_HEIGHT in dynamicExtras.js

// Live-preview-only interactive affordances that dynamicExtras.js renders
// onto extra photos (drag handle cursor is harmless, but the edit button
// and resize handle are visible UI chrome that must never appear in the
// final PDF).
const HIDE_EDITOR_CHROME_CSS = `
  .bd-photo-edit-btn, .bd-user-photo-resize, .bd-photo-edit-panel { display: none !important; }
`;

const IMAGE_MIME = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

class MissingImageError extends Error {}

function fileToDataUri(absPath) {
  const mime = IMAGE_MIME[path.extname(absPath).toLowerCase()];
  if (!mime) throw new MissingImageError(`Unsupported image type: ${absPath}`);
  let bytes;
  try {
    bytes = readFileSync(absPath);
  } catch {
    // Fail loudly: shipping a paid PDF with a missing background is worse
    // than failing the render (the pipeline marks the order FAILED and logs it).
    throw new MissingImageError(`Template image not found: ${absPath}`);
  }
  return `data:${mime};base64,${bytes.toString("base64")}`;
}

/**
 * Relative url(...) references inside a template's style.css
 * (e.g. `url('./background.png')`) -> data: URIs, resolved against the
 * template's own folder. Absolute URLs, data: URIs and #fragments are left alone.
 */
function inlineCssUrls(css, baseDir) {
  return css.replace(
    /url\(\s*(['"]?)(?!data:|https?:|file:|\/|#)([^'")]+?)\1\s*\)/gi,
    (_m, quote, rel) => `url(${quote}${fileToDataUri(path.resolve(baseDir, rel))}${quote})`
  );
}

/**
 * file:// URLs produced by `new URL("./x.png", import.meta.url).href` inside
 * layout.js / themes.js (under Node, import.meta.url is a file:// URL) ->
 * data: URIs. Runs over the finished HTML so it covers every page.
 */
function inlineFileUrls(html) {
  return html.replace(
    /file:\/\/[^\s"'()<>]+?\.(?:png|jpe?g|webp|gif|svg)/gi,
    (url) => fileToDataUri(fileURLToPath(url))
  );
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf-8");
}

function injectIntoPage(pageHtml, photosHtml, sectionsHtml) {
  // Same injection logic as livePreview.js's injectIntoPage — sectionsHtml
  // goes INSIDE the page root (before its closing </div>) so it participates
  // in that template's own flow/grid; photosHtml is position:absolute so
  // placement doesn't matter.
  const idx = pageHtml.lastIndexOf("</div>");
  if (idx === -1) return pageHtml + photosHtml + sectionsHtml;
  return pageHtml.slice(0, idx) + photosHtml + sectionsHtml + pageHtml.slice(idx);
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

async function main() {
  const raw = await readStdin();
  let input;
  try {
    input = JSON.parse(raw);
  } catch (err) {
    return fail(`Invalid JSON input: ${err.message}`);
  }

  const { templateId, formData, schema: schemaSnapshot } = input;
  if (!templateId || typeof templateId !== "string") {
    return fail("templateId is required");
  }

  const catalogDir = path.join(FRONTEND_TEMPLATES_DIR, "catalog", templateId);

  let layoutModule, schemaModule, cloneSchema, renderExtras;
  try {
    layoutModule = await import(path.join(catalogDir, "layout.js"));
    schemaModule = await import(path.join(catalogDir, "schema.js"));
    ({ cloneSchema } = await import(path.join(FRONTEND_TEMPLATES_DIR, "schemaUtils.js")));
    ({ renderExtras } = await import(path.join(FRONTEND_TEMPLATES_DIR, "dynamicExtras.js")));
  } catch (err) {
    return fail(`Failed to load template modules for "${templateId}": ${err.stack || err}`);
  }

  // Prefer the order's live schema snapshot (captures any custom
  // sections/pages/extra photos the user added at runtime). Falls back to
  // the template's own pristine schema.js — same fallback the frontend
  // itself uses the first time a template is opened with no saved draft —
  // for orders that never sent one (e.g. an older client build).
  const hasSnapshot = schemaSnapshot && Array.isArray(schemaSnapshot.pages) && schemaSnapshot.pages.length > 0;
  const schema = cloneSchema(hasSnapshot ? schemaSnapshot : schemaModule.schema);

  const safeFormData = formData && typeof formData === "object" ? formData : {};

  let baseHtml;
  try {
    baseHtml = layoutModule.render(safeFormData, schema);
  } catch (err) {
    return fail(`layout.render() failed for "${templateId}": ${err.stack || err}`);
  }

  let extras;
  try {
    // watermark:false is the one deliberate difference from the live
    // preview render path — see dynamicExtras.js.
    extras = renderExtras(templateId, schema, safeFormData, { watermark: false });
  } catch (err) {
    return fail(`renderExtras() failed for "${templateId}": ${err.stack || err}`);
  }
  const { firstPagePhotosHtml, firstPageSectionsHtml, extraPageHtmls } = extras;

  const page1Html = injectIntoPage(baseHtml, firstPagePhotosHtml, firstPageSectionsHtml);
  const pagesHtml = [page1Html, ...extraPageHtmls];

  let styleCss;
  try {
    styleCss = readFileSync(path.join(catalogDir, "style.css"), "utf-8");
    styleCss = inlineCssUrls(styleCss, catalogDir);
  } catch (err) {
    return fail(`Could not read/prepare style.css for "${templateId}": ${err.message}`);
  }

  const pagesMarkup = pagesHtml
    .map((html, i) => `<section class="bd-print-page"${i > 0 ? ' style="page-break-before:always;"' : ""}>${html}</section>`)
    .join("\n");

  let doc = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  @page { size: ${PAGE_WIDTH}px ${PAGE_HEIGHT}px; margin: 0; }
  .bd-print-page { position: relative; width: ${PAGE_WIDTH}px; }
  ${HIDE_EDITOR_CHROME_CSS}
  ${styleCss}
</style>
</head>
<body>
${pagesMarkup}
</body>
</html>`;

  try {
    doc = inlineFileUrls(doc);
  } catch (err) {
    return fail(`Could not inline template images for "${templateId}": ${err.message}`);
  }

  process.stdout.write(doc);
}

main().catch((err) => fail(`Unexpected error: ${err.stack || err}`));
