/* =========================================================
   PANDUAN CEPAT UNTUK PEMULA 🎯
   Kode untuk LIGHTBOX (foto galeri yang membesar saat diklik).
   - Klik foto → foto membesar di tengah layar
   - Tombol panah kiri/kanan → pindah ke foto lain
   - Tombol X atau klik area gelap → tutup
========================================================= */

const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentIndex = 0;
const daftarFoto = [];

galleryItems.forEach((item, index) => {
  const img = item.querySelector('img');
  const caption = item.querySelector('.gallery-caption')?.textContent || '';
  daftarFoto.push({ src: img.src, caption });

  item.addEventListener('click', () => {
    currentIndex = index;
    bukaLightbox();
  });
});

function bukaLightbox() {
  if (!lightbox) return;
  const foto = daftarFoto[currentIndex];
  lightboxImg.src = foto.src;
  lightboxCaption.textContent = foto.caption;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function tutupLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function fotoBerikutnya() {
  currentIndex = (currentIndex + 1) % daftarFoto.length;
  bukaLightbox();
}

function fotoSebelumnya() {
  currentIndex = (currentIndex - 1 + daftarFoto.length) % daftarFoto.length;
  bukaLightbox();
}

if (lightboxClose) lightboxClose.addEventListener('click', tutupLightbox);
if (lightboxNext) lightboxNext.addEventListener('click', fotoBerikutnya);
if (lightboxPrev) lightboxPrev.addEventListener('click', fotoSebelumnya);

// Klik area gelap di luar foto untuk menutup
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) tutupLightbox();
  });
}

// Kontrol dengan keyboard (Esc, panah kiri, panah kanan)
document.addEventListener('keydown', (e) => {
  if (!lightbox || !lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') tutupLightbox();
  if (e.key === 'ArrowRight') fotoBerikutnya();
  if (e.key === 'ArrowLeft') fotoSebelumnya();
});
