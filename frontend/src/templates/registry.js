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
  {
    id: "template_03",
    name: "Royal Maroon",
    community: "Hindu",
    description: "Ornate maroon & gold design with a diamond-pattern border, geared toward bride biodata.",
    thumbnail: "./src/assets/thumbnails/template_03.png",
    loadSchema: () => import("./catalog/template_03/schema.js"),
    loadLayout: () => import("./catalog/template_03/layout.js"),
    styleHref: "./src/templates/catalog/template_03/style.css",
  },
  {
    id: "template_04",
    name: "Navy & Gold",
    community: "Muslim",
    description: "Elegant navy background with gold typography, including a dedicated Sect / Maslak section.",
    thumbnail: "./src/assets/thumbnails/template_04.png",
    loadSchema: () => import("./catalog/template_04/schema.js"),
    loadLayout: () => import("./catalog/template_04/layout.js"),
    styleHref: "./src/templates/catalog/template_04/style.css",
  },
  {
    id: "template_05",
    name: "Heritage Wood",
    community: "Muslim",
    description: "Warm earthy wood-texture background with rust corner borders and Arabic-script accent.",
    thumbnail: "./src/assets/thumbnails/template_05.png",
    loadSchema: () => import("./catalog/template_05/schema.js"),
    loadLayout: () => import("./catalog/template_05/layout.js"),
    styleHref: "./src/templates/catalog/template_05/style.css",
  },
  {
    id: "template_06",
    name: "Blossom Pink",
    community: "Muslim",
    description: "Soft pink theme with a dedicated Birth Name field alongside legal Full Name and a Sect / Maslak section.",
    thumbnail: "./src/assets/thumbnails/template_06.png",
    loadSchema: () => import("./catalog/template_06/schema.js"),
    loadLayout: () => import("./catalog/template_06/layout.js"),
    styleHref: "./src/templates/catalog/template_06/style.css",
  },
  {
    id: "template_07",
    name: "Sacred Minimal",
    community: "Christian",
    description: "Deliberately spare black & white layout (no religious-details section, unlike template_08) with a Work field distinct from Occupation.",
    thumbnail: "./src/assets/thumbnails/template_07.png",
    loadSchema: () => import("./catalog/template_07/schema.js"),
    loadLayout: () => import("./catalog/template_07/layout.js"),
    styleHref: "./src/templates/catalog/template_07/style.css",
  },
  {
    id: "template_08",
    name: "Sky Blue Faith",
    community: "Christian",
    description: "Sky-blue theme with the most detailed religious section yet — Church, Denomination, Diocese, Parish, Confirmation, Sacraments and Baptism Date.",
    thumbnail: "./src/assets/thumbnails/template_08.png",
    loadSchema: () => import("./catalog/template_08/schema.js"),
    loadLayout: () => import("./catalog/template_08/layout.js"),
    styleHref: "./src/templates/catalog/template_08/style.css",
  },
  {
    id: "template_09",
    name: "Sikh Sacred Gold",
    community: "Sikh",
    description: "Gold & navy theme with the Ik Onkar symbol and Waheguru invocation — first Sikh-community template in the catalog.",
    thumbnail: "./src/assets/thumbnails/template_09.png",
    loadSchema: () => import("./catalog/template_09/schema.js"),
    loadLayout: () => import("./catalog/template_09/layout.js"),
    styleHref: "./src/templates/catalog/template_09/style.css",
  },
  {
    id: "template_10",
    name: "Modern Narrative",
    community: "Hindu",
    description: "Dark card-grid layout built around free-text About Myself / Expectations sections alongside Overview, Family and Beliefs — structurally distinct from the row-based templates.",
    thumbnail: "./src/assets/thumbnails/template_10.png",
    loadSchema: () => import("./catalog/template_10/schema.js"),
    loadLayout: () => import("./catalog/template_10/layout.js"),
    styleHref: "./src/templates/catalog/template_10/style.css",
  },
  {
    id: "template_11",
    name: "Marathi Kuldaivat",
    community: "Hindu",
    description: "First Marathi-language template — Devanagari labels with Maharashtrian astrological fields (Kuldaivat, Nadi, Gan, Varna) not found in any other template.",
    thumbnail: "./src/assets/thumbnails/template_11.png",
    loadSchema: () => import("./catalog/template_11/schema.js"),
    loadLayout: () => import("./catalog/template_11/layout.js"),
    styleHref: "./src/templates/catalog/template_11/style.css",
  },
  {
    id: "template_12",
    name: "Extended Family Tree",
    community: "Hindu",
    description: "Two-column layout built for dense, multi-generation family sections — Paternal Uncle/Aunt and separate Paternal/Maternal Grandparents fields, unique to this template.",
    thumbnail: "./src/assets/thumbnails/template_12.png",
    loadSchema: () => import("./catalog/template_12/schema.js"),
    loadLayout: () => import("./catalog/template_12/layout.js"),
    styleHref: "./src/templates/catalog/template_12/style.css",
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