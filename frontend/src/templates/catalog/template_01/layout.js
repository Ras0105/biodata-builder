// layout.js — template_01 (Hindu Classic Ivory)
// Pure rendering: (formData) -> HTML string for the live preview / print sheet.
// Knows nothing about other templates. Styling comes entirely from style.css.

import { schema } from "./schema.js";

function esc(str) {
  return (str || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function row(label, value) {
  return `
    <div class="bd-row">
      <span class="bd-label">${esc(label)}</span>
      <span class="bd-colon">:</span>
      <span class="bd-value">${value && value.trim() ? esc(value) : "&nbsp;"}</span>
    </div>`;
}

export function render(formData) {
  const personal = schema.sections[0];
  const family = schema.sections[1];

  const photoSrc = formData.photo || "";

  return `
    <div class="bd-template bd-template01">
      <div class="bd-corner bd-corner-tl"></div>
      <div class="bd-corner bd-corner-tr"></div>
      <div class="bd-corner bd-corner-bl"></div>
      <div class="bd-corner bd-corner-br"></div>

      <div class="bd-photo-wrap">
        ${
          photoSrc
            ? `<img class="bd-photo" src="${photoSrc}" alt="Photo" />`
            : `<div class="bd-photo bd-photo-placeholder">Photo</div>`
        }
      </div>

      <h2 class="bd-section-title">${personal.title}</h2>
      <div class="bd-section">
        ${personal.fields.map((f) => row(f.label, formData[f.id])).join("")}
      </div>

      <h2 class="bd-section-title">${family.title}</h2>
      <div class="bd-section">
        ${family.fields.map((f) => row(f.label, formData[f.id])).join("")}
      </div>
    </div>`;
}
