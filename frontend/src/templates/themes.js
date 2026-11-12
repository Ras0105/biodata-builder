// themes.js — visual identity extracted from each template's own style.css.
// Used ONLY by the generic engine (dynamicExtras.js/livePreview.js) so that
// pages/sections/photos the user adds at runtime inherit the same colors,
// font and border as the template's own hardcoded design — instead of a
// generic unstyled box. Never edited when a template's core design changes
// only if that design's palette changes.

// Resolves an image that lives next to a template (src/templates/catalog/<id>/<file>).
// new URL(..., import.meta.url) works in the browser (-> http URL) AND in Node
// (-> file:// URL, which backend/render/render.mjs inlines as a data: URI for the PDF).
const img = (templateId, file) => new URL(`./catalog/${templateId}/${file}`, import.meta.url).href;

export const THEMES = {
  template_01: { bg: "url('" + img("template_01", "continuation-bg.jpg") + "') center/100% 100% no-repeat, #fdf6ec", text: "#2b1610", font: "\"Georgia\", \"Times New Roman\", serif", border: "none", accent: "#7a2419" },
  template_02: { bg: "url('" + img("template_02", "continuation-bg.png") + "') center/100% 100% no-repeat, #f9f6ef", text: "#241f16", font: "\"Georgia\", \"Times New Roman\", serif", border: "none", accent: "#1f4020", contPadding: "95px 25px 70px 103px" },
  template_03: { bg: "url('" + img("template_03", "continuation-bg.jpg") + "') center/100% 100% no-repeat, #5c0f14", text: "#f8ecd2", font: "\"Georgia\", \"Times New Roman\", serif", border: "none", accent: "#e9c979" },
  template_04: { bg: "url('" + img("template_04", "continuation-bg.jpg") + "') center/100% 100% no-repeat, #1b2947", text: "#e9ecf5", font: "\"Georgia\", \"Times New Roman\", serif", border: "none", accent: "#c9a24b" },
  template_05: { bg: "url('" + img("template_05", "continuation-bg.jpg") + "') center/100% 100% no-repeat, #ece4d4", text: "#3a2e22", font: "\"Georgia\", \"Times New Roman\", serif", border: "none", accent: "#a8461f" },
  template_06: { bg: "url('" + img("template_06", "continuation-bg.jpg") + "') center/100% 100% no-repeat, #fbe9d8", text: "#4a2f16", font: "\"Georgia\", \"Times New Roman\", serif", border: "none", accent: "#7a3220", contPadding: "70px 58px 60px" },
  template_07: { bg: "url('" + img("template_07", "continuation-bg.jpg") + "') center/100% 100% no-repeat, #fffdf7", text: "#2b2118", font: "\"Georgia\", \"Times New Roman\", serif", border: "none", accent: "#a67c2e" },
  template_08: { bg: "#fbfbf9 url(\"" + img("template_08", "continuation-bg.png") + "\") top center / 100% 100% no-repeat", text: "#16324f", font: "\"Georgia\", \"Times New Roman\", serif", border: null, accent: "#16324f", contPadding: "250px 58px 60px 58px" },
  template_09: { bg: "#fdfaf2", text: "#2e2a1f", font: "\"Georgia\", \"Times New Roman\", serif", border: "6px solid #b3852c", accent: "#b3852c" },
  template_10: { bg: "#12283a", text: "#e8eef2", font: "\"Helvetica Neue\", Arial, sans-serif", border: null, accent: "#e0a83e" },
  template_11: { bg: "#fff8f0", text: "#3a2418", font: "\"Noto Sans Devanagari\", \"Nirmala UI\", \"Georgia\", serif", border: "5px solid #b5261f", accent: "#b5261f" },
  template_12: { bg: "#fbf4ea", text: "#3a2e22", font: "\"Helvetica Neue\", Arial, sans-serif", border: null, accent: "#d9c19a" },
  template_13: { bg: "#fdfcf6", text: "#2c2418", font: "\"Georgia\", \"Times New Roman\", serif", border: "14px solid #0d6b6b", accent: "#0d6b6b" },
  template_14: { bg: "#ffffff", text: "#24331f", font: "\"Noto Sans Devanagari\", \"Nirmala UI\", \"Georgia\", serif", border: "10px solid #2c6e3f", accent: "#2c6e3f" },
  template_15: { bg: "#fffaf3", text: "#3a2f27", font: "\"Segoe UI\", \"Helvetica Neue\", Arial, sans-serif", border: null, accent: "#c9973f" },
  template_16: { bg: "#ffffff", text: "#2b2320", font: "\"Segoe UI\", \"Helvetica Neue\", Arial, sans-serif", border: null, accent: "#3a2e2a" },
  template_17: { bg: "#141414", text: "#f2f0ec", font: "\"Helvetica Neue\", Arial, sans-serif", border: null, accent: "#b7b3ac" },
  template_18: { bg: "#f6ece4", text: "#3a3229", font: "Georgia, \"Times New Roman\", serif", border: null, accent: "#9c8a76" },
  template_19: { bg: "#3a3a3a", text: "#f0f0f0", font: "\"Helvetica Neue\", Arial, sans-serif", border: null, accent: "#7ee08a" },
  template_20: { bg: "#ffffff", text: "#2c2620", font: "\"Segoe UI\", \"Helvetica Neue\", Arial, sans-serif", border: null, accent: "#4c6a80" },
  template_21: { bg: "radial-gradient(ellipse at 20% 15%, rgba(180, 150, 100, 0.10), transparent 40%),\n    radial-gradient(ellipse at 85% 80%, rgba(150, 120, 80, 0.12), transparent 45%),\n    #f1e6cf", text: "#3d2e1f", font: "Georgia, \"Times New Roman\", serif", border: "10px solid #f1e6cf", accent: "#6b4423" },
  template_22: { bg: "#ffffff", text: "#3a2b2b", font: "Georgia, \"Times New Roman\", serif", border: null, accent: "#7a2e42" },
  template_23: { bg: "#ffffff", text: "#3a2f2f", font: "\"Segoe UI\", \"Helvetica Neue\", Arial, sans-serif", border: null, accent: "#6b2c42" },
  template_24: { bg: "#ffffff", text: "#2f2626", font: "\"Segoe UI\", \"Helvetica Neue\", Arial, sans-serif", border: null, accent: "#2f2020" },
  template_25: { bg: "url('" + img("template_25", "continuation-bg.jpg") + "') center/100% 100% no-repeat, #f5c518", text: "#3a1010", font: "\"Georgia\", \"Times New Roman\", serif", border: "2px solid #7a1c1c", accent: "#7a1c1c", contPadding: "130px 84px 70px" }, 
  template_26: {backgroundSize: "100% 100%", backgroundPosition: "center center", backgroundRepeat: "no-repeat", bg: "url('" + img("template_26", "continuation-bg.png") + "') center center / 100% 100% no-repeat"},
  template_27: { bg: "url('" + img("template_27", "continuation-bg.jpg") + "') center/100% 100% no-repeat, #fbf3de", text: "#3a1010", font: "\"Georgia\", \"Times New Roman\", serif", border: "1.5px solid #8b1a1a", accent: "#8b1a1a", contPadding: "150px 86px 90px" },
  template_28: { bg: "url('" + img("template_28", "continuation-bg.png") + "') center/100% 100% no-repeat, #2b0d29", text: "#f5ead0", font: "\"Georgia\", \"Times New Roman\", serif", border: "1.5px solid #c9a227", accent: "#d9b64a", contPadding: "150px 86px 90px" },
  template_29: {bg: "url('" + img("template_29", "continuation-bg.webp") + "')"},
};

export function getTheme(templateId) {
  return THEMES[templateId] || { bg: "#ffffff", text: "#222222", font: "Georgia, serif", border: "1px solid #ccc", accent: "#555555" };
}