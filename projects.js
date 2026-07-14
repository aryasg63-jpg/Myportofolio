/* =========================================================
   PANDUAN CEPAT UNTUK PEMULA 🎯
   Kode untuk tombol FILTER di bagian Proyek.
   - Setiap kartu proyek punya atribut data-category di HTML.
   - Saat tombol filter diklik, kartu yang cocok akan tampil,
     lainnya disembunyikan, disertai suara "whoosh".
========================================================= */

const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Suara whoosh saat filter berubah (efek transisi)
    if (typeof playSfx === 'function' && typeof sfxWhoosh !== 'undefined') {
      playSfx(sfxWhoosh);
    }

    const kategoriPilihan = btn.dataset.filter;

    projectCards.forEach((card, i) => {
      const kategoriKartu = card.dataset.category;
      const cocok = kategoriPilihan === 'semua' || kategoriPilihan === kategoriKartu;

      if (cocok) {
        card.classList.remove('hidden-project');
        // animasi muncul bertahap (stagger)
        card.style.transitionDelay = (i * 0.05) + 's';
        requestAnimationFrame(() => card.classList.add('active'));
      } else {
        card.classList.add('hidden-project');
      }
    });
  });
});
