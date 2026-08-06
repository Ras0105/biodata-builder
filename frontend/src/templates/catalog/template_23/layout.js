// layout.js — template_23 (Split Header Duo)
import { schema } from "./schema.js";

function esc(str) {
  return (str || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function line(label, value) {
  return `<div class="bd23-line"><span class="bd23-label">${esc(label)}:</span> <span class="bd23-value">${value && value.trim() ? esc(value) : "&nbsp;"}</span></div>`;
}

export function render(formData, liveSchema) {
  const [profile, contact, personal, family] = (liveSchema || schema).sections;
  const photoSrc = formData.photo || "";

  return `
    <div class="bd-template bd-template23">
      <div class="bd23-header">
        <div class="bd23-name-panel">
          <div class="bd23-name">${esc(formData.fullName) || "&nbsp;"}</div>
        </div>
        <div class="bd23-photo-wrap">
          ${photoSrc
            ? `<img class="bd23-photo" src="${photoSrc}" alt="Photo" />`
            : `<div class="bd23-photo bd23-photo-placeholder">Photo</div>`}
          <div class="bd23-contact-caption">
            ${formData.contactPrimary ? `<div>&#9742; ${esc(formData.contactPrimary)}</div>` : ""}
            ${formData.contactSecondary ? `<div>&#9993; ${esc(formData.contactSecondary)}</div>` : ""}
          </div>
        </div>
      </div>

      <div class="bd23-body">
        <div class="bd23-col">
          <h3 class="bd23-col-title">${esc(personal?.title)}</h3>
          ${(personal?.fields || []).map((f) => line(f.label, formData[f.id])).join("")}
        </div>
        <div class="bd23-col">
          <h3 class="bd23-col-title">${esc(family?.title)}</h3>
          ${(family?.fields || []).map((f) => line(f.label, formData[f.id])).join("")}
        </div>
      </div>
    </div>`;
}