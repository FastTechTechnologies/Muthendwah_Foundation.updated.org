/* =========================================================
   TALK TO MUTENDWAH FOUNDATION — MAIN SCRIPT
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* PRELOADER */
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) setTimeout(() => preloader.classList.add('hidden'), 400);
  });

  /* AOS */
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 800, once: true, offset: 60, easing: 'ease-out-cubic' });
  }

  /* YEAR */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* NAVBAR SCROLL */
  const nav = document.getElementById('mainNav');
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 40);
    if (backToTop) backToTop.classList.toggle('visible', y > 400);
    updateActiveLink();
  });

  /* ACTIVE NAV LINK */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  function updateActiveLink() {
    const scrollPos = window.scrollY + 130;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
      }
    });
  }

  /* BACK TO TOP */
  if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* DARK MODE */
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('ttm-theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
      localStorage.setItem('ttm-theme', isDark ? 'dark' : 'light');
    });
  }

  /* COUNTERS */
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.dataset.target;
        let count = 0;
        const step = Math.max(1, Math.ceil(target / 60));
        const update = () => {
          count += step;
          if (count >= target) { el.textContent = target + '+'; return; }
          el.textContent = count;
          requestAnimationFrame(update);
        };
        update();
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* PROGRAM FILTER */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const programItems = document.querySelectorAll('.program-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      programItems.forEach(item => {
        const cats = item.dataset.category || '';
        const match = filter === 'all' || cats.includes(filter);
        item.style.display = match ? '' : 'none';
        if (match) {
          item.style.animation = 'none';
          void item.offsetWidth;
          item.style.animation = 'fadeIn .5s ease';
        }
      });
    });
  });

  /* GALLERY LIGHTBOX */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });
  const closeLightbox = () => {
    if (lightbox) lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  /* DONATE TABS */
  const donateTabs = document.querySelectorAll('.donate-tab');
  const donatePanes = document.querySelectorAll('.donate-pane');
  donateTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      donateTabs.forEach(t => t.classList.remove('active'));
      donatePanes.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.target);
      if (target) target.classList.add('active');
    });
  });

  /* COPY BUTTONS */
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.classList.add('copied');
        setTimeout(() => { btn.innerHTML = original; btn.classList.remove('copied'); }, 1500);
      } catch (err) { console.warn('Copy failed', err); }
    });
  });

  /* FORM VALIDATION */
  function validateForm(form) {
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      const value = field.value.trim();
      let fieldValid = value !== '';
      if (field.type === 'email' && value) fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      field.classList.toggle('is-invalid', !fieldValid);
      if (!fieldValid) valid = false;
    });
    return valid;
  }

  /* SUBMIT TO WEB3FORMS */
  async function submitToWeb3Forms(form, alertEl, submitBtn) {
    const formData = new FormData(form);
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    if (btnText) btnText.classList.add('d-none');
    if (btnLoading) btnLoading.classList.remove('d-none');
    submitBtn.disabled = true;
    if (alertEl) { alertEl.className = 'form-alert'; alertEl.textContent = ''; }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST', body: formData
      });
      const data = await response.json();
      if (data.success) {
        if (alertEl) {
          alertEl.className = 'form-alert success';
          alertEl.innerHTML = '<i class="fas fa-check-circle me-2"></i>Thank you! Your message has been sent. We will get back to you shortly.';
        }
        form.reset();
        form.querySelectorAll('.is-invalid').forEach(f => f.classList.remove('is-invalid'));
      } else {
        if (alertEl) {
          alertEl.className = 'form-alert error';
          alertEl.innerHTML = '<i class="fas fa-exclamation-circle me-2"></i>Something went wrong. Please try again or email info@talktotmutendwah.org';
        }
      }
    } catch (err) {
      if (alertEl) {
        alertEl.className = 'form-alert error';
        alertEl.innerHTML = '<i class="fas fa-exclamation-circle me-2"></i>Network error. Please check your connection.';
      }
    } finally {
      if (btnText) btnText.classList.remove('d-none');
      if (btnLoading) btnLoading.classList.add('d-none');
      submitBtn.disabled = false;
    }
  }

  /* CONTACT FORM */
  const contactForm = document.getElementById('contactForm');
  const contactAlert = document.getElementById('contactAlert');
  const contactSubmit = document.getElementById('contactSubmit');
  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();
      if (!validateForm(contactForm)) return;
      await submitToWeb3Forms(contactForm, contactAlert, contactSubmit);
    });
  }

  /* VOLUNTEER FORM */
  const volunteerForm = document.getElementById('volunteerForm');
  const volunteerAlert = document.getElementById('volunteerAlert');
  const volunteerSubmit = document.getElementById('volunteerSubmit');
  if (volunteerForm) {
    volunteerForm.addEventListener('submit', async e => {
      e.preventDefault();
      if (!validateForm(volunteerForm)) return;
      await submitToWeb3Forms(volunteerForm, volunteerAlert, volunteerSubmit);
    });
  }

  /* NEWSLETTER */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      const msg = newsletterForm.parentElement.querySelector('.newsletter-msg');
      const input = newsletterForm.querySelector('input');
      if (input && input.value.includes('@')) {
        if (msg) msg.textContent = '✓ Subscribed! Thank you for staying connected.';
        newsletterForm.reset();
        setTimeout(() => { if (msg) msg.textContent = ''; }, 4000);
      }
    });
  }

  /* SMOOTH SCROLL */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
      }
    });
  });

  /* CONSOLE SIGNATURE */
  console.log('%c Talk To Mutendwah Foundation ', 'background:#1E4B8F;color:#C8965A;padding:6px 12px;border-radius:6px;font-weight:bold;');
  console.log('%c "Everyone can be great because everyone can serve." ', 'color:#C8965A;font-style:italic;');
});