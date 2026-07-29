import "./style.css";
import { hitos } from "./data.js";
import { initDialog, openDialogById } from "./dialog.js";
import { initFilters } from "./filters.js";

const timelineEl = document.querySelector("#timeline");

function groupByYear(items) {
  const map = {};
  items.forEach((h) => {
    const y = h.date.slice(0, 4);
    if (!map[y]) map[y] = [];
    map[y].push(h);
  });
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
}

function buildSpinePath(positions, centerX, yearMarkers) {
  if (positions.length === 0 && yearMarkers.length === 0) return "";

  const allY = [];
  for (const ym of yearMarkers) allY.push(ym.y);
  for (const p of positions) allY.push(p.y);
  if (allY.length < 2) return "";

  allY.sort((a, b) => a - b);

  let d = `M ${centerX} ${allY[0]}`;
  for (let i = 1; i < allY.length; i++) {
    d += ` L ${centerX} ${allY[i]}`;
  }

  for (const p of positions) {
    d += ` M ${centerX} ${p.y} L ${p.x} ${p.y}`;
  }

  return d;
}

function renderTimeline() {
  const oldSvg = document.querySelector("#road");
  if (oldSvg) oldSvg.remove();
  const oldContainer = document.querySelector("#timeline-items");
  if (oldContainer) oldContainer.remove();
  const currentMin = timelineEl.style.minHeight;
  if (currentMin) timelineEl.style.minHeight = "";

  const roadWidth = timelineEl.offsetWidth;
  const centerX = roadWidth / 2;
  const yearGroups = groupByYear(hitos);
  const ITEM_W = 600;
  const MARKER_HALF = 44;
  const GAP = 27;
  const YEAR_PILL_H = 60;
  const YEAR_GAP = 64;
  const BASE_GAP = 60;
  const TOP_PAD = 120;

  const itemsContainer = document.createElement("div");
  itemsContainer.id = "timeline-items";
  itemsContainer.classList.add("timeline-items");
  timelineEl.appendChild(itemsContainer);

  const measureEl = document.createElement("div");
  measureEl.style.cssText = "position:fixed;left:-9999px;top:0;visibility:hidden";
  document.body.appendChild(measureEl);

  let globalIndex = 0;
  let cursorY = TOP_PAD;
  const yearMarkers = [];
  const positions = [];
  const cardFragments = [];

  yearGroups.forEach(([year, group]) => {
    yearMarkers.push({ y: cursorY + YEAR_PILL_H / 2, year });

    cursorY += YEAR_PILL_H + YEAR_GAP;

    const yearLabel = document.createElement("div");
    yearLabel.className = "year-label";
    yearLabel.textContent = year;
    itemsContainer.appendChild(yearLabel);

    group.forEach((hito) => {
      const side = globalIndex % 2 === 0 ? "item-left" : "item-right";
      const markerX = side === "item-left"
        ? centerX - MARKER_HALF - GAP - 130
        : centerX + MARKER_HALF + GAP + 130;

      const tempCard = document.createElement("article");
      tempCard.className = "card";
      tempCard.style.position = "static";
      tempCard.style.width = "260px";
      tempCard.innerHTML = `
        <h3 class="title">${hito.title}</h3>
        <p class="description">${hito.body}</p>
        <button class="hito-action" type="button" data-hito-id="${hito.id}">Ver hito</button>
      `;
      measureEl.appendChild(tempCard);
      const cardHeight = tempCard.offsetHeight;
      measureEl.removeChild(tempCard);

      const item = document.createElement("div");
      item.className = `timeline-item ${side}`;
      item.style.left = `${markerX - ITEM_W / 2}px`;
      item.style.top = `${cursorY}px`;
      item.dataset.id = hito.id;

      item.innerHTML = `
        <span class="marker">
          ${hito.icon ? `<img class="marker-icon" src="${hito.icon}" alt="" />` : ""}
        </span>
        <article class="card">
          <h3 class="title">${hito.title}</h3>
          <p class="description">${hito.body}</p>
          <button class="hito-action" type="button" data-hito-id="${hito.id}">Ver hito</button>
        </article>
      `;

      positions.push({
        x: markerX,
        y: cursorY + MARKER_HALF,
      });

      itemsContainer.appendChild(item);

      cursorY += cardHeight + BASE_GAP;
      globalIndex++;
    });
  });

  document.body.removeChild(measureEl);

  const totalHeight = cursorY + 160;
  timelineEl.style.minHeight = `${totalHeight}px`;

  const timelineRect = timelineEl.getBoundingClientRect();
  const markerEls = itemsContainer.querySelectorAll(".marker");
  const actualPositions = [...markerEls].map((marker) => {
    const rect = marker.getBoundingClientRect();
    return {
      x: rect.left - timelineRect.left + rect.width / 2,
      y: rect.top - timelineRect.top + rect.height / 2,
    };
  });

  const svgNS = "http://www.w3.org/2000/svg";

  const svg = document.createElementNS(svgNS, "svg");
  svg.id = "road";
  svg.classList.add("timeline-road");
  svg.setAttribute("preserveAspectRatio", "xMinYMin meet");
  svg.setAttribute("viewBox", `0 0 ${roadWidth} ${totalHeight}`);

  const glowEl = document.createElementNS(svgNS, "path");
  glowEl.classList.add("timeline-glow");
  glowEl.setAttribute("fill", "none");
  glowEl.setAttribute("stroke", "var(--color-accent-blue)");
  glowEl.setAttribute("stroke-width", "24");
  glowEl.setAttribute("opacity", "0.08");
  glowEl.setAttribute("stroke-linecap", "round");
  glowEl.setAttribute("stroke-linejoin", "round");

  const pathEl = document.createElementNS(svgNS, "path");
  pathEl.classList.add("timeline-path");
  const pathData = buildSpinePath(actualPositions, centerX, yearMarkers);
  pathEl.setAttribute("d", pathData);
  glowEl.setAttribute("d", pathData);

  svg.appendChild(glowEl);
  svg.appendChild(pathEl);

  const extraG = document.createElementNS(svgNS, "g");

  yearMarkers.forEach(({ y, year }) => {
    const rx = 14;
    const ry = 14;
    const pw = 110;
    const ph = YEAR_PILL_H;
    const px = centerX - pw / 2;
    const py = y - ph / 2;

    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("x", px);
    rect.setAttribute("y", py);
    rect.setAttribute("width", pw);
    rect.setAttribute("height", ph);
    rect.setAttribute("rx", rx);
    rect.setAttribute("ry", ry);
    rect.setAttribute("fill", "var(--color-brand)");
    rect.setAttribute("opacity", "0.85");
    extraG.appendChild(rect);

    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", centerX);
    text.setAttribute("y", py + ph / 2);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "central");
    text.setAttribute("fill", "var(--color-base)");
    text.setAttribute("font-weight", "800");
    text.setAttribute("font-size", "20");
    text.textContent = year;
    extraG.appendChild(text);
  });

  svg.appendChild(extraG);
  timelineEl.prepend(svg);

  observeItems();
  scheduleRedraw();
}

function scheduleRedraw() {
  let timer;
  const breakpoint = 768;
  window.addEventListener("resize", () => {
    clearTimeout(timer);
    if (window.innerWidth <= breakpoint) return;
    timer = setTimeout(renderTimeline, 180);
  });
}

function observeItems() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.2 },
  );

  document.querySelectorAll(".timeline-item").forEach((item) => observer.observe(item));
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

  const params = new URLSearchParams(window.location.search);
  const hitoId = params.get("hito");
  if (hitoId) {
    setTimeout(() => openDialogById(hitoId), 600);
  }
  document.body.style.opacity = "1";
}

initApp();
