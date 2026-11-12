# Frontend

Static site (no build step), deployed to Vercel. See `../docs/PROJECT_STRUCTURE.md` for the full layout and rules.

- `css/` — global styles, loaded in numeric order (the cascade depends on it).
- `assets/` — static files only (brand, media, gallery thumbnails).
- `src/` — JavaScript only. `main.js` is the entry point.
- `src/templates/catalog/template_NN/` — one self-contained folder per template:
  `layout.js`, `schema.js`, `style.css`, plus its images (`background.*`, `continuation-bg.*`, …).

The backend renders PDFs by importing `src/templates/` directly (`backend/render/render.mjs`),
so keep that path stable and never put base64 data in source files.

Local preview: `python -m http.server 5500` from this folder, then open http://localhost:5500.
