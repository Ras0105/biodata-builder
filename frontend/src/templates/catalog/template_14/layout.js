// layout.js — template_14 (Sanskrit Vivaha Vrittapatram)
// Pure rendering: (formData) -> HTML string. Independent of every other template.

import { schema } from "./schema.js";

function esc(str) {
  return (str || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function row(label, value) {
  return `
    <div class="bd14-row">
      <span class="bd14-label">${esc(label)}</span>
      <span class="bd14-value">${value && value.trim() ? esc(value) : "&nbsp;"}</span>
    </div>`;
}

function sectionTitle(title) {
  return `<div class="bd14-section-title">${esc(title)}</div>`;
}

export function render(formData) {
  const [personal, jyotish, family] = schema.sections;
  const photoSrc = formData.photo || "";

  return `
    <div class="bd-template bd-template14">
      <div class="bd14-heading">|| श्री गणेशाय नमः ||</div>
      <h1 class="bd14-title">विवाह-वृत्तपत्रम्</h1>

      <div class="bd14-photo-wrap">
        ${photoSrc
          ? `<img class="bd14-photo" src="${photoSrc}" alt="Photo" />`
          : `<div class="bd14-photo bd14-photo-placeholder">छायाचित्रम्</div>`}
      </div>

      ${sectionTitle(personal?.title)}
      <div class="bd14-section">
        ${(personal?.fields || []).map((f) => row(f.label, formData[f.id])).join("")}
      </div>

      ${sectionTitle(jyotish?.title)}
      <div class="bd14-section">
        ${(jyotish?.fields || []).map((f) => row(f.label, formData[f.id])).join("")}
      </div>

      ${sectionTitle(family?.title)}
      <div class="bd14-section">
        ${(family?.fields || []).map((f) => row(f.label, formData[f.id])).join("")}
      </div>
    </div>`;
}