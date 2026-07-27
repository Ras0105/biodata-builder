// state.js — small central store. No template-specific knowledge lives here.

export const state = {
  view: "gallery", // "gallery" | "builder"
  templateId: null,
  schema: null,
  formData: {},
  email: "",
  fullName: "",
};

const listeners = [];

export function subscribe(fn) {
  listeners.push(fn);
}

export function notify() {
  listeners.forEach((fn) => fn(state));
}

export function setField(fieldId, value) {
  state.formData[fieldId] = value;
  notify();
}

export function selectTemplate(templateId, schema) {
  state.templateId = templateId;
  state.schema = schema;
  state.formData = schemaToEmptyData(schema);
  state.view = "builder";
  notify();
}

export function backToGallery() {
  state.view = "gallery";
  state.templateId = null;
  state.schema = null;
  state.formData = {};
  notify();
}

function schemaToEmptyData(schema) {
  const data = { photo: null };
  schema.sections.forEach((section) => {
    section.fields.forEach((f) => {
      data[f.id] = "";
    });
  });
  return data;
}
