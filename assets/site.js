const root = document.documentElement;
const hero = document.querySelector('.hero');
const slot = document.querySelector('.hero-slot');
const traveler = document.querySelector('.traveler');
const orbitMove = document.querySelector('.orbit-move');
const rings = [...document.querySelectorAll('.ring')];
const mark = document.querySelector('.ruler-mark');
const markText = mark?.querySelector('em');
const ruler = document.querySelector('.ruler');
const progress = document.querySelector('.bar-progress');
const sections = [...document.querySelectorAll('.sec[id]')];
const railItems = [...document.querySelectorAll('[data-rail]')];
const railGap = document.querySelector('.rail-gap');
const navLinks = [...document.querySelectorAll('[data-nav]')];
const calm = matchMedia('(prefers-reduced-motion: reduce)');
const wide = matchMedia('(min-width: 1280px)');

// Aparición al entrar en pantalla
const reveal = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        reveal.unobserve(entry.target);
      }
    });
  },
  { rootMargin: '0px 0px -8% 0px' },
);

// Índice de secciones
function setActive(id) {
  const index = railItems.findIndex((li) => li.dataset.rail === id);
  railItems.forEach((li, i) => {
    li.classList.toggle('on', i === index);
    li.style.order = i <= index ? 0 : 2;
  });
  if (railGap) railGap.style.order = 1;
  navLinks.forEach((a) => a.classList.toggle('on', a.dataset.nav === id));
}

// Dónde debe estar el círculo: empieza en la portada y termina recorriendo la regla
let intro = !calm.matches;
function placeTraveler(p) {
  const slotBox = slot.getBoundingClientRect();
  const size = slotBox.width;
  const startX = slotBox.left + size / 2;
  const startY = intro ? innerHeight / 2 : slotBox.top + size / 2 + scrollY;

  let endX;
  let endY;
  let endSize;
  if (wide.matches && ruler) {
    const box = ruler.getBoundingClientRect();
    endX = box.right - 24;
    endY = box.top + box.height * p;
    endSize = 40;
  } else {
    endX = innerWidth - 38;
    endY = innerHeight - 38;
    endSize = 48;
  }

  const t = Math.min(1, scrollY / (innerHeight * 0.75));
  const ease = t * t * (3 - 2 * t);
  const x = startX + (endX - startX) * ease;
  const y = (startY - scrollY) * (1 - ease) + endY * ease;
  const scale = (size + (endSize - size) * ease) / 96;
  traveler.style.transform = `translate(${x}px, ${y}px) scale(${intro ? scale * 1.5 : scale})`;
  traveler.style.setProperty('--done', (p * 100).toFixed(1));
  traveler.style.setProperty('--spin', `${scrollY * 0.25}deg`);
}

let current = '';
function update() {
  const max = root.scrollHeight - innerHeight;
  const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
  mark?.style.setProperty('--p', p);
  progress?.style.setProperty('--p', p);
  if (markText) markText.textContent = `${String(Math.round(p * 100)).padStart(3, '0')}%`;
  placeTraveler(p);

  if (!calm.matches && scrollY < innerHeight * 1.2) {
    orbitMove.style.setProperty('--drop', `${scrollY * 0.55}px`);
    orbitMove.style.setProperty('--grow', (1 + scrollY / innerHeight / 3).toFixed(3));
  }

  const line = innerHeight * 0.35;
  let id = sections[0].id;
  sections.forEach((s) => {
    if (s.getBoundingClientRect().top <= line) id = s.id;
  });
  if (p > 0.995) id = sections[sections.length - 1].id;
  if (id !== current) {
    current = id;
    setActive(id);
  }
}

// Las órbitas giran solas y también con el scroll, solo mientras se ven
const speeds = [3.2, -2.1, 1.4];
const scrollTurn = [0.09, -0.06, 0.04];
let heroVisible = true;
new IntersectionObserver(([entry]) => {
  heroVisible = entry.isIntersecting;
  if (heroVisible) requestAnimationFrame(spin);
}).observe(hero);

let last = performance.now();
let elapsed = 0;
function spin(now) {
  elapsed += Math.min(0.1, (now - last) / 1000);
  last = now;
  rings.forEach((ring, i) => {
    ring.style.setProperty('--a', `${(elapsed * speeds[i] + scrollY * scrollTurn[i]).toFixed(2)}deg`);
  });
  if (heroVisible && !calm.matches) requestAnimationFrame(spin);
}

let queued = false;
function queue() {
  if (!queued) {
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      update();
    });
  }
}
addEventListener('scroll', queue, { passive: true });
addEventListener('resize', queue);

// Entrada: el logo aparece solo y luego se abren las órbitas y el texto
function start() {
  hero.classList.remove('pre');
  document.querySelectorAll('.rv').forEach((el) => reveal.observe(el));
  traveler.classList.add('gliding');
  intro = false;
  update();
  setTimeout(() => traveler.classList.remove('gliding'), 950);
}

update();
requestAnimationFrame(spin);
if (calm.matches || scrollY > 10) start();
else setTimeout(start, 900);
