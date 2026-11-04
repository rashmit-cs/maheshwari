// Maheshwari Tours and Travels — site scripts
// Plain JS, no build step, no external dependency.

var WHATSAPP_NUMBER = '919307974659';

// ---------- Vehicle fleet data ----------
// Sedan / SUV / Premium SUV rates are indicative airport-transfer fares shown on
// airport-transfer.html and routes.html. Larger vehicles (Tempo Traveller, buses)
// are quote-only until the operator supplies confirmed fares — no figures are invented.
var VEHICLE_ORDER = ['sedan', 'suv', 'premium-suv', 'luxury-suv', 'tempo-traveller', 'mini-staff-bus', 'staff-bus'];

var VEHICLES = {
  'sedan': {
    name: 'Sedan',
    tagline: 'Dzire or equivalent',
    type: 'Car', ac: true, seats: 4,
    rates: {
      dabolim: [ { d: 'Calangute', p: 1300 }, { d: 'Candolim', p: 1300 }, { d: 'Panaji', p: 1100 } ],
      mopa:    [ { d: 'Calangute', p: 1200 }, { d: 'Candolim', p: 1300 }, { d: 'Panaji', p: 1350 } ]
    }
  },
  'suv': {
    name: 'SUV',
    tagline: 'Ertiga or equivalent',
    type: 'MUV', ac: true, seats: 6,
    rates: {
      dabolim: [ { d: 'Calangute', p: 1600 }, { d: 'Candolim', p: 1600 }, { d: 'Panaji', p: 1350 } ],
      mopa:    [ { d: 'Calangute', p: 1400 }, { d: 'Candolim', p: 1500 }, { d: 'Panaji', p: 1600 } ]
    }
  },
  'premium-suv': {
    name: 'Premium SUV',
    tagline: 'Innova or equivalent',
    type: 'SUV', ac: true, seats: 7,
    rates: {
      dabolim: [ { d: 'Calangute', p: 1900 }, { d: 'Candolim', p: 1900 }, { d: 'Panaji', p: 1600 } ],
      mopa:    [ { d: 'Calangute', p: 1700 }, { d: 'Candolim', p: 1800 }, { d: 'Panaji', p: 1900 } ]
    }
  },
  'tempo-traveller': {
    name: 'Tempo Traveller',
    tagline: '12–17 Seater AC Tempo Traveller',
    type: 'Van', ac: true, seats: 15,
    quoteOnly: true
  },
  'mini-staff-bus': {
    name: 'Mini & Staff Bus',
    tagline: '30+ Seater AC Bus',
    type: 'Bus', ac: true, seats: 30,
    quoteOnly: true
  },
  // quoteOnly vehicles show an Enquire message instead of a fare table.
  'luxury-suv': {
    name: 'Luxury SUV',
    tagline: 'Fortuner or equivalent',
    type: 'SUV', ac: true, seats: 6,
    quoteOnly: true
  },
  'staff-bus': {
    name: 'Staff Bus',
    tagline: 'Dedicated Corporate Staff Bus',
    type: 'Bus', ac: true, seats: 40,
    quoteOnly: true
  }
};

// Image files used on fleet cards + modal header
var VEHICLE_IMAGES = {
  'sedan': 'images/vehicle-sedan.jpg',
  'suv': 'images/vehicle-suv.jpg',
  'premium-suv': 'images/vehicle-premium-suv.jpg',
  'tempo-traveller': 'images/vehicle-tempo-traveller.jpg',
  'mini-staff-bus': 'images/vehicle-mini-staff-bus.jpg',
  'luxury-suv': 'images/vehicle-luxury-suv.jpg',
  'staff-bus': 'images/vehicle-staff-bus.jpg'
};

