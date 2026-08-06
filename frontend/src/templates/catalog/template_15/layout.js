// layout.js — template_15 (Noor Mahal Beliefs)
// Pure rendering: (formData) -> HTML string. Independent of every other template.

import { schema } from "./schema.js";

function esc(str) {
  return (str || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function bullet(label, value) {
  return `<div class="bd15-bullet"><span class="bd15-bullet-label">${esc(label)}:</span> ${value && value.trim() ? esc(value) : "&nbsp;"}</div>`;
}

function card(title, innerHtml) {
  return `
    <div class="bd15-card">
      <h3 class="bd15-card-title">&#9789; ${esc(title)}</h3>
      <div class="bd15-card-body">${innerHtml}</div>
    </div>`;
}

export function render(formData, liveSchema) {
  const [profile, overview, aboutMe, family, beliefs, expectations] = (liveSchema || schema).sections;
  const photoSrc = formData.photo || "";

  return `
    <div class="bd-template bd-template15">
      <div class="bd15-header">
        <div class="bd15-photo-wrap">
          ${photoSrc
            ? `<img class="bd15-photo" src="${photoSrc}" alt="Photo" />`
            : `<div class="bd15-photo bd15-photo-placeholder">Photo</div>`}
        </div>
        <div class="bd15-header-text">
          <div class="bd15-name">${esc(formData.fullName) || "&nbsp;"}</div>
          <div class="bd15-subline">${esc(formData.dob) || ""}${formData.dob && formData.placeOfBirth ? ", " : ""}${esc(formData.placeOfBirth) || ""}</div>
          <div class="bd15-subline">${formData.height ? "Height: " + esc(formData.height) + "  " : ""}${formData.motherTongue ? "Mother Tongue: " + esc(formData.motherTongue) : ""}</div>
          <div class="bd15-subline">${esc(formData.contact) || ""}</div>
        </div>
      </div>

      <div class="bd15-grid">
        ${card(overview?.title, (overview?.fields || []).map((f) => bullet(f.label, formData[f.id])).join(""))}
        ${card(aboutMe?.title, `<p class="bd15-paragraph">${esc(formData.aboutMe) || "&nbsp;"}</p>`)}
        ${card(family?.title, (family?.fields || []).map((f) => bullet(f.label, formData[f.id])).join(""))}
        ${card(beliefs?.title, (beliefs?.fields || []).map((f) => bullet(f.label, formData[f.id])).join(""))}
      </div>

      ${card(expectations?.title, `<p class="bd15-paragraph">${esc(formData.expectations) || "&nbsp;"}</p>`)}
    </div>`;
}