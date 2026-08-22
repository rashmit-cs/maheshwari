// Maheshwari Tours and Travels — site scripts
// Plain JS, no build step, no external dependency.

var WHATSAPP_NUMBER = '919307974659';

// ---------- Vehicle fleet data ----------
// Sedan / SUV / Premium SUV rates are the site's existing, previously-confirmed
// airport-transfer figures (Dabolim & Mopa -> Calangute/Candolim/Panaji).
// Tempo Traveller and Mini & Staff Bus point-to-point rates are NEW placeholder
// figures added for this picker (modeled on typical Goa large-vehicle market
// rates) — flag these two for R to confirm/replace before publishing.
var VEHICLE_ORDER = ['sedan', 'suv', 'premium-suv', 'tempo-traveller', 'mini-staff-bus'];

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
    rates: {
      dabolim: [ { d: 'Panaji', p: 3500 } ], // NEW — confirm with R
      mopa:    [ { d: 'Panaji', p: 4500 } ]  // NEW — confirm with R
    }
  },
  'mini-staff-bus': {
    name: 'Mini & Staff Bus',
    tagline: '30+ Seater AC Bus',
    type: 'Bus', ac: true, seats: 30,
    rates: {
      dabolim: [ { d: 'Panaji', p: 5000 } ], // NEW — confirm with R
      mopa:    [ { d: 'Panaji', p: 6000 } ]  // NEW — confirm with R
    }
  }
};

// Image files used on fleet cards + modal header
var VEHICLE_IMAGES = {
  'sedan': 'images/vehicle-sedan.svg',
  'suv': 'images/vehicle-suv.svg',
  'premium-suv': 'images/vehicle-premium-suv.svg',
  'tempo-traveller': 'images/vehicle-tempo-traveller.svg',
  'mini-staff-bus': 'images/vehicle-mini-staff-bus.svg'
};

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav toggle ---------- */
  var menuBtn = document.getElementById('menu-toggle');
  var menu = document.getElementById('mobile-menu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      menu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', menu.classList.contains('open') ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        if (openItem !== item) openItem.classList.remove('open');
      });
      item.classList.toggle('open', !wasOpen);
    });
  });

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

  function waLink(message) {
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
  }

  function renderRateTable(vehicleId, pickup) {
    var v = VEHICLES[vehicleId];
    if (!v || !modalRateBody) return;
    var pickupLabel = pickup === 'dabolim' ? 'Dabolim Airport' : 'Mopa Airport';
    modalRateBody.innerHTML = '';
    v.rates[pickup].forEach(function (row) {
      var tr = document.createElement('tr');
      var priceClass = pickup === 'dabolim' ? 'price-sedan' : 'price-suv';
      tr.innerHTML =
        '<td class="route-name">' + pickupLabel + ' → ' + row.d + '</td>' +
        '<td class="num ' + priceClass + '">₹' + row.p.toLocaleString('en-IN') + '</td>' +
        '<td class="num"><a href="' + waLink('Hi Maheshwari Tours and Travels, I would like to book a ' + v.name + ' from ' + pickupLabel + ' to ' + row.d + '. Fare: ₹' + row.p + '.') + '" target="_blank" rel="noopener noreferrer" class="btn-enquire">Book</a></td>';
      modalRateBody.appendChild(tr);
    });
  }

  function openModal(vehicleId) {
    var v = VEHICLES[vehicleId];
    if (!v) return;
    currentVehicleId = vehicleId;

    modalName.textContent = v.name;
    modalTagline.textContent = v.tagline;
    modalIcon.innerHTML = '<img src="' + (VEHICLE_IMAGES[vehicleId] || '') + '" alt="' + v.name + '" width="120" height="64">';
    modalBadges.innerHTML =
      '<span class="vbadge">' + (v.ac ? 'AC' : 'Non-AC') + '</span>' +
      '<span class="vbadge">' + v.seats + ' Seats</span>' +
      '<span class="vbadge">' + v.type + '</span>';

    modalTabs.forEach(function (t) {
      t.classList.toggle('active', t.getAttribute('data-pickup') === 'dabolim');
    });
    renderRateTable(vehicleId, 'dabolim');

    modalBookLink.href = waLink('Hi Maheshwari Tours and Travels, I would like to book a ' + v.name + '. Please share availability.');

    pkgHalfLink.href = waLink('Hi Maheshwari Tours and Travels, I would like a Half Day package quote for a ' + v.name + '.');
    pkgFullLink.href = waLink('Hi Maheshwari Tours and Travels, I would like a Full Day package quote for a ' + v.name + '.');
    pkgOutstationLink.href = waLink('Hi Maheshwari Tours and Travels, I would like an Outstation multi-day package quote for a ' + v.name + '.');

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
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
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  modalTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      modalTabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      renderRateTable(currentVehicleId, tab.getAttribute('data-pickup'));
    });
  });

});
