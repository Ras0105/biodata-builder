// layout.js — template_05 (Heritage Wood)
// Pure rendering: (formData) -> HTML string. Independent of every other template.

import { schema } from "./schema.js";

function esc(str) {
  return (str || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function row(label, value) {
  return `
    <div class="bd05-row">
      <span class="bd05-label">${esc(label)}</span>
      <span class="bd05-colon">:</span>
      <span class="bd05-value">${value && value.trim() ? esc(value) : "&nbsp;"}</span>
    </div>`;
}

function sectionTitle(title) {
  return `<h2 class="bd05-section-title">${esc(title)}</h2>`;
}

export function render(formData) {
  const [personal, family, contact] = schema.sections;
  const photoSrc = formData.photo || "";

  return `
    <div class="bd-template bd-template05">
      <div class="bd05-corner bd05-corner-tl"></div>
      <div class="bd05-corner bd05-corner-tr"></div>
      <div class="bd05-corner bd05-corner-bl"></div>
      <div class="bd05-corner bd05-corner-br"></div>

      <div class="bd05-title-row">
        <div class="bd05-title">Biodata</div>
        <div class="bd05-title-arabic">&#65275;&#65268;&#65198;&#65235;&#65166;&#65254;&#65170;&#65268;&#65198;&#65235;&#65170;&#65166; &#65251;&#65170;&#65256;&#65166;</div>
      </div>

      <div class="bd05-top-row">
        <div class="bd05-top-left">
          ${sectionTitle(personal.title)}
          <div class="bd05-section">
            ${personal.fields.slice(0, 4).map((f) => row(f.label, formData[f.id])).join("")}
          </div>
        </div>
        <div class="bd05-photo-wrap">
          ${photoSrc
            ? `<img class="bd05-photo" src="${photoSrc}" alt="Photo" />`
            : `<div class="bd05-photo bd05-photo-placeholder">Photo</div>`}
        </div>
      </div>

      <div class="bd05-section">
        ${personal.fields.slice(4).map((f) => row(f.label, formData[f.id])).join("")}
      </div>

      ${sectionTitle(family.title)}
      <div class="bd05-section">
        ${family.fields.map((f) => row(f.label, formData[f.id])).join("")}
      </div>

      ${sectionTitle(contact.title)}
      <div class="bd05-section">
        ${contact.fields.map((f) => row(f.label, formData[f.id])).join("")}
      </div>
    </div>`;
}
