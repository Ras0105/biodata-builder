// formRenderer.js — GENERIC engine.
// Renders whatever pages/sections/fields/photos the current schema has, plus
// the controls to mutate that structure. Never edited when a template is
// added, changed, or removed.

import { getMissingRequiredFields } from "../templates/schemaUtils.js";
export { getMissingRequiredFields };

function escAttr(str) {
  return (str || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// callbacks: {
//   onFieldChange(fieldId, value),
//   onAddSection(pageId, title), onRemoveSection(pageId, sectionId), onRenameSection(pageId, sectionId, title),
//   onAddField(pageId, sectionId, label), onRemoveField(pageId, sectionId, fieldId),
//   onAddPage(), onRemovePage(pageId),
//   onAddPhoto(), onRemovePhoto(photoId),
// }
export function renderForm(container, schema, formData, callbacks) {
  container.innerHTML = "";

  renderPhotosBlock(container, schema, formData, callbacks);

  schema.pages.forEach((page, pageIndex) => {
    const pageWrap = document.createElement("div");
    pageWrap.className = "form-page";

    const pageHeader = document.createElement("div");
    pageHeader.className = "form-page-header";
    pageHeader.innerHTML = `<span>Page ${pageIndex + 1}</span>`;
    if (schema.pages.length > 1 && pageIndex > 0) {
      const removePageBtn = document.createElement("button");
      removePageBtn.type = "button";
      removePageBtn.className = "btn-link btn-danger";
      removePageBtn.textContent = "Remove page";
      removePageBtn.addEventListener("click", () => {
        if (confirm("Remove this page and all its sections?")) callbacks.onRemovePage(page.id);
      });
      pageHeader.appendChild(removePageBtn);
    }
    pageWrap.appendChild(pageHeader);

    page.sections.forEach((section) => {
      pageWrap.appendChild(renderSection(page.id, section, formData, callbacks));
    });

    const addSectionBtn = document.createElement("button");
    addSectionBtn.type = "button";
    addSectionBtn.className = "btn btn-secondary btn-add-section";
    addSectionBtn.textContent = "+ Add custom section";
    addSectionBtn.addEventListener("click", () => {
      const title = prompt("Section title (e.g. Hobbies, Contact Info):");
      if (title && title.trim()) callbacks.onAddSection(page.id, title.trim());
    });
    pageWrap.appendChild(addSectionBtn);

    container.appendChild(pageWrap);
  });

  const addPageBtn = document.createElement("button");
  addPageBtn.type = "button";
  addPageBtn.className = "btn btn-secondary btn-add-page";
  addPageBtn.textContent = "+ Add page";
  addPageBtn.addEventListener("click", () => callbacks.onAddPage());
  container.appendChild(addPageBtn);

  wireFieldInputs(container, callbacks);
}

function renderPhotosBlock(container, schema, formData, callbacks) {
  const wrap = document.createElement("div");
  wrap.className = "form-photos";

  schema.photos.forEach((photo, idx) => {
    const photoBlock = document.createElement("div");
    photoBlock.className = "form-field form-field-photo";

    const removeBtn = !photo.required
      ? `<button type="button" class="btn-link btn-danger" data-remove-photo="${photo.id}">Remove</button>`
      : "";

    // Primary photo (idx 0) is always locked into the template's designed
    // spot. Extra photos can be placed on any page the user has — that's
    // the "flexible photo placement" the builder offers.
    const placementHtml =
      idx > 0 && schema.pages.length > 0
        ? `
      <label class="photo-placement-label">Show on (drag it into place on the preview)</label>
      <select data-move-photo="${photo.id}" class="photo-placement-select">
        ${schema.pages
          .map(
            (p, i) =>
              `<option value="${p.id}" ${(photo.page || schema.pages[0].id) === p.id ? "selected" : ""}>Page ${i + 1}</option>`
          )
          .join("")}
      </select>`
        : "";

    // Issue 4, 15 & 16: extra photos (idx > 0) get shape/border/filter
    // controls and up/down ordering (which also controls stacking order —
    // "above/below" — since dynamicExtras draws later photos on top).
    const styleHtml = idx > 0 ? photoStyleControlsHtml(photo) : "";
    const reorderHtml =
      idx > 0
        ? `
      <div class="photo-reorder">
        <button type="button" class="btn-link" data-reorder-photo="${photo.id}" data-dir="up" title="Bring above the photo below it">&#8593; Move up</button>
        <button type="button" class="btn-link" data-reorder-photo="${photo.id}" data-dir="down" title="Send below the photo above it">&#8595; Move down</button>
      </div>`
        : "";

    photoBlock.innerHTML = `
      <label>${escAttr(photo.label)}${photo.required ? " *" : ""}${idx === 0 ? " (main)" : ""}</label>
      <input type="file" accept="image/*" data-field="${photo.id}" data-photo="true" />
      ${placementHtml}
      ${styleHtml}
      ${reorderHtml}
      ${removeBtn}
    `;
    photoBlock.querySelector("input").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => callbacks.onFieldChange(photo.id, reader.result);
      reader.readAsDataURL(file);
    });
    const removeEl = photoBlock.querySelector("[data-remove-photo]");
    if (removeEl) removeEl.addEventListener("click", () => callbacks.onRemovePhoto(photo.id));
    const moveEl = photoBlock.querySelector("[data-move-photo]");
    if (moveEl) moveEl.addEventListener("change", (e) => callbacks.onMovePhoto(photo.id, e.target.value));
    wirePhotoStyleControls(photoBlock, photo, callbacks);
    photoBlock.querySelectorAll("[data-reorder-photo]").forEach((btn) => {
      btn.addEventListener("click", () => callbacks.onReorderPhoto(photo.id, btn.dataset.dir));
    });

    wrap.appendChild(photoBlock);
  });

  if (schema.photos.length < 4) {
    const addPhotoBtn = document.createElement("button");
    addPhotoBtn.type = "button";
    addPhotoBtn.className = "btn btn-secondary btn-add-photo";
    addPhotoBtn.textContent = "+ Add photo";
    addPhotoBtn.addEventListener("click", () => callbacks.onAddPhoto());
    wrap.appendChild(addPhotoBtn);
  }

  container.appendChild(wrap);
}

