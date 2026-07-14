/* =========================================================
   PANDUAN CEPAT UNTUK PEMULA 🎯
   File ini mengatur SEMUA interaktivitas & efek suara.
   - Musik latar & sound effect ada di folder assets/audio/
   - Kalau mau ganti musik, tinggal ganti file bg-music.mp3
     dengan nama file yang sama (atau ubah path di bawah).
========================================================= */

// ============ 0. SISTEM SUARA (musik latar + sound effect) ============
const sfxClick = new Audio('assets/audio/sfx-click.mp3');
const sfxHover = new Audio('assets/audio/sfx-hover.mp3');
const sfxSuccess = new Audio('assets/audio/sfx-success.mp3');
const sfxWhoosh = new Audio('assets/audio/sfx-whoosh.mp3');
const bgMusic = new Audio('assets/audio/bg-music.mp3');

bgMusic.loop = true;
bgMusic.volume = 0.35;
sfxHover.volume = 0.5;
sfxClick.volume = 0.6;
sfxSuccess.volume = 0.6;
sfxWhoosh.volume = 0.5;

let soundEnabled = true;
let musicStarted = false;

// Fungsi pemutar SFX aman (klon audio biar bisa tumpang tindih)
function playSfx(audioEl) {
  if (!soundEnabled) return;
  const clone = audioEl.cloneNode();
  clone.volume = audioEl.volume;
  clone.play().catch(() => {});
}

// Browser modern memblokir autoplay suara sebelum ada interaksi user.
// Jadi musik baru mulai diputar begitu user pertama kali klik apa saja.
function startMusicOnce() {
  if (musicStarted || !soundEnabled) return;
  bgMusic.play().then(() => {
    musicStarted = true;
    document.querySelectorAll('.music-player').forEach(p => p.classList.add('playing'));
  }).catch(() => {});
}

document.addEventListener('click', startMusicOnce, { once: true });

// ============ 1. TOMBOL TOGGLE MUSIK (widget mengambang) ============
const musicPlayer = document.getElementById('musicPlayer');
const musicToggleBtn = document.getElementById('musicToggleBtn');

if (musicToggleBtn) {
  musicToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playSfx(sfxClick);

    if (bgMusic.paused) {
      bgMusic.play().catch(() => {});
      musicPlayer.classList.add('playing');
      musicToggleBtn.textContent = '⏸';
      musicStarted = true;
    } else {
      bgMusic.pause();
      musicPlayer.classList.remove('playing');
      musicToggleBtn.textContent = '▶';
    }
  });
}

// ============ 2. TOMBOL MUTE SEMUA SUARA (di navbar) ============
const soundToggle = document.getElementById('soundToggle');

if (soundToggle) {
  soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggle.classList.toggle('muted', !soundEnabled);
    soundToggle.textContent = soundEnabled ? '🔊' : '🔇';

    if (!soundEnabled) {
      bgMusic.pause();
      if (musicPlayer) musicPlayer.classList.remove('playing');
      if (musicToggleBtn) musicToggleBtn.textContent = '▶';
    } else {
      bgMusic.play().catch(() => {});
      if (musicPlayer) musicPlayer.classList.add('playing');
      if (musicToggleBtn) musicToggleBtn.textContent = '⏸';
      musicStarted = true;
    }
  });
}

// ============ 3. SOUND EFFECT UNTUK SEMUA TOMBOL & LINK INTERAKTIF ============
// Setiap elemen dengan class ini otomatis dapat suara klik + hover + efek ripple
const elemenBersuara = document.querySelectorAll(
  '.btn, .filter-btn, .contact-method-card, .gallery-item, .lightbox-close, .lightbox-nav, .tool-item, .chip'
);

elemenBersuara.forEach(el => {
  el.addEventListener('mouseenter', () => playSfx(sfxHover));

  el.addEventListener('click', (e) => {
    playSfx(sfxClick);

    // Efek ripple lingkaran menyebar dari titik klik
    if (getComputedStyle(el).position === 'static') {
      el.style.position = 'relative';
    }
    el.style.overflow = el.style.overflow || 'hidden';

    const rect = el.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height) * 2;
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
});

// ============ 4. MENU HAMBURGER (MOBILE) ============
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');

if (burger) {
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    playSfx(sfxClick);
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

// ============ 5. CURSOR GLOW MENGIKUTI MOUSE ============
const cursorGlow = document.querySelector('.cursor-glow');

if (cursorGlow && window.matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  });
} else if (cursorGlow) {
  cursorGlow.style.display = 'none';
}

// ============ 6. PARTIKEL MENGAMBANG DI SELURUH HALAMAN ============
const particlesContainer = document.querySelector('.particles');

if (particlesContainer) {
  const warnaPartikel = ['#c9a24b', '#2a9d8f', '#a78bfa', '#5cb3e0'];
  const jumlahPartikel = window.innerWidth < 768 ? 14 : 26;

  for (let i = 0; i < jumlahPartikel; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const ukuran = Math.random() * 5 + 2;
    p.style.width = ukuran + 'px';
    p.style.height = ukuran + 'px';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.background = warnaPartikel[Math.floor(Math.random() * warnaPartikel.length)];
    p.style.boxShadow = `0 0 ${ukuran * 2}px ${p.style.background}`;
    p.style.animationDuration = (Math.random() * 12 + 10) + 's';
    p.style.animationDelay = (Math.random() * 12) + 's';
    particlesContainer.appendChild(p);
  }
}

// ============ 7. SCROLL PROGRESS BAR ============
const scrollProgress = document.getElementById('scrollProgress');

if (scrollProgress) {
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = pct + '%';
  });
}

// ============ 8. ANIMASI MUNCUL SAAT DI-SCROLL ============
const elemenUntukAnimasi = document.querySelectorAll(
  '.card, .reveal, .reveal-left, .reveal-right, .reveal-scale, .timeline-item, .project-card, .gallery-item'
);

elemenUntukAnimasi.forEach(el => {
  if (!el.classList.contains('reveal-left') && !el.classList.contains('reveal-right') && !el.classList.contains('reveal-scale')) {
    el.classList.add('reveal');
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.12 });

elemenUntukAnimasi.forEach(el => observer.observe(el));

// ============ 9. ANIMASI BAR SKILL SAAT TERLIHAT ============
const skillBars = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      const targetWidth = bar.dataset.width;
      setTimeout(() => { bar.style.width = targetWidth; }, 150);
      skillObserver.unobserve(bar);
    }
  });
}, { threshold: 0.4 });

skillBars.forEach(bar => {
  bar.dataset.width = bar.style.width;
  bar.style.width = "0%";
  skillObserver.observe(bar);
});

// ============ 10. TOMBOL KEMBALI KE ATAS ============
const backToTop = document.getElementById('backToTop');

if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 400);
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============ 11. NAVBAR BAYANGAN SAAT SCROLL ============
const navbar = document.querySelector('.navbar');

if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 50 ? "0 4px 24px rgba(0,0,0,0.35)" : "none";
  });
}

// ============ 12. HIGHLIGHT MENU AKTIF SESUAI SCROLL (one-page nav) ============
const sections = document.querySelectorAll('section[id], header[id]');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

if (sections.length && navItems.length) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.4, rootMargin: '-80px 0px -50% 0px' });

  sections.forEach(sec => navObserver.observe(sec));
}
