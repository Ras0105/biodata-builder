// layout.js — template_18 (Ivory Editorial Bride)
// Pure rendering: (formData) -> HTML string. Independent of every other template.

import { schema } from "./schema.js";

function esc(str) {
  return (str || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function row(label, value) {
  return `
    <div class="bd18-row">
      <span class="bd18-label">${esc(label)}</span>
      <span class="bd18-value">${value && value.trim() ? esc(value) : "&nbsp;"}</span>
    </div>`;
}

function sectionTitle(title) {
  return `<h2 class="bd18-section-title">${esc(title)}</h2>`;
}

export function render(formData) {
  const [profile, personal, family, contact] = schema.sections;
  const photoSrc = formData.photo || "";

  return `
    <div class="bd-template bd-template18">
      <div class="bd18-hero">
        <div class="bd18-wordmark">Biodata</div>
        <div class="bd18-photo-frame">
          ${photoSrc
            ? `<img class="bd18-photo" src="${photoSrc}" alt="Photo" />`
            : `<div class="bd18-photo bd18-photo-placeholder">Photo</div>`}
        </div>
        ${formData.caption && formData.caption.trim() ? `<p class="bd18-caption">&ldquo;${esc(formData.caption)}&rdquo;</p>` : ""}
        <div class="bd18-name">${esc(formData.fullName) || "&nbsp;"}</div>
      </div>

      <div class="bd18-body">
        ${sectionTitle(personal?.title)}
        <div class="bd18-section">
          ${(personal?.fields || []).map((f) => row(f.label, formData[f.id])).join("")}
        </div>

        ${sectionTitle(family?.title)}
        <div class="bd18-section">
          ${(family?.fields || []).map((f) => row(f.label, formData[f.id])).join("")}
        </div>

        ${sectionTitle(contact?.title)}
        <div class="bd18-section">
          ${(contact?.fields || []).map((f) => row(f.label, formData[f.id])).join("")}
        </div>
      </div>
    </div>`;
}