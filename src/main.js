import "./style.css";
import { hitos, formatDate } from "./data.js";
import { initSVG, renderPath } from "./svg.js";
import { initDialog, openDialogById } from "./dialog.js";
import { initFilters, renderActions } from "./filters.js";

const timelineEl = document.querySelector("#timeline");

const CATEGORY_COLORS = {
  institucional: "purple",
  comunidad: "purple",
  internacional: "blue",
  educacion: "blue",
  glam: "green",
  datos: "green",
};

const CATEGORY_ACCENTS = {
  purple: { accent: "var(--color-accent-purple)", text: "var(--color-accent-purple)" },
  green: { accent: "var(--color-accent-green)", text: "var(--color-accent-green-text)" },
  blue: { accent: "var(--color-accent-blue)", text: "var(--color-accent-blue)" },
};

function getCategoryColor(category) {
  return CATEGORY_COLORS[category] || "blue";
}

function renderTimeline() {
  const layoutPattern = ["center", "left", "right"];
  timelineEl.innerHTML = hitos
    .map((hito, index) => {
      const layout = layoutPattern[index % layoutPattern.length];
      const markerPosition = layout === "center" ? "hito--marker-bottom" : "";
      const accent = CATEGORY_ACCENTS[getCategoryColor(hito.category)];

      return `
   <li class="hito hito--${layout}${markerPosition ? ` ${markerPosition}` : ""}"
    data-id="${hito.id}"
    data-type="${hito.type ?? ""}"
    data-category="${hito.category}"
    data-color="${getCategoryColor(hito.category)}"
    style="--x-offset: ${hashOffset(hito.id)}px; --accent: ${accent.accent}; --accent-text: ${accent.text}"
    >
      <span class="hito-marker">
        ${hito.icon ? `<img class="hito-marker-icon" src="${hito.icon}" alt="" aria-hidden="true" />` : ""}
      </span>

      <article class="hito-card">
        <span class="hito-year">${formatDate(hito.date)}</span>
        <h3 class="hito-title">${hito.title}</h3>
        <p class="hito-body">${hito.body}</p>

        <div class="hito-actions"></div>
      </article>
    </li>
  `;
    })
    .join("");

  renderActions();
  initSVG(timelineEl);
  renderPath();
}

function initApp() {
  initTheme();

  renderTimeline();

  initDialog();
  initFilters();

  initResizeHandler();
  initAnimations();

  const params = new URLSearchParams(window.location.search);
  const hitoId = params.get("hito");
  if (hitoId) {
    setTimeout(() => openDialogById(hitoId), 600);
  }
  document.body.style.opacity = "1";
}

function initTheme() {
  const saved = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
  document.getElementById("theme-toggle")?.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
}

function hashOffset(id, range = 30) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % (range * 2)) - range;
}

function initAnimations() {
  document.querySelectorAll(".hito").forEach((el, i) => {
    el.style.setProperty("--delay", `${i * 60}ms`);
    el.classList.add("hito--visible");
  });
}

function initResizeHandler() {
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(renderPath, 100);
  });
}



initApp();
