// layout.js — template_02 (Vedic Sage)
// Pure rendering: (formData) -> HTML string. Independent of every other template.

import { schema } from "./schema.js";

function esc(str) {
  return (str || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function row(label, value) {
  return `
    <div class="bd02-row">
      <span class="bd02-label">${esc(label)}</span>
      <span class="bd02-value">${value && value.trim() ? esc(value) : "&nbsp;"}</span>
    </div>`;
}

function sectionHeader(title) {
  return `<div class="bd02-section-title"><span>${esc(title)}</span></div>`;
}

export function render(formData) {
  const [personal, astro, family] = schema.sections;
  const photoSrc = formData.photo || "";

  return `
    <div class="bd-template bd-template02">
      <div class="bd02-invocation">|| श्री गणेशाय नमः ||</div>
      <div class="bd02-title">विवाह-वृत्तपत्रम्</div>
      <div class="bd02-title-rule"></div>

      <div class="bd02-photo-wrap">
        ${photoSrc
          ? `<img class="bd02-photo" src="${photoSrc}" alt="Photo" />`
          : `<div class="bd02-photo bd02-photo-placeholder">Photo</div>`}
      </div>

      ${sectionHeader(personal?.title)}
      <div class="bd02-section">
        ${(personal?.fields || []).map((f) => row(f.label, formData[f.id])).join("")}
      </div>

      ${sectionHeader(astro?.title)}
      <div class="bd02-section">
        ${(astro?.fields || []).map((f) => row(f.label, formData[f.id])).join("")}
      </div>

      ${sectionHeader(family?.title)}
      <div class="bd02-section">
        ${(family?.fields || []).map((f) => row(f.label, formData[f.id])).join("")}
      </div>
    </div>`;
}
