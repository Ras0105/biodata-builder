// layout.js — template_09 (Sikh Sacred Gold)
// Pure rendering: (formData) -> HTML string. Independent of every other template.

import { schema } from "./schema.js";

function esc(str) {
  return (str || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function row(label, value) {
  return `
    <div class="bd09-row">
      <span class="bd09-label">${esc(label)}</span>
      <span class="bd09-colon">:</span>
      <span class="bd09-value">${value && value.trim() ? esc(value) : "&nbsp;"}</span>
    </div>`;
}

function sectionTitle(title) {
  return `<h2 class="bd09-section-title">${esc(title)}</h2>`;
}

export function render(formData, liveSchema) {
  const [personal, family, contact] = (liveSchema || schema).sections;
  const photoSrc = formData.photo || "";

  return `
    <div class="bd-template bd-template09">
      <div class="bd09-emblem">&#2676;</div>
      <div class="bd09-invocation">Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh</div>

      <div class="bd09-top-row">
        <div class="bd09-top-left">
          ${sectionTitle(personal?.title)}
          <div class="bd09-section">
            ${(personal?.fields || []).slice(0, 6).map((f) => row(f.label, formData[f.id])).join("")}
          </div>
        </div>
        <div class="bd09-photo-wrap">
          ${photoSrc
            ? `<img class="bd09-photo" src="${photoSrc}" alt="Photo" />`
            : `<div class="bd09-photo bd09-photo-placeholder">Photo</div>`}
        </div>
      </div>

      <div class="bd09-section">
        ${(personal?.fields || []).slice(6).map((f) => row(f.label, formData[f.id])).join("")}
      </div>

      ${sectionTitle(family?.title)}
      <div class="bd09-section">
        ${(family?.fields || []).map((f) => row(f.label, formData[f.id])).join("")}
      </div>

      ${sectionTitle(contact?.title)}
      <div class="bd09-section">
        ${(contact?.fields || []).map((f) => row(f.label, formData[f.id])).join("")}
      </div>
    </div>`;
}