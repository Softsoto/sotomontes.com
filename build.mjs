// Genera index.html y sitemap.xml a partir de projects.mjs y look.mjs. Sin dependencias: `node build.mjs`.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { categories, projects } from './projects.mjs';
import { look } from './look.mjs';
import { novedades } from './novedades.mjs';

const SITE = 'https://sotomontes.com';
const GITHUB = 'https://github.com/Softsoto';
const YEAR = 2026;
const description =
  'Portafolio de Sebastian Sotomontes: aplicaciones de escritorio, web, sistemas y juegos. Software que corre en tu equipo, sin servidores ni cuentas.';

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const slug = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
const pad = (n, size = 2) => String(n).padStart(size, '0');

for (const p of projects) {
  if (!look[p.name]) throw new Error(`Falta ${p.name} en look.mjs`);
  if (!novedades[p.name]) throw new Error(`Falta ${p.name} en novedades.mjs`);
}

// Repos que GitHub todavía no ha dejado crear: su botón se activa al publicarlos
const pending = existsSync('pending.json') ? JSON.parse(readFileSync('pending.json', 'utf8')) : [];

const LOGO = `<svg class="logo" viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M4 3h24v8H13v3h15v15H4v-8h15v-3H4z"/></svg>`;

const iconFile = (name) =>
  existsSync(`assets/icons/${name}.svg`) ? `assets/icons/${name}.svg` : `assets/icons/${name}.png`;

const icon = (p) =>
  `<img class="ico" src="${iconFile(look[p.name].icon)}" alt="" width="128" height="128" loading="lazy" decoding="async">`;

const title = (p) => {
  const [a, b] = look[p.name].title.split('|');
  return `${esc(a)}<span class="tone">${esc(b)}</span>`;
};

const media = (p) => {
  if (p.image) {
    return `<img src="assets/img/${esc(p.image)}.jpg" alt="Captura de ${esc(p.name)}" width="800" height="500" loading="lazy" decoding="async">`;
  }
  return `<div class="gen" aria-hidden="true"><img src="assets/icons/${esc(look[p.name].icon)}-line.svg" alt="" width="200" height="200" loading="lazy"></div>`;
};

let counter = 0;
const card = (p) => {
  counter += 1;
  const l = look[p.name];
  const n = novedades[p.name];
  const waiting = p.url && pending.includes(p.url.split('/').pop());
  const link = p.play
    ? `<a class="gh" href="${esc(p.play)}">Jugar ↗</a>`
    : waiting
    ? '<span class="more more-off">Próximamente en GitHub</span>'
    : p.url
    ? `<a class="gh" href="${esc(p.url)}" rel="noopener">Ver en GitHub ↗</a>`
    : `<span class="more more-off">${esc(p.status ?? 'Código privado')}</span>`;
  return `<article class="cell rv" id="${slug(p.name)}" style="--c:${esc(l.color)}">
            <header class="cell-head"><span class="badge">${pad(counter)}</span><span class="kind">${esc(l.kind)}</span><span class="ver">${/^\d/.test(n.version) ? 'v' : ''}${esc(n.version)}</span></header>
            <div class="media">${media(p)}</div>
            <div class="body">
              ${icon(p)}
              <h3>${title(p)}</h3>
              <p>${esc(p.desc)}</p>
              <p class="latest"><b>Novedad</b> ${esc(n.news[0])}</p>
              <ul class="tags">${p.stack.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
              ${link}
            </div>
          </article>`;
};

// Órbitas de la portada: cada anillo lleva varios iconos repartidos en círculo.
const inCat = (id, n) => projects.filter((p) => p.cat === id).slice(0, n);
const orbiters = [...inCat('escritorio', 10), ...inCat('web', 6), ...inCat('juegos', 2)];
const sizes = [5, 6, 7];
const orbit = sizes
  .map((size, ring) => {
    const start = sizes.slice(0, ring).reduce((a, b) => a + b, 0);
    const items = orbiters.slice(start, start + size);
    const arc = look[items[0].name].color;
    const planets = items
      .map((p, i) => {
        const angle = Math.round((360 / size) * i + ring * 24);
        return `<span class="planet" style="--t:${angle}deg;--c:${esc(look[p.name].color)}"><img src="${iconFile(look[p.name].icon)}" alt="" width="128" height="128"></span>`;
      })
      .join('');
    return `<div class="ring ring-${ring + 1}"><svg viewBox="0 0 200 200"><circle class="ring-ticks" cx="100" cy="100" r="99"/><circle class="ring-arc" cx="100" cy="100" r="99" style="stroke:${esc(arc)}" pathLength="360"/></svg>${planets}</div>`;
  })
  .join('\n        ');

const nav = [
  { id: 'inicio', label: 'Inicio' },
  ...categories.map((c) => ({ id: c.id, label: c.label })),
  { id: 'principios', label: 'Principios' },
  { id: 'contacto', label: 'Contacto' },
];
const secNo = (id) => pad(nav.findIndex((n) => n.id === id));

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

  <a class="traveler" href="#inicio" aria-label="Volver al inicio">
    <svg class="traveler-ring" viewBox="0 0 100 100" aria-hidden="true">
      <circle class="traveler-ticks" cx="50" cy="50" r="47"/>
      <circle class="traveler-progress" cx="50" cy="50" r="47" pathLength="100"/>
    </svg>
    ${LOGO}
  </a>

  <section class="sec hero pre" id="inicio" aria-labelledby="t-inicio">
    <div class="orbit" aria-hidden="true">
      <div class="orbit-move">
        ${orbit}
      </div>
    </div>
    <div class="hero-center">
      <div class="hero-slot" aria-hidden="true"></div>
      <h1 id="t-inicio" class="rv">Sebastian <span>Sotomontes</span></h1>
      <p class="hero-sub rv">Software que corre en tu equipo.</p>
      <p class="hero-text rv">Creo aplicaciones de escritorio, web, sistemas y juegos. Me gustan las que funcionan sin servidores ni cuentas, bien diseñadas y pensadas para gente real.</p>
      <div class="actions rv">
        <a class="btn btn-solid" href="#escritorio">Ver los ${projects.length} proyectos</a>
        <a class="btn" href="${GITHUB}" rel="noopener">GitHub ↗</a>
      </div>
    </div>
  </section>

  <div class="page">
    <main class="frame">
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
        <span class="secret-door">© ${YEAR} Sebastian Sotomontes. Todos los derechos reservados.</span>
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
