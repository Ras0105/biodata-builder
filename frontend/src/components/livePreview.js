// livePreview.js — GENERIC engine.
// Loads whichever template's layout.js + style.css the registry points to,
// renders the template's own (hardcoded) sections, then appends whatever
// custom sections/photos/pages the user added at runtime via dynamicExtras.js.
// Never edited per-template.

import { getTemplateMeta } from "../templates/registry.js";
import { renderExtras } from "../templates/dynamicExtras.js";

let currentStyleEl = null;
const PAGE_WIDTH = 735; // matches the fixed template page width used across the catalog

function applyResponsiveScale(scaleWrapperEl) {
  const parent = scaleWrapperEl.parentElement; // .preview-panel
  const available = parent.clientWidth - 16; // small breathing room
  const scale = Math.min(1, available / PAGE_WIDTH);
  scaleWrapperEl.style.transform = `scale(${scale})`;
  scaleWrapperEl.style.transformOrigin = "top center";

  // Measure the mount's ACTUAL natural (unscaled) height rather than assuming
  // a fixed page ratio — needed now that extra sections/pages can make the
  // content taller than a single template page used to be.
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

export async function renderPreview(container, templateId, schema, formData) {
  const meta = getTemplateMeta(templateId);
  await ensureStyleLoaded(templateId);
  const { render } = await meta.loadLayout();

  let baseHtml;
  try {
    baseHtml = render(formData);
  } catch (err) {
    // A built-in section/field the user removed was positionally required by
    // this template's hardcoded layout. Fail soft instead of a blank preview.
    console.error("Template render failed:", err);
    baseHtml = `<div class="bd-render-error">This template's preview couldn't render with the current sections removed. Try restoring the removed section, or check the Print/Download output.</div>`;
  }

  const { firstPageExtraHtml, extraPagesHtml } = renderExtras(schema, formData);

  container.innerHTML = baseHtml + firstPageExtraHtml + extraPagesHtml;

  const scaleWrapperEl = container.parentElement; // .preview-scale
  applyResponsiveScale(scaleWrapperEl);
}

// Re-scale on rotate/resize without a full re-render.
window.addEventListener("resize", () => {
  document.querySelectorAll(".preview-scale").forEach(applyResponsiveScale);
});
