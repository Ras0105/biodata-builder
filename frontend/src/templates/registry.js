// registry.js
// The ONLY file that needs a new line when a template is added or removed.
// Each entry is fully self-contained: its own schema, layout and style live
// under templates/catalog/<id>/ and nowhere else references them directly.

export const TEMPLATE_REGISTRY = [
  {
    id: "template_01",
    name: "Classic Ivory",
    community: "Hindu",
    description: "Traditional cream & charcoal biodata with corner floral flourishes and a circular photo frame.",
    thumbnail: "./src/assets/thumbnails/template_01.png",
    loadSchema: () => import("./catalog/template_01/schema.js"),
    loadLayout: () => import("./catalog/template_01/layout.js"),
    styleHref: "./src/templates/catalog/template_01/style.css",
  },
  {
    id: "template_02",
    name: "Vedic Sage",
    community: "Hindu",
    description: "Sanskrit invocation header on a green Vedic theme, with a dedicated astrological (Gotra) section.",
    thumbnail: "./src/assets/thumbnails/template_02.png",
    loadSchema: () => import("./catalog/template_02/schema.js"),
    loadLayout: () => import("./catalog/template_02/layout.js"),
    styleHref: "./src/templates/catalog/template_02/style.css",
  },
];

export function getTemplateMeta(id) {
  const meta = TEMPLATE_REGISTRY.find((t) => t.id === id);
  if (!meta) throw new Error(`Unknown template id: ${id}`);
  return meta;
}

export function listTemplates() {
  return TEMPLATE_REGISTRY.map(({ id, name, description, thumbnail }) => ({
    id,
    name,
    description,
    thumbnail,
  }));
}