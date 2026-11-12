'use strict';

const root = document.documentElement;
const menu = document.getElementById('menu');
const menuBtn = document.getElementById('menu-btn');
const themeBtns = document.querySelectorAll('[data-tema]');

/* ---------- Tema ---------- */
function setTheme(name) {
  root.dataset.theme = name;
  themeBtns.forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.tema === name));
  });
  try {
    localStorage.setItem('tema', name);
  } catch (e) {
    /* penyimpanan tidak tersedia, abaikan */
  }
}

themeBtns.forEach((btn) => {
  btn.addEventListener('click', () => setTheme(btn.dataset.tema));
});

setTheme(root.dataset.theme);

/* ---------- Menu mobile ---------- */
function setMenu(open) {
  menu.classList.toggle('is-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
}

menuBtn.addEventListener('click', () => {
  setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
});

// Tutup menu setelah memilih tautan atau menekan Escape
menu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setMenu(false);
});

window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => {
  if (e.matches) setMenu(false);
});

/* ---------- Tahun footer ---------- */
document.getElementById('year').textContent = new Date().getFullYear();