// Issue 4 & 16: Canva-style photo styling — shape, border style/width/color,
// filter — for extra (non-primary) photos. Kept collapsed by default so it
// doesn't overwhelm the form; opens on demand.
const SHAPES = [
  ["square", "Square"],
  ["circle", "Circle"],
  ["rect", "Rounded"],
];
const BORDER_STYLES = [
  ["solid", "Solid"],
  ["dashed", "Dashed"],
  ["dotted", "Dotted"],
  ["double", "Double"],
  ["none", "None"],
];
const FILTERS = [
  ["none", "None"],
  ["grayscale", "Grayscale"],
  ["sepia", "Sepia"],
  ["vintage", "Vintage"],
  ["cool", "Cool"],
  ["soft", "Soft"],
];

function photoStyleControlsHtml(photo) {
  return `
    <details class="photo-style-panel">
      <summary>Style this photo (shape, border, filter)</summary>
      <div class="photo-style-grid">
        <label>Shape
          <select data-style-photo="${photo.id}" data-style-key="shape">
            ${SHAPES.map(([v, l]) => `<option value="${v}" ${photo.shape === v ? "selected" : ""}>${l}</option>`).join("")}
          </select>
        </label>
        <label>Border
          <select data-style-photo="${photo.id}" data-style-key="borderStyle">
            ${BORDER_STYLES.map(([v, l]) => `<option value="${v}" ${photo.borderStyle === v ? "selected" : ""}>${l}</option>`).join("")}
          </select>
        </label>
        <label>Border width
          <input type="range" min="0" max="10" step="1" data-style-photo="${photo.id}" data-style-key="borderWidth" value="${photo.borderWidth ?? 3}" />
        </label>
        <label>Border color
          <input type="color" data-style-photo="${photo.id}" data-style-key="borderColor" value="${photo.borderColor || "#555555"}" />
        </label>
        <label>Filter
          <select data-style-photo="${photo.id}" data-style-key="filter">
            ${FILTERS.map(([v, l]) => `<option value="${v}" ${photo.filter === v ? "selected" : ""}>${l}</option>`).join("")}
          </select>
        </label>
      </div>
    </details>`;
}

