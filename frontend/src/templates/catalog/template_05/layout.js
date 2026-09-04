// layout.js — template_05 (Heritage Wood)
// Pure rendering: (formData) -> HTML string. Independent of every other template.

import { schema } from "./schema.js";

function esc(str) {
  return (str || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// Formats "date"-type field values (stored as raw YYYY-MM-DD from the date
// input) into a readable form for display, e.g. "12 Apr 1998". Leaves every
// other field type untouched.
function fmt(field, value) {
  if (field.type !== "date" || !value) return value;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function row(label, value) {
  return `
    <div class="bd05-row">
      <span class="bd05-label">${esc(label)}</span>
      <span class="bd05-colon">:</span>
      <span class="bd05-value">${value && value.trim() ? esc(value) : "&nbsp;"}</span>
    </div>`;
}

// Renders a section's fields as two columns (first half left, second half
// right) with a vertical divider and a lotus mark between them — matches
// the reference's Family/Contact partition line.
function twoColSection(fields, formatted) {
  const mid = Math.ceil(formatted.length / 2);
  const left = formatted.slice(0, mid);
  const right = formatted.slice(mid);
  return `
    <div class="bd05-section bd05-section-pair">
      <div class="bd05-col">${left.join("")}</div>
      <div class="bd05-divider"></div>
      <div class="bd05-col">${right.join("")}</div>
    </div>`;
}

function sectionTitle(title) {
  return `<h2 class="bd05-section-title">${esc(title)}</h2>`;
}

export function render(formData, liveSchema) {
    const sections = (liveSchema || schema).sections;
  const personal = sections.find((s) => s.id === "personal");
  const family = sections.find((s) => s.id === "family");
  const contact = sections.find((s) => s.id === "contact");
  const photoSrc = formData.photo || "";

  return `
    <div class="bd-template bd-template05">
      <div class="bd05-top-row">
        <div class="bd05-top-left">
          ${sectionTitle(personal?.title)}
          <div class="bd05-section">
            ${(personal?.fields || []).slice(0, 4).map((f) => row(f.label, fmt(f, formData[f.id]))).join("")}
          </div>
        </div>
        <div class="bd05-photo-wrap">
          ${photoSrc
            ? `<img class="bd05-photo" src="${photoSrc}" alt="Photo" />`
            : `<div class="bd05-photo bd05-photo-placeholder">Photo</div>`}
        </div>
      </div>

      <div class="bd05-section">
        ${(personal?.fields || []).slice(4).map((f) => row(f.label, fmt(f, formData[f.id]))).join("")}
      </div>

      ${sectionTitle(family?.title)}
      ${twoColSection(family?.fields, (family?.fields || []).map((f) => row(f.label, fmt(f, formData[f.id]))))}

      ${sectionTitle(contact?.title)}
      ${twoColSection(contact?.fields, (contact?.fields || []).map((f) => row(f.label, fmt(f, formData[f.id]))))}
    </div>`;
}
