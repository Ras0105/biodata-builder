// layout.js — template_20 (Slate Traditional Detailed)
import { schema } from "./schema.js";

function esc(str) {
  return (str || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function line(label, value) {
  return `<div class="bd20-line"><span class="bd20-line-label">${esc(label)}</span><span class="bd20-line-sep">:</span><span class="bd20-line-value">${value && value.trim() ? esc(value) : "&nbsp;"}</span></div>`;
}

function sectionBlock(section, formData) {
  return `
    <div class="bd20-block">
      <h3 class="bd20-block-title">${esc(section?.title)}</h3>
      <div class="bd20-block-body">
        ${(section?.fields || []).map((f) => line(f.label, formData[f.id])).join("")}
      </div>
    </div>`;
}

export function render(formData, liveSchema) {
  const [profile, contact, personal, education, parents, mosal] = (liveSchema || schema).sections;
  const photoSrc = formData.photo || "";
  const eduLines = [formData.eduLine1, formData.eduLine2, formData.eduLine3].filter((v) => v && v.trim());

  return `
    <div class="bd-template bd-template20">
      <div class="bd20-header">
        <div class="bd20-photo-wrap">
          ${photoSrc
            ? `<img class="bd20-photo" src="${photoSrc}" alt="Photo" />`
            : `<div class="bd20-photo bd20-photo-placeholder">Photo</div>`}
        </div>
        <div class="bd20-header-text">
          <div class="bd20-name">${esc(formData.fullName) || "&nbsp;"}</div>
          <p class="bd20-intro">${formData.intro && formData.intro.trim() ? esc(formData.intro) : "&nbsp;"}</p>
        </div>
      </div>

      <div class="bd20-contact-bar">
        ${formData.email ? `<span>&#9993; ${esc(formData.email)}</span>` : ""}
        ${formData.phone ? `<span>&#9742; ${esc(formData.phone)}</span>` : ""}
        ${formData.residence ? `<span>&#128205; ${esc(formData.residence)}</span>` : ""}
        ${formData.officeAddress ? `<span>&#128188; ${esc(formData.officeAddress)}</span>` : ""}
      </div>

      <div class="bd20-body">
        <div class="bd20-col">
          ${sectionBlock(personal, formData)}
          <div class="bd20-block">
            <h3 class="bd20-block-title">${esc(education?.title)}</h3>
            <div class="bd20-block-body">
              ${eduLines.length
                ? eduLines.map((l) => `<div class="bd20-edu-line">${esc(l)}</div>`).join("")
                : `<div class="bd20-edu-line">&nbsp;</div>`}
            </div>
          </div>
        </div>
        <div class="bd20-col">
          ${sectionBlock(parents, formData)}
        </div>
      </div>

      <div class="bd20-mosal">
        <h3 class="bd20-block-title">${esc(mosal?.title)}</h3>
        <div class="bd20-mosal-body">
          ${(mosal?.fields || []).map((f) => line(f.label, formData[f.id])).join("")}
        </div>
      </div>
    </div>`;
}