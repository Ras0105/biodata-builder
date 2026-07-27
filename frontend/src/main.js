import { getTemplateMeta } from "./templates/registry.js";
import { renderGallery } from "./components/templateGallery.js";
import { renderForm } from "./components/formRenderer.js";
import { renderPreview } from "./components/livePreview.js";
import { startCheckout } from "./components/checkout.js";
import { state, setField, selectTemplate, backToGallery, subscribe } from "./state.js";

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

async function onSelectTemplate(templateId) {
  const meta = getTemplateMeta(templateId);
  const { schema } = await meta.loadSchema();
  selectTemplate(templateId, schema);
  showView();

  // Form is built ONCE per template selection. Each keystroke updates state
  // and repaints only the preview — rebuilding the form on every keystroke
  // would blow away input focus.
  renderForm(formMount, state.schema, state.formData, (fieldId, value) => {
    setField(fieldId, value);
    renderPreview(previewMount, state.templateId, state.formData);
  });

  await renderPreview(previewMount, state.templateId, state.formData);
}

fullNameInput.addEventListener("input", (e) => { state.fullName = e.target.value; });
emailInput.addEventListener("input", (e) => { state.email = e.target.value; });

backBtn.addEventListener("click", () => {
  backToGallery();
  showView();
});

// state.notify() still fires on setField (e.g. if other UI ever needs to react
// to form data changes generically); the form/preview repaint above already
// happens directly from the input handler, so this subscription is a no-op
// placeholder kept for future generic listeners.
subscribe(() => {});

downloadBtn.addEventListener("click", () => {
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
});

renderGallery(galleryGrid, onSelectTemplate);
showView();
