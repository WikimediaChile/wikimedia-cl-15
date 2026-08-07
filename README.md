# Wikimedia Chile — 15 años

Micrositio conmemorativo por los 15 años de Wikimedia Chile. Línea de tiempo interactiva con hitos, trazado SVG y búsqueda/filtros.

## Stack

- [Vite](https://vitejs.dev/) — bundler y dev server
- [Tailwind CSS v4](https://tailwindcss.com/) — utilidades CSS
- Vanilla JS (ESM) — sin framework

## Requisitos

- Node.js >= 20.19 o >= 22.12
- `pnpm`


## Desarrollo

```bash
pnpm install
pnpm run dev
```

Abrir `http://localhost:5173` en el navegador.

```bash
pnpm run dev --host   # para acceder desde otros dispositivos
```

## Build

```bash
pnpm run build
pnpm run preview
```
Clonar el repositorio:

```bash
git clone https://github.com/WikimediaChile/wikimedia-cl-15.git
cd wikimedia-cl-15
pnpm install
pnpm run dev
```

## Estructura

```text
.
├── index.html
├── package.json
├── vite.config.js
├── public/
│   ├── Wikimedia-logo.svg
│   ├── favicon.png
│   └── A_view_towards_Torres_Del_Paine.jpg
└── src/
    ├── main.js              # Punto de entrada e inicialización
    ├── data.js              # Carga y procesamiento de hitos
    ├── filters.js           # Búsqueda y filtros
    ├── dialog.js            # Modal con <dialog>
    ├── svg.js               # Trazado SVG de la línea de tiempo
    ├── style.css            # Punto de entrada CSS
    ├── data/
    │   └── hitos.json       # Fuente de datos de los hitos
    ├── styles/
    │   ├── theme.css        # Variables de diseño
    │   ├── base.css         # Reset y tipografía
    │   ├── layout.css       # Layout general
    │   ├── header.css       # Header
    │   ├── hero.css         # Hero con numeral "15"
    │   ├── footer.css       # Footer
    │   ├── timeline.css     # Línea de tiempo y tarjetas
    │   └── dialog.css       # Panel modal
    └── assets/
        ├── icon-*.svg       # Íconos por categoría
        └── ornamento-*.svg  # Decoraciones del hero
```

## Funcionalidades

- Línea de tiempo interactiva con trazado SVG.
- Búsqueda de hitos por texto.
- Filtro por categoría: Institucional, Comunidad, Internacional, GLAM, Educación y Datos.
- Filtro para mostrar hitos con contenido adicional.
- Diálogo con información ampliada de cada hito.
- Enlaces directos a hitos mediante el parámetro `?hito=id`.
- Soporte para imágenes, enlaces externos y videos de YouTube.
- Diseño responsivo para escritorio y dispositivos móviles.
- Modo claro y oscuro.
