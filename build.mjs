// Genera index.html y sitemap.xml a partir de projects.mjs y look.mjs. Sin dependencias: `node build.mjs`.
import { writeFileSync } from 'node:fs';
import { categories, projects } from './projects.mjs';
import { look } from './look.mjs';

const SITE = 'https://sotomontes.com';
const GITHUB = 'https://github.com/Softsoto';
const YEAR = 2026;
const description =
  'Portafolio de Sebastian Sotomontes: aplicaciones de escritorio, web y juegos. Software que corre en tu equipo, sin servidores ni cuentas.';

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const slug = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
const pad = (n, size = 2) => String(n).padStart(size, '0');

for (const p of projects) {
  if (!look[p.name]) throw new Error(`Falta ${p.name} en look.mjs`);
}

const LOGO = `<svg class="logo" viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M4 3h24v8H13v3h15v15H4v-8h15v-3H4z"/></svg>`;

const icon = (p) => {
  const l = look[p.name];
  return l.icon
    ? `<img class="ico" src="assets/icons/${esc(l.icon)}.png" alt="" width="128" height="128" loading="lazy" decoding="async">`
    : `<span class="ico ico-mono" aria-hidden="true">${esc(l.mono)}</span>`;
};

const title = (p) => {
  const [a, b] = look[p.name].title.split('|');
  return `${esc(a)}<span class="tone">${esc(b)}</span>`;
};

const media = (p) => {
  if (p.image) {
    return `<img src="assets/img/${esc(p.image)}.jpg" alt="Captura de ${esc(p.name)}" width="800" height="500" loading="lazy" decoding="async">`;
  }
  const letter = p.name.replace(/^Operación /, '').charAt(0);
  return `<div class="gen" aria-hidden="true"><span>${esc(letter)}</span></div>`;
};

let counter = 0;
const card = (p) => {
  counter += 1;
  const l = look[p.name];
  const link = p.url
    ? `<a class="more" href="${esc(p.url)}" rel="noopener">Ver código ↗</a>`
    : `<span class="more more-off">${esc(p.status ?? 'Código privado')}</span>`;
  return `<article class="cell rv" id="${slug(p.name)}" style="--c:${esc(l.color)}">
            <header class="cell-head"><span class="badge">${pad(counter)}</span><span class="kind">${esc(l.kind)}</span></header>
            <div class="media">${media(p)}</div>
            <div class="body">
              ${icon(p)}
              <h3>${title(p)}</h3>
              <p>${esc(p.desc)}</p>
              <ul class="tags">${p.stack.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
              ${link}
            </div>
          </article>`;
};

const wall = projects
  .filter((p) => look[p.name].icon || p.name === 'Operación Quilcue')
  .slice(0, 16)
  .map(
    (p) => `<li><a href="#${slug(p.name)}" style="--c:${esc(look[p.name].color)}">${icon(p)}<span>${esc(p.name)}</span></a></li>`,
  )
  .join('\n            ');

const nav = [
  { id: 'inicio', label: 'Inicio' },
  ...categories.map((c) => ({ id: c.id, label: c.label })),
  { id: 'principios', label: 'Principios' },
  { id: 'contacto', label: 'Contacto' },
];
const secNo = (id) => pad(nav.findIndex((n) => n.id === id) + 1);

const sections = categories
  .map((c) => {
    const items = projects.filter((p) => p.cat === c.id);
    return `<section class="sec" id="${c.id}" aria-labelledby="t-${c.id}">
        <div class="sec-head"><span>${secNo(c.id)} / ${esc(c.label)}</span><span>${items.length} proyectos</span></div>
        <h2 class="sec-title rv" id="t-${c.id}">${esc(c.title)}</h2>
        <div class="cells cells-${items.length === 2 ? 'two' : 'three'}">
          ${items.map(card).join('\n          ')}
        </div>
      </section>`;
  })
  .join('\n      ');

const principles = [
  ['Local primero', 'La mayoría de mis apps guarda todo en tu equipo y funciona sin servidores ni cuentas.'],
  ['Tus archivos son tuyos', 'Las herramientas web procesan los documentos en el navegador. Nada se sube.'],
  ['La herramienta correcta', 'C#, Rust, Python, TypeScript o Unity: uso lo que cada problema pide.'],
  ['Datos reales', 'Lo que ves en pantalla es lo que pasa en tu equipo. Nada de cifras de adorno.'],
  ['Para gente real', 'Problemas concretos: cobrar, administrar un edificio, vender en línea.'],
  ['Diseño con cuidado', 'Una herramienta también se juzga por cómo se siente al usarla.'],
]
  .map(
    ([t, d], i) => `<article class="rule rv"><span class="rule-no">${pad(i + 1)}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></article>`,
  )
  .join('\n          ');

