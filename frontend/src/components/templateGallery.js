// templateGallery.js — GENERIC engine.
// Renders every entry in the registry as a card, plus a category filter bar
// derived automatically from each template's `community` (see registry.js
// getCategories/listCategories). Adding a template with a brand-new
// community value adds a new filter chip by itself — nothing here needs
// editing when the catalog changes.

import { TEMPLATE_REGISTRY, getCategories, listCategories } from "../templates/registry.js";

let activeCategory = "All";

export function renderGallery(container, onSelect) {
  container.innerHTML = "";

  const filterBar = document.createElement("div");
  filterBar.className = "gallery-filters";
  listCategories().forEach((cat) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "filter-chip" + (cat === activeCategory ? " active" : "");
    chip.textContent = cat;
    chip.addEventListener("click", () => {
      activeCategory = cat;
      renderGallery(container, onSelect);
    });
    filterBar.appendChild(chip);
  });
  container.appendChild(filterBar);

  const grid = document.createElement("div");
  grid.className = "gallery-grid";

  const visible =
    activeCategory === "All"
      ? TEMPLATE_REGISTRY
      : TEMPLATE_REGISTRY.filter((meta) => getCategories(meta).includes(activeCategory));

  if (!visible.length) {
    grid.innerHTML = `<div class="gallery-empty">No templates in this category yet.</div>`;
  }

  visible.forEach((meta) => {
    const card = document.createElement("div");
    card.className = "template-card";
    card.innerHTML = `
      <div class="template-card-thumb">
        <img src="${meta.thumbnail}" alt="${meta.name}" onerror="this.style.display='none'; this.parentElement.classList.add('no-thumb');" />
      </div>
      <div class="template-card-body">
        <div class="template-card-name">${meta.name}</div>
        <div class="template-card-community">${meta.community || ""}</div>
        <div class="template-card-desc">${meta.description || ""}</div>
        <button type="button" class="btn btn-primary">Use this template</button>
      </div>
    `;
    card.querySelector("button").addEventListener("click", () => onSelect(meta.id));
    card.querySelector(".template-card-thumb").addEventListener("click", () => onSelect(meta.id));
    grid.appendChild(card);
  });

  container.appendChild(grid);
}