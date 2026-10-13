/* =========================================================
   SMART FEATURES — Talk To Mutendwah Foundation
   Locations: Nairobi County + Kitui County (Ikutha)
   ========================================================= */

/* =========================================================
   SHARED LOCATIONS DATA
   Single source of truth used by both the presence cards
   and the interactive map.
   ========================================================= */
window.TTM_LOCATIONS = [
  {
    name: "Nairobi County",
    city: "Nairobi",
    desc: "Our head office and the beating heart of the Mama Angaza program. Young mothers come here daily to train in Cisco and Huawei digital skills, receive mental health support, and access mentorship.",
    shortDesc: "Head Office · Mama Angaza tech hub · School mentorship network",
    icon: 'fa-city',
    image: 'assets/gallery-1.jpg',
    tag: 'County HQ',
    category: 'nairobi',
    featured: true,
    flag: 'MAIN HUB',
    lat: -1.286389,
    lng: 36.817223,
    stats: [
      { label: 'Enrolled Learners', value: '120+' },
      { label: 'Partner Schools', value: '8' },
      { label: 'Years Active', value: '3' }
    ],
    detail: "Nairobi County is the flagship hub of the Talk To Mutendwah Foundation. From our Lang'ata base we run the Mama Angaza tech program (Cisco & Huawei), School Mentorship Project, menstrual health advocacy, media broadcasts, and community outreach across the informal settlements."
  },
  {
    name: "Kitui County — Ikutha",
    city: "Ikutha",
    desc: "Our agricultural and economic empowerment site. Women and young mothers receive climate-smart farming training, vocational skills, and menstrual health education in partnership with local community leaders.",
    shortDesc: "Agriculture · Economic empowerment · Community outreach",
    icon: 'fa-seedling',
    image: 'assets/gallery-5.jpg',
    tag: 'Ikutha · Kitui',
    category: 'kitui',
    featured: false,
    flag: 'EXPANSION',
    lat: -1.4500,
    lng: 38.0500,
    stats: [
      { label: 'Farmers Trained', value: '25+' },
      { label: 'Acreage', value: '2' },
      { label: 'Harvest Cycles', value: '4' }
    ],
    detail: "Ikutha in Kitui County is our agricultural and economic empowerment hub. We train women and young mothers in modern climate-smart farming techniques, vocational skills like soap-making and beadwork, and menstrual health advocacy — building sustainable income and food security for local households."
  }
];

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

  document.querySelectorAll('a, button, .gallery-item, .program-card, .video-card, input, .presence-card, .certificate-card, .partner-card, .cisco-course-card')
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
  document.querySelectorAll('.certificate-card').forEach(card => {
    const title = card.querySelector('.certificate-title')?.textContent || '';
    if (title) index.push({ title, desc: 'Certificate', type: 'Certificate', target: card });
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
   #10 PRESENCE PANEL — Smart Footprint Cards
   Reads from window.TTM_LOCATIONS
   ========================================================= */
(function initPresence() {
  const grid = document.getElementById('presenceGrid');
  if (!grid) return;

  const locations = window.TTM_LOCATIONS || [];
  if (!locations.length) return;

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

  // Cursor hover
  const ring = document.querySelector('.cursor-ring');
  if (ring) {
    grid.querySelectorAll('.presence-card').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  }

  // Modal
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
   DONATION SLIDER + IMPACT CALCULATOR
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
   COUNTDOWN TIMER
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
      dEl.textContent = '00'; hEl.textContent = '00';
      mEl.textContent = '00'; sEl.textContent = '00';
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
   PWA SERVICE WORKER
   ========================================================= */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

/* =========================================================
   PUSH NOTIFICATIONS (basic)
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
   MULTI-STEP WIZARD (Volunteer Form)
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
   GEOLOCATION AUTO-FILL
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
   CONFETTI
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
   BADGE SYSTEM
   ========================================================= */
(function initBadges() {
  const toast = document.getElementById('badgeToast');
  if (!toast) return;

  const unlocked = new Set(JSON.parse(localStorage.getItem('ttm-badges') || '[]'));

  const badges = {
    explorer: { icon: '🧭', label: 'Explorer — Visited 3 sections' },
    supporter: { icon: '💛', label: 'Supporter — Opened donation modal' },
    learner: { icon: '🎓', label: 'Learner — Explored our programs' },
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
   AMBIENT SOUND
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
   FAB CLUSTER
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
   SMART MAP — OpenFreeMap via MapLibre GL
   Reads from window.TTM_LOCATIONS
   ========================================================= */
(function initSmartMap() {
  const mapEl = document.getElementById('googleMap');
  if (!mapEl) return;

  if (typeof L === 'undefined') {
    mapEl.innerHTML = `
      <div class="google-map-fallback">
        <i class="fas fa-map-marked-alt"></i>
        <h5 class="mb-1">Interactive Map</h5>
        <p class="mb-0 small">Leaflet library not loaded.</p>
      </div>`;
    return;
  }

  const locations = window.TTM_LOCATIONS || [];
  if (!locations.length) return;

  try {
    const map = L.map('googleMap', {
      center: [-1.5, 37.3],   // Centered between Nairobi and Kitui
      zoom: 7,
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true
    });

    /* BASEMAP — try MapLibre (vector, vibrant), fallback raster */
    let usingVector = false;

    if (typeof L.maplibreGL === 'function') {
      try {
        L.maplibreGL({
          style: 'https://tiles.openfreemap.org/styles/liberty',
          attribution: '&copy; <a href="https://openfreemap.org">OpenFreeMap</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        usingVector = true;
      } catch (e) {
        console.warn('MapLibre failed, using raster fallback:', e);
      }
    }

    if (!usingVector) {
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
        referrerPolicy: 'strict-origin-when-cross-origin'
      }).addTo(map);
    }

    /* Branded pulsing markers */
    function makeMarkerIcon(featured) {
      return L.divIcon({
        className: 'custom-map-marker' + (featured ? ' featured' : ''),
        html: `
          <div class="pin-wrap">
            <div class="pin-body"><div class="pin-dot"></div></div>
            <div class="pin-pulse"></div>
          </div>`,
        iconSize: featured ? [48, 58] : [42, 52],
        iconAnchor: featured ? [24, 48] : [21, 42],
        popupAnchor: [0, featured ? -46 : -40]
      });
    }

    locations.forEach(loc => {
      const marker = L.marker([loc.lat, loc.lng], {
        icon: makeMarkerIcon(loc.featured),
        riseOnHover: true
      }).addTo(map);

      const statsHtml = loc.stats.map(s => `
        <div class="map-popup-stat">
          <strong>${s.value}</strong>
          <span>${s.label}</span>
        </div>
      `).join('');

      marker.bindPopup(`
        <div class="map-popup">
          <div class="map-popup-img" style="background-image:url('${loc.image}');">
            <span class="map-popup-tag">${loc.tag}</span>
          </div>
          <div class="map-popup-body">
            <h6 class="map-popup-title">${loc.name}</h6>
            <p class="map-popup-desc">${loc.shortDesc}</p>
            <div class="map-popup-stats">${statsHtml}</div>
          </div>
        </div>
      `, {
        maxWidth: 300,
        closeButton: true,
        autoPan: true,
        autoPanPadding: [40, 40]
      });
    });

    map.on('click', () => map.scrollWheelZoom.enable());
    map.on('mouseout', () => map.scrollWheelZoom.disable());

    /* Badge */
    const badge = document.createElement('div');
    badge.className = 'map-badge';
    badge.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${locations.length} Counties · Nairobi &amp; Kitui`;
    mapEl.appendChild(badge);

    /* Locate Me */
    const locateBtn = document.createElement('button');
    locateBtn.type = 'button';
    locateBtn.className = 'map-locate-btn';
    locateBtn.innerHTML = `<i class="fas fa-crosshairs"></i> Locate Me`;
    locateBtn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        locateBtn.innerHTML = `<i class="fas fa-times-circle"></i> Not supported`;
        return;
      }
      locateBtn.classList.add('loading');
      locateBtn.innerHTML = `<i class="fas fa-spinner"></i> Locating...`;

      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: `<div style="
              width:18px;height:18px;
              background:#10b981;border:3px solid #fff;
              border-radius:50%;
              box-shadow:0 0 0 6px rgba(16,185,129,.25), 0 4px 12px rgba(0,0,0,.3);
            "></div>`,
            iconSize: [18, 18],
            iconAnchor: [9, 9]
          });
          L.marker([latitude, longitude], { icon: userIcon })
            .addTo(map)
            .bindPopup('<strong>You are here</strong>')
            .openPopup();
          map.setView([latitude, longitude], 12);
          locateBtn.classList.remove('loading');
          locateBtn.innerHTML = `<i class="fas fa-check"></i> Found`;
          setTimeout(() => {
            locateBtn.innerHTML = `<i class="fas fa-crosshairs"></i> Locate Me`;
          }, 2500);
        },
        () => {
          locateBtn.classList.remove('loading');
          locateBtn.innerHTML = `<i class="fas fa-times-circle"></i> Denied`;
          setTimeout(() => {
            locateBtn.innerHTML = `<i class="fas fa-crosshairs"></i> Locate Me`;
          }, 2500);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
    mapEl.appendChild(locateBtn);

    /* Legend */
    const legend = document.createElement('div');
    legend.className = 'map-legend';
    legend.innerHTML = `
      <div class="map-legend-item"><span class="map-legend-dot red"></span> Main Hub</div>
      <div class="map-legend-item"><span class="map-legend-dot blue"></span> Expansion</div>
    `;
    mapEl.appendChild(legend);

    /* Ensure render */
    setTimeout(() => {
      map.invalidateSize();
      window.dispatchEvent(new Event('resize'));
    }, 900);
    window.addEventListener('resize', () => {
      map.invalidateSize();
      window.dispatchEvent(new Event('resize'));
    });

  } catch (err) {
    console.warn('Map init failed:', err);
    mapEl.innerHTML = `
      <div class="google-map-fallback">
        <i class="fas fa-map-marked-alt"></i>
        <h5 class="mb-1">Interactive Map</h5>
        <p class="mb-0 small">Scroll down to explore our locations as cards below.</p>
      </div>`;
  }
})();

/* =========================================================
   CERTIFICATE GALLERY WITH AUTO NAME-MASKING
   ========================================================= */
(function initCertificates() {
  const grid = document.getElementById('certificatesGrid');
  if (!grid) return;

  const certificates = [
    {
      image: 'assets/certificate-1.png',
      title: 'Introduction to Modern AI',
      recipient: 'Denis Mwenda',
      program: 'Cisco Networking Academy · AALTI',
      date: '14 Sep 2026',
      mask: { x: 25, y: 26, w: 50, h: 10 }
    },
    {
      image: 'assets/certificate-2.png',
      title: 'Cisco Cybersecurity Essentials',
      recipient: 'Sylvester Otieno',
      program: 'Mama Angaza · Cisco Networking Academy',
      date: 'March 2025',
      mask: { x: 25, y: 26, w: 50, h: 10 }
    },
    {
      image: 'assets/certificate-3.png',
      title: 'Introduction to Cybersecurity',
      recipient: 'Millicent Mokeira',
      program: 'Mama Angaza · Cisco Networking Academy',
      date: 'February 2025',
      mask: { x: 25, y: 26, w: 50, h: 10 }
    },
    {
      image: 'assets/certificate-4.png',
      title: 'AI Fundamentals',
      recipient: 'Brian Kamau',
      program: 'Mama Angaza · Huawei ICT Academy',
      date: 'December 2024',
      mask: { x: 28, y: 30, w: 44, h: 10 }
    },
    {
      image: 'assets/certificate-6.png',
      title: 'Digital Literacy Certification',
      recipient: 'Peter Ochieng',
      program: 'Mama Angaza · Cisco Networking Academy',
      date: 'October 2024',
      mask: { x: 25, y: 26, w: 50, h: 10 }
    },
    {
      image: 'assets/certificate-2.png',
      title: 'Cybersecurity Tactics',
      recipient: 'Sylvester Otieno',
      program: 'Mama Angaza · Cisco Networking Academy',
      date: 'March 2025',
      mask: { x: 25, y: 26, w: 50, h: 10 }
    }
  ];

  function maskName(fullName) {
    if (!fullName) return '— — —';
    const parts = fullName.trim().split(/\s+/);
    return parts.map(p => p.charAt(0).toUpperCase() + '•'.repeat(Math.max(2, p.length - 1))).join(' ');
  }

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
          <p class="certificate-recipient"><i class="fas fa-lock me-1"></i>Recipient identity protected</p>
          <span class="certificate-meta">${cert.program} · ${cert.date}</span>
          <span class="certificate-view">View Full <i class="fas fa-arrow-right"></i></span>
        </div>
      </div>
    </div>
  `).join('');

  if (typeof AOS !== 'undefined') AOS.refresh();

  const modalEl = document.getElementById('certificateModal');
  if (modalEl && typeof bootstrap !== 'undefined') {
    const modal = new bootstrap.Modal(modalEl);
    const imgEl = document.getElementById('certificateModalImg');
    const overlayEl = document.getElementById('certificateModalOverlay');

    function positionMask(cert) {
      overlayEl.innerHTML = '';
      const imgRect = imgEl.getBoundingClientRect();
      const parentRect = overlayEl.parentElement.getBoundingClientRect();
      const offsetX = imgRect.left - parentRect.left;
      const offsetY = imgRect.top - parentRect.top;
      const m = cert.mask || { x: 25, y: 26, w: 50, h: 10 };

      const maskBox = document.createElement('div');
      maskBox.className = 'mask-box';
      maskBox.style.position = 'absolute';
      maskBox.style.left = (offsetX + (imgRect.width * m.x / 100)) + 'px';
      maskBox.style.top = (offsetY + (imgRect.height * m.y / 100)) + 'px';
      maskBox.style.width = (imgRect.width * m.w / 100) + 'px';
      maskBox.style.height = (imgRect.height * m.h / 100) + 'px';
      maskBox.innerHTML = `<i class="fas fa-user-secret"></i> ${maskName(cert.recipient)}`;
      overlayEl.appendChild(maskBox);
    }

    grid.querySelectorAll('.certificate-card').forEach(card => {
      card.addEventListener('click', () => {
        const cert = certificates[+card.dataset.index];
        if (!cert) return;

        grid.querySelectorAll('.certificate-card').forEach(c => c.dataset.active = 'false');
        card.dataset.active = 'true';

        imgEl.src = cert.image;
        overlayEl.innerHTML = '';
        overlayEl.style.position = 'absolute';
        overlayEl.style.inset = '0';
        overlayEl.style.pointerEvents = 'none';
        overlayEl.style.zIndex = '2';

        const applyMask = () => requestAnimationFrame(() => positionMask(cert));

        if (imgEl.complete && imgEl.naturalWidth > 0) applyMask();
        else imgEl.onload = applyMask;

        modal.show();
      });
    });

    window.addEventListener('resize', () => {
      if (!modalEl.classList.contains('show')) return;
      const activeCard = grid.querySelector('.certificate-card[data-active="true"]');
      if (!activeCard) return;
      const cert = certificates[+activeCard.dataset.index];
      if (cert && imgEl.complete) positionMask(cert);
    });

    modalEl.addEventListener('hidden.bs.modal', () => {
      imgEl.src = '';
      overlayEl.innerHTML = '';
      grid.querySelectorAll('.certificate-card').forEach(c => c.dataset.active = 'false');
    });
  }

  const ring = document.querySelector('.cursor-ring');
  if (ring) {
    grid.querySelectorAll('.certificate-card').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  }
})();