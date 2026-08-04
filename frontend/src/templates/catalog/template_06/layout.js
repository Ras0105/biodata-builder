// layout.js — template_06 (Blossom Pink)
// Pure rendering: (formData) -> HTML string for the live preview / print sheet.
// Knows nothing about other templates. Styling comes entirely from style.css.

import { schema } from "./schema.js";

function esc(str) {
  return (str || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function row(label, value) {
  return `
    <div class="bd06-row">
      <span class="bd06-label">${esc(label)}</span>
      <span class="bd06-value">${value && value.trim() ? esc(value) : "&nbsp;"}</span>
    </div>`;
}

function sectionTitle(title) {
  return `<h2 class="bd06-section-title">${esc(title)}</h2>`;
}

export function render(formData) {
  const [personal, religious, family, contact] = schema.sections;
  const photoSrc = formData.photo || "";

  return `
    <div class="bd-template bd-template06">
      <div class="bd06-icon">&#9789;</div>
      <div class="bd06-invocation">Bismillah-ir-Rahman-ir-Rahim</div>

      <div class="bd06-top-row">
        <div class="bd06-top-left">
          ${sectionTitle(personal.title)}
          <div class="bd06-section-single">
            ${personal.fields.slice(0, 8).map((f) => row(f.label, formData[f.id])).join("")}
          </div>
        </div>
        <div class="bd06-photo-wrap">
          ${photoSrc
            ? `<img class="bd06-photo" src="${photoSrc}" alt="Photo" />`
            : `<div class="bd06-photo bd06-photo-placeholder">Photo</div>`}
        </div>
      </div>

      <div class="bd06-section-single">
        ${personal.fields.slice(8).map((f) => row(f.label, formData[f.id])).join("")}
      </div>

      ${sectionTitle(religious.title)}
      <div class="bd06-section-pair">
        ${religious.fields.map((f) => row(f.label, formData[f.id])).join("")}
      </div>

      ${sectionTitle(family.title)}
      <div class="bd06-section-pair">
        ${family.fields.map((f) => row(f.label, formData[f.id])).join("")}
      </div>

      ${sectionTitle(contact.title)}
      <div class="bd06-section-pair">
        ${contact.fields.map((f) => row(f.label, formData[f.id])).join("")}
      </div>
    </div>`;
}