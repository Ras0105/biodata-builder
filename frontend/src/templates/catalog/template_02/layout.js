// layout.js — template_02 (Vedic Sage)
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
    <div class="bd02-row">
      <span class="bd02-label">${esc(label)}</span>
      <span class="bd02-value">${value && value.trim() ? esc(value) : "&nbsp;"}</span>
    </div>`;
}

function sectionHeader(title) {
  return `<div class="bd02-section-title"><span>${esc(title)}</span></div>`;
}

export function render(formData, liveSchema) {
    const sections = (liveSchema || schema).sections;
  const personal = sections.find((s) => s.id === "personal");
  const astro = sections.find((s) => s.id === "astro");
  const family = sections.find((s) => s.id === "family");
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
        ${(personal?.fields || []).map((f) => row(f.label, fmt(f, formData[f.id]))).join("")}
      </div>

      ${sectionHeader(astro?.title)}
      <div class="bd02-section">
        ${(astro?.fields || []).map((f) => row(f.label, fmt(f, formData[f.id]))).join("")}
      </div>

      ${sectionHeader(family?.title)}
      <div class="bd02-section">
        ${(family?.fields || []).map((f) => row(f.label, fmt(f, formData[f.id]))).join("")}
      </div>
    </div>`;
}
