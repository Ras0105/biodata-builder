// formRenderer.js — GENERIC engine.
// Takes any template's schema + current formData and renders inputs.
// Never edited when a template is added, changed, or removed.

function escAttr(str) {
  return (str || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

export function renderForm(container, schema, formData, onChange) {
  container.innerHTML = "";

  // photo upload
  const photoBlock = document.createElement("div");
  photoBlock.className = "form-field form-field-photo";
  photoBlock.innerHTML = `
    <label>${schema.photo.label}${schema.photo.required ? " *" : ""}</label>
    <input type="file" accept="image/*" data-field="photo" />
  `;
  container.appendChild(photoBlock);

  photoBlock.querySelector("input").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange("photo", reader.result);
    reader.readAsDataURL(file);
  });

  schema.sections.forEach((section) => {
    const sectionEl = document.createElement("fieldset");
    sectionEl.className = "form-section";
    sectionEl.innerHTML = `<legend>${section.title}</legend>`;

    section.fields.forEach((field) => {
      const fieldEl = document.createElement("div");
      fieldEl.className = "form-field";

      const labelHtml = `<label for="f_${field.id}">${field.label}${field.required ? " *" : ""}</label>`;

      if (field.type === "textarea") {
        fieldEl.innerHTML = `
          ${labelHtml}
          <textarea
            id="f_${field.id}"
            rows="4"
            placeholder="${escAttr(field.placeholder || "")}"
            data-field="${field.id}"
          ></textarea>
        `;
        // Set as a property, not an attribute, so newlines/quotes in existing
        // data round-trip exactly rather than being HTML-escaped by hand.
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

      sectionEl.appendChild(fieldEl);
    });

    container.appendChild(sectionEl);
  });

  container.querySelectorAll("input[data-field], textarea[data-field]").forEach((input) => {
    if (input.type === "file") return;
    input.addEventListener("input", (e) => {
      onChange(e.target.dataset.field, e.target.value);
    });
  });
}

// Returns ids of required fields (schema + photo) that are currently empty.
// Used by checkout to block downloads on incomplete required data, on top
// of the fullName/email check that already happens there.
export function getMissingRequiredFields(schema, formData) {
  const missing = [];
  if (schema.photo.required && !formData.photo) missing.push(schema.photo.label);
  schema.sections.forEach((section) => {
    section.fields.forEach((field) => {
      if (field.required && !(formData[field.id] || "").toString().trim()) {
        missing.push(field.label);
      }
    });
  });
  return missing;
}