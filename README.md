# St. Kitts Landing (Administrable)

Este proyecto está pensado para Hostinger Business con soporte Node.js. La opción más simple y compatible con tu hosting es **Express.js** (ya incluido en el proyecto), porque:

- Permite servir el sitio estático desde `/public`.
- Gestiona el registro del newsletter con persistencia en `data/newsletter.json`.
- Expone un panel simple en `/admin` para ver suscriptores.

## Stack recomendado (en Hostinger)
- **Express.js** (actualmente implementado).

También podrías migrar a React/Vite o Next.js si quieres un CMS más avanzado, pero para el objetivo de “landing + newsletter administrable”, Express es la ruta más directa y liviana.

## Instalación local
1. Instala dependencias:
   ```bash
   npm install
   ```
2. Inicia el servidor:
   ```bash
   npm start
   ```
3. Accede:
   - Sitio: `http://localhost:3000/`
   - Admin: `http://localhost:3000/admin`

## Instalación en Hostinger (paso a paso)
1. Sube estos archivos/carpetas:
   - `public/`
   - `data/newsletter.json`
   - `server.js`
   - `package.json`
2. En el panel de Hostinger, configura Node.js:
   - **Entry point:** `server.js`
   - **Root:** carpeta del proyecto
3. Instala dependencias:
   ```bash
   npm install
   ```
4. Inicia o reinicia el servicio Node.js.
5. Verifica:
   - `https://tudominio.com/`
   - `https://tudominio.com/admin`
