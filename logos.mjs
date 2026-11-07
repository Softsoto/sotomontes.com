// Logos de los proyectos · © 2026 Sebastian Sotomontes
// Genera en assets/icons, con `node logos.mjs`:
//   nombre.svg       logo con fondo, para iconos
//   nombre-line.svg  solo el símbolo, para portadas
import { writeFileSync } from 'node:fs';

// Cada símbolo usa {s} como color. a y b son el degradado del fondo.
const line = (d, w = 4) =>
  `<path d="${d}" fill="none" stroke="{s}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const dot = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="{s}"/>`;
const ring = (cx, cy, r, w = 4) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="{s}" stroke-width="${w}"/>`;
const box = (x, y, w, h, rx = 0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="{s}"/>`;
const oval = (cx, cy, rx, ry, rot = 0) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="{s}" transform="rotate(${rot} ${cx} ${cy})"/>`;

const DARK = '#0d0e11';

export const logos = {
  'pdf-studio': { a: '#ec4fa6', b: '#7c3aed', color: '#ec4fa6',
    art: line('M19 10h17l11 11v33H19z') + line('M36 10v11h11') + line('M25 42c3-7 5 3 8-1s4 2 7 0', 3.5) },
  omnicare: { a: '#4aa3ff', b: '#6d4dff', color: '#5b96ff',
    art: ring(32, 32, 21) + line('M18 32h7l3.5-9 7 18 3.5-9h7', 3.5) },
  'mercado-manager': { a: '#f2a81d', b: '#d9601a', ink: DARK, color: '#f2a81d',
    art: line('M13 13h20l19 19-20 20-19-19z') + dot(24, 24, 3.5) + line('M28 40l9-9M31 31h6v6', 3.5) },
  'hd-guardian': { a: '#2bb6e8', b: '#2c5fe0', color: '#2bb6e8',
    art: line('M32 9l20 7v15c0 12-8 19-20 24-12-5-20-12-20-24V16z') + ring(32, 30, 9, 3.5) + dot(32, 30, 2.5) },
  'ssa-studio': { a: '#1fc8b4', b: '#0b7fc2', color: '#1fc8b4',
    art: line('M16 13h32a4 4 0 0 1 4 4v30a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V17a4 4 0 0 1 4-4z') + dot(32, 27, 6) + '<path d="M29 29l-3 13h12l-3-13z" fill="{s}"/>' },
  transcriptor: { a: '#ff8a3a', b: '#e0362f', color: '#ff7f3a',
    art: line('M11 28v8M18 21v22M25 14v36M32 24v16') + line('M41 23h12M41 32h12M41 41h8') },
  comanda: { a: '#2fd17a', b: '#0d9bb5', color: '#2fd17a',
    art: line('M18 11h28a7 7 0 0 1 7 7v19a7 7 0 0 1-7 7H29L17 54V44a7 7 0 0 1-6-7V18a7 7 0 0 1 7-7z') + line('M22 23l4 4 7-8M38 25h6M22 34h22', 3.5) },
  'crm-personal': { a: '#f8c63c', b: '#ea8a10', ink: DARK, color: '#f5b92a',
    art: line('M15 13h13a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H15a2 2 0 0 1-2-2V15a2 2 0 0 1 2-2z') + line('M36 13h13a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H36a2 2 0 0 1-2-2V15a2 2 0 0 1 2-2z') + line('M15 34h13a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H15a2 2 0 0 1-2-2V36a2 2 0 0 1 2-2z') + dot(42.5, 42.5, 9) },
  squadcats: { a: '#9176ff', b: '#3457e6', color: '#9176ff',
    art: line('M13 12l11 9h16l11-9v24c0 11-8 17-19 17s-19-6-19-17z') + dot(24, 35, 3.5) + dot(40, 35, 3.5) + line('M29 43c2 2 4 2 6 0', 3) },
  'enterprise-sso': { a: '#f7b52c', b: '#e06a12', ink: DARK, color: '#f59e0b',
    art: ring(23, 41, 11) + line('M31 33l20-20M43 21l7 7M36 28l5 5') + dot(23, 41, 3) },
  legionfix: { a: '#16251b', b: '#0a120d', ink: '#3ddc6a', color: '#3ddc6a',
    art: line('M45 11a12 12 0 0 0-14 16L12 46a5 5 0 0 0 7 7l19-19a12 12 0 0 0 16-14l-9 9-7-2-2-7z') },
  'epic-intelligence': { a: '#2a241a', b: '#14110b', ink: '#dcb873', color: '#dcb873',
    art: line('M32 8l21 12v24L32 56 11 44V20z') + line('M23 41v-7M32 41V23M41 41V29') },
  'editor-pdf': { a: '#2dd4bf', b: '#0f8f8a', ink: DARK, color: '#2dd4bf',
    art: line('M18 10h18l11 11v33H18z') + line('M36 10v11h11') + line('M25 31h15M32.5 31v15M28 46h9', 3.5) },
  'cuentas-de-cobro': { a: '#4cc08f', b: '#167a5b', color: '#4cc08f',
    art: line('M15 9h34v45l-6-4-5.500 4-6-4-6 4-5.500-4-5 4z') + line('M39 22c-1-3-4-4-7-4-4 0-7 2-7 5s3 5 7 6 7 3 7 6-3 5-7 5c-3 0-6-1-7-4M32 15v28', 3) },
  'generador-plantillas': { a: '#4ba6ff', b: '#2548c9', color: '#4ba6ff',
    art: line('M25 10h21a4 4 0 0 1 4 4v28') + line('M17 19h20a4 4 0 0 1 4 4v27a4 4 0 0 1-4 4H17a4 4 0 0 1-4-4V23a4 4 0 0 1 4-4z') + line('M21 30h12M21 38h6', 3.5) + box(21, 43, 12, 4, 1) },
  'convertidor-extensiones': { a: '#45c3fa', b: '#1467c8', color: '#45c3fa',
    art: line('M14 30a18 18 0 0 1 32-11M50 34a18 18 0 0 1-32 11') + line('M47 8v11H36M17 56V45h11') + dot(32, 32, 4) },
  'generador-recibos': { a: '#ffa650', b: '#d9441f', ink: DARK, color: '#ffa650',
    art: box(12, 15, 5, 34) + box(21, 15, 2.5, 34) + box(27, 15, 7, 34) + box(38, 15, 2.5, 34) + box(44, 15, 3, 34) + box(50, 15, 3, 34) },
  'comederos-de-las-gatas': { a: '#ff7c9c', b: '#c9367e', color: '#ff7c9c',
    art: oval(32, 42, 13, 10.5) + oval(13.500, 31, 5, 6.500, -20) + oval(24, 19, 5, 7, -8) + oval(40, 19, 5, 7, 8) + oval(50.500, 31, 5, 6.500, 20) },
  'operacion-quilcue': { a: '#b4ef45', b: '#3f9e2c', ink: DARK, color: '#a5e93a',
    art: line('M9 52h17M37 38h18') + line('M17 44c0-22 22-30 30-13', 3.5).replace('stroke-width', 'stroke-dasharray="1 7" stroke-width') + dot(17, 44, 4.5) + line('M47 16l2 5 5 .5-4 3.500 1 5-4-3-4 3 1-5-4-3.500 5-.5z', 2.5) },
  'spex-studio': { a: '#ff5f7c', b: '#b0219e', color: '#ff5f7c',
    art: box(16, 18, 9, 28) + box(7, 27, 27, 10) + box(42, 18, 10, 10) + box(42, 36, 10, 10) + box(52, 27, 6, 10) + box(36, 27, 6, 10) },
  'estacion-diagnostico': { a: '#f5a524', b: '#d9601a', ink: DARK, color: '#f5a524',
    art: line('M11 13h42a3 3 0 0 1 3 3v26a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3V16a3 3 0 0 1 3-3zM24 54h16M32 45v9') + line('M15 29h8l3-7 6 14 3-7h14', 3.5) },
  'generador-informes': { a: '#3fd3bd', b: '#0f7f8f', ink: DARK, color: '#3fd3bd',
    art: line('M20 13h-3a4 4 0 0 0-4 4v33a4 4 0 0 0 4 4h30a4 4 0 0 0 4-4V17a4 4 0 0 0-4-4h-3M23 9h18v9H23z') + line('M23 36l6 6 12-14', 4) },
  'analizador-metadatos': { a: '#34c3a0', b: '#0e7490', ink: DARK, color: '#34c3a0',
    art: line('M38 54H16V10h20l11 11v12M36 10v11h11') + ring(41, 43, 8, 3.5) + line('M47 49l7 7') },
  'dashboard-personal': { a: '#f0b040', b: '#b4581a', ink: DARK, color: '#f0b040',
    art: line('M12 42a20 20 0 1 1 40 0') + line('M32 42l10-13') + dot(32, 42, 4) + line('M12 52h40', 3.5) },
  'extractor-audio': { a: '#f7a23b', b: '#d9391f', color: '#f7a23b',
    art: line('M26 44V16l24-5v28') + ring(19, 44, 7) + ring(43, 39, 7) },
  'telegram-video-saver': { a: '#46b4ee', b: '#1c5fc4', color: '#46b4ee',
    art: line('M14 11h36a4 4 0 0 1 4 4v22a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V15a4 4 0 0 1 4-4z') + '<path d="M27 18l13 8-13 8z" fill="{s}"/>' + line('M32 46v9M26 50l6 6 6-6', 3.5) },
  sotos: { a: '#8fa8ff', b: '#4a35c8', color: '#8fa8ff',
    art: line('M32 8l21 12v24L32 56 11 44V20z') + line('M32 8v24l21 12M32 32L11 44', 3) },
  cinora: { a: '#ff6b81', b: '#a6226c', color: '#ff6b81',
    art: ring(32, 32, 23) + '<path d="M26 20l19 12-19 12z" fill="{s}"/>' },
  'usb-herramientas': { a: '#7fd16b', b: '#1f8a5b', ink: DARK, color: '#7fd16b',
    art: line('M22 28h20v27H22zM26 28V10h12v18') + box(29, 15, 2.500, 5) + box(33, 15, 2.500, 5) + line('M28 38h8', 3.500) },
  'limpiador-metadatos': { a: '#5ad0c8', b: '#17678f', ink: DARK, color: '#5ad0c8',
    art: line('M46 9L26 33') + line('M18 31l16 13-8 11H12l-2-6z') + line('M19 45l-3 10M26 44l-2 10', 3) },
  'amazon-tracker': { a: '#ffb347', b: '#cf5a1e', ink: DARK, color: '#ffb347',
    art: line('M10 12v42h44') + line('M18 20l10 12 8-7 14 17') + line('M42 42h8v-8', 3.500) },
  'ddns-remoto': { a: '#f58a3c', b: '#b63a1c', color: '#f58a3c',
    art: line('M12 11h40a3 3 0 0 1 3 3v24a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3V14a3 3 0 0 1 3-3zM24 53h16M32 41v12') + line('M22 26a10 10 0 0 1 18-5M42 26a10 10 0 0 1-18 5', 3) + line('M41 15v6h-6M23 37v-6h6', 3) },
  'dos-lunas': { a: '#2a2f6e', b: '#0d0e2b', ink: '#ffd27a', color: '#ffd27a',
    art: '<path d="M30 10a17 17 0 1 0 0 34 14 14 0 1 1 0-34z" fill="{s}"/>' + dot(45, 44, 8) + dot(50, 15, 2) + dot(40, 23, 1.500) },
  'avatar-creator': { a: '#ff8f5a', b: '#c7305f', color: '#ff8f5a',
    art: ring(32, 23, 12) + line('M11 55c2-13 11-18 21-18s19 5 21 18') },
};

const svg = (inner, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="${title}">
  <!-- © 2026 Sebastian Sotomontes -->
${inner}
</svg>
`;

for (const [name, l] of Object.entries(logos)) {
  const ink = l.ink ?? '#ffffff';
  const tile = `  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${l.a}"/><stop offset="1" stop-color="${l.b}"/></linearGradient></defs>
  <rect width="64" height="64" rx="15" fill="url(#g)"/>
  ${l.art.replaceAll('{s}', ink)}`;
  writeFileSync(`assets/icons/${name}.svg`, svg(tile, name));
  writeFileSync(`assets/icons/${name}-line.svg`, svg(`  ${l.art.replaceAll('{s}', l.color)}`, name));
}
console.log(`${Object.keys(logos).length} logos`);
