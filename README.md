# Cole Palmer x St Kitts — Landing editorial (Vite + Vanilla JS)

Landing premium editorial, mobile-first, con contenido desacoplado por idioma y partials HTML.

## ✅ Requisitos
- Node.js 18+ recomendado
- npm (incluido con Node)

## 🚀 Instalación rápida (novato)
```bash
npm install
npm run dev
```
Abre la URL que aparece en la terminal (normalmente http://localhost:5173).

## 🏗️ Build de producción
```bash
npm run build
```
La carpeta lista para subir es **`dist/`**.

## 📤 Subir a Hostinger (FTP)
1. Ejecuta `npm run build`.
2. Entra a la carpeta `dist/`.
3. Sube **todo el contenido de `dist/`** a tu hosting por FTP.

## 🌍 Multi-idioma
- Inglés: `/index.html`
- Español: `/es/index.html`

El contenido vive en:
- `src/data/en.json`
- `src/data/es.json`

## 🧩 Estructura de secciones (partials)
- `src/partials/header.html`
- `src/partials/footer.html`
- `src/partials/sections/*.html`

`src/main.js` detecta el idioma, carga el JSON y compone el HTML.

## ✅ Tracking (GTM + GA4 + Search Console)
### Google Tag Manager
1. Reemplaza `GTM-XXXXXXX` en `index.html` y `es/index.html`.
2. Inserta el snippet real de GTM en **head** y el **noscript** en el body.

### GA4 desde GTM (paso a paso)
1. Entra a Google Tag Manager.
2. Crea un **Tag** nuevo: “Google Analytics: GA4 Configuration”.
3. Pega tu **Measurement ID** de GA4.
4. Trigger: **All Pages**.
5. Publica el contenedor.

### Search Console
1. En Search Console, selecciona verificación por **meta tag**.
2. Copia el contenido y reemplaza `SEARCH_CONSOLE_PLACEHOLDER` en `index.html` y `es/index.html`.

## 🖼️ Imágenes y performance
- Usa imágenes en **WebP/AVIF** cuando sea posible.
- Añade `width` y `height` para evitar CLS.
- Todas las imágenes en tarjetas tienen `loading="lazy"`.

## ✅ Checklist rápida (mobile-first)
- Navegación sticky visible y legible.
- CTA principal visible sin scroll.
- Tipografía legible y tamaños con `clamp()`.
- Secciones con buen aire y scroll suave.
- Enlaces externos abren en nueva pestaña.

---

Si necesitas cambiar textos, edita los JSON en `src/data/`.
