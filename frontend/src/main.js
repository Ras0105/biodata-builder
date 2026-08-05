import { getTemplateMeta } from "./templates/registry.js";
import { renderGallery } from "./components/templateGallery.js";
import { renderForm, getMissingRequiredFields } from "./components/formRenderer.js";
import { renderPreview } from "./components/livePreview.js";
import { startCheckout } from "./components/checkout.js";
import { state, setField, selectTemplate, backToGallery, subscribe, saveDraft, clearDraft } from "./state.js";

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

async function onSelectTemplate(templateId, { updateHash = true } = {}) {
  const meta = getTemplateMeta(templateId);
  const { schema } = await meta.loadSchema();
  selectTemplate(templateId, schema);
  showView();

  fullNameInput.value = state.fullName;
  emailInput.value = state.email;

  if (updateHash) location.hash = `#/${templateId}`;

  renderForm(formMount, state.schema, state.formData, (fieldId, value) => {
    setField(fieldId, value);
    renderPreview(previewMount, state.templateId, state.formData);
  });

  await renderPreview(previewMount, state.templateId, state.formData);
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