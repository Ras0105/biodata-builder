// livePreview.js — GENERIC engine.
// Loads whichever template's layout.js + style.css the registry points to,
// and renders current formData into the preview pane. Never edited per-template.

import { getTemplateMeta } from "../templates/registry.js";

let currentStyleEl = null;

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
}
