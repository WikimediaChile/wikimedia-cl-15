import hitosRaw from "./data/hitos.json";
import iconInstitucional from "./assets/icon-institucional.svg";
import iconComunidad from "./assets/icon-comunidad.svg";
import iconInternacional from "./assets/icon-internacional.svg";
import iconGlam from "./assets/icon-glam.svg";
import iconEducacion from "./assets/icon-educacion.svg";
import iconDatos from "./assets/icon-datos.svg";

const iconMap = {
  institucional: iconInstitucional,
  comunidad: iconComunidad,
  internacional: iconInternacional,
  glam: iconGlam,
  educacion: iconEducacion,
  datos: iconDatos,
};

export const hitos = [...hitosRaw].sort((a, b) =>
  a.date.localeCompare(b.date),
).map((hito) => ({
  ...hito,
  icon: iconMap[hito.icon] || iconMap[hito.category] || null,
}));

export function getHitoById(id) {
  return hitos.find((h) => h.id === id);
}

const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

export function formatDate(date) {
  if (!date) return "";
  const [year, month, day] = date.split("-").map(Number);
  const monthName = MONTHS[month - 1];
  if (!monthName) return String(year);
  return day && day !== 1
    ? `${day} de ${monthName} de ${year}`
    : `${monthName} de ${year}`;
}

export function hasAdditionalContent(hito) {
  return Boolean(hito.image || hito.url || hito.youtubeId);
}

export function shouldShowAction(hito, isTruncated) {
  return hasAdditionalContent(hito) || isTruncated;
}

export function getFilteredHitos(filterType, searchQuery, filterCategory) {
  return hitos.filter((hito) => {
    if (filterType && hito.type !== filterType) return false;
    if (filterCategory && hito.category !== filterCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !hito.title.toLowerCase().includes(q) &&
        !hito.body.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });
}
