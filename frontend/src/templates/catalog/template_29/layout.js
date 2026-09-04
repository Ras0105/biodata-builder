// layout.js — template_29 (Emerald Bismillah Arch)
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

// Small circular icon shown before the label, Contact Details section only.
const CONTACT_ICONS = { phone: "&#9742;", whatsapp: "&#128172;", email: "&#9993;" };

function row(field, value, { icon } = {}) {
  const filled = value && value.toString().trim();
  const labelHtml = icon
    ? `<span class="bd29-icon">${icon}</span><span>${esc(field.label)}</span>`
    : esc(field.label);

  if (field.type === "textarea") {
    const html = filled ? esc(value).replace(/\n/g, "<br/>") : "";
    return `
      <div class="bd29-row bd29-row-area">
        <span class="bd29-label">${labelHtml}</span>
        <span class="bd29-colon">:</span>
        <span class="bd29-value bd29-value-area">${html}</span>
      </div>`;
  }
  return `
    <div class="bd29-row">
      <span class="bd29-label">${labelHtml}</span>
      <span class="bd29-colon">:</span>
      <span class="bd29-value">${filled ? esc(value) : ""}</span>
    </div>`;
}

function sectionTitle(title) {
  return `
    <div class="bd29-title-row">
      <span class="bd29-title-line"></span>
      <span class="bd29-diamond">&#10070;</span>
      <h3 class="bd29-badge">${esc(title)}</h3>
      <span class="bd29-diamond">&#10070;</span>
      <span class="bd29-title-line"></span>
    </div>`;
}

function sectionBlock(section, formData, { icons } = {}) {
  if (!section) return "";
  return `
    <div class="bd29-block">
      ${sectionTitle(section.title)}
      <div class="bd29-block-body">
        ${(section.fields || [])
          .map((f) => row(f, fmt(f, formData[f.id]), { icon: icons ? CONTACT_ICONS[f.id] : null }))
          .join("")}
      </div>
    </div>`;
}

export function render(formData, liveSchema) {
  const sections = (liveSchema || schema).sections;
  const personal = sections.find((s) => s.id === "personal");
  const religious = sections.find((s) => s.id === "religious");
  const family = sections.find((s) => s.id === "family");
  const education = sections.find((s) => s.id === "education");
  const residence = sections.find((s) => s.id === "residence");
  const contact = sections.find((s) => s.id === "contact");
  const about = sections.find((s) => s.id === "about");

  const photoSrc = formData.photo || "";

  return `
    <div class="bd-template bd-template29">
      <div class="bd-content">
        <div class="bd29-photo-wrap">
          <div class="bd29-photo-frame">
            ${photoSrc
              ? `<img class="bd29-photo" src="${photoSrc}" alt="Photo" />`
              : `<div class="bd29-photo bd29-photo-placeholder"><span>PHOTO</span></div>`}
          </div>
        </div>

        <div class="bd29-grid">
          <div class="bd29-col">
            ${sectionBlock(personal, formData)}
            ${sectionBlock(family, formData)}
            ${sectionBlock(residence, formData)}
          </div>
          <div class="bd29-col">
            ${sectionBlock(religious, formData)}
            ${sectionBlock(education, formData)}
            ${sectionBlock(contact, formData, { icons: true })}
          </div>
        </div>

        ${
          about
            ? `
        <div class="bd29-about">
          ${sectionTitle(about.title)}
          <div class="bd29-block-body">
            ${(about.fields || []).map((f) => row(f, fmt(f, formData[f.id]))).join("")}
          </div>
        </div>`
            : ""
        }
      </div>
    </div>`;
}