const ticks = Array.from({ length: 41 }, (_, i) => {
  const value = i * 2.5;
  const major = i % 4 === 0;
  return `<i class="${major ? 'major' : ''}" style="top:${value}%">${major && value > 0 ? `<b>${value}</b>` : ''}</i>`;
}).join('');

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
  <meta name="color-scheme" content="dark">
  <meta name="theme-color" content="#0d0e11">
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
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@125,600;125,800&family=Instrument+Sans:wght@400;600&family=JetBrains+Mono:wght@400;500&display=swap">
  <link rel="stylesheet" href="assets/styles.css">
  <script>document.documentElement.classList.add('js')</script>
  <script type="application/ld+json">${jsonLd}</script>
</head>
<body>
  <a class="skip" href="#escritorio">Saltar a los proyectos</a>

  <header class="bar">
    <a class="bar-logo" href="#inicio" aria-label="Sebastian Sotomontes, inicio">${LOGO}</a>
    <nav class="bar-nav" aria-label="Secciones">
      ${nav.map((n) => `<a href="#${n.id}" data-nav="${n.id}">${esc(n.label)}</a>`).join('\n      ')}
    </nav>
    <a class="bar-cta" href="${GITHUB}" rel="noopener me">GitHub ↗</a>
    <span class="bar-progress" aria-hidden="true"></span>
  </header>

  <aside class="rail">
    <nav aria-label="Índice">
      <ol class="rail-list">
        ${nav.map((n) => `<li data-rail="${n.id}"><a href="#${n.id}">${esc(n.label)}</a></li>`).join('\n        ')}
        <li class="rail-gap" aria-hidden="true"></li>
      </ol>
    </nav>
    <div class="ruler" aria-hidden="true">${ticks}<span class="ruler-mark"><em>000%</em></span></div>
  </aside>

  <div class="page">
    <main class="frame">
      <section class="sec hero" id="inicio" aria-labelledby="t-inicio">
        <div class="sec-head"><span>${secNo('inicio')} / Sebastian Sotomontes</span><span>${projects.length} proyectos · Escritorio, web y juegos</span></div>
        <div class="hero-grid">
          <div class="hero-copy">
            <h1 id="t-inicio" class="rv">Sebastian <span>Sotomontes</span></h1>
            <p class="hero-sub rv">Software que corre en tu equipo.</p>
            <p class="hero-text rv">Creo aplicaciones de escritorio, web y juegos. Me gustan las que funcionan sin servidores ni cuentas, bien diseñadas y pensadas para gente real.</p>
            <div class="actions rv">
              <a class="btn btn-solid" href="#escritorio">Ver proyectos</a>
              <a class="btn" href="${GITHUB}" rel="noopener">GitHub ↗</a>
            </div>
          </div>
          <ul class="wall rv" aria-label="Algunos proyectos">
            ${wall}
          </ul>
        </div>
      </section>

      ${sections}

      <section class="sec" id="principios" aria-labelledby="t-principios">
        <div class="sec-head"><span>${secNo('principios')} / Principios</span><span>Lo que comparten todos</span></div>
        <h2 class="sec-title rv" id="t-principios">Hecho <span class="accent">a mi manera.</span></h2>
        <div class="cells cells-three">
          ${principles}
        </div>
      </section>

      <section class="sec closing" id="contacto" aria-labelledby="t-contacto">
        <div class="sec-head"><span>${secNo('contacto')} / Contacto</span><span>GitHub</span></div>
        <div class="closing-body">
          <h2 class="rv" id="t-contacto">¿Quieres ver <span class="accent">más?</span></h2>
          <p class="rv">La mayoría del código es privado. Con gusto doy acceso de solo lectura a quien quiera revisarlo.</p>
          <a class="btn btn-solid rv" href="${GITHUB}" rel="noopener">Ir a GitHub ↗</a>
        </div>
      </section>

      <footer class="foot">
        <span>© ${YEAR} Sebastian Sotomontes. Todos los derechos reservados.</span>
        <span>Las capturas usan modos demo o datos de ejemplo.</span>
      </footer>
    </main>
  </div>
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