// Alt text for fleet images (illustrative images, not photos of specific vehicles)
var VEHICLE_ALT = {
  'sedan': 'Illustrative image: white sedan with Maheshwari Tours & Travels branding on a Goa coastal road',
  'suv': 'Illustrative image: white six-seater MUV with Maheshwari Tours & Travels branding on a Goa coastal road',
  'premium-suv': 'Illustrative image: white seven-seater SUV with Maheshwari Tours & Travels branding on a Goa coastal road',
  'tempo-traveller': 'Illustrative image: white Tempo Traveller minibus with Maheshwari Tours & Travels branding beside the sea',
  'mini-staff-bus': 'Illustrative image: white 30-seater coach with Maheshwari Tours & Travels branding on a Goa coastal road',
  'luxury-suv': 'Illustrative image: white luxury SUV with Maheshwari Tours & Travels branding on a Goa coastal road',
  'staff-bus': 'Illustrative image: white 40-seater staff bus with Maheshwari Tours & Travels branding on a Goa coastal road'
};

var NEW_TAB_NOTE = '<span class="sr-only"> (opens in a new tab)</span>';

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav toggle ---------- */
  var menuBtn = document.getElementById('menu-toggle');
  var menu = document.getElementById('mobile-menu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      menu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', menu.classList.contains('open') ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        menu.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.focus();
      }
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item, i) {
    var btn = item.querySelector('.faq-question');
    var panel = item.querySelector('.faq-answer');
    if (!btn || !panel) return;
    var pid = 'faq-panel-' + i;
    panel.id = pid;
    panel.setAttribute('role', 'region');
    btn.setAttribute('aria-controls', pid);
    btn.setAttribute('aria-expanded', 'false');
    var icon = btn.querySelector('.icon');
    if (icon) icon.setAttribute('aria-hidden', 'true');
    var label = btn.querySelector('span');
    if (label) { if (!label.id) label.id = 'faq-q-' + i; panel.setAttribute('aria-labelledby', label.id); }
    btn.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove('open');
          var ob = openItem.querySelector('.faq-question');
          if (ob) ob.setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('open', !wasOpen);
      btn.setAttribute('aria-expanded', wasOpen ? 'false' : 'true');
    });
  });

  /* ---------- Ticker pause control (WCAG 2.2.2) ---------- */
  var ticker = document.querySelector('.ticker');
  if (ticker) {
    ticker.setAttribute('aria-hidden', 'false');
    var tbtn = document.createElement('button');
    tbtn.type = 'button';
    tbtn.className = 'ticker-toggle';
    tbtn.setAttribute('aria-pressed', 'false');
    tbtn.textContent = 'Pause';
    tbtn.setAttribute('aria-label', 'Pause scrolling announcement banner');
    tbtn.addEventListener('click', function () {
      var paused = ticker.classList.toggle('is-paused');
      tbtn.setAttribute('aria-pressed', paused ? 'true' : 'false');
      tbtn.textContent = paused ? 'Play' : 'Pause';
      tbtn.setAttribute('aria-label', (paused ? 'Resume' : 'Pause') + ' scrolling announcement banner');
    });
    ticker.appendChild(tbtn);
  }

  /* ---------- Contact form: validation + WhatsApp hand-off (no data is sent to our servers) ---------- */
  var cform = document.getElementById('contact-form');
  if (cform) {
    var status = document.getElementById('cf-status');
    var fields = {
      name: document.getElementById('cf-name'),
      phone: document.getElementById('cf-phone'),
      service: document.getElementById('cf-service'),
      message: document.getElementById('cf-message'),
      consent: document.getElementById('cf-consent')
    };
    var errs = {
      name: 'Please enter your name.',
      phone: 'Please enter a valid phone number (10 digits, or with +91).',
      consent: 'Please tick the box to agree before sending.'
    };
    function setErr(key, msg) {
      var f = fields[key], box = document.getElementById('cf-' + key + '-error');
      if (!f || !box) return;
      if (msg) { f.setAttribute('aria-invalid', 'true'); box.textContent = msg; box.hidden = false; }
      else { f.removeAttribute('aria-invalid'); box.textContent = ''; box.hidden = true; }
    }
    function validPhone(v) {
      var d = v.replace(/[\s\-()]/g, '');
      return /^(\+91|91|0)?[6-9]\d{9}$/.test(d);
    }
    ['name', 'phone', 'consent'].forEach(function (k) {
      fields[k].addEventListener('input', function () { setErr(k, ''); });
      fields[k].addEventListener('change', function () { setErr(k, ''); });
    });
    cform.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = [];
      if (!fields.name.value.trim()) { setErr('name', errs.name); bad.push('name'); } else setErr('name', '');
      if (!validPhone(fields.phone.value)) { setErr('phone', errs.phone); bad.push('phone'); } else setErr('phone', '');
      if (!fields.consent.checked) { setErr('consent', errs.consent); bad.push('consent'); } else setErr('consent', '');
      if (bad.length) {
        status.hidden = false; status.className = 'form-status error';
        status.textContent = 'Please fix ' + bad.length + (bad.length === 1 ? ' field' : ' fields') + ' below and try again.';
        fields[bad[0]].focus();
        return;
      }
      var msg = 'Hi Maheshwari Tours and Travels — ' + fields.name.value.trim() +
        ' here (phone: ' + fields.phone.value.trim() + '). I need: ' + fields.service.value + '.' +
        (fields.message.value.trim() ? ' ' + fields.message.value.trim() : '');
      status.hidden = false; status.className = 'form-status';
      status.textContent = 'Opening WhatsApp with your message. If it does not open, call +91 93079 74659.';
      window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
  }

  /* ---------- Header shadow on scroll (runs on every page) ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var updateHeaderScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    updateHeaderScroll();
    window.addEventListener('scroll', updateHeaderScroll, { passive: true });
  }

  /* ---------- Scroll-reveal animations (runs on every page) ---------- */
  var revealSelectors = [
    '.vehicle-card', '.tour-card', '.service-card',
    '.info-card', '.route-card', '.why-item', '.testimonial-card',
    '.package-card', '.package-mini', '.faq-item'
  ];
  var revealTargets = document.querySelectorAll(revealSelectors.join(','));

  if (revealTargets.length && 'IntersectionObserver' in window) {
    // Stagger cards within the same grid/parent, reset the counter per parent
    var staggerCounters = new WeakMap();
    revealTargets.forEach(function (el) {
      el.classList.add('reveal');
      var parent = el.parentElement;
      var count = staggerCounters.get(parent) || 0;
      el.style.setProperty('--reveal-index', Math.min(count, 8)); // cap delay growth
      staggerCounters.set(parent, count + 1);
    });

    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // No IntersectionObserver support (very old browser) — just show everything
    revealTargets.forEach(function (el) { el.classList.add('reveal', 'is-visible'); });
  }

  /* ---------- Vehicle fleet modal ---------- */
  var modal = document.getElementById('vehicle-modal');
  if (!modal) return; // pages without the picker (legal pages etc.) stop here

  var modalClose = document.getElementById('modal-close');
  var modalName = document.getElementById('modal-vehicle-name');
  var modalTagline = document.getElementById('modal-vehicle-tagline');
  var modalBadges = document.getElementById('modal-badges');
  var modalIcon = document.getElementById('modal-icon');
  var modalRateBody = document.getElementById('modal-rate-body');
  var modalBookLink = document.getElementById('modal-book-link');
  var modalTabs = modal.querySelectorAll('.modal-tab');
  var pkgHalfLink = document.getElementById('pkg-half-link');
  var pkgFullLink = document.getElementById('pkg-full-link');
  var pkgOutstationLink = document.getElementById('pkg-outstation-link');

  var currentVehicleId = null;
  var lastFocus = null;

  function waLink(message) {
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
  }

  function renderRateTable(vehicleId, pickup) {
    var v = VEHICLES[vehicleId];
    if (!v || !modalRateBody) return;

    if (v.quoteOnly) {
      modalRateBody.innerHTML =
        '<tr><td colspan="3" style="text-align:center; padding:18px; font-family:var(--font-body); color:var(--ink2);">' +
        'Rates for the ' + v.name + ' are quote-based — tap below to get pricing on WhatsApp.</td></tr>';
      return;
    }

    var pickupLabel = pickup === 'dabolim' ? 'Dabolim Airport' : 'Mopa Airport';
    modalRateBody.innerHTML = '';
    v.rates[pickup].forEach(function (row) {
      var tr = document.createElement('tr');
      var priceClass = pickup === 'dabolim' ? 'price-sedan' : 'price-suv';
      tr.innerHTML =
        '<td class="route-name">' + pickupLabel + ' → ' + row.d + '</td>' +
        '<td class="num ' + priceClass + '">₹' + row.p.toLocaleString('en-IN') + '</td>' +
        '<td class="num"><a href="' + waLink('Hi Maheshwari Tours and Travels, I would like to book a ' + v.name + ' from ' + pickupLabel + ' to ' + row.d + '. Indicative fare shown on your website: ₹' + row.p + ' — please confirm.') + '" target="_blank" rel="noopener noreferrer" class="btn-enquire">Book<span class="sr-only"> ' + v.name + ' from ' + pickupLabel + ' to ' + row.d + ' on WhatsApp (opens in a new tab)</span></a></td>';
      modalRateBody.appendChild(tr);
    });
  }

  function openModal(vehicleId) {
    var v = VEHICLES[vehicleId];
    if (!v) return;
    currentVehicleId = vehicleId;

    modalName.textContent = v.name;
    modalTagline.textContent = v.tagline;
    modalIcon.innerHTML = '<img src="' + (VEHICLE_IMAGES[vehicleId] || '') + '" alt="' + (VEHICLE_ALT[vehicleId] || '') + '" width="120" height="64">';
    modalBadges.innerHTML =
      '<span class="vbadge">' + (v.ac ? 'AC' : 'Non-AC') + '</span>' +
      '<span class="vbadge">' + v.seats + ' Seats</span>' +
      '<span class="vbadge">' + v.type + '</span>';

    // Pickup tabs only make sense when there's per-route rate data
    modalTabs.forEach(function (t) {
      t.style.display = v.quoteOnly ? 'none' : '';
      t.classList.toggle('active', t.getAttribute('data-pickup') === 'dabolim');
    });
    renderRateTable(vehicleId, 'dabolim');

    modalBookLink.innerHTML = (v.quoteOnly ? 'Get a Quote on WhatsApp' : 'Book This Vehicle on WhatsApp') + NEW_TAB_NOTE;
    modalBookLink.href = waLink('Hi Maheshwari Tours and Travels, I would like ' + (v.quoteOnly ? 'a quote for a ' : 'to book a ') + v.name + '. Please share availability' + (v.quoteOnly ? ' and pricing.' : '.'));

    pkgHalfLink.href = waLink('Hi Maheshwari Tours and Travels, I would like a Half Day package quote for a ' + v.name + '.');
    pkgFullLink.href = waLink('Hi Maheshwari Tours and Travels, I would like a Full Day package quote for a ' + v.name + '.');
    pkgOutstationLink.href = waLink('Hi Maheshwari Tours and Travels, I would like an Outstation multi-day package quote for a ' + v.name + '.');

    lastFocus = document.activeElement;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.querySelectorAll('main, .site-footer, .site-header, .mobile-bar, .ticker').forEach(function (n) { n.setAttribute('inert', ''); });
    modal.removeAttribute('inert');
    modalClose.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    document.querySelectorAll('[inert]').forEach(function (n) { n.removeAttribute('inert'); });
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.querySelectorAll('.vehicle-card').forEach(function (card) {
    card.addEventListener('click', function () {
      openModal(card.getAttribute('data-vehicle'));
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key === 'Tab') {
      var f = modal.querySelectorAll('a[href], button:not([disabled])');
      var vis = Array.prototype.filter.call(f, function (el) { return el.offsetParent !== null; });
      if (!vis.length) return;
      var first = vis[0], last = vis[vis.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  modalTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      modalTabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      renderRateTable(currentVehicleId, tab.getAttribute('data-pickup'));
    });
  });

});
