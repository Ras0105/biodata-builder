// layout.js — template_19 (Charcoal Portfolio Grid)
import { schema } from "./schema.js";

function esc(str) {
  return (str || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function card(title, innerHtml) {
  return `
    <div class="bd19-card">
      <h3 class="bd19-card-title">${esc(title)}</h3>
      <div class="bd19-card-body">${innerHtml}</div>
    </div>`;
}

function line(label, value) {
  return `<div class="bd19-line"><span class="bd19-line-label">${esc(label)}</span><span class="bd19-line-value">${value && value.trim() ? esc(value) : "&nbsp;"}</span></div>`;
}

export function render(formData) {
  const [profile, about, timeline, personal, family, contact] = schema.sections;
  const photoSrc = formData.photo || "";
  const timelineEntries = [1, 2, 3, 4]
    .map((n) => formData[`timelineItem${n}`])
    .filter((v) => v && v.trim());

  return `
    <div class="bd-template bd-template19">
      <div class="bd19-top">
        <div class="bd19-headline">
          <div class="bd19-name">${esc(formData.fullName) || "&nbsp;"}</div>
          <div class="bd19-tagline">${esc(formData.tagline) || ""}</div>
        </div>
        <div class="bd19-photo-wrap">
          ${photoSrc
            ? `<img class="bd19-photo" src="${photoSrc}" alt="Photo" />`
            : `<div class="bd19-photo bd19-photo-placeholder">Photo</div>`}
        </div>
      </div>

      <div class="bd19-grid">
        <div class="bd19-col-left">
          ${card(about.title, `<p class="bd19-about">${formData.aboutMe && formData.aboutMe.trim() ? esc(formData.aboutMe) : "&nbsp;"}</p>`)}
          ${card(family.title, family.fields.map((f) => line(f.label, formData[f.id])).join(""))}
        </div>
        <div class="bd19-col-right">
          ${card(timeline.title, timelineEntries.length
            ? `<ul class="bd19-timeline-list">${timelineEntries.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>`
            : `<p class="bd19-about">&nbsp;</p>`)}
          ${card(personal.title, personal.fields.map((f) => line(f.label, formData[f.id])).join(""))}
        </div>
      </div>

      <div class="bd19-contact-strip">
        ${formData.email ? `<span>&#9993; ${esc(formData.email)}</span>` : ""}
        ${formData.phone ? `<span>&#9742; ${esc(formData.phone)}</span>` : ""}
        ${formData.location ? `<span>&#128205; ${esc(formData.location)}</span>` : ""}
      </div>
    </div>`;
}