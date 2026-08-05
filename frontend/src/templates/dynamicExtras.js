// dynamicExtras.js — GENERIC engine.
// Every per-template layout.js only knows how to render the sections/photo it
// shipped with (hardcoded). Whatever the user adds at runtime — a custom
// section, an extra photo, a whole extra page — is rendered HERE instead,
// generically, using that template's own THEME (colors/font/border, see
// themes.js) so it blends in rather than looking like a bolted-on box.
// Extra PHOTOS are rendered as a freeform, absolutely-positioned overlay
// (draggable/resizable — see livePreview.js) so they never disturb a
// template's own grid/flex layout and can go anywhere the user wants on
// the page. This file is never edited when a template is added/changed/removed.

import { getTheme } from "./themes.js";

const PAGE_WIDTH = 735;
const PAGE_MIN_HEIGHT = 1040;

function esc(str) {
  return (str || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function sectionHtml(theme, section, formData) {
  const rows = section.fields
    .map((f) => {
      const val = formData[f.id] && formData[f.id].toString().trim() ? esc(formData[f.id]) : "&nbsp;";
      return `
        <div style="display:grid;grid-template-columns:180px 14px 1fr;font-size:15px;line-height:1.5;padding:4px 0;">
          <span style="font-weight:700;">${esc(f.label)}</span>
          <span>:</span>
          <span>${val}</span>
        </div>`;
    })
    .join("");
  return `
    <div style="margin-bottom:22px;">
      <h3 style="font-size:18px;font-weight:700;letter-spacing:.01em;margin:0 0 10px;padding-bottom:8px;border-bottom:2px solid ${theme.accent};color:${theme.accent};">${esc(section.title)}</h3>
      ${rows || `<div style="font-size:13px;font-style:italic;opacity:.65;">No fields added yet.</div>`}
    </div>`;
}

// In-flow block of custom sections. Given `grid-column:1/-1` + `flex:0 0 100%`
// inline so that, if the template's root is CSS grid or flex (a few are),
// this block still spans full width as a new row instead of squeezing into
// one column/track.
function buildSectionsBlock(theme, sections, formData, { topBorder } = {}) {
  if (!sections.length) return "";
  return `
    <div style="grid-column:1/-1;flex:0 0 100%;width:100%;box-sizing:border-box;${
      topBorder ? `margin-top:26px;padding-top:22px;border-top:1px dashed ${theme.accent};` : ""
    }font-family:${theme.font};color:${theme.text};">
      ${sections.map((s) => sectionHtml(theme, s, formData)).join("")}
    </div>`;
}

function photoShapeStyle(shape) {
  if (shape === "circle") return "border-radius:50%;";
  if (shape === "rect") return "border-radius:4px;";
  return "border-radius:8px;"; // square/default
}

// Freeform, draggable/resizable photo overlay. `position:absolute` takes it
// completely out of the template's document flow (so it can never disturb a
// grid/flex layout and can never "escape" the page — it's always positioned
// relative to the nearest positioned ancestor, which is the page itself).
function photoOverlayHtml(theme, photo, formData) {
  const src = formData[photo.id];
  const shapeCss = photoShapeStyle(photo.shape);
  const x = photo.x ?? 40;
  const y = photo.y ?? 40;
  const w = photo.w ?? 120;
  const h = photo.h ?? 120;
  const inner = src
    ? `<img src="${src}" alt="${esc(photo.label)}" style="width:100%;height:100%;object-fit:cover;display:block;${shapeCss}" />`
    : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:12px;text-align:center;opacity:.65;background:rgba(128,128,128,0.15);${shapeCss}">${esc(photo.label)}</div>`;

  return `
    <div class="bd-user-photo" data-photo-drag="${photo.id}" style="
      position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;
      border:3px solid ${theme.accent};box-sizing:border-box;cursor:move;${shapeCss}
    ">
      ${inner}
      <div class="bd-user-photo-resize" data-photo-resize="${photo.id}"></div>
    </div>`;
}

function photosOverlayHtml(theme, photos, formData) {
  if (!photos.length) return "";
  // pointer-events:none on the wrapper (so it never blocks clicks on the
  // template underneath), each photo re-enables pointer-events:auto.
  return `
    <div class="bd-user-photo-layer" style="position:absolute;inset:0;pointer-events:none;">
      ${photos.map((p) => `<div style="pointer-events:auto;position:absolute;inset:0;">${photoOverlayHtml(theme, p, formData)}</div>`).join("")}
    </div>`;
}

// A full continuation page (page 2, 3, ...), styled as its own sheet using
// the exact page-shell dimensions/background/border/font every template
// uses, so it reads as "the same biodata, next page".
function continuationPageHtml(theme, pageNumber, totalPages, photos, sections, formData) {
  const borderCss = theme.border ? `border:${theme.border};` : `border:1px solid ${theme.accent};`;
  const isEmpty = !photos.length && !sections.length;
  return `
    <div class="bd-cont-page" style="
      position:relative;width:${PAGE_WIDTH}px;min-height:${PAGE_MIN_HEIGHT}px;margin:0 auto;
      box-sizing:border-box;padding:56px 60px;background:${theme.bg};color:${theme.text};
      font-family:${theme.font};${borderCss}
    ">
      <div style="position:absolute;top:22px;right:28px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;opacity:.55;">
        Page ${pageNumber} of ${totalPages}
      </div>
      ${photosOverlayHtml(theme, photos, formData)}
      ${
        isEmpty
          ? `<div style="font-size:13px;font-style:italic;opacity:.6;margin-top:60px;text-align:center;">No sections added to this page yet. Use "+ Add custom section" to fill it in.</div>`
          : buildSectionsBlock(theme, sections, formData, { topBorder: false })
      }
    </div>`;
}

// Returns { firstPagePhotosHtml, firstPageSectionsHtml, extraPageHtmls }.
// - firstPagePhotosHtml: absolute overlay, safe to inject ANYWHERE inside
//   the template's root div (position:absolute removes it from flow).
// - firstPageSectionsHtml: in-flow block, must be injected right before the
//   root div's closing tag.
export function renderExtras(templateId, schema, formData) {
  const theme = getTheme(templateId);
  const extraPhotos = schema.photos.slice(1); // photos[0] is always handled by the template itself
  const totalPages = schema.pages.length;

  const page1 = schema.pages[0];
  const page1Id = page1?.id;
  const page1CustomSections = (page1?.sections || []).filter((s) => s.custom);
  const page1Photos = extraPhotos.filter((p) => (p.page || page1Id) === page1Id);

  const firstPagePhotosHtml = photosOverlayHtml(theme, page1Photos, formData);
  const firstPageSectionsHtml = buildSectionsBlock(theme, page1CustomSections, formData, { topBorder: true });

  const extraPageHtmls = schema.pages.slice(1).map((page, i) => {
    const pagePhotos = extraPhotos.filter((p) => p.page === page.id);
    return continuationPageHtml(theme, i + 2, totalPages, pagePhotos, page.sections, formData);
  });

  return { firstPagePhotosHtml, firstPageSectionsHtml, extraPageHtmls };
}
