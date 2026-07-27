// formRenderer.js — GENERIC engine.
// Takes any template's schema + current formData and renders inputs.
// Never edited when a template is added, changed, or removed.

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
      fieldEl.innerHTML = `
        <label for="f_${field.id}">${field.label}${field.required ? " *" : ""}</label>
        <input
          id="f_${field.id}"
          type="${field.type === "date" ? "date" : "text"}"
          placeholder="${field.placeholder || ""}"
          data-field="${field.id}"
          value="${formData[field.id] || ""}"
        />
      `;
      sectionEl.appendChild(fieldEl);
    });

    container.appendChild(sectionEl);
  });

  container.querySelectorAll("input[data-field]").forEach((input) => {
    if (input.type === "file") return;
    input.addEventListener("input", (e) => {
      onChange(e.target.dataset.field, e.target.value);
    });
  });
}
