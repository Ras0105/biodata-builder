// preference-form.js — "Request a Template" mini form window.
//
// Unlike report-issue.js (which intentionally opens the Google Form in a
// new tab), this one shows a SMALL floating window on top of the current
// page — like a widget, not a full-page takeover — with the actual form
// embedded inside an <iframe>. The user stays on the templates page the
// whole time; they just close the window when done.
//
// ----------------------------------------------------------------------
// >>> REPLACE THIS with your real Google Form's embed link. <<<
// Open your Google Form → click "Send" → the "<>" (embed HTML) tab →
// copy the URL inside the src="..." — it already ends in
// "?embedded=true", which is what makes it render form-only (no Google
// header/footer) inside the iframe.
// Example: "https://docs.google.com/forms/d/e/1FAIpQ.../viewform?embedded=true"
const PREFERENCE_FORM_URL = "https://docs.google.com/forms/d/e/REPLACE_WITH_YOUR_FORM_ID/viewform?embedded=true";
// ----------------------------------------------------------------------

let modalEl = null;
let iframeEl = null;

function buildModal() {
  const overlay = document.createElement("div");
  overlay.id = "preferenceFormModal";
  overlay.className = "preference-form-modal";
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="preference-form-backdrop"></div>
    <div class="preference-form-window" role="dialog" aria-modal="true" aria-labelledby="preferenceFormTitle">
      <div class="preference-form-header">
        <span id="preferenceFormTitle">Tell us what you're looking for</span>
        <button type="button" class="preference-form-close" aria-label="Close">&times;</button>
      </div>
      <div class="preference-form-body">
        <iframe
          title="Template preference form"
          src="about:blank"
          loading="lazy"
          referrerpolicy="strict-origin-when-cross-origin"
        ></iframe>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  iframeEl = overlay.querySelector("iframe");

  const close = () => {
    overlay.hidden = true;
    // Reset the src so the form re-loads fresh (and stops running) once closed.
    iframeEl.src = "about:blank";
  };
  overlay.querySelector(".preference-form-close").addEventListener("click", close);
  overlay.querySelector(".preference-form-backdrop").addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalEl && !modalEl.hidden) close();
  });

  modalEl = overlay;
}

function openPreferenceForm() {
  if (!modalEl) buildModal();
  iframeEl.src = PREFERENCE_FORM_URL;
  modalEl.hidden = false;
}

/**
 * Wires up every element with the `.preference-form-link` class on the
 * page (e.g. the "Request a Template" button on the coming-soon card) so
 * clicking it opens the small in-page form window instead of navigating
 * away. Safe to call on any page with zero or more such elements.
 */
export function initPreferenceFormModal() {
  document.querySelectorAll(".preference-form-link").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openPreferenceForm();
    });
  });
}

// Exported separately for elements created dynamically at runtime (e.g.
// a coming-soon card re-rendered after a filter change won't be caught
// by the querySelectorAll pass above unless re-wired — call this instead).
export { openPreferenceForm };
