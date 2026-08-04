// layout.js — template_03 (Royal Maroon)
// Pure rendering: (formData) -> HTML string. Independent of every other template.

import { schema } from "./schema.js";

function esc(str) {
  return (str || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function row(label, value) {
  return `
    <div class="bd03-row">
      <span class="bd03-label">${esc(label)}</span>
      <span class="bd03-value">${value && value.trim() ? esc(value) : "&nbsp;"}</span>
    </div>`;
}

function sectionTitle(title) {
  return `<h2 class="bd03-section-title">${esc(title)}</h2>`;
}

export function render(formData) {
  const [personal, family, contact] = schema.sections;
  const photoSrc = formData.photo || "";

  return `
    <div class="bd-template bd-template03">
      <div class="bd03-border-top"></div>

      <div class="bd03-invocation">श्री गणेशाय नमः</div>

      <div class="bd03-top-row">
        <div class="bd03-top-left">
          ${sectionTitle(personal.title)}
          <div class="bd03-section">
            ${personal.fields.slice(0, 6).map((f) => row(f.label, formData[f.id])).join("")}
          </div>
        </div>
        <div class="bd03-photo-wrap">
          ${photoSrc
            ? `<img class="bd03-photo" src="${photoSrc}" alt="Photo" />`
            : `<div class="bd03-photo bd03-photo-placeholder">Photo</div>`}
        </div>
      </div>

      <div class="bd03-section">
        ${personal.fields.slice(6).map((f) => row(f.label, formData[f.id])).join("")}
      </div>

      ${sectionTitle(family.title)}
      <div class="bd03-section">
        ${family.fields.map((f) => row(f.label, formData[f.id])).join("")}
      </div>

      ${sectionTitle(contact.title)}
      <div class="bd03-section">
        ${contact.fields.map((f) => row(f.label, formData[f.id])).join("")}
      </div>

      <div class="bd03-border-bottom"></div>
    </div>`;
}
