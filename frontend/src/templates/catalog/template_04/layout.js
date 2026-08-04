// layout.js — template_04 (Navy & Gold)
// Pure rendering: (formData) -> HTML string. Independent of every other template.

import { schema } from "./schema.js";

function esc(str) {
  return (str || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function row(label, value) {
  return `
    <div class="bd04-row">
      <span class="bd04-label">${esc(label)}:</span>
      <span class="bd04-value">${value && value.trim() ? esc(value) : "&nbsp;"}</span>
    </div>`;
}

function sectionTitle(title) {
  return `<h2 class="bd04-section-title">${esc(title)}</h2>`;
}

export function render(formData) {
  const [personal, religious, family, contact] = schema.sections;
  const photoSrc = formData.photo || "";

  return `
    <div class="bd-template bd-template04">
      <div class="bd04-icon">&#9789;</div>
      <div class="bd04-invocation">Bismillah-ir-Rahman-ir-Rahim</div>

      <div class="bd04-top-row">
        <div class="bd04-top-left">
          ${sectionTitle(personal.title)}
          <div class="bd04-section bd04-section-single">
            ${personal.fields.slice(0, 8).map((f) => row(f.label, formData[f.id])).join("")}
          </div>
        </div>
        <div class="bd04-photo-wrap">
          ${photoSrc
            ? `<img class="bd04-photo" src="${photoSrc}" alt="Photo" />`
            : `<div class="bd04-photo bd04-photo-placeholder">Photo</div>`}
        </div>
      </div>

      <div class="bd04-section bd04-section-single">
        ${personal.fields.slice(8).map((f) => row(f.label, formData[f.id])).join("")}
      </div>

      ${sectionTitle(religious.title)}
      <div class="bd04-section bd04-section-pair">
        ${religious.fields.map((f) => row(f.label, formData[f.id])).join("")}
      </div>

      ${sectionTitle(family.title)}
      <div class="bd04-section bd04-section-pair">
        ${family.fields.map((f) => row(f.label, formData[f.id])).join("")}
      </div>

      ${sectionTitle(contact.title)}
      <div class="bd04-section bd04-section-pair">
        ${contact.fields.map((f) => row(f.label, formData[f.id])).join("")}
      </div>
    </div>`;
}
