// layout.js — template_13 (Chattogram Ornate)
// Pure rendering: (formData) -> HTML string. Independent of every other template.

import { schema } from "./schema.js";

function esc(str) {
  return (str || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function row(label, value) {
  return `
    <div class="bd13-row">
      <span class="bd13-label">${esc(label)}</span>
      <span class="bd13-colon">:</span>
      <span class="bd13-value">${value && value.trim() ? esc(value) : "&nbsp;"}</span>
    </div>`;
}

function sectionTitle(title) {
  return `<h2 class="bd13-section-title">${esc(title)}</h2>`;
}

function paragraph(value) {
  return `<p class="bd13-paragraph">${value && value.trim() ? esc(value) : "&nbsp;"}</p>`;
}

export function render(formData) {
  const [personal, family, expectations, contact] = schema.sections;
  const photoSrc = formData.photo || "";

  return `
    <div class="bd-template bd-template13">
      <div class="bd13-photo-wrap">
        ${photoSrc
          ? `<img class="bd13-photo" src="${photoSrc}" alt="Photo" />`
          : `<div class="bd13-photo bd13-photo-placeholder">Photo</div>`}
      </div>

      <div class="bd13-two-col">
        <div class="bd13-col">
          ${sectionTitle(personal?.title)}
          <div class="bd13-section">
            ${(personal?.fields || []).map((f) => row(f.label, formData[f.id])).join("")}
          </div>

          ${sectionTitle(family?.title)}
          <div class="bd13-section">
            ${row(family?.fields?.[0]?.label, formData[family?.fields?.[0]?.id])}
            ${row(family?.fields?.[1]?.label, formData[family?.fields?.[1]?.id])}
            ${paragraph(formData[family?.fields?.[2]?.id])}
          </div>
        </div>

        <div class="bd13-col">
          ${sectionTitle(expectations?.title)}
          <div class="bd13-section">
            ${paragraph(formData.expectations)}
          </div>

          ${sectionTitle(contact?.title)}
          <div class="bd13-section">
            ${(contact?.fields || []).map((f) => row(f.label, formData[f.id])).join("")}
          </div>
        </div>
      </div>
    </div>`;
}