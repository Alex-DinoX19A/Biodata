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

/* ---------- Animasi saat elemen masuk ke layar ---------- */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(
    '.section__title, .section__lead, .about > *, .panel__title--center, .chips .chip, #kontak .actions, .contact-alt'
  ).forEach((element) => {
    element.classList.add('reveal');
    revealObserver.observe(element);
  });
}

/* ---------- Tahun footer ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ==========================================================
   Animasi tambahan bertema 8-bit
   (dekorasi dibuat lewat JS, jadi isi HTML tetap sama)
   ========================================================== */

function buatEl(tag, className, parent) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (parent) parent.appendChild(node);
  return node;
}

/* ---------- Bilah progres scroll (melangkah per 1/40, gaya piksel) ---------- */
(function progresScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const bar = buatEl('div', 'px-progress', navbar);
  bar.setAttribute('aria-hidden', 'true');

  function perbarui() {
    const maks = document.documentElement.scrollHeight - window.innerHeight;
    const rasio = maks > 0 ? window.scrollY / maks : 0;
    bar.style.transform = 'scaleX(' + (Math.round(rasio * 40) / 40).toFixed(3) + ')';
  }

  let menunggu = false;
  window.addEventListener('scroll', () => {
    if (menunggu) return;
    menunggu = true;
    requestAnimationFrame(() => {
      perbarui();
      menunggu = false;
    });
  }, { passive: true });
  window.addEventListener('resize', perbarui);
  perbarui();
})();

/* ---------- Kilat singkat saat ganti tema ---------- */
if (!reduceMotion) {
  themeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const kilat = buatEl('div', 'px-flash', document.body);
      kilat.setAttribute('aria-hidden', 'true');
      kilat.addEventListener('animationend', () => kilat.remove());
    });
  });
}

/* Sisanya hanya jalan jika pengguna tidak meminta gerak dikurangi */
if (!reduceMotion) {
  /* ---------- Bintang piksel + meteor ---------- */
  const lapisan = buatEl('div', 'px-bg', document.body);
  lapisan.setAttribute('aria-hidden', 'true');

  const jumlahBintang = window.innerWidth < 768 ? 24 : 44;
  const ukuranBintang = [4, 4, 4, 8];
  const warnaBintang = ['a', 'b', 'c'];

  for (let i = 0; i < jumlahBintang; i += 1) {
    const bintang = buatEl('span', 'px-star px-star--' + warnaBintang[i % 3], lapisan);
    const ukuran = ukuranBintang[Math.floor(Math.random() * ukuranBintang.length)];
    bintang.style.left = (Math.random() * 100).toFixed(1) + '%';
    bintang.style.top = (Math.random() * 100).toFixed(1) + '%';
    bintang.style.width = ukuran + 'px';
    bintang.style.height = ukuran + 'px';
    bintang.style.animationDelay = (Math.random() * 4).toFixed(2) + 's';
    bintang.style.animationDuration = (2 + Math.random() * 3).toFixed(2) + 's';
  }

  function luncurkanMeteor() {
    if (!document.hidden) {
      const meteor = buatEl('span', 'px-meteor', lapisan);
      meteor.style.top = (Math.random() * 45).toFixed(1) + '%';
      meteor.style.left = (30 + Math.random() * 60).toFixed(1) + '%';
      meteor.addEventListener('animationend', () => meteor.remove());
    }
    setTimeout(luncurkanMeteor, 4000 + Math.random() * 5000);
  }
  setTimeout(luncurkanMeteor, 2500);

  /* ---------- Slime piksel melompat di dasar hero ---------- */
  const hero = document.querySelector('.hero');
  if (hero) {
    // o = badan, h = kilau, e = mata
    const slime = [
      '...oooo...',
      '..ohoooo..',
      '.oooooooo.',
      '.ooeooeoo.',
      'oooeooeooo',
      '.oooooooo.'
    ];
    const warna = { e: 'var(--bg)', h: 'var(--fg)', o: 'var(--accent-2)' };
    const urutan = ['e', 'h', 'o']; // yang pertama tampil paling atas
    const bayangan = [];
    urutan.forEach((kode) => {
      slime.forEach((baris, y) => {
        [...baris].forEach((sel, x) => {
          if (sel === kode) bayangan.push((x * 4) + 'px ' + (y * 4) + 'px 0 ' + warna[kode]);
        });
      });
    });

    const sprite = buatEl('div', 'px-sprite', hero);
    sprite.setAttribute('aria-hidden', 'true');
    const lompat = buatEl('div', 'px-sprite__hop', sprite);
    const piksel = buatEl('div', 'px-sprite__pix', lompat);
    piksel.style.boxShadow = bayangan.join(',');
  }

  /* ---------- Judul hero diketik huruf demi huruf ---------- */
  const judul = document.querySelector('.hero__title');
  if (judul) {
    const teks = judul.textContent;
    judul.setAttribute('aria-label', teks);
    judul.textContent = '';
    const huruf = [...teks].map((ch) => {
      const span = buatEl('span', 'tw', judul);
      span.textContent = ch;
      span.setAttribute('aria-hidden', 'true');
      return span;
    });

    let i = 0;
    const ketik = () => {
      if (i > 0) huruf[i - 1].classList.remove('tw--kursor');
      if (i >= huruf.length) return;
      huruf[i].classList.add('tw--on', 'tw--kursor');
      i += 1;
      if (i === huruf.length) {
        const terakhir = huruf[i - 1];
        setTimeout(() => terakhir.classList.remove('tw--kursor'), 2200);
        return;
      }
      setTimeout(ketik, 85);
    };
    setTimeout(ketik, 500);
  }

  /* ---------- Ledakan piksel saat klik ---------- */
  document.addEventListener('click', (e) => {
    if (e.detail === 0) return; // klik dari keyboard, lewati
    const jumlah = 8;
    for (let i = 0; i < jumlah; i += 1) {
      const p = buatEl('span', 'px-burst', document.body);
      const sudut = (Math.PI * 2 / jumlah) * i + Math.random() * 0.4;
      const jarak = 28 + Math.random() * 26;
      p.style.left = e.clientX + 'px';
      p.style.top = e.clientY + 'px';
      p.style.background = i % 2 ? 'var(--accent-2)' : 'var(--accent)';
      p.style.setProperty('--dx', Math.round(Math.cos(sudut) * jarak) + 'px');
      p.style.setProperty('--dy', Math.round(Math.sin(sudut) * jarak) + 'px');
      p.setAttribute('aria-hidden', 'true');
      p.addEventListener('animationend', () => p.remove());
    }
  });
}
