import { getTemplateMeta } from "./templates/registry.js";
import { renderGallery } from "./components/templateGallery.js";
import { renderForm, getMissingRequiredFields } from "./components/formRenderer.js";
import { renderPreview } from "./components/livePreview.js";
import { startCheckout } from "./components/checkout.js";
import {
  state, setField, selectTemplate, backToGallery, subscribe, saveDraft, clearDraft,
  addSection, removeSection, renameSection, addFieldToSection, removeField,
  addPage, removePage, addPhoto, removePhoto, movePhoto, positionPhoto,
} from "./state.js";

const viewGallery = document.getElementById("view-gallery");
const viewBuilder = document.getElementById("view-builder");
const galleryGrid = document.getElementById("galleryGrid");
const formMount = document.getElementById("formMount");
const previewMount = document.getElementById("previewMount");
const backBtn = document.getElementById("backBtn");
const downloadBtn = document.getElementById("downloadBtn");
const fullNameInput = document.getElementById("f_fullName");
const emailInput = document.getElementById("f_email");

const overlayEl = document.getElementById("overlay");
const overlayTextEl = document.getElementById("overlayText");
const overlay = {
  show: (msg) => { overlayTextEl.textContent = msg; overlayEl.hidden = false; },
  hide: () => { overlayEl.hidden = true; },
  fail: (msg) => { overlay.hide(); alert(msg); },
};

function showView() {
  viewGallery.hidden = state.view !== "gallery";
  viewBuilder.hidden = state.view !== "builder";
}

// Re-renders both the form panel and the live preview from current state.
// Used after any structural change (add/remove section, page, photo, field)
// since those change what the form and preview both need to display.
function rerenderAll() {
  renderForm(formMount, state.schema, state.formData, formCallbacks);
  renderPreview(previewMount, state.templateId, state.schema, state.formData, formCallbacks);
}

const formCallbacks = {
  onFieldChange: (fieldId, value) => {
    setField(fieldId, value);
    renderPreview(previewMount, state.templateId, state.schema, state.formData, formCallbacks);
  },
  onAddSection: (pageId, title) => { addSection(pageId, title); rerenderAll(); },
  onRemoveSection: (pageId, sectionId) => { removeSection(pageId, sectionId); rerenderAll(); },
  onRenameSection: (pageId, sectionId, title) => { renameSection(pageId, sectionId, title); rerenderAll(); },
  onAddField: (pageId, sectionId, label) => { addFieldToSection(pageId, sectionId, label); rerenderAll(); },
  onRemoveField: (pageId, sectionId, fieldId) => { removeField(pageId, sectionId, fieldId); rerenderAll(); },
  onAddPage: () => { addPage(); rerenderAll(); },
  onRemovePage: (pageId) => { removePage(pageId); rerenderAll(); },
  onAddPhoto: () => { addPhoto(); rerenderAll(); },
  onRemovePhoto: (photoId) => { removePhoto(photoId); rerenderAll(); },
  onMovePhoto: (photoId, pageId) => { movePhoto(photoId, pageId); rerenderAll(); },
  // Drag/resize on the preview: persist only, no re-render (avoids flicker —
  // the preview DOM already reflects the new position live during the drag).
  onPhotoPosition: (photoId, pos) => { positionPhoto(photoId, pos); },
};

async function onSelectTemplate(templateId, { updateHash = true } = {}) {
  const meta = getTemplateMeta(templateId);
  const { schema } = await meta.loadSchema();
  selectTemplate(templateId, schema);
  showView();

  fullNameInput.value = state.fullName;
  emailInput.value = state.email;

  if (updateHash) location.hash = `#/${templateId}`;

  renderForm(formMount, state.schema, state.formData, formCallbacks);
  await renderPreview(previewMount, state.templateId, state.schema, state.formData, formCallbacks);
}

fullNameInput.addEventListener("input", (e) => { state.fullName = e.target.value; saveDraft(); });
emailInput.addEventListener("input", (e) => { state.email = e.target.value; saveDraft(); });

backBtn.addEventListener("click", () => {
  backToGallery();
  showView();
  history.pushState(null, "", location.pathname);
});

subscribe(() => {});

downloadBtn.addEventListener("click", () => {
  const missing = getMissingRequiredFields(state.schema, state.formData);
  if (missing.length) {
    overlay.fail(`Please fill in: ${missing.join(", ")}`);
    return;
  }

  startCheckout(
    {
      email: state.email,
      fullName: state.fullName,
      community: getTemplateMeta(state.templateId).community,
      templateId: state.templateId,
      formData: state.formData,
    },
    overlay
  );
  // Optional: clearDraft(state.templateId) after a *confirmed* successful order,
  // inside checkout.js's success callback — not here, in case payment fails.
});

// --- hash routing: deep link + refresh survival ---
function routeFromHash() {
  const match = location.hash.match(/^#\/(.+)$/);
  if (match) {
    try {
      onSelectTemplate(match[1], { updateHash: false });
      return;
    } catch {
      // unknown template id in hash — fall through to gallery
    }
  }
  backToGallery();
  showView();
}

window.addEventListener("hashchange", routeFromHash);

renderGallery(galleryGrid, (id) => onSelectTemplate(id));
routeFromHash(); // handles initial load, including a refresh mid-builder
