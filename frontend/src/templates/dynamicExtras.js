// dynamicExtras.js — GENERIC engine.
// Every per-template layout.js only knows how to render the sections/photo it
// shipped with (hardcoded). Whatever the user adds at runtime — a custom
// section, an extra photo, a whole extra page — is rendered HERE instead,
// generically, and appended after the template's own hardcoded HTML.
// This file is never edited when a template is added, changed, or removed.

function esc(str) {
  return (str || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function renderExtraSection(section, formData) {
  const rows = section.fields
    .map((f) => `
      <div class="bd-extra-row">
        <span class="bd-extra-label">${esc(f.label)}</span>
        <span class="bd-extra-colon">:</span>
        <span class="bd-extra-value">${formData[f.id] && formData[f.id].toString().trim() ? esc(formData[f.id]) : "&nbsp;"}</span>
      </div>`)
    .join("");
  return `
    <div class="bd-extra-section">
      <h3 class="bd-extra-section-title">${esc(section.title)}</h3>
      ${rows || '<div class="bd-extra-empty">No fields added yet.</div>'}
    </div>`;
}

function renderExtraPhotos(photos, formData) {
  if (!photos.length) return "";
  return `
    <div class="bd-extra-photos">
      ${photos
        .map((p) => {
          const src = formData[p.id];
          return `
            <div class="bd-extra-photo-item">
              ${src ? `<img class="bd-extra-photo" src="${src}" alt="${esc(p.label)}" />` : `<div class="bd-extra-photo bd-extra-photo-placeholder">${esc(p.label)}</div>`}
              <div class="bd-extra-photo-label">${esc(p.label)}</div>
            </div>`;
        })
        .join("")}
    </div>`;
}

// Returns { firstPageExtraHtml, extraPagesHtml }.
// firstPageExtraHtml: custom sections/photos that belong on page 1 (appended
// below the template's own hardcoded content, same sheet).
// extraPagesHtml: each additional page (index > 0) rendered as its own sheet.
export function renderExtras(schema, formData) {
  const extraPhotos = schema.photos.slice(1); // photos[0] is always handled by the template itself
  const page1 = schema.pages[0];
  const page1CustomSections = (page1?.sections || []).filter((s) => s.custom);

  const firstPageParts = [];
  if (extraPhotos.length) firstPageParts.push(renderExtraPhotos(extraPhotos, formData));
  if (page1CustomSections.length) {
    firstPageParts.push(
      `<div class="bd-extra-wrap">${page1CustomSections.map((s) => renderExtraSection(s, formData)).join("")}</div>`
    );
  }
  const firstPageExtraHtml = firstPageParts.join("");

  const extraPagesHtml = schema.pages
    .slice(1)
    .map((page, i) => {
      const sectionsHtml = page.sections.map((s) => renderExtraSection(s, formData)).join("");
      return `
        <div class="bd-extra-page">
          <div class="bd-extra-page-label">Page ${i + 2}</div>
          ${sectionsHtml || '<div class="bd-extra-empty">No sections added to this page yet.</div>'}
        </div>`;
    })
    .join("");

  return { firstPageExtraHtml, extraPagesHtml };
}
