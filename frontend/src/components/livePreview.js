// livePreview.js — GENERIC engine.
// Loads whichever template's layout.js + style.css the registry points to,
// and renders current formData into the preview pane. Never edited per-template.

import { getTemplateMeta } from "../templates/registry.js";

let currentStyleEl = null;
const PAGE_WIDTH = 735; // matches the fixed template page width used across the catalog

function applyResponsiveScale(scaleWrapperEl) {
  const parent = scaleWrapperEl.parentElement; // .preview-panel
  const available = parent.clientWidth - 16; // small breathing room
  const scale = Math.min(1, available / PAGE_WIDTH);
  scaleWrapperEl.style.transform = `scale(${scale})`;
  scaleWrapperEl.style.transformOrigin = "top center";
  // reserve correct scaled height so page doesn't overlap content below it
  scaleWrapperEl.style.height = `${PAGE_WIDTH * scale * (1040 / PAGE_WIDTH)}px`;
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

export async function renderPreview(container, templateId, formData) {
  const meta = getTemplateMeta(templateId);
  await ensureStyleLoaded(templateId);
  const { render } = await meta.loadLayout();
  container.innerHTML = render(formData);

  const scaleWrapperEl = container.parentElement; // .preview-scale
  applyResponsiveScale(scaleWrapperEl);
}

// Re-scale on rotate/resize without a full re-render.
window.addEventListener("resize", () => {
  document.querySelectorAll(".preview-scale").forEach(applyResponsiveScale);
});