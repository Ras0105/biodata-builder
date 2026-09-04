// layout.js — template_28 (Royal Amethyst Ganesh Invocation)
// Pure rendering: (formData) -> HTML string. Independent of every other template.

import { schema } from "./schema.js";

function esc(str) {
  return (str || "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
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

function row(field, value) {
  const filled = value && value.toString().trim();
  if (field.type === "textarea") {
    const html = filled ? esc(value).replace(/\n/g, "<br/>") : "";
    return `
      <div class="bd28-row bd28-row-area">
        <span class="bd28-label">${esc(field.label)}</span>
        <span class="bd28-colon">:</span>
        <span class="bd28-value bd28-value-area">${html}</span>
      </div>`;
  }
  return `
    <div class="bd28-row">
      <span class="bd28-label">${esc(field.label)}</span>
      <span class="bd28-colon">:</span>
      <span class="bd28-value">${filled ? esc(value) : ""}</span>
    </div>`;
}

function sectionTitle(title) {
  return `
    <h2 class="bd28-section-title"><span class="bd28-flourish">&#10022;</span>${esc(title)}<span class="bd28-flourish">&#10022;</span></h2>`;
}

export function render(formData, liveSchema) {
  const sections = (liveSchema || schema).sections;
  const personal = sections.find((s) => s.id === "personal");
  const family = sections.find((s) => s.id === "family");
  const contact = sections.find((s) => s.id === "contact");

  const photoSrc = formData.photo || "";

  return `
    <div class="bd-template bd-template28">
      <div class="bd28-content">

        ${
          personal
            ? `
        ${sectionTitle(personal.title)}
        <div class="bd28-top-grid">
          <div class="bd28-section bd28-personal-fields">
            ${(personal.fields || []).map((f) => row(f, fmt(f, formData[f.id]))).join("")}
          </div>
          <div class="bd28-photo-wrap">
            <div class="bd28-photo-frame">
              ${
                photoSrc
                  ? `<img class="bd28-photo" src="${photoSrc}" alt="Photo" />`
                  : `<div class="bd28-photo bd28-photo-placeholder"><span>PHOTO</span></div>`
              }
            </div>
          </div>
        </div>`
            : ""
        }

        ${
          family
            ? `
        ${sectionTitle(family.title)}
        <div class="bd28-section bd28-full-section">
          ${(family.fields || []).map((f) => row(f, fmt(f, formData[f.id]))).join("")}
        </div>`
            : ""
        }

        ${
          contact
            ? `
        ${sectionTitle(contact.title)}
        <div class="bd28-section bd28-full-section">
          ${(contact.fields || []).map((f) => row(f, fmt(f, formData[f.id]))).join("")}
        </div>`
            : ""
        }
      </div>
    </div>`;
}
