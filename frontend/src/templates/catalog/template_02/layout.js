// layout.js — template_02 (Vedic Sage)
// Pure rendering: (formData) -> HTML string. Independent of every other template.
//
// The page-1 background (style.css) already has the ornate photo frame,
// "PHOTO" placeholder and camera icon baked into the artwork. When the user
// hasn't uploaded a photo, we still render an (invisible) placeholder div in
// the exact frame spot with the "-photo-placeholder" class the live editor
// looks for generically (see wirePrimaryPhotoUpload in livePreview.js) so
// clicking that spot opens the upload dialog — the background's own artwork
// shows through since the placeholder has no fill of its own. Once a photo
// IS uploaded, it's laid in as an absolutely-positioned <img> matched to the
// exact pixel box of the frame (see .bd02-photo in style.css) so it drops in
// cleanly inside the existing border instead of drawing a second border.

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

// Small line-art icon set (24x24 viewBox, stroke=currentColor) used next to
// each field label, matching the thin dark-green icon style of the reference.
const ICONS = {
  person: '<path d="M12 12.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/><path d="M4.5 20c.5-4 3.5-6.2 7.5-6.2s7 2.2 7.5 6.2"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
  height: '<path d="M12 2.5v19"/><path d="M8 6l4-3.5L16 6"/><path d="M8 18l4 3.5 4-3.5"/>',
  education: '<path d="M12 4 2.5 9 12 14l9.5-5L12 4Z"/><path d="M6 11.3V16c0 1.6 2.7 3 6 3s6-1.4 6-3v-4.7"/>',
  briefcase: '<rect x="3" y="8" width="18" height="11.5" rx="2"/><path d="M8.5 8V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2"/>',
  gotra: '<circle cx="12" cy="12" r="2.4"/><path d="M12 3v3.4M12 17.6V21M3 12h3.4M17.6 12H21M6 6l2.4 2.4M15.6 15.6 18 18M18 6l-2.4 2.4M8.4 15.6 6 18"/>',
  people: '<circle cx="8" cy="7.5" r="2.8"/><circle cx="16.5" cy="7.5" r="2.8"/><path d="M2.5 20c.4-3.3 2.8-5.6 5.5-5.6s5.1 2.3 5.5 5.6"/><path d="M11 20c.4-3.3 2.7-5.6 5.5-5.6s5.1 2.3 5.5 5.6"/>',
  home: '<path d="M3.5 11 12 3.5 20.5 11"/><path d="M5.5 9.7V20h13V9.7"/>',
  phone: '<path d="M6.5 3.5h3l1.6 4-2 2a11 11 0 0 0 5 5l2-2 4 1.6v3a2 2 0 0 1-2 2C10.5 19.1 4.9 13.5 4.5 6.5a2 2 0 0 1 2-3Z"/>',
};

function icon(name) {
  const paths = ICONS[name];
  if (!paths) return "";
  return `<svg class="bd02-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

function row(field, value) {
  const filled = value && value.toString().trim();
  return `
    <div class="bd02-row">
      <span class="bd02-row-icon">${icon(field.icon)}</span>
      <span class="bd02-label">${esc(field.label)}</span>
      <span class="bd02-colon">:</span>
      <span class="bd02-value">${filled ? esc(value) : ""}</span>
    </div>`;
}

function sectionTitle(title) {
  return `
    <div class="bd02-title-row">
      <span class="bd02-title-line"></span>
      <span class="bd02-title-diamond">&#10022;</span>
      <span class="bd02-title-pill">${esc(title)}</span>
      <span class="bd02-title-diamond">&#10022;</span>
      <span class="bd02-title-line"></span>
    </div>`;
}

function sectionBlock(section, formData) {
  if (!section) return "";
  return `
    <div class="bd02-section">
      ${sectionTitle(section.title)}
      <div class="bd02-fields">
        ${(section.fields || []).map((f) => row(f, fmt(f, formData[f.id]))).join("")}
      </div>
    </div>`;
}

export function render(formData, liveSchema) {
  const sections = (liveSchema || schema).sections;
  const personal = sections.find((s) => s.id === "personal");
  const astro = sections.find((s) => s.id === "astro");
  const family = sections.find((s) => s.id === "family");
  const photoSrc = formData.photo || "";

  return `
    <div class="bd-template bd-template02">
      ${
        photoSrc
          ? `<img class="bd02-photo" src="${photoSrc}" alt="Photo" />`
          : `<div class="bd02-photo bd02-photo-placeholder"></div>`
      }
      <div class="bd02-content">
        ${sectionBlock(personal, formData)}
        ${sectionBlock(astro, formData)}
        ${sectionBlock(family, formData)}
      </div>
    </div>`;
}
