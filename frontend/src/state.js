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
const DRAFT_PREFIX = "biodata_draft_";

export function subscribe(fn) {
  listeners.push(fn);
}

export function notify() {
  listeners.forEach((fn) => fn(state));
}

// --- persistence ---
function draftKey(templateId) {
  return `${DRAFT_PREFIX}${templateId}`;
}

let saveTimer = null;
export function saveDraft() {
  if (!state.templateId) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    localStorage.setItem(
      draftKey(state.templateId),
      JSON.stringify({ formData: state.formData, email: state.email, fullName: state.fullName })
    );
  }, 300); // debounce so we don't hit localStorage on every keystroke
}

export function loadDraft(templateId) {
  try {
    const raw = localStorage.getItem(draftKey(templateId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearDraft(templateId) {
  localStorage.removeItem(draftKey(templateId));
}

export function setField(fieldId, value) {
  state.formData[fieldId] = value;
  saveDraft();
  notify();
}

export function selectTemplate(templateId, schema) {
  state.templateId = templateId;
  state.schema = schema;

  const draft = loadDraft(templateId);
  if (draft) {
    state.formData = { ...schemaToEmptyData(schema), ...draft.formData };
    state.email = draft.email || "";
    state.fullName = draft.fullName || "";
  } else {
    state.formData = schemaToEmptyData(schema);
    state.email = "";
    state.fullName = "";
  }

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