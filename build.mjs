// Genera index.html y sitemap.xml a partir de projects.mjs. Sin dependencias: `node build.mjs`.
import { writeFileSync } from 'node:fs';
import { categories, projects } from './projects.mjs';

const SITE = 'https://sotomontes.com';
const GITHUB = 'https://github.com/Softsoto';
const YEAR = 2026;
const description =
  'Portafolio de Sebastian Sotomontes: aplicaciones de escritorio, web y utilidades que funcionan en tu equipo, sin servidores ni cuentas.';

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const cover = (p) =>
  p.image
    ? `<img src="assets/img/${esc(p.image)}.jpg" alt="Captura de ${esc(p.name)}" width="800" height="500" loading="lazy" decoding="async">`
    : `<div class="poster poster-${esc(p.cover ?? 'ink')}" aria-hidden="true"><span>${esc(p.name)}</span></div>`;

const card = (p) => {
  const meta = p.url
    ? `<a class="tag tag-link" href="${esc(p.url)}" rel="noopener">Ver código ↗</a>`
    : `<span class="tag">${esc(p.status ?? 'Código privado')}</span>`;
  return `<li class="card">
          <div class="cover">${cover(p)}</div>
          <h3>${esc(p.name)}</h3>
          <p>${esc(p.desc)}</p>
          <div class="meta"><span class="stack">${p.stack.map(esc).join(' · ')}</span>${meta}</div>
        </li>`;
};

const sections = categories
  .map((c) => {
    const items = projects.filter((p) => p.cat === c.id);
    return `<section class="group" data-cat="${c.id}" aria-labelledby="t-${c.id}">
      <header class="group-head">
        <h2 id="t-${c.id}">${esc(c.title)}</h2>
        <span class="count">${items.length}</span>
      </header>
      <ul class="grid">
        ${items.map(card).join('\n        ')}
      </ul>
    </section>`;
  })
  .join('\n    ');

const filters = [{ id: 'todos', label: 'Todos' }, ...categories]
  .map(
    (c, i) =>
      `<button type="button" data-filter="${c.id}" aria-pressed="${i === 0}">${esc(c.label)}</button>`,
  )
  .join('\n        ');

const jsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Sebastian Sotomontes',
  url: SITE,
  sameAs: [GITHUB],
  jobTitle: 'Desarrollador de software',
});

const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sebastian Sotomontes · Desarrollador de software</title>
  <meta name="description" content="${esc(description)}">
  <meta name="author" content="Sebastian Sotomontes">
  <meta name="color-scheme" content="light dark">
  <link rel="canonical" href="${SITE}/">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${SITE}/">
  <meta property="og:title" content="Sebastian Sotomontes · Desarrollador de software">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${SITE}/assets/og.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Instrument+Sans:wght@400;600&family=JetBrains+Mono:wght@400&display=swap">
  <link rel="stylesheet" href="assets/styles.css">
  <script type="application/ld+json">${jsonLd}</script>
</head>
<body>
  <a class="skip" href="#proyectos">Saltar a los proyectos</a>
  <header class="hero">
    <p class="eyebrow">Desarrollador de software</p>
    <h1>Sebastian<br>Sotomontes</h1>
    <p class="lead">Creo aplicaciones de escritorio, web y utilidades. Me gustan las que funcionan en tu propio equipo, sin servidores ni cuentas, bien diseñadas y pensadas para gente real.</p>
    <nav class="actions" aria-label="Principal">
      <a class="btn btn-solid" href="#proyectos">Ver los ${projects.length} proyectos</a>
      <a class="btn" href="${GITHUB}" rel="noopener me">GitHub ↗</a>
    </nav>
  </header>

  <main id="proyectos">
    <div class="toolbar">
      <p>La mayoría del código es privado. Las capturas son de modos demo o datos de ejemplo.</p>
      <div class="filters" role="group" aria-label="Filtrar proyectos">
        ${filters}
      </div>
    </div>
    ${sections}
  </main>

  <footer class="foot">
    <p>© ${YEAR} Sebastian Sotomontes. Todos los derechos reservados.</p>
    <a href="${GITHUB}" rel="noopener">github.com/Softsoto</a>
  </footer>
  <script src="assets/site.js" defer></script>
</body>
</html>
`;

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE}/</loc><lastmod>${today}</lastmod></url>
</urlset>
`;

writeFileSync('index.html', html);
writeFileSync('sitemap.xml', sitemap);
console.log(`index.html: ${projects.length} proyectos`);
