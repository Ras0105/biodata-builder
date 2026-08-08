import { getTemplateMeta, getCategories } from "./templates/registry.js";
import { renderGallery } from "./components/templateGallery.js";
import { renderForm, getMissingRequiredFields } from "./components/formRenderer.js";
import { renderPreview } from "./components/livePreview.js";
import { startCheckout } from "./components/checkout.js";
import { calculateAge } from "./templates/schemaUtils.js";
import {
  state, setField, selectTemplate, backToGallery, subscribe, saveDraft, clearDraft,
  addSection, removeSection, renameSection, addFieldToSection, removeField,
  addPage, removePage, addPhoto, removePhoto, movePhoto, positionPhoto,
  setPhotoStyle, bringPhotoToFront, restartCurrentTemplate,
} from "./state.js";

const viewGallery = document.getElementById("view-gallery");
const viewBuilder = document.getElementById("view-builder");
const galleryGrid = document.getElementById("galleryGrid");
const formMount = document.getElementById("formMount");
const previewMount = document.getElementById("previewMount");
const backBtn = document.getElementById("backBtn");
const restartBtn = document.getElementById("restartBtn");
const downloadBtn = document.getElementById("downloadBtn");
const fullNameInput = document.getElementById("f_fullName");
const emailInput = document.getElementById("f_email");
const phoneInput = document.getElementById("f_phone");
const countryCodeSelect = document.getElementById("f_countryCode");
const phoneErrorEl = document.getElementById("phoneError");

// Issue 7: phone number with country code, defaulting to India.
const COUNTRY_CODES = [
  ["+91", "India (+91)", 10],
  ["+1", "USA/Canada (+1)", 10],
  ["+44", "UK (+44)", 10],
  ["+61", "Australia (+61)", 9],
  ["+971", "UAE (+971)", 9],
  ["+966", "Saudi Arabia (+966)", 9],
  ["+974", "Qatar (+974)", 8],
  ["+965", "Kuwait (+965)", 8],
  ["+968", "Oman (+968)", 8],
  ["+973", "Bahrain (+973)", 8],
  ["+92", "Pakistan (+92)", 10],
  ["+880", "Bangladesh (+880)", 10],
  ["+977", "Nepal (+977)", 10],
  ["+94", "Sri Lanka (+94)", 9],
  ["+65", "Singapore (+65)", 8],
];
countryCodeSelect.innerHTML = COUNTRY_CODES
  .map(([code, label]) => `<option value="${code}">${label}</option>`)
  .join("");
countryCodeSelect.value = "+91"; // default India

function expectedPhoneLength(code) {
  const found = COUNTRY_CODES.find(([c]) => c === code);
  return found ? found[2] : 10;
}

function validatePhone({ showError = true } = {}) {
  const digits = phoneInput.value.replace(/\D/g, "");
  const expectedLen = expectedPhoneLength(countryCodeSelect.value);
  const valid = digits.length === expectedLen;
  if (showError) {
    phoneErrorEl.textContent = valid || !digits ? "" : `Enter a valid ${expectedLen}-digit number for ${countryCodeSelect.value}.`;
  }
  return valid;
}

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
// Issue 7: age gate is only relevant on Marriage-category templates, and only
// business logic that lives in main.js — formRenderer.js stays generic and
// just renders whatever { fieldId, minAge } it's handed.
function getAgeGate() {
  if (!state.templateId) return null;
  const isMarriageTemplate = getCategories(getTemplateMeta(state.templateId)).includes("Marriage");
  return isMarriageTemplate ? { fieldId: "dob", minAge: 18 } : null;
}

function rerenderAll() {
  renderForm(formMount, state.schema, state.formData, formCallbacks, { ageGate: getAgeGate() });
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
  onPhotoStyle: (photoId, patch) => { setPhotoStyle(photoId, patch); rerenderAll(); },
  onPhotoToFront: (photoId) => { bringPhotoToFront(photoId); rerenderAll(); },
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
  phoneInput.value = state.phone || "";
  countryCodeSelect.value = state.countryCode || "+91";
  phoneErrorEl.textContent = "";

  if (updateHash) location.hash = `#/${templateId}`;

  renderForm(formMount, state.schema, state.formData, formCallbacks, { ageGate: getAgeGate() });
  await renderPreview(previewMount, state.templateId, state.schema, state.formData, formCallbacks);
}

fullNameInput.addEventListener("input", (e) => { state.fullName = e.target.value; saveDraft(); });
emailInput.addEventListener("input", (e) => { state.email = e.target.value; saveDraft(); });
phoneInput.addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/\D/g, "");
  state.phone = e.target.value;
  saveDraft();
  validatePhone();
});
countryCodeSelect.addEventListener("change", (e) => {
  state.countryCode = e.target.value;
  saveDraft();
  validatePhone();
});

backBtn.addEventListener("click", () => {
  backToGallery();
  showView();
  history.pushState(null, "", location.pathname);
});

// Issue 2: Start over — clears the draft and restores this template to its
// pristine, un-edited state without leaving the builder.
restartBtn.addEventListener("click", async () => {
  if (!state.templateId) return;
  if (!confirm("Start over? This clears everything you've entered for this biodata.")) return;
  const meta = getTemplateMeta(state.templateId);
  const { schema } = await meta.loadSchema();
  restartCurrentTemplate(schema);
  fullNameInput.value = "";
  emailInput.value = "";
  phoneInput.value = "";
  countryCodeSelect.value = "+91";
  phoneErrorEl.textContent = "";
  renderForm(formMount, state.schema, state.formData, formCallbacks, { ageGate: getAgeGate() });
  await renderPreview(previewMount, state.templateId, state.schema, state.formData, formCallbacks);
});

subscribe(() => {});

downloadBtn.addEventListener("click", () => {
  const missing = getMissingRequiredFields(state.schema, state.formData);
  if (missing.length) {
    overlay.fail(`Please fill in: ${missing.join(", ")}`);
    return;
  }

  if (!validatePhone()) {
    overlay.fail(phoneInput.value ? phoneErrorEl.textContent || "Please enter a valid phone number." : "Please add your phone number before downloading.");
    return;
  }

  // Age gate — only Marriage-category biodatas require 18+, and only when we
  // can actually read a DOB (every template's schema uses the same "dob"
  // field id, see schema.js files). General/non-marriage templates are unrestricted.
  const ageGate = getAgeGate();
  if (ageGate) {
    const age = calculateAge(state.formData[ageGate.fieldId]);
    if (age !== null && age < ageGate.minAge) {
      overlay.fail(`This is a marriage biodata template, and the date of birth entered shows an age under ${ageGate.minAge}. Only users aged ${ageGate.minAge} and above can create a marriage biodata.`);
      return;
    }
  }

  startCheckout(
    {
      email: state.email,
      fullName: state.fullName,
      phone: `${state.countryCode || "+91"} ${state.phone || ""}`.trim(),
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