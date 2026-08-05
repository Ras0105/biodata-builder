// layout.js — template_21 (Vintage Parchment Scroll)
import { schema } from "./schema.js";

function esc(str) {
  return (str || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function line(label, value) {
  return `<div class="bd21-line"><span class="bd21-label">${esc(label)}:</span><span class="bd21-value">${value && value.trim() ? esc(value) : "&nbsp;"}</span></div>`;
}

function bar(title, innerHtml) {
  return `
    <div class="bd21-section">
      <div class="bd21-bar">${esc(title)}</div>
      <div class="bd21-section-body">${innerHtml}</div>
    </div>`;
}

export function render(formData) {
  const [profile, personal, qualification, family, address] = schema.sections;
  const photoSrc = formData.photo || "";

  return `
    <div class="bd-template bd-template21">
      <div class="bd21-page">
        <div class="bd21-photo-col">
          ${photoSrc
            ? `<img class="bd21-photo" src="${photoSrc}" alt="Photo" />`
            : `<div class="bd21-photo bd21-photo-placeholder">Photo</div>`}
        </div>

        <div class="bd21-content">
          ${formData.invocation && formData.invocation.trim() ? `<div class="bd21-invocation">${esc(formData.invocation)}</div>` : ""}
          <div class="bd21-name-banner">
            <div class="bd21-name">${esc(formData.fullName) || "&nbsp;"}</div>
            ${formData.dobDisplay && formData.dobDisplay.trim() ? `<div class="bd21-dob">${esc(formData.dobDisplay)}</div>` : ""}
          </div>

          ${bar(personal?.title, (personal?.fields || []).map((f) => line(f.label, formData[f.id])).join(""))}
          ${bar(qualification?.title, (qualification?.fields || []).map((f) => line(f.label, formData[f.id])).join(""))}
          ${bar(family?.title, (family?.fields || []).map((f) => line(f.label, formData[f.id])).join(""))}
          ${bar(address?.title, (address?.fields || []).map((f) => line(f.label, formData[f.id])).join(""))}
        </div>
      </div>
    </div>`;
}