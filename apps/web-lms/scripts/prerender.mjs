// Genera HTML estático real para las rutas públicas conocidas.
//
// Por qué: esto es una SPA (Vite + React Router) en GitHub Pages. GitHub
// Pages no tiene servidor propio, así que las rutas que no son un archivo
// real (p.ej. /privacidad) se resuelven copiando dist/index.html a
// dist/404.html — funciona para un visitante real (el JS carga y React
// Router pinta la página correcta), pero el status HTTP sigue siendo 404
// ("soft 404"), lo cual Google Search Console marca como roto y penaliza
// en la indexación. Además, el HTML que le llega a cualquier bot es una
// cáscara vacía sin contenido real hasta que se ejecuta el JS.
//
// Este script arranca un servidor local que imita ese mismo comportamiento
// de GitHub Pages (servir index.html para cualquier ruta desconocida),
// visita cada ruta pública real con un navegador headless, espera a que
// React la pinte del todo, y guarda el HTML ya renderizado en
// dist/<ruta>/index.html. GitHub Pages sirve esos archivos directamente
// con un 200 real y contenido real, sin pasar por el truco del 404.
//
// Rutas deliberadamente NO incluidas: /cursos, /mi-area, /login dependen
// de un backend real (que no está desplegado, ver CLAUDE.md) y ya están
// bloqueadas en robots.txt — prerenderizarlas mostraría datos vacíos/rotos
// como si fueran el contenido real.
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer";

const DIST = path.resolve(import.meta.dirname, "..", "dist");
const PORT = 4399;
// Con barra final en las legales: GitHub Pages redirige (301) /privacidad
// -> /privacidad/ antes de servir el index.html de esa carpeta, así que la
// URL final real siempre lleva barra — generar el snapshot ya desde esa
// ruta evita que el <link rel="canonical"> capturado apunte a la URL que
// redirige en vez de a la que responde 200 directamente.
const ROUTES = ["/", "/privacidad/", "/aviso-legal/", "/cookies/", "/accesibilidad/"];

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".txt": "text/plain",
  ".xml": "application/xml",
};

async function startServer() {
  const server = createServer(async (req, res) => {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    const filePath = path.join(DIST, urlPath);
    const candidate = urlPath === "/" ? path.join(DIST, "index.html") : filePath;
    const target = existsSync(candidate) && !candidate.endsWith(path.sep)
      ? candidate
      : path.join(DIST, "index.html"); // fallback SPA, igual que 404.html en producción
    try {
      const body = await readFile(target);
      res.writeHead(200, { "Content-Type": MIME[path.extname(target)] || "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(404);
      res.end();
    }
  });
  await new Promise((resolve) => server.listen(PORT, "127.0.0.1", resolve));
  return server;
}

async function main() {
  const server = await startServer();
  // Sin executablePath: usa el Chrome que gestiona el propio paquete
  // `puppeteer` (descargado por `npx puppeteer browsers install chrome`,
  // ver el paso equivalente en deploy-landing.yml). CHROME_PATH permite
  // apuntar a un binario de sistema si hiciera falta.
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    headless: "new",
    args: ["--no-sandbox"],
  });

  try {
    for (const route of ROUTES) {
      const page = await browser.newPage();
      await page.goto(`http://127.0.0.1:${PORT}${route}`, { waitUntil: "networkidle0", timeout: 30000 });
      // Deja que las transiciones de framer-motion terminen antes de capturar.
      await new Promise((r) => setTimeout(r, 800));
      const html = await page.evaluate((port) => {
        // Componentes con lazy() + Suspense (p.ej. ChatWidget) disparan su
        // import() nada más montar, aunque nadie interactúe con ellos — el
        // navegador inserta entonces un <link rel="modulepreload"> con URL
        // ABSOLUTA a este mismo servidor temporal (127.0.0.1:<port>) en
        // <head>. Si eso se guarda tal cual, cualquier otro origen (el test
        // local en otro puerto, o uclcampus.com real) intenta precargar
        // desde un host que no existe ahí y la CSP lo bloquea. El import()
        // real de todos modos usa una ruta relativa y sigue funcionando -
        // esto es solo la etiqueta de precarga, se puede quitar sin riesgo.
        const prefix = `http://127.0.0.1:${port}/`;
        document.querySelectorAll(`link[rel="modulepreload"][href^="${prefix}"]`).forEach((el) => el.remove());
        return "<!doctype html>\n" + document.documentElement.outerHTML;
      }, PORT);
      await page.close();

      const outDir = route === "/" ? DIST : path.join(DIST, route);
      await mkdir(outDir, { recursive: true });
      await writeFile(path.join(outDir, "index.html"), html);
      console.log(`prerender: ${route} -> ${path.relative(DIST, path.join(outDir, "index.html"))}`);
    }
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error("prerender failed:", err);
  process.exit(1);
});
