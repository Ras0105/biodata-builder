// "Report an Issue" — every trigger on the site (footer links, the
// builder's "Need help?" button, the floating help button, the failed-
// payment/generation overlay link, etc.) now behaves the same way:
// 1. A small "are you sure?" confirm dialog appears.
// 2. If the user taps "Yes", the real Google Form opens in a brand new
//    browser tab (window.open(..., "_blank")) — no iframe, no embedding.
//
// The previous version embedded the form in an on-page iframe so the
// address bar never changed. That approach has been removed completely
// per product decision — the form now always opens as a normal external
// link, just gated behind a confirm step first.

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScr2pIGFqQNVCKA9zXnW2bMFi4Z9DygGioIgYwfzqld9iC2ag/viewform";

let confirmEl = null;

function buildConfirm() {
  const overlay = document.createElement("div");
  overlay.id = "reportIssueConfirm";
  overlay.className = "report-issue-confirm";
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="report-issue-confirm-backdrop"></div>
    <div class="report-issue-confirm-box" role="dialog" aria-modal="true" aria-labelledby="reportIssueConfirmText">
      <button type="button" class="report-issue-confirm-x" aria-label="Cancel">&times;</button>
      <p id="reportIssueConfirmText">Do you want to submit an issue report?</p>
      <div class="report-issue-confirm-actions">
        <button type="button" class="btn btn-secondary" data-choice="no">No</button>
        <button type="button" class="btn" data-choice="yes">Yes</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const close = () => { overlay.hidden = true; };
  overlay.querySelector(".report-issue-confirm-x").addEventListener("click", close);
  overlay.querySelector(".report-issue-confirm-backdrop").addEventListener("click", close);
  overlay.querySelector('[data-choice="no"]').addEventListener("click", close);
  overlay.querySelector('[data-choice="yes"]').addEventListener("click", () => {
    close();
    // Confirmed — open the real Google Form directly in a new tab.
    window.open(FORM_URL, "_blank", "noopener");
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && confirmEl && !confirmEl.hidden) close();
  });

  confirmEl = overlay;
}

function openReportIssueConfirm() {
  if (!confirmEl) buildConfirm();
  confirmEl.hidden = false;
}

/**
 * Wires up every element with the `.report-issue-link` or
 * `.report-issue-link-confirm` class on the page — both classes now do
 * the same thing (confirm, then open the form in a new tab). Kept as two
 * class names so existing markup doesn't need to change. Safe to call on
 * any page with zero or more of either.
 */
export function initReportIssueModal() {
  document
    .querySelectorAll(".report-issue-link, .report-issue-link-confirm")
    .forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        openReportIssueConfirm();
      });
    });
}

// Exported separately for elements created dynamically at runtime — e.g.
// main.js's overlay.failWithHelp() builds its "Report this issue" link
// after the page has already loaded, so it can't rely on the
// querySelectorAll pass above and calls this directly on click instead.
export { openReportIssueConfirm };
