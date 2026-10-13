/* =========================================================
   LANGUAGE TOGGLE EN/SW (#15)
   ========================================================= */
(function initLanguage() {
  const dict = {
    en: {
      'Home': 'Home', 'About': 'About', 'Programs': 'Programs', 'Impact': 'Impact',
      'Dashboard': 'Dashboard', 'Map': 'Map', 'Gallery': 'Gallery', 'Team': 'Team',
      'Events': 'Events', 'Quiz': 'Quiz', 'Contact': 'Contact',
      'Donate': 'Donate', 'Volunteer': 'Volunteer', 'Contact Us': 'Contact Us',
      'Make a Donation': 'Make a Donation', 'Our Programs': 'Our Programs',
      'Who We Are': 'Who We Are', 'Upcoming Events': 'Upcoming Events'
    },
    sw: {
      'Home': 'Nyumbani', 'About': 'Kuhusu', 'Programs': 'Programu', 'Impact': 'Athari',
      'Dashboard': 'Dashibodi', 'Map': 'Ramani', 'Gallery': 'Picha', 'Team': 'Timu',
      'Events': 'Matukio', 'Quiz': 'Jaribio', 'Contact': 'Wasiliana',
      'Donate': 'Changia', 'Volunteer': 'Kujitolea', 'Contact Us': 'Wasiliana Nasi',
      'Make a Donation': 'Toa Mchango', 'Our Programs': 'Programu Zetu',
      'Who We Are': 'Sisi Ni Nani', 'Upcoming Events': 'Matukio Yajayo'
    }
  };

  const btns = document.querySelectorAll('.lang-btn');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyLang(btn.dataset.lang);
      localStorage.setItem('ttm-lang', btn.dataset.lang);
    });
  });

  function applyLang(lang) {
    const map = dict[lang] || dict.en;
    document.querySelectorAll('.navbar-nav .nav-link').forEach(el => {
      const key = el.textContent.trim();
      if (map[key]) el.textContent = map[key];
    });
  }
  const saved = localStorage.getItem('ttm-lang');
  if (saved && saved !== 'en') {
    const targetBtn = document.querySelector(`.lang-btn[data-lang="${saved}"]`);
    if (targetBtn) targetBtn.click();
  }
})();