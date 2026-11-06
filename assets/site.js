const buttons = document.querySelectorAll('[data-filter]');
const groups = document.querySelectorAll('.group');

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
    groups.forEach((g) => {
      g.hidden = filter !== 'todos' && g.dataset.cat !== filter;
    });
  });
});
