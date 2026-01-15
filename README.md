# Cole Palmer x St Kitts — Landing editorial (Vite + Vanilla JS)

Landing premium editorial, mobile-first, con contenido desacoplado por idioma, partials HTML y un panel **Admin Light** para editar JSON sin recompilar.

## ✅ Requisitos
- Node.js 18+ recomendado (solo para desarrollo con Vite)
- npm (incluido con Node)
- PHP 8+ si quieres usar el panel admin (`/admin.html` + `save-content.php`)

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

> **Nota**: El panel admin usa PHP, por lo que **no funciona dentro de `dist/`**. Si necesitas Admin Light en producción, despliega el proyecto con PHP (no solo archivos estáticos) y conserva `admin.html`, `admin.js`, `save-content.php` y la carpeta `data/`.

## 📤 Subir a Hostinger (FTP)
1. Ejecuta `npm run build`.
2. Entra a la carpeta `dist/`.
3. Sube **todo el contenido de `dist/`** a tu hosting por FTP.

Si quieres usar Admin Light en el hosting:
- Sube también `admin.html`, `admin.js`, `save-content.php` y la carpeta `data/` al mismo nivel que tu `index.html`.
- Asegúrate de que el hosting soporte PHP y tenga permisos de escritura en `data/`.

## 🌍 Multi-idioma
- Inglés: `/index.html`
- Español: `/es/index.html`

El contenido vive en:
- `data/en.json`
- `data/es.json`

`src/main.js` detecta el idioma, carga el JSON y compone el HTML.

## 🧩 Estructura de secciones (partials)
- `src/partials/header.html`
- `src/partials/footer.html`
- `src/partials/sections/*.html`

## ✅ Admin Light (editar contenido sin recompilar)
Ruta: `/admin.html`

### Qué puedes editar
- Hero (title, subtitle, CTA)
- Chapters 01–05
- Things To Do (lista de items visibles; **sin Romance ni Rum Master**)
- Links del menú (labels y URLs)

### Cómo cambiar la contraseña
1. Abre `/generate-password.php` en el navegador (en un entorno seguro).
2. Genera el hash SHA-256 con tu nueva contraseña.
3. Pega el hash en `config.php` en la constante `ADMIN_PASSWORD_HASH`.

#### Cambios futuros de contraseña
- Repite el proceso con `generate-password.php`.
- Sustituye el hash en `config.php`.

### Backups de JSON
Cada guardado crea un backup automático en `data/backups/`.

### Advertencias de seguridad
- Admin Light es **minimalista**: usa hash SHA-256 y validación básica.
- Úsalo solo en entornos con HTTPS y acceso restringido.
- Considera mover el admin detrás de autenticación adicional en producción.

## 🎨 Logo y tipografías
- El logo principal vive en `public/logo.svg`.
- En `index.html` y `es/index.html` debes reemplazar `your-kit-id` con tu **Adobe Fonts Kit ID**.
- Asegúrate de incluir la familia **Komu New** en el kit para los títulos.

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

Si necesitas cambiar textos, edita los JSON en `data/`.
