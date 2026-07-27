// templateGallery.js — GENERIC engine.
// Renders every entry in the registry as a card. Adding/removing a template
// changes nothing here — it just changes what this loop iterates over.

import { TEMPLATE_REGISTRY } from "../templates/registry.js";

export function renderGallery(container, onSelect) {
  container.innerHTML = "";

  TEMPLATE_REGISTRY.forEach((meta) => {
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
    container.appendChild(card);
  });
}
