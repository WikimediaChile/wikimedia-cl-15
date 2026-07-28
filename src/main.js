import "./style.css";
import { hitos } from "./data.js";
import { initSVG, renderPath } from "./svg.js";
import { initDialog, openDialogById } from "./dialog.js";
import { initFilters, renderActions } from "./filters.js";

const timelineEl = document.querySelector("#timeline");

function renderTimeline() {
  timelineEl.innerHTML = hitos
    .map((hito, index) => {
      const layout = index % 2 === 0 ? "left" : "right";

      return `
   <li class="hito hito--${layout}"
    data-id="${hito.id}"
    data-type="${hito.type ?? ""}"
    data-category="${hito.category}"
    >
      <span class="hito-marker">
        ${hito.icon ? `<img class="hito-marker-icon" src="${hito.icon}" alt="" aria-hidden="true" />` : ""}
      </span>

      <article class="hito-card">
        <span class="hito-year">${hito.date.slice(0, 4)}</span>
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
  // renderPath();
}

function renderAfterAnimations() {
  const cards = document.querySelectorAll(".hito-card");
  if (cards.length === 0) {
    setTimeout(() => renderPath(), 100);
    return;
  }

  let pending = cards.length;
  cards.forEach((card) => {
    card.addEventListener(
      "animationend",
      () => {
        pending--;
        if (pending === 0) renderPath();
      },
      { once: true },
    );
  });
}

function initTheme() {
  const html = document.documentElement;
  const saved = localStorage.getItem("theme");
  if (saved === "light") html.setAttribute("data-theme", "light");

  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const isLight = html.getAttribute("data-theme") === "light";
    if (isLight) {
      html.removeAttribute("data-theme");
      localStorage.setItem("theme", "dark");
    } else {
      html.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  });
}

function initApp() {
  initTheme();
  renderTimeline();

  initDialog();
  initFilters();

  initResizeHandler();
  initAnimations();

  renderAfterAnimations();

  const params = new URLSearchParams(window.location.search);
  const hitoId = params.get("hito");
  if (hitoId) {
    setTimeout(() => openDialogById(hitoId), 600);
  }
  document.body.style.opacity = "1";
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
