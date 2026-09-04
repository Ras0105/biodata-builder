// layout.js — template_26 (Ivory Swastik Kalash)

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
      <div class="bd-row bd-row-area">
        <span class="bd-label">${esc(field.label)}</span>
        <span class="bd-colon">:</span>
        <span class="bd-value bd-value-area">${html}</span>
      </div>`;
  }
  return `
    <div class="bd-row">
      <span class="bd-label">${esc(field.label)}</span>
      <span class="bd-colon">:</span>
      <span class="bd-value">${filled ? esc(value) : ""}</span>
    </div>`;
}

function sectionTitle(title) {
  return `<h2 class="bd-section-title"><span class="bd-rule"></span><span class="bd-title-text">${esc(title)}</span><span class="bd-rule"></span></h2>`;
}

export function render(formData, liveSchema) {
  const sections = (liveSchema || schema).sections;
  const personal = sections.find((s) => s.id === "personal");
  const family = sections.find((s) => s.id === "family");
  const contact = sections.find((s) => s.id === "contact");

  const photoSrc = formData.photo || "";

  return `
    <div class="bd-template bd-template27">
      <div class="bd-content">

        ${
          personal
            ? `
        ${sectionTitle(personal.title)}
        <div class="bd-top-grid">
          <div class="bd-section bd-personal-fields">
            ${(personal.fields || []).map((f) => row(f, fmt(f, formData[f.id]))).join("")}
          </div>
          <div class="bd-photo-wrap">
            <div class="bd-photo-frame">
              ${
                photoSrc
                  ? `<img class="bd-photo" src="${photoSrc}" alt="Photo" />`
                  : `<div class="bd-photo bd-photo-placeholder"><span>PHOTO</span></div>`
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
        <div class="bd-section bd-full-section">
          ${(family.fields || []).map((f) => row(f, fmt(f, formData[f.id]))).join("")}
        </div>`
            : ""
        }

        ${
          contact
            ? `
        ${sectionTitle(contact.title)}
        <div class="bd-section bd-full-section">
          ${(contact.fields || []).map((f) => row(f, fmt(f, formData[f.id]))).join("")}
        </div>`
            : ""
        }
      </div>
    </div>`;
}