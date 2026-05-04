/**
 * generate-static.mjs
 * Génère un index.html valide pour hébergement mutualisé (Hostinger)
 * à partir du manifest Vite. À exécuter après `npm run build`.
 *
 * Usage: node scripts/generate-static.mjs
 * Output: dist/client/index.html + dist/client/.htaccess
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const MANIFEST_PATH = resolve(ROOT, "dist/server/.vite/manifest.json");
const CLIENT_DIR = resolve(ROOT, "dist/client");

if (!existsSync(MANIFEST_PATH)) {
  console.error("❌ Manifest introuvable. Lancez d'abord : npm run build");
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf-8"));

// Trouver le CSS principal
const cssFile = Object.values(manifest).find(
  (e) => e.file && e.file.endsWith(".css")
)?.file;

// Trouver le JS principal (point d'entrée du router)
const mainJs = Object.values(manifest).find(
  (e) => e.isEntry && e.file && e.file.includes("router")
)?.file ?? Object.values(manifest).find(
  (e) => e.isEntry && e.file && e.file.endsWith(".js")
)?.file;

// Lire le CSS des assets client
const clientCssFiles = [];
if (existsSync(resolve(CLIENT_DIR, "assets"))) {
  const { readdirSync } = await import("fs");
  const files = readdirSync(resolve(CLIENT_DIR, "assets"));
  files.filter(f => f.endsWith(".css")).forEach(f => clientCssFiles.push(`assets/${f}`));
}

// Trouver le JS principal côté client
const clientJsFiles = [];
if (existsSync(resolve(CLIENT_DIR, "assets"))) {
  const { readdirSync } = await import("fs");
  const files = readdirSync(resolve(CLIENT_DIR, "assets"));
  // Le bundle principal est le plus gros fichier JS (le router)
  const jsFiles = files.filter(f => f.endsWith(".js") && !f.includes("worker"));
  // On cherche index- (entry point client)
  const mainEntry = jsFiles.find(f => f.startsWith("index-") && !f.includes("CN23") && !f.includes("BQD"));
  if (mainEntry) clientJsFiles.push(`assets/${mainEntry}`);
  // Ajouter aussi les chunks de départ
  jsFiles.filter(f => f.startsWith("index-")).forEach(f => {
    if (!clientJsFiles.includes(`assets/${f}`)) clientJsFiles.push(`assets/${f}`);
  });
}

const html = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Men of Grace — Maison de tailleur</title>
    <meta name="description" content="Costumes sur-mesure, mariage et executive. Façonnés à la main. Livraison internationale." />
    ${clientCssFiles.map(f => `<link rel="stylesheet" href="/${f}" />`).join("\n    ")}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500&family=Inter:wght@200;300;400;500&display=swap" />
  </head>
  <body>
    <div id="root"></div>
    ${clientJsFiles.map(f => `<script type="module" src="/${f}"></script>`).join("\n    ")}
  </body>
</html>`;

writeFileSync(resolve(CLIENT_DIR, "index.html"), html);
console.log("✅ index.html généré dans dist/client/");

// Générer le .htaccess pour le routing SPA (Apache / Hostinger)
const htaccess = `Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [QSA,L]

# Cache des assets statiques
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Compression Gzip
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>
`;

writeFileSync(resolve(CLIENT_DIR, ".htaccess"), htaccess);
console.log("✅ .htaccess généré dans dist/client/");

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 DÉPLOIEMENT HOSTINGER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Uploadez TOUT le contenu de dist/client/ dans public_html/
2. Vérifiez que index.html et .htaccess sont bien à la racine
3. Activez mod_rewrite dans Hostinger si besoin
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
