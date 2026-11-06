const root = document.documentElement;
const mark = document.querySelector('.ruler-mark');
const markText = mark?.querySelector('em');
const progress = document.querySelector('.bar-progress');
const sections = [...document.querySelectorAll('.sec[id]')];
const railItems = [...document.querySelectorAll('[data-rail]')];
const railGap = document.querySelector('.rail-gap');
const navLinks = [...document.querySelectorAll('[data-nav]')];

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
document.querySelectorAll('.rv').forEach((el) => reveal.observe(el));

// Regla de progreso e índice
function setActive(id) {
  const index = railItems.findIndex((li) => li.dataset.rail === id);
  railItems.forEach((li, i) => {
    li.classList.toggle('on', i === index);
    li.style.order = i <= index ? 0 : 2;
  });
  if (railGap) railGap.style.order = 1;
  navLinks.forEach((a) => a.classList.toggle('on', a.dataset.nav === id));
}

let queued = false;
let current = '';
function update() {
  queued = false;
  const max = root.scrollHeight - innerHeight;
  const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
  mark?.style.setProperty('--p', p);
  progress?.style.setProperty('--p', p);
  if (markText) markText.textContent = `${String(Math.round(p * 100)).padStart(3, '0')}%`;

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

function queue() {
  if (!queued) {
    queued = true;
    requestAnimationFrame(update);
  }
}
addEventListener('scroll', queue, { passive: true });
addEventListener('resize', queue);
update();
