// state.js — small central store. No template-specific knowledge lives here.

import {
  cloneSchema,
  emptyFormData,
  addSection as _addSection,
  removeSection as _removeSection,
  renameSection as _renameSection,
  addFieldToSection as _addFieldToSection,
  removeField as _removeField,
  addPage as _addPage,
  removePage as _removePage,
  addPhoto as _addPhoto,
  removePhoto as _removePhoto,
  movePhoto as _movePhoto,
  positionPhoto as _positionPhoto,
} from "./templates/schemaUtils.js";

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
// NOTE: drafts now also persist the mutated schema shape (pages/sections the
// user added or removed), not just formData — otherwise a refresh would
// restore old field values against the template's original, unmutated schema.
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
      JSON.stringify({
        formData: state.formData,
        email: state.email,
        fullName: state.fullName,
        schema: { id: state.schema.id, photos: state.schema.photos, pages: state.schema.pages },
      })
    );
  }, 300);
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

export function selectTemplate(templateId, rawSchema) {
  state.templateId = templateId;

  const draft = loadDraft(templateId);
  // If a draft saved a previously-mutated schema (user added/removed sections
  // last time), restore THAT structure instead of the template's pristine one.
  state.schema = draft?.schema ? cloneSchema(draft.schema) : cloneSchema(rawSchema);

  if (draft) {
    state.formData = { ...emptyFormData(state.schema), ...draft.formData };
    state.email = draft.email || "";
    state.fullName = draft.fullName || "";
  } else {
    state.formData = emptyFormData(state.schema);
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

// --- structural mutation actions (form UI calls these; each re-notifies) ---

function pruneOrphanedFormData() {
  const validIds = new Set(state.schema.photos.map((p) => p.id));
  state.schema.pages.forEach((page) =>
    page.sections.forEach((s) => s.fields.forEach((f) => validIds.add(f.id)))
  );
  Object.keys(state.formData).forEach((key) => {
    if (!validIds.has(key)) delete state.formData[key];
  });
}

export function addSection(pageId, title) {
  const id = _addSection(state.schema, pageId, title);
  if (id) saveDraft();
  notify();
  return id;
}

export function removeSection(pageId, sectionId) {
  _removeSection(state.schema, pageId, sectionId);
  pruneOrphanedFormData();
  saveDraft();
  notify();
}

export function renameSection(pageId, sectionId, newTitle) {
  _renameSection(state.schema, pageId, sectionId, newTitle);
  saveDraft();
  notify();
}

export function addFieldToSection(pageId, sectionId, label) {
  const id = _addFieldToSection(state.schema, pageId, sectionId, label);
  if (id) state.formData[id] = "";
  saveDraft();
  notify();
  return id;
}

export function removeField(pageId, sectionId, fieldId) {
  _removeField(state.schema, pageId, sectionId, fieldId);
  pruneOrphanedFormData();
  saveDraft();
  notify();
}

export function addPage() {
  const id = _addPage(state.schema);
  if (id) saveDraft();
  notify();
  return id;
}

export function removePage(pageId) {
  _removePage(state.schema, pageId);
  pruneOrphanedFormData();
  saveDraft();
  notify();
}

export function addPhoto(label) {
  const id = _addPhoto(state.schema, label);
  if (id) state.formData[id] = null;
  saveDraft();
  notify();
  return id;
}

export function removePhoto(photoId) {
  _removePhoto(state.schema, photoId);
  pruneOrphanedFormData();
  saveDraft();
  notify();
}

export function movePhoto(photoId, pageId) {
  _movePhoto(state.schema, photoId, pageId);
  saveDraft();
  notify();
}

// Called after a drag/resize on the live preview. Deliberately does NOT
// call notify()/trigger a form re-render — the preview already reflects the
// new position live during the drag, so re-rendering here would just cause
// a flicker. It only needs to persist.
export function positionPhoto(photoId, pos) {
  _positionPhoto(state.schema, photoId, pos);
  saveDraft();
}