function wirePhotoStyleControls(photoBlock, photo, callbacks) {
  photoBlock.querySelectorAll("[data-style-photo]").forEach((input) => {
    input.addEventListener("input", (e) => {
      const key = e.target.dataset.styleKey;
      let value = e.target.value;
      if (key === "borderWidth") value = Number(value);
      callbacks.onPhotoStyle(photo.id, { [key]: value });
    });
  });
}

function renderSection(pageId, section, formData, callbacks) {
  const sectionEl = document.createElement("fieldset");
  sectionEl.className = "form-section";

  const legend = document.createElement("legend");
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.className = "section-title-input";
  titleInput.value = section.title;
  titleInput.addEventListener("change", (e) => callbacks.onRenameSection(pageId, section.id, e.target.value));
  legend.appendChild(titleInput);

  if (section.removable) {
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "btn-link btn-danger";
    removeBtn.textContent = "Remove section";
    removeBtn.addEventListener("click", () => {
      if (confirm(`Remove "${section.title}"?`)) callbacks.onRemoveSection(pageId, section.id);
    });
    legend.appendChild(removeBtn);
  }
  sectionEl.appendChild(legend);

  section.fields.forEach((field) => {
    sectionEl.appendChild(renderField(pageId, section, field, formData, callbacks));
  });

  const addFieldBtn = document.createElement("button");
  addFieldBtn.type = "button";
  addFieldBtn.className = "btn-link btn-add-field";
  addFieldBtn.textContent = "+ Add field";
  addFieldBtn.addEventListener("click", () => {
    const label = prompt("Field name (e.g. Blood Group):");
    if (label && label.trim()) callbacks.onAddField(pageId, section.id, label.trim());
  });
  sectionEl.appendChild(addFieldBtn);

  return sectionEl;
}

function renderField(pageId, section, field, formData, callbacks) {
  const fieldEl = document.createElement("div");
  fieldEl.className = "form-field";
  // Issue 11: any non-required field can be removed (pre-built or custom) —
  // only required fields are locked to edit-only. Pre-built fields can never
  // be removed AS a definition, only their value cleared, but hiding them
  // from the biodata (what this button does) covers "I don't want to share
  // my age" without letting the section itself get corrupted.
  const removeFieldHtml = !field.required
    ? `<button type="button" class="btn-link btn-danger btn-remove-field" data-remove-field="${field.id}" title="Remove this field from your biodata">✕</button>`
    : "";
  const labelHtml = `<label for="f_${field.id}">${escAttr(field.label)}${field.required ? " *" : ""}</label>${removeFieldHtml}`;

  if (field.type === "textarea") {
    fieldEl.innerHTML = `
      ${labelHtml}
      <textarea id="f_${field.id}" rows="4" placeholder="${escAttr(field.placeholder || "")}" data-field="${field.id}"></textarea>
    `;
    fieldEl.querySelector("textarea").value = formData[field.id] || "";
  } else {
    fieldEl.innerHTML = `
      ${labelHtml}
      <input
        id="f_${field.id}"
        type="${field.type === "date" ? "date" : "text"}"
        placeholder="${escAttr(field.placeholder || "")}"
        data-field="${field.id}"
        value="${escAttr(formData[field.id] || "")}"
      />
    `;
  }
  const removeEl = fieldEl.querySelector("[data-remove-field]");
  if (removeEl) removeEl.addEventListener("click", () => callbacks.onRemoveField(pageId, section.id, field.id));
  return fieldEl;
}

function wireFieldInputs(container, callbacks) {
  container.querySelectorAll("input[data-field], textarea[data-field]").forEach((input) => {
    if (input.type === "file") return;
    input.addEventListener("input", (e) => {
      callbacks.onFieldChange(e.target.dataset.field, e.target.value);
    });
  });
}