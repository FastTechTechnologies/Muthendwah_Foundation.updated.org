/* =========================================================
   SMART FEATURES — Talk To Mutendwah Foundation
   Includes: Cursor, Parallax, Scroll Progress, Live Search,
   Presence Panel (smart interactive cards), Charts,
   Donation Slider, Countdown, Video Modal, PWA,
   Notifications, Wizard, Geolocation, Confetti, Badges,
   Ambient Sound, FAB Cluster
   ========================================================= */

/* =========================================================
   #2 CUSTOM CURSOR
   ========================================================= */
(function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll('a, button, .gallery-item, .program-card, .video-card, input, .quiz-option, .presence-card')
    .forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
})();

/* =========================================================
   #3 PARALLAX SCROLLING
   ========================================================= */
(function initParallax() {
  const els = document.querySelectorAll('.hero-card, .about-img-main, .program-card');
  if (!els.length) return;

  window.addEventListener('scroll', () => {
    els.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.style.transform = `translateY(${(rect.top - window.innerHeight / 2) * 0.05}px)`;
      }
    });
  }, { passive: true });
})();

/* =========================================================
   #5 SCROLL PROGRESS BAR
   ========================================================= */
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* =========================================================
   #9 LIVE SEARCH
   ========================================================= */
(function initSearch() {
  const toggle = document.getElementById('searchToggle');
  const panel = document.getElementById('searchPanel');
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  if (!toggle || !panel) return;

  toggle.addEventListener('click', () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open') && input) input.focus();
  });

  document.addEventListener('click', e => {
    if (!panel.contains(e.target) && !toggle.contains(e.target)) {
      panel.classList.remove('open');
    }
  });

  // Build searchable index from page content
  const index = [];
  document.querySelectorAll('.program-card').forEach(card => {
    const title = card.querySelector('h4')?.textContent || '';
    const desc = card.querySelector('p')?.textContent || '';
    if (title) index.push({ title, desc, type: 'Program', target: card });
  });
  document.querySelectorAll('.event-card').forEach(card => {
    const title = card.querySelector('h5')?.textContent || '';
    const desc = card.querySelector('p')?.textContent || '';
    if (title) index.push({ title, desc, type: 'Event', target: card });
  });
  document.querySelectorAll('.video-card').forEach(card => {
    const title = card.querySelector('.video-caption')?.textContent || '';
    if (title) index.push({ title, desc: 'Video testimonial', type: 'Story', target: card });
  });
  document.querySelectorAll('.team-card').forEach(card => {
    const title = card.querySelector('h5')?.textContent || '';
    const desc = card.querySelector('p')?.textContent || '';
    if (title) index.push({ title, desc, type: 'Team', target: card });
  });
  document.querySelectorAll('.presence-card').forEach(card => {
    const title = card.querySelector('h6')?.textContent || '';
    const desc = card.querySelector('p')?.textContent || '';
    if (title) index.push({ title, desc, type: 'Location', target: card });
  });

  if (input) {
    input.addEventListener('input', () => {
      const q = input.value.toLowerCase().trim();
      results.innerHTML = '';
      if (q.length < 2) return;

      const hits = index.filter(i =>
        i.title.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q)
      ).slice(0, 6);

      if (!hits.length) {
        results.innerHTML = '<div class="search-empty">No results found.</div>';
        return;
      }

      hits.forEach(hit => {
        const div = document.createElement('div');
        div.className = 'search-item';
        div.innerHTML = `<h6>${hit.title}</h6><p>${hit.type} · ${hit.desc.slice(0, 80)}...</p>`;
        div.addEventListener('click', () => {
          hit.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          hit.target.style.transition = 'box-shadow .5s';
          hit.target.style.boxShadow = '0 0 0 4px rgba(200,150,90,.6)';
          setTimeout(() => hit.target.style.boxShadow = '', 2000);
          panel.classList.remove('open');
          input.value = '';
          results.innerHTML = '';
        });
        results.appendChild(div);
      });
    });
  }
})();

/* =========================================================
   #10 PRESENCE PANEL — Smart Interactive Footprint Cards
   ========================================================= */
(function initPresence() {
  const grid = document.getElementById('presenceGrid');
  if (!grid) return;

  // Location data — edit freely
  const locations = [
    {
      name: "Lang'ata, Nairobi",
      desc: "Our head office and the beating heart of the Mama Angaza program. Young mothers come here daily to train in Cisco and Huawei digital skills.",
      shortDesc: "Head Office & Mama Angaza training hub",
      icon: 'fa-building',
      image: 'assets/gallery-1.jpg',
      tag: 'Core Hub',
      category: 'nairobi',
      featured: true,
      flag: 'MAIN HUB',
      stats: [
        { label: 'Enrolled Learners', value: '120+' },
        { label: 'Cisco Graduates', value: '45' },
        { label: 'Years Active', value: '3' }
      ],
      detail: "Our flagship hub where young mothers receive globally recognized tech certifications through Cisco Networking Academy and Huawei. Equipped with computer labs, mentorship, and childcare support."
    },
    {
      name: 'Baba Dogo',
      desc: "Community outreach hotspot where we host Menstrual Health Sundays, mental wellness forums, and pad distribution drives.",
      shortDesc: "Community outreach & Menstrual Health Sundays",
      icon: 'fa-people-group',
      image: 'assets/gallery-2.jpg',
      tag: '5+ events/yr',
      category: 'nairobi',
      featured: false,
      flag: 'ACTIVE',
      stats: [
        { label: 'Events Held', value: '12' },
        { label: 'Girls Reached', value: '200+' },
        { label: 'Pads Distributed', value: '500' }
      ],
      detail: "Baba Dogo is one of our busiest community outreach sites. We partner with local churches and schools to run menstrual health education, distribute eco-friendly pads, and offer free mental health check-ins."
    },
    {
      name: 'Kibera',
      desc: "Deep community engagement through mentorship circles and economic empowerment workshops for young women.",
      shortDesc: "Mentorship & economic empowerment programs",
      icon: 'fa-hand-holding-heart',
      image: 'assets/gallery-3.jpg',
      tag: '150+ reached',
      category: 'nairobi',
      featured: false,
      flag: 'ACTIVE',
      stats: [
        { label: 'Beneficiaries', value: '150+' },
        { label: 'Mentors', value: '20' },
        { label: 'Workshops', value: '30' }
      ],
      detail: "In Kibera we run soap-making, beadwork, and craft vocational training to build immediate income for young mothers, alongside weekly mentorship circles."
    },
    {
      name: 'Mathare',
      desc: "Partnering with local schools to guide students through critical transitional years with career development.",
      shortDesc: "School mentorship partnerships",
      icon: 'fa-school',
      image: 'assets/gallery-4.jpg',
      tag: '8 schools',
      category: 'nairobi',
      featured: false,
      flag: 'PARTNER',
      stats: [
        { label: 'Partner Schools', value: '8' },
        { label: 'Students Mentored', value: '300+' },
        { label: 'Sessions/Year', value: '48' }
      ],
      detail: "Our School Mentorship Project works inside 8 Mathare schools, delivering career development modules, life skills workshops, and one-on-one mentor matching with professionals."
    },
    {
      name: 'Kiambu County',
      desc: "Pilot agricultural cooperative teaching climate-smart farming to women and young mothers.",
      shortDesc: "Agricultural cooperative pilot",
      icon: 'fa-seedling',
      image: 'assets/gallery-5.jpg',
      tag: 'Pilot site',
      category: 'pilot county',
      featured: false,
      flag: 'PILOT',
      stats: [
        { label: 'Farmers Trained', value: '25' },
        { label: 'Acreage', value: '2' },
        { label: 'Harvest Cycles', value: '4' }
      ],
      detail: "Our pilot agricultural cooperative teaches modern, climate-smart farming techniques. Women learn to grow, harvest, and sell produce — creating sustainable income and food security."
    },
    {
      name: 'Kajiado Outreach',
      desc: "New 2026 expansion bringing menstrual health awareness and pad distribution to pastoralist communities.",
      shortDesc: "Menstrual health awareness campaigns",
      icon: 'fa-venus',
      image: 'assets/gallery-6.jpg',
      tag: 'New 2026',
      category: 'county',
      featured: false,
      flag: 'NEW',
      stats: [
        { label: 'Launch', value: '2026' },
        { label: 'Target Girls', value: '300' },
        { label: 'Partner NGOs', value: '2' }
      ],
      detail: "Launching in 2026, our Kajiado outreach will partner with local NGOs to reach pastoralist communities with menstrual health education and eco-friendly pad distribution."
    }
  ];

  // Render cards
  grid.innerHTML = locations.map((loc, i) => `
    <div class="col-md-6 col-lg-4 presence-card-wrapper" data-category="${loc.category}" data-aos="fade-up" data-aos-delay="${i * 80}">
      <div class="presence-card ${loc.featured ? 'featured' : ''}" data-index="${i}">
        <div class="presence-card-img">
          <img src="${loc.image}" alt="${loc.name}" loading="lazy" />
          <span class="presence-flag ${loc.featured ? 'featured' : ''}">${loc.flag}</span>
        </div>
        <div class="presence-card-icon"><i class="fas ${loc.icon}"></i></div>
        <div class="presence-card-body">
          <h6>${loc.name}</h6>
          <p>${loc.shortDesc}</p>
          <div class="presence-meta">
            <span class="presence-count"><i class="fas fa-bolt"></i>${loc.tag}</span>
            <span class="presence-link">View Details <i class="fas fa-arrow-right"></i></span>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // Re-init AOS for new cards
  if (typeof AOS !== 'undefined') AOS.refresh();

  // Animate mini counters
  const miniCounters = document.querySelectorAll('.counter-mini');
  const miniObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.dataset.target;
        let count = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const update = () => {
          count += step;
          if (count >= target) {
            el.textContent = target + (target >= 100 ? '+' : '');
            return;
          }
          el.textContent = count;
          requestAnimationFrame(update);
        };
        update();
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  miniCounters.forEach(c => miniObs.observe(c));

  // Filter tabs
  const filterBtns = document.querySelectorAll('.presence-filter');
  const wrappers = document.querySelectorAll('.presence-card-wrapper');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      wrappers.forEach(w => {
        const cats = (w.dataset.category || '').split(' ');
        const match = filter === 'all' || cats.includes(filter);
        if (match) {
          w.classList.remove('hidden');
          w.style.animation = 'none';
          void w.offsetWidth;
          w.style.animation = 'fadeIn .5s ease';
        } else {
          w.classList.add('hidden');
        }
      });
      if (typeof AOS !== 'undefined') AOS.refresh();
    });
  });

  // Hover state for custom cursor
  const ring = document.querySelector('.cursor-ring');
  if (ring) {
    grid.querySelectorAll('.presence-card').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  }

  // Modal — click a card to open detail
  const modalEl = document.getElementById('presenceModal');
  if (modalEl && typeof bootstrap !== 'undefined') {
    const modal = new bootstrap.Modal(modalEl);

    document.querySelectorAll('.presence-card').forEach(card => {
      card.addEventListener('click', () => {
        const idx = +card.dataset.index;
        const loc = locations[idx];
        if (!loc) return;

        document.getElementById('presenceModalImg').style.backgroundImage = `url('${loc.image}')`;
        document.getElementById('presenceModalTag').textContent = loc.tag;
        document.getElementById('presenceModalTitle').textContent = loc.name;
        document.getElementById('presenceModalDesc').textContent = loc.detail || loc.desc;

        document.getElementById('presenceModalStats').innerHTML = loc.stats.map(s => `
          <div class="presence-modal-stat">
            <strong>${s.value}</strong>
            <span>${s.label}</span>
          </div>
        `).join('');

        modal.show();
      });
    });
  }
})();

/* =========================================================
   #11 IMPACT CHARTS
   ========================================================= */
(function initCharts() {
  if (typeof Chart === 'undefined') return;
  const c1 = document.getElementById('beneficiariesChart');
  const c2 = document.getElementById('programsChart');
  if (!c1 || !c2) return;

  new Chart(c1, {
    type: 'bar',
    data: {
      labels: ['2022', '2023', '2024', '2025', '2026 (target)'],
      datasets: [{
        label: 'Beneficiaries',
        data: [120, 280, 420, 650, 1000],
        backgroundColor: ['#1E4B8F', '#2E5D9F', '#4A75B8', '#7A9BD0', '#C8965A'],
        borderRadius: 10,
        barThickness: 40
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,.05)' } },
        x: { grid: { display: false } }
      }
    }
  });

  new Chart(c2, {
    type: 'doughnut',
    data: {
      labels: ['Mama Angaza', 'Mentorship', 'Caregivers', 'Agriculture', 'Media'],
      datasets: [{
        data: [35, 25, 18, 12, 10],
        backgroundColor: ['#1E4B8F', '#C8965A', '#5B2C6F', '#2E7D6F', '#E0B681'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { position: 'bottom', labels: { padding: 16, font: { size: 12 } } }
      },
      cutout: '65%'
    }
  });
})();

/* =========================================================
   #12 + #20 DONATION SLIDER + IMPACT CALCULATOR
   ========================================================= */
(function initDonationSlider() {
  const slider = document.getElementById('donationSlider');
  const valueEl = document.getElementById('sliderValue');
  const donateAmount = document.getElementById('donateAmount');
  if (!slider) return;

  const update = () => {
    const amt = +slider.value;
    if (valueEl) valueEl.textContent = amt.toLocaleString();
    if (donateAmount) donateAmount.textContent = amt.toLocaleString();

    const padsEl = document.getElementById('impactPads');
    const laptopsEl = document.getElementById('impactLaptops');
    const sessionsEl = document.getElementById('impactSessions');
    const farmsEl = document.getElementById('impactFarms');

    if (padsEl) padsEl.textContent = Math.floor(amt / 500);
    if (laptopsEl) laptopsEl.textContent = (amt / 45000).toFixed(1);
    if (sessionsEl) sessionsEl.textContent = Math.floor(amt / 1500);
    if (farmsEl) farmsEl.textContent = Math.floor(amt / 3000);
  };

  slider.addEventListener('input', update);
  update();
})();

/* =========================================================
   #13 COUNTDOWN TIMER
   ========================================================= */
(function initCountdown() {
  const target = new Date('2026-09-15T09:00:00+03:00').getTime();
  const dEl = document.getElementById('cd-days');
  const hEl = document.getElementById('cd-hours');
  const mEl = document.getElementById('cd-mins');
  const sEl = document.getElementById('cd-secs');
  if (!dEl) return;

  const tick = () => {
    const diff = target - Date.now();
    if (diff <= 0) {
      dEl.textContent = '00';
      hEl.textContent = '00';
      mEl.textContent = '00';
      sEl.textContent = '00';
      return;
    }
    dEl.textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
    hEl.textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
    mEl.textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    sEl.textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  };
  tick();
  setInterval(tick, 1000);
})();

/* =========================================================
   #14 VIDEO TESTIMONIALS
   ========================================================= */
(function initVideoModal() {
  const modalEl = document.getElementById('videoModal');
  const player = document.getElementById('videoPlayer');
  if (!modalEl || !player || typeof bootstrap === 'undefined') return;

  const modal = new bootstrap.Modal(modalEl);

  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => {
      const src = card.dataset.video;
      if (src) {
        player.src = src;
        modal.show();
        player.play().catch(() => {});
      }
    });
  });

  modalEl.addEventListener('hidden.bs.modal', () => {
    player.pause();
    player.src = '';
  });
})();

/* =========================================================
   #16 PWA SERVICE WORKER
   ========================================================= */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

/* =========================================================
   #17 PUSH NOTIFICATIONS (basic)
   ========================================================= */
(function initNotifications() {
  if (!('Notification' in window)) return;

  setTimeout(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(p => {
        if (p === 'granted') {
          new Notification('Talk To Mutendwah Foundation', {
            body: "Thanks for visiting! We'll keep you posted on upcoming events.",
            icon: 'assets/icons/icon-192.png'
          });
        }
      });
    }
  }, 30000);
})();

/* =========================================================
   #21 MULTI-STEP WIZARD (Volunteer Form)
   ========================================================= */
(function initWizard() {
  const form = document.getElementById('volunteerForm');
  if (!form) return;

  const panes = form.querySelectorAll('.wizard-pane');
  const steps = document.querySelectorAll('.wizard-step');
  const back = document.getElementById('wizBack');
  const next = document.getElementById('wizNext');
  const submit = document.getElementById('volunteerSubmit');
  const review = document.getElementById('reviewContent');
  let current = 1;
  const total = panes.length;

  const show = n => {
    panes.forEach(p => p.classList.toggle('active', +p.dataset.pane === n));
    steps.forEach(s => {
      const sn = +s.dataset.step;
      s.classList.toggle('active', sn === n);
      s.classList.toggle('completed', sn < n);
    });
    if (back) back.disabled = n === 1;
    if (next) next.classList.toggle('d-none', n === total);
    if (submit) submit.classList.toggle('d-none', n !== total);
    if (n === total) buildReview();
  };

  const validatePane = n => {
    const pane = form.querySelector(`.wizard-pane[data-pane="${n}"]`);
    if (!pane) return true;
    let ok = true;
    pane.querySelectorAll('[required]').forEach(f => {
      const valid = f.value.trim() !== '';
      f.classList.toggle('is-invalid', !valid);
      if (!valid) ok = false;
    });
    return ok;
  };

  const buildReview = () => {
    const data = new FormData(form);
    let html = '';
    for (const [k, v] of data.entries()) {
      if (['access_key', 'subject', 'from_name', 'botcheck'].includes(k)) continue;
      if (v) html += `<div class="mb-2"><strong>${k}:</strong> ${v}</div>`;
    }
    if (review) review.innerHTML = html || '<em>No data entered.</em>';
  };

  if (next) next.addEventListener('click', () => {
    if (!validatePane(current)) return;
    if (current < total) { current++; show(current); }
  });
  if (back) back.addEventListener('click', () => {
    if (current > 1) { current--; show(current); }
  });

  show(1);
})();

/* =========================================================
   #24 GEOLOCATION AUTO-FILL
   ========================================================= */
(function initGeo() {
  const geoField = document.getElementById('geoLocation');
  if (!geoField || geoField.value) return;

  fetch('https://ipapi.co/json/')
    .then(r => r.json())
    .then(d => {
      if (d.city && d.country_name) {
        geoField.placeholder = `${d.city}, ${d.country_name}`;
      }
    })
    .catch(() => {});
})();

/* =========================================================
   #26 CONFETTI
   ========================================================= */
window.triggerConfetti = function () {
  const container = document.getElementById('confettiContainer');
  if (!container) return;

  const colors = ['#1E4B8F', '#C8965A', '#5B2C6F', '#2E7D6F', '#E0B681', '#e63946'];
  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * 0.5 + 's';
    piece.style.animationDuration = (2 + Math.random() * 2) + 's';
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 5000);
  }
};

document.querySelectorAll('[data-bs-target="#donateModal"]').forEach(btn => {
  btn.addEventListener('click', () => setTimeout(() => window.triggerConfetti(), 400));
});

/* =========================================================
   #27 BADGE SYSTEM
   ========================================================= */
(function initBadges() {
  const toast = document.getElementById('badgeToast');
  if (!toast) return;

  const unlocked = new Set(JSON.parse(localStorage.getItem('ttm-badges') || '[]'));

  const badges = {
    explorer: { icon: '🧭', label: 'Explorer — Visited 3 sections' },
    supporter: { icon: '💛', label: 'Supporter — Opened donation modal' },
    learner: { icon: '🎓', label: 'Learner — Completed the quiz' },
    connector: { icon: '🤝', label: 'Connector — Sent a message' }
  };

  function unlock(key) {
    if (unlocked.has(key)) return;
    unlocked.add(key);
    localStorage.setItem('ttm-badges', JSON.stringify([...unlocked]));
    const b = badges[key];
    toast.innerHTML = `<i>${b.icon}</i><div><strong>Badge Unlocked!</strong><br /><small>${b.label}</small></div>`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }
  window.unlockBadge = unlock;

  const seen = new Set();
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        seen.add(e.target.id);
        if (seen.size >= 3) unlock('explorer');
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('section[id]').forEach(s => obs.observe(s));

  document.querySelectorAll('[data-bs-target="#donateModal"]').forEach(b => {
    b.addEventListener('click', () => unlock('supporter'));
  });

  const cf = document.getElementById('contactForm');
  if (cf) cf.addEventListener('submit', () => unlock('connector'));
})();

/* =========================================================
   #28 AMBIENT SOUND
   ========================================================= */
(function initSound() {
  const btn = document.getElementById('soundToggle');
  const audio = document.getElementById('ambientAudio');
  if (!btn || !audio) return;

  let playing = false;

  btn.addEventListener('click', () => {
    if (playing) {
      audio.pause();
      btn.classList.remove('playing');
      btn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
      audio.volume = 0.15;
      audio.play().then(() => {
        btn.classList.add('playing');
        btn.innerHTML = '<i class="fas fa-volume-up"></i>';
      }).catch(() => {});
    }
    playing = !playing;
  });
})();

/* =========================================================
   #30 FAB CLUSTER
   ========================================================= */
(function initFAB() {
  const toggle = document.getElementById('fabToggle');
  const cluster = document.querySelector('.fab-cluster');
  if (!toggle || !cluster) return;

  toggle.addEventListener('click', e => {
    e.stopPropagation();
    cluster.classList.toggle('open');
  });

  document.addEventListener('click', e => {
    if (!cluster.contains(e.target)) cluster.classList.remove('open');
  });
})();

/* =========================================================
   GOOGLE MAP (replaces old OpenStreetMap integration)
   ========================================================= */
(function initGoogleMap() {
  const mapEl = document.getElementById('googleMap');
  if (!mapEl) return;

  // ⚠️ REPLACE THIS WITH YOUR OWN GOOGLE MAPS API KEY
  // Get a free key: https://console.cloud.google.com/google/maps-apis/credentials
  const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

  // Locations from the presence data (kept in sync manually)
  const locations = [
    { name: "Lang'ata, Nairobi", desc: 'Head Office & Mama Angaza training hub', lat: -1.3667, lng: 36.7333 },
    { name: 'Baba Dogo', desc: 'Community outreach & Menstrual Health Sundays', lat: -1.2680, lng: 36.8470 },
    { name: 'Kibera', desc: 'Mentorship & economic empowerment programs', lat: -1.3133, lng: 36.7833 },
    { name: 'Mathare', desc: 'School mentorship partnerships', lat: -1.2600, lng: 36.8600 },
    { name: 'Kiambu County', desc: 'Agricultural cooperative pilot', lat: -1.1714, lng: 36.8356 },
    { name: 'Kajiado Outreach', desc: 'Menstrual health awareness campaigns', lat: -1.8521, lng: 36.7768 }
  ];

  // Fallback if no API key or Maps fails to load
  function renderFallback() {
    mapEl.innerHTML = `
      <div class="google-map-fallback">
        <i class="fas fa-map-marked-alt"></i>
        <h5 class="mb-1">Interactive Map</h5>
        <p class="mb-2 small">Add your Google Maps API key in <code>js/features.js</code> to enable the live map.</p>
        <p class="small text-muted mb-0">Meanwhile, scroll down to explore our ${locations.length} locations as cards below.</p>
      </div>`;
  }

  // If key not configured → fallback immediately
  if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY') {
    renderFallback();
    return;
  }

  // Load Google Maps script dynamically
  window.initMutendwahMap = function () {
    try {
      const map = new google.maps.Map(mapEl, {
        center: { lat: -1.286389, lng: 36.817223 }, // Nairobi
        zoom: 7,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#f3ede3' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#1E4B8F' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
          { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#C8965A' }] },
          { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#e5e0d8' }] },
          { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#6b7280' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
          { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#e5e0d8' }] },
          { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#6b7280' }] },
          { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#e5e0d8' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#b3c9e6' }] },
          { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#1E4B8F' }] }
        ]
      });

      const infoWindow = new google.maps.InfoWindow();

      locations.forEach(loc => {
        const marker = new google.maps.Marker({
          position: { lat: loc.lat, lng: loc.lng },
          map: map,
          title: loc.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: '#C8965A',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3
          },
          animation: google.maps.Animation.DROP
        });

        marker.addListener('click', () => {
          infoWindow.setContent(`
            <div style="font-family:'Inter',sans-serif; max-width:240px;">
              <h6 style="font-family:'Playfair Display',serif; color:#1E4B8F; margin:0 0 6px; font-size:1rem;">${loc.name}</h6>
              <p style="margin:0; font-size:.85rem; color:#6b7280; line-height:1.5;">${loc.desc}</p>
            </div>
          `);
          infoWindow.open(map, marker);
        });
      });
    } catch (err) {
      console.warn('Google Maps failed:', err);
      renderFallback();
    }
  };

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMutendwahMap`;
  script.async = true;
  script.defer = true;
  script.onerror = renderFallback;
  document.head.appendChild(script);
})();

/* =========================================================
   CERTIFICATE GALLERY WITH AUTO NAME-MASKING
   Automatically detects text region on certificate image
   and overlays a privacy mask to hide recipient name.
   ========================================================= */
(function initCertificates() {
  const grid = document.getElementById('certificatesGrid');
  if (!grid) return;

  /* ---------- EDIT THIS ARRAY WITH YOUR CERTIFICATES ----------
     Each item:
     - image:        path to certificate image
     - title:        certificate title
     - recipient:    full name (will be auto-masked)
     - program:      e.g. "Mama Angaza · Cisco Cybersecurity"
     - date:         e.g. "March 2025"
     - mask:         where to mask on the image (percentages)
                     x, y = top-left corner, w, h = width/height
                     Values are relative to the image (0–100%)
  ---------------------------------------------------------------*/
  const certificates = [
    {
      image: 'assets/certificate-1.jpg',
      title: 'Cisco Cybersecurity Essentials',
      recipient: 'Sylvester Otieno',
      program: 'Mama Angaza · Cisco Networking Academy',
      date: 'March 2025',
      mask: { x: 30, y: 48, w: 40, h: 8 }
    },
    {
      image: 'assets/certificate-2.jpg',
      title: 'Introduction to Cybersecurity',
      recipient: 'Millicent Mokeira',
      program: 'Mama Angaza · Cisco Networking Academy',
      date: 'February 2025',
      mask: { x: 30, y: 48, w: 40, h: 8 }
    },
    {
      image: 'assets/certificate-3.jpg',
      title: 'Web Design Fundamentals',
      recipient: 'Grace Wanjiru',
      program: 'Mama Angaza · Huawei ICT Academy',
      date: 'January 2025',
      mask: { x: 30, y: 48, w: 40, h: 8 }
    },
    {
      image: 'assets/certificate-4.jpg',
      title: 'AI Fundamentals',
      recipient: 'Brian Kamau',
      program: 'Mama Angaza · Huawei ICT Academy',
      date: 'December 2024',
      mask: { x: 30, y: 48, w: 40, h: 8 }
    },
    {
      image: 'assets/certificate-5.jpg',
      title: 'School Mentorship Program',
      recipient: 'Faith Njeri',
      program: 'School Mentorship Project',
      date: 'November 2024',
      mask: { x: 30, y: 48, w: 40, h: 8 }
    },
    {
      image: 'assets/certificate-6.jpg',
      title: 'Digital Literacy Certification',
      recipient: 'Peter Ochieng',
      program: 'Mama Angaza · Cisco Networking Academy',
      date: 'October 2024',
      mask: { x: 30, y: 48, w: 40, h: 8 }
    }
  ];

  /* ---------- Auto-mask helper ---------- */
  function maskName(fullName) {
    if (!fullName) return '— — —';
    const parts = fullName.trim().split(/\s+/);
    return parts.map(p => p.charAt(0).toUpperCase() + '•'.repeat(Math.max(2, p.length - 1))).join(' ');
  }

  /* ---------- Render cards ---------- */
  grid.innerHTML = certificates.map((cert, i) => `
    <div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="${i * 80}">
      <div class="certificate-card" data-index="${i}">
        <div class="certificate-thumb">
          <img src="${cert.image}" alt="${cert.title}" loading="lazy" onerror="this.style.display='none'; this.parentElement.style.background='linear-gradient(135deg,#1E4B8F,#5B2C6F)';" />
          <span class="certificate-privacy"><i class="fas fa-shield-alt"></i> Masked</span>
          <div class="certificate-mask">
            <i class="fas fa-eye"></i> View Certificate
          </div>
        </div>
        <div class="certificate-body">
          <h6 class="certificate-title">${cert.title}</h6>
          <p class="certificate-recipient">Recipient: <strong>${maskName(cert.recipient)}</strong></p>
          <span class="certificate-meta">${cert.program} · ${cert.date}</span>
          <span class="certificate-view">View Full <i class="fas fa-arrow-right"></i></span>
        </div>
      </div>
    </div>
  `).join('');

  if (typeof AOS !== 'undefined') AOS.refresh();

  /* ---------- Modal + auto-masking ---------- */
  const modalEl = document.getElementById('certificateModal');
  if (modalEl && typeof bootstrap !== 'undefined') {
    const modal = new bootstrap.Modal(modalEl);
    const imgEl = document.getElementById('certificateModalImg');
    const overlayEl = document.getElementById('certificateModalOverlay');

    grid.querySelectorAll('.certificate-card').forEach(card => {
      card.addEventListener('click', () => {
        const cert = certificates[+card.dataset.index];
        if (!cert) return;

        imgEl.src = cert.image;
        overlayEl.innerHTML = '';

        // Wait for image to load so overlay aligns correctly
        imgEl.onload = () => {
          const rect = imgEl.getBoundingClientRect();
          const m = cert.mask || { x: 30, y: 48, w: 40, h: 8 };

          const maskBox = document.createElement('div');
          maskBox.className = 'mask-box';
          maskBox.style.left = `calc(20px + ${m.x}%)`;
          maskBox.style.top  = `calc(20px + ${m.y}%)`;
          maskBox.style.width = `${m.w}%`;
          maskBox.style.height = `${m.h}%`;
          maskBox.innerHTML = `<i class="fas fa-user-secret"></i> ${maskName(cert.recipient)}`;

          overlayEl.appendChild(maskBox);
        };

        modal.show();
      });
    });

    // Clear image + overlay on close
    modalEl.addEventListener('hidden.bs.modal', () => {
      imgEl.src = '';
      overlayEl.innerHTML = '';
    });
  }

  // Cursor hover
  const ring = document.querySelector('.cursor-ring');
  if (ring) {
    grid.querySelectorAll('.certificate-card').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  }
})();