// livePreview.js — GENERIC engine.
// Loads whichever template's layout.js + style.css the registry points to,
// renders the template's own (hardcoded) page-1 sections, then injects
// whatever custom sections/photos the user added at runtime (dynamicExtras.js)
// INSIDE that same page (not appended after it — that was the bug that made
// extra photos render outside the page). Multiple pages are shown ONE AT A
// TIME, Canva-style, with arrow/dot navigation. Extra photos are draggable
// and resizable directly on the page. Never edited per-template.

import { getTemplateMeta } from "../templates/registry.js";
import { renderExtras } from "../templates/dynamicExtras.js";

let currentStyleEl = null;
const PAGE_WIDTH = 735; // matches the fixed template page width used across the catalog

// Remembers current page + last rendered pages/scale, so arrow/dot clicks
// and photo drags can act instantly without recomputing template HTML.
const nav = {
  templateId: null,
  pagesHtml: [],
  currentIndex: 0,
  container: null,
  scaleWrapperEl: null,
  scale: 1,
  schema: null,
  callbacks: null,
};

// Injects `sectionsHtml` right before the root element's closing </div> (so
// it's INSIDE the page, in normal flow) and `photosHtml` anywhere inside
// (it's position:absolute, so placement in the markup doesn't matter — it's
// removed from flow and positioned relative to the page itself).
function injectIntoPage(pageHtml, photosHtml, sectionsHtml) {
  const idx = pageHtml.lastIndexOf("</div>");
  if (idx === -1) return pageHtml + photosHtml + sectionsHtml;
  return pageHtml.slice(0, idx) + photosHtml + sectionsHtml + pageHtml.slice(idx);
}

function applyResponsiveScale(scaleWrapperEl) {
  const parent = scaleWrapperEl.parentElement; // .preview-panel
  const available = parent.clientWidth - 16; // small breathing room
  const scale = Math.min(1, available / PAGE_WIDTH);
  scaleWrapperEl.style.transform = `scale(${scale})`;
  scaleWrapperEl.style.transformOrigin = "top center";
  nav.scale = scale;

  const mount = scaleWrapperEl.querySelector("#previewMount") || scaleWrapperEl.firstElementChild;
  const naturalHeight = mount ? mount.scrollHeight : PAGE_WIDTH * (1040 / 735);
  scaleWrapperEl.style.height = `${naturalHeight * scale}px`;
}

async function ensureStyleLoaded(templateId) {
  const meta = getTemplateMeta(templateId);
  if (currentStyleEl && currentStyleEl.dataset.templateId === templateId) return;
  if (currentStyleEl) currentStyleEl.remove();

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = meta.styleHref;
  link.dataset.templateId = templateId;
  document.head.appendChild(link);
  currentStyleEl = link;
}

function getNavEls() {
  return {
    navEl: document.getElementById("previewNav"),
    dotsEl: document.getElementById("previewDots"),
    prevBtn: document.getElementById("prevPageBtn"),
    nextBtn: document.getElementById("nextPageBtn"),
  };
}

// --- drag / resize for user-added photos, directly on the preview ---
function wirePhotoInteractions(container) {
  if (!nav.schema) return;

  container.querySelectorAll("[data-photo-drag]").forEach((el) => {
    const photoId = el.dataset.photoDrag;
    let mode = null; // "drag" | "resize"
    let startX = 0, startY = 0, origX = 0, origY = 0, origW = 0, origH = 0;

    const commit = () => {
      const photo = nav.schema.photos.find((p) => p.id === photoId);
      if (!photo) return;
      photo.x = parseFloat(el.style.left) || 0;
      photo.y = parseFloat(el.style.top) || 0;
      photo.w = parseFloat(el.style.width) || photo.w;
      photo.h = parseFloat(el.style.height) || photo.h;
      nav.callbacks?.onPhotoPosition?.(photoId, { x: photo.x, y: photo.y, w: photo.w, h: photo.h });
    };

    el.addEventListener("pointerdown", (e) => {
      mode = "drag";
      el.setPointerCapture(e.pointerId);
      startX = e.clientX;
      startY = e.clientY;
      origX = parseFloat(el.style.left) || 0;
      origY = parseFloat(el.style.top) || 0;
      e.preventDefault();
    });

    el.addEventListener("pointermove", (e) => {
      if (mode !== "drag") return;
      const dx = (e.clientX - startX) / nav.scale;
      const dy = (e.clientY - startY) / nav.scale;
      el.style.left = `${Math.max(0, origX + dx)}px`;
      el.style.top = `${Math.max(0, origY + dy)}px`;
    });

    const endDrag = () => {
      if (mode !== "drag") return;
      mode = null;
      commit();
    };
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);

    const handle = el.querySelector("[data-photo-resize]");
    if (!handle) return;

    handle.addEventListener("pointerdown", (e) => {
      mode = "resize";
      handle.setPointerCapture(e.pointerId);
      startX = e.clientX;
      startY = e.clientY;
      origW = parseFloat(el.style.width) || 120;
      origH = parseFloat(el.style.height) || 120;
      e.stopPropagation();
      e.preventDefault();
    });

    handle.addEventListener("pointermove", (e) => {
      if (mode !== "resize") return;
      const dw = (e.clientX - startX) / nav.scale;
      const dh = (e.clientY - startY) / nav.scale;
      el.style.width = `${Math.max(50, origW + dw)}px`;
      el.style.height = `${Math.max(50, origH + dh)}px`;
      e.stopPropagation();
    });

    const endResize = (e) => {
      if (mode !== "resize") return;
      mode = null;
      commit();
      e.stopPropagation();
    };
    handle.addEventListener("pointerup", endResize);
    handle.addEventListener("pointercancel", endResize);
  });
}

function showPage(index) {
  if (!nav.pagesHtml.length) return;
  nav.currentIndex = Math.max(0, Math.min(index, nav.pagesHtml.length - 1));
  nav.container.innerHTML = nav.pagesHtml[nav.currentIndex];
  applyResponsiveScale(nav.scaleWrapperEl);
  wirePhotoInteractions(nav.container);
  renderNavControls();
}

function renderNavControls() {
  const { navEl, dotsEl, prevBtn, nextBtn } = getNavEls();
  if (!navEl) return;

  const total = nav.pagesHtml.length;
  if (total <= 1) {
    navEl.hidden = true;
    return;
  }
  navEl.hidden = false;

  dotsEl.innerHTML = "";
  for (let i = 0; i < total; i += 1) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "preview-dot" + (i === nav.currentIndex ? " active" : "");
    dot.setAttribute("aria-label", `Go to page ${i + 1}`);
    dot.addEventListener("click", () => showPage(i));
    dotsEl.appendChild(dot);
  }

  prevBtn.disabled = nav.currentIndex === 0;
  nextBtn.disabled = nav.currentIndex === total - 1;
}

let navWired = false;
function wireNavOnce() {
  if (navWired) return;
  navWired = true;
  const { prevBtn, nextBtn } = getNavEls();
  if (prevBtn) prevBtn.addEventListener("click", () => showPage(nav.currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => showPage(nav.currentIndex + 1));
}

export async function renderPreview(container, templateId, schema, formData, callbacks) {
  const meta = getTemplateMeta(templateId);
  await ensureStyleLoaded(templateId);
  const { render } = await meta.loadLayout();

  let baseHtml;
  try {
    // Issue 6: pass the LIVE (possibly mutated) schema, not just formData —
    // every template's render() now prefers this over its own frozen import
    // so a field added to (or removed from) a pre-built section shows up
    // immediately instead of only ever reflecting the template's original shape.
    baseHtml = render(formData, schema);
  } catch (err) {
    console.error("Template render failed:", err);
    baseHtml = `<div class="bd-render-error">This template's preview couldn't render with the current sections removed. Try restoring the removed section, or check the Print/Download output.</div>`;
  }

  const { firstPagePhotosHtml, firstPageSectionsHtml, extraPageHtmls } = renderExtras(templateId, schema, formData);
  const page1Html = injectIntoPage(baseHtml, firstPagePhotosHtml, firstPageSectionsHtml);
  const pagesHtml = [page1Html, ...extraPageHtmls];

  wireNavOnce();

  const isTemplateSwitch = nav.templateId !== templateId;
  nav.templateId = templateId;
  nav.pagesHtml = pagesHtml;
  nav.container = container;
  nav.scaleWrapperEl = container.parentElement; // .preview-scale
  nav.schema = schema;
  nav.callbacks = callbacks;

  showPage(isTemplateSwitch ? 0 : nav.currentIndex);
}

// Re-scale on rotate/resize without a full re-render.
window.addEventListener("resize", () => {
  document.querySelectorAll(".preview-scale").forEach(applyResponsiveScale);
});