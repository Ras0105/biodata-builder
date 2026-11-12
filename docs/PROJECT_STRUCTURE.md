# Biodata Builder — project structure

This replaces the old `docs/project structure.md`, which described the original
resume-builder layout (`resume_template.html`, `payment.py` doing signature
verification, a single `script.js`, …) and no longer matches the code.

## 1. Repository layout

```
biodata-builder/
├── frontend/                 static site, deployed to Vercel (no build step)
├── backend/                  FastAPI service, deployed to Railway (Docker)
├── docs/                     PROJECT_STRUCTURE.md (this file), CHANGES.md, ...
├── tools/
│   └── restructure_frontend.py   the migration that produced this layout
├── .dockerignore             keeps the Docker build context small
└── .gitignore
```

The Docker build context is still the **repo root** (`docker build -f backend/Dockerfile .`),
because `backend/render/render.mjs` imports `frontend/src/templates/` directly.
That path is deliberately unchanged.

### backend/ (structure unchanged — shown for reference)

```
backend/
├── app/
│   ├── main.py  config.py  database.py  models.py  schemas.py
│   ├── templates_registry.py        VALID_TEMPLATE_IDS (must match the frontend registry)
│   ├── routers/    orders.py  webhooks.py  downloads.py
│   └── services/   payment.py  pdf_generator.py  pdf_pipeline.py  storage.py  email.py
├── render/render.mjs                ★ updated — see section 3
├── Dockerfile  requirements.txt  .env.example  README.md
```

### frontend/ (new)

```
frontend/
├── index.html
├── vercel.json                  headers + caching rules (updated)
├── package.json                 {"type":"module"} — lets Node (render.mjs) import src/ files
├── legal/                       privacy, terms, refund, contact pages
│
├── css/                         ← was one 1,869-line style.css; same rules, same order
│   ├── 01-base.css              theme tokens, buttons, header/nav/mobile menu
│   ├── 02-hero.css              hero, trust chips, logo ring
│   ├── 03-landing.css           features, how-it-works, gallery, preference form
│   ├── 04-builder.css           builder, fullscreen preview, responsive layout
│   ├── 05-preview-extras.css    user-added sections/photos/pages, overflow polish
│   ├── 06-footer.css            footer, back-to-top
│   └── 07-pages-widgets.css     legal pages, report-issue, contact, confirm gate
│                                (numbers = load order; the cascade depends on it)
├── assets/                      ← static files only; nothing here is code
│   ├── brand/                   logo mark, logo banner, watermark logo
│   ├── media/                   dark.mp4, light.mp4 (hero)
│   └── thumbnails/              template_01.webp … template_29.webp (600px wide)
│
└── src/                         ← JavaScript only
    ├── main.js                  entry point (index.html loads this)
    ├── core/                    api.js · state.js · theme.js
    ├── modals/                  report-issue.js · preference-form.js
    ├── components/              templateGallery · formRenderer · livePreview · checkout · sharePreview
    └── templates/
        ├── registry.js          the ONE file edited when a template is added/removed
        ├── themes.js            colours/fonts for user-added pages (6 KB, was 9.5 MB)
        ├── dynamicExtras.js  schemaUtils.js  canonicalFields.js     generic engine
        └── catalog/
            └── template_NN/
                ├── layout.js            HTML for the page
                ├── schema.js            sections/fields
                ├── style.css            plain CSS, a few KB
                ├── background.<ext>     page-1 background        (was base64 inside style.css)
                ├── continuation-bg.<ext> page-2+ background     (was base64 inside themes.js)
                └── frame.png            template_06 only         (was base64 inside layout.js)
```

## 2. What was wrong and what changed

| Problem | Evidence | Fix |
|---|---|---|
| Images embedded as base64 in CSS | 13 template `style.css` files held a full-page image each; `template_25/style.css` was **4.2 MB**, `template_28` 2.7 MB | Images are real files next to the template. CSS now says `url('./background.png')`. Catalog CSS total: 10.0 MB → **0.1 MB** |
| `themes.js` was 9.5 MB | Held a *second, different* set of 13 base64 backgrounds (continuation pages). Not the same bytes as the CSS ones | Extracted to `continuation-bg.*`; `themes.js` builds the URL with `new URL(..., import.meta.url)`. 9.5 MB → **6.5 KB** |
| Inline PNG in `template_06/layout.js` | 40 KB base64 frame | `frame.png` |
| 63 MB of 3–4 MB PNG gallery thumbnails | 29 thumbnails, up to 4.3 MB each, all loaded on the landing page | 600 px WebP, **1.0 MB total** (max 0.1 MB each) |
| Everything dumped in `src/` and `src/assets/` | code, videos, logos and thumbnails mixed | `assets/` (static) vs `src/` (code) vs `css/` |
| One 1,869-line `style.css` | — | 7 ordered partials, split only at top-level section comments; verified lossless |
| Loose modules in `src/` | `api.js`, `state.js`, `theme.js`, `report-issue.js`, `preference-form.js` beside `main.js` | `src/core/`, `src/modals/`; every import rewritten |
| Stray files | empty `src/file`, `catalog/template_02.zip`, orphan `catalog/template_01/themes.js` (imported by nothing), `template_26/bg.png` + `bg2.png` (referenced nowhere) | Removed from the tree, parked in `_removed_review/` — delete once you've looked |
| `vercel.json` cache rules pointed at `/script.js` | that file doesn't exist | Rules now target `css/`, `src/*.js`, `assets/`, template images |

**Result:** frontend 65.5 MB → 23.2 MB; largest source file 9.5 MB → 30 KB (`main.js`).
Every `.js`, `.css` and `.html` file is now small enough to paste into a chat.

Behaviour on the user's side is unchanged: same API calls, same `schema` / `form_data`
payload to `/api/create-order`, same hash routing. The database, models and webhook
flow are not touched.

## 3. Backend changes

**Required — 1 file: `backend/render/render.mjs`** (replacement provided).

Why: the PDF is produced by `Node → HTML string → Playwright page.set_content()`. That
page has no base URL, so a file path such as `./background.png` would fail to load and
the PDF would silently come out **without its background**. The updated script converts
every image reference back into a `data:` URI before the HTML leaves Node:

* relative `url(...)` in the template's `style.css` → resolved against the template folder
* `file://` URLs that `themes.js` / `template_06/layout.js` produce under Node → read from disk

If an image file is missing, `render.mjs` now **exits non-zero** instead of emitting a
broken page, so `pdf_pipeline.py` marks the order `FAILED` and logs it, rather than
delivering a paid PDF with no background.

**Not required:** `pdf_generator.py`, `pdf_pipeline.py`, `models.py`, `schemas.py`, routers,
`templates_registry.py` and the Dockerfile are unchanged. The Dockerfile already copies
`frontend/src/templates`, which is where the images now live.

**Recommended housekeeping**

* Add the provided `.dockerignore` (excludes `frontend/assets`, `.git`, local `.env`, …).
  The image only needs `frontend/package.json` and `frontend/src/templates`.
* `backend/README.md` still says "24 templates"; there are 29 (`VALID_TEMPLATE_IDS` is already `1..29`).
* Replace the old `docs/project structure.md` with this file.

## 4. Rules going forward

* **No base64 in source files.** Images go next to their template (or in `assets/`) and are
  referenced by path. A template image must be `.png/.jpg/.jpeg/.webp/.gif/.svg`
  (those are the types `render.mjs` inlines).
* **Template CSS:** reference images as `url('./file.ext')` — relative to the CSS file.
* **Template JS (layout/themes):** use `new URL("./file.ext", import.meta.url).href`,
  not a hand-written `/src/...` path, so it works in both the browser and Node.
* **Adding template #30:** create `catalog/template_30/{layout.js,schema.js,style.css,background.*}`,
  add one entry to `registry.js`, add `assets/thumbnails/template_30.webp`, and bump
  `range(1, 30)` in `backend/app/templates_registry.py`. Nothing else.
* **New global CSS:** add to the partial that matches, or a new `NN-name.css` — and add the
  `<link>` to `index.html` **and** the four `legal/*.html` pages (they load the same set, in order).
* Keep template images **same-origin** (they are, on Vercel); the share/preview feature uses
  html2canvas, which would need CORS headers for images served from another domain.

## 5. Applying it to your repo

```bash
git checkout -b restructure-frontend
git rm -r frontend                      # old tree
cp -r <package>/frontend .              # new tree
cp <package>/backend/render/render.mjs backend/render/render.mjs
cp <package>/.dockerignore .
cp <package>/docs/PROJECT_STRUCTURE.md docs/ && git rm "docs/project structure.md"
git add -A && git commit -m "Restructure frontend: extract base64 images, split CSS, group modules"
```

Then, before merging: run **one real order in Razorpay test mode** on a template that has
a background (e.g. 25 or 28) and on one with extra pages, and eyeball the PDF.
Vercel needs no config change (root directory stays `frontend/`).

Your old images remain in git **history**, so the repository itself stays large. To shrink
it, `git filter-repo` can purge them — optional, rewrites history, not needed for anything above.

If you have newer frontend commits than the zip I received, re-run the migration on them
instead: `python tools/restructure_frontend.py <old_frontend> <new_frontend> <review_dir>`.

## 6. How this was verified

* **PDF HTML is byte-identical.** For all 29 templates I rendered a 2-page payload (so
  `themes.js` backgrounds are exercised) with the *original* code + *original* `render.mjs`
  and with the *new* code + *new* `render.mjs`: 29 / 29 outputs identical.
* `style.css` partials concatenated equal the original file byte for byte.
* 289 static references (imports, `new URL`, `url()`, `src`/`href`, registry paths) all resolve;
  `node --check` passes on every JS file; no `base64,` and no `src/assets` remain.
* Real Chromium run of the restructured site: 29 thumbnails + logos load, 7 stylesheets apply,
  template 01 / 25 backgrounds and the template 06 frame load from files, continuation
  backgrounds return 200, legal pages work — **0 page errors, 0 failed requests**.
* A missing image makes `render.mjs` fail loudly (tested).

**Not tested:** the actual Playwright PDF print and the Razorpay/Vercel deployment — I have no
access to your live environment. Image bytes are untouched, so I expect no difference, but see
the test-order step above.

## 7. Deliberately left alone

* `src/main.js` (30 KB) is still one file. It's now small enough to share, but it mixes
  navigation, phone validation, hero videos and routing; splitting it safely needs a browser
  test pass per feature, so I didn't do it blind.
* `core/theme.js` also contains `initBackToTop`; the name is misleading but renaming touches
  the legal pages too. Easy follow-up.
* `template_26` reuses template_25's class names (`bd-template25`). Harmless today
  (only one template stylesheet is loaded at a time) but worth renaming eventually.
* Background images were extracted **losslessly**. `template_25` (4.2 MB PNG) and `template_28`
  (2.7 MB PNG) could be recompressed, but that changes PDF output, so it should be a visual decision.
