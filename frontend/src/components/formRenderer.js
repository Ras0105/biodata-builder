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
    if (schema.pages.length > 1) {
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

  schema.photos.forEach((photo) => {
    const photoBlock = document.createElement("div");
    photoBlock.className = "form-field form-field-photo";

    const removeBtn = !photo.required
      ? `<button type="button" class="btn-link btn-danger" data-remove-photo="${photo.id}">Remove</button>`
      : "";

    photoBlock.innerHTML = `
      <label>${escAttr(photo.label)}${photo.required ? " *" : ""}</label>
      <input type="file" accept="image/*" data-field="${photo.id}" data-photo="true" />
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
  const removeFieldHtml = field.custom
    ? `<button type="button" class="btn-link btn-danger btn-remove-field" data-remove-field="${field.id}">✕</button>`
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
