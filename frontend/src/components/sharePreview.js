// sharePreview.js — GENERIC engine, works for every template unchanged.
//
// Issue 2 (WhatsApp-optimized export): this is deliberately a PREVIEW share,
// not the paid deliverable — it captures whatever's currently on screen
// (watermark included, by design: it's free, so it should stay branded and
// nudge whoever it's shared with back to Aananda Digital), compressed and
// sized the way WhatsApp actually wants images (a single JPG under ~1MB,
// object-fit contained, not a giant lossless PNG). The real, unwatermarked
// deliverable stays exactly what it already was: a *paid* PDF, generated
// server-side once backend/app/services/pdf_pipeline.py exists — this file
// never touches that flow.
//
// Uses html2canvas (loaded via CDN in index.html) to rasterize the live
// preview DOM, since there's no server round-trip available for this yet.

const MAX_WIDTH_PX = 1080; // WhatsApp comfortably displays/compresses at this width
const JPEG_QUALITY = 0.85;

async function captureElementAsJpegBlob(pageEl) {
  if (!window.html2canvas) {
    throw new Error("html2canvas failed to load — check your network/ad-blocker settings.");
  }
  const canvas = await window.html2canvas(pageEl, {
    backgroundColor: "#ffffff",
    scale: Math.min(2, MAX_WIDTH_PX / pageEl.offsetWidth),
    useCORS: true,
    // Some templates embed large inline (base64) background/frame images —
    // give them more headroom to decode before html2canvas gives up.
    imageTimeout: 30000,
    // Issue: sharing failed outright (not just a console warning) whenever
    // the page also had the header's autoplay hero-logo <video> elements in
    // the DOM. html2canvas clones the WHOLE document (not just pageEl) to
    // resolve layout/styles before rasterizing, and drawing an in-progress
    // <video>'s current frame onto its internal canvas throws a
    // SecurityError ("tainted") for those looping muted videos — unrelated
    // to pageEl itself, but enough to abort the capture. Since we only ever
    // need the template page as an image, skip cloning/rendering any
    // <video> element entirely rather than trying to rasterize it.
    ignoreElements: (el) => el.tagName === "VIDEO",
    // Issue: template_06's arch-shaped photo frame uses a compound
    // elliptical border-radius ("h1 h2 h3 h4 / v1 v2 v3 v4" — different
    // horizontal/vertical radii per corner). html2canvas's CSS parser
    // throws on that "/" shorthand, silently aborting the whole capture for
    // just this one template with no useful error surfacing. Flatten any
    // such border-radius to its horizontal-only equivalent on the CLONE
    // html2canvas is about to rasterize — the live, on-screen, editable
    // preview (and the real print/PDF pipeline) are completely untouched;
    // only the shared JPEG trades a slightly less elliptical corner for
    // actually being generated at all.
    onclone: (clonedDoc, clonedEl) => {
      const view = clonedDoc.defaultView || window;
      clonedEl.querySelectorAll("*").forEach((node) => {
        const radius = view.getComputedStyle(node).borderRadius;
        if (radius && radius.includes("/")) {
          node.style.borderRadius = radius.split("/")[0].trim();
        }
      });
    },
  });
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY));
}

export async function shareCurrentPreview(previewMount, templateName, overlay) {
  const pageEl = previewMount.firstElementChild;
  if (!pageEl) return overlay.fail("Nothing to share yet — fill in a few details first.");

  overlay.show("Preparing a shareable preview…");
  let blob;
  try {
    blob = await captureElementAsJpegBlob(pageEl);
  } catch (err) {
    // Issue: this failure was previously completely silent (no console
    // output at all), which made it impossible to diagnose why a specific
    // template's capture failed. Always surface the real error now.
    console.error("shareCurrentPreview: html2canvas capture failed:", err);
    overlay.fail("Couldn't generate a shareable image. Please try again.");
    return;
  }
  if (!blob) {
    console.error("shareCurrentPreview: canvas.toBlob returned null — canvas may be empty or exceed the browser's max canvas size.");
    overlay.fail("Couldn't generate a shareable image. Please try again.");
    return;
  }

  const fileName = `${(templateName || "biodata-preview").replace(/\s+/g, "-").toLowerCase()}.jpg`;
  const file = new File([blob], fileName, { type: "image/jpeg" });

  // Mobile: hands straight to the native share sheet (WhatsApp/Instagram/etc
  // all appear there automatically) — this is the primary path most users hit.
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    overlay.hide();
    try {
      await navigator.share({
        files: [file],
        title: "My biodata preview",
        text: "Here's a preview of my biodata, made with Aananda Digital.",
      });
    } catch {
      // user cancelled the share sheet — not an error, nothing to do
    }
    return;
  }

  // Desktop fallback: just download the image so it can be dragged into
  // WhatsApp Web / any chat manually.
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  overlay.hide();
}
