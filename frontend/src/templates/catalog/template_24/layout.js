// layout.js — template_24 (Coral Panel Profile)
import { schema } from "./schema.js";

function esc(str) {
  return (str || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function pill(title) {
  return `<div class="bd24-pill">${esc(title)}</div>`;
}

function line(label, value) {
  if (!value || !value.trim()) return "";
  return `<div class="bd24-line"><span class="bd24-label">${esc(label)}:</span> ${esc(value)}</div>`;
}

export function render(formData) {
  const [profile, occupation, education, family, interests, address] = schema.sections;
  const photoSrc = formData.photo || "";
  const eduLines = [formData.eduLine1, formData.eduLine2, formData.eduLine3].filter((v) => v && v.trim());

  return `
    <div class="bd-template bd-template24">
      <div class="bd24-photo-col">
        ${photoSrc
          ? `<img class="bd24-photo" src="${photoSrc}" alt="Photo" />`
          : `<div class="bd24-photo bd24-photo-placeholder">Photo</div>`}
        <div class="bd24-photo-name">${esc(formData.fullName) || "&nbsp;"}</div>
      </div>

      <div class="bd24-panel">
        ${pill(profile?.title)}
        <div class="bd24-block">
          ${(profile?.fields || []).filter((f) => f.id !== "fullName").map((f) => line(f.label, formData[f.id])).join("")}
        </div>

        ${pill(occupation?.title)}
        <div class="bd24-block">${formData.occupation && formData.occupation.trim() ? esc(formData.occupation) : "&nbsp;"}</div>

        ${pill(education?.title)}
        <div class="bd24-block">
          ${eduLines.length ? eduLines.map((l) => `<div class="bd24-line">${esc(l)}</div>`).join("") : "&nbsp;"}
        </div>

        ${pill(family?.title)}
        <div class="bd24-block">
          ${(family?.fields || []).map((f) => line(f.label, formData[f.id])).join("")}
        </div>

        ${pill(interests?.title)}
        <div class="bd24-block">${formData.interests && formData.interests.trim() ? esc(formData.interests) : "&nbsp;"}</div>

        ${pill(address?.title)}
        <div class="bd24-block">${formData.address && formData.address.trim() ? esc(formData.address) : "&nbsp;"}</div>
      </div>
    </div>`;
}