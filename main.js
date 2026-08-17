// Maheshwari Tours and Travels — site scripts
// Plain JS, no build step, no external dependency.

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

  /* ---------- Fare calculator ---------- */
  // PLACEHOLDER RATES — modeled on typical Goa taxi market pricing.
  // Replace with your actual verified rates before this site goes live.
  var ROUTE_RATES = {
    'dabolim-calangute':  { label: 'Dabolim Airport → Calangute',  km: 34, sedan: 1300, suv: 1600, premium: 1900 },
    'dabolim-candolim':   { label: 'Dabolim Airport → Candolim',   km: 37, sedan: 1300, suv: 1600, premium: 1900 },
    'mopa-calangute':     { label: 'Mopa Airport → Calangute',     km: 35, sedan: 1200, suv: 1400, premium: 1700 },
    'mopa-candolim':      { label: 'Mopa Airport → Candolim',      km: 38, sedan: 1300, suv: 1500, premium: 1800 },
    'madgaon-panaji':     { label: 'Madgaon Station → Panaji',     km: 33, sedan: 1200, suv: 1450, premium: 1700 },
    'thivim-baga':        { label: 'Thivim Station → Baga',        km: 23, sedan: 1000, suv: 1200, premium: 1400 },
    'colva-madgaon':      { label: 'Colva → Madgaon Station',      km: 8,  sedan: 600,  suv: 800,  premium: 950  },
    'calangute-anjuna':   { label: 'Calangute → Anjuna',           km: 6,  sedan: 600,  suv: 700,  premium: 850  }
  };
  var HOURLY_RATES = {
    '4':  { label: '4 Hours / 40 KM',   sedan: 1400, suv: 1800 },
    '8':  { label: '8 Hours / 80 KM',   sedan: 2500, suv: 3200 },
    '12': { label: '12 Hours / 120 KM', sedan: 3400, suv: 4300 }
  };
  var OUTSTATION_PER_KM = { sedan: 13, suv: 17, premium: 20 };
  var OUTSTATION_MIN_KM = 250; // typical round-trip minimum billing for outstation

  var calc = document.getElementById('fare-calculator');
  if (calc) {
    var tabs = calc.querySelectorAll('.calc-tab');
    var panels = calc.querySelectorAll('.calc-panel');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var target = tab.getAttribute('data-target');
        panels.forEach(function (p) {
          p.style.display = (p.id === target) ? 'block' : 'none';
        });
      });
    });

    // Route tab
    var routeSelect = document.getElementById('calc-route');
    var routeResultSedan = document.getElementById('route-result-sedan');
    var routeResultSuv = document.getElementById('route-result-suv');
    var routeWhatsapp = document.getElementById('route-whatsapp-link');
    function updateRoute() {
      if (!routeSelect) return;
      var r = ROUTE_RATES[routeSelect.value];
      if (!r) return;
      routeResultSedan.textContent = '₹' + r.sedan.toLocaleString('en-IN');
      routeResultSuv.textContent = '₹' + r.suv.toLocaleString('en-IN');
      if (routeWhatsapp) {
        var msg = 'Hi Maheshwari Tours and Travels, I would like to book a taxi for ' + r.label +
          ' (' + r.km + ' km). Sedan fare: ₹' + r.sedan + ', SUV fare: ₹' + r.suv + '.';
        routeWhatsapp.href = 'https://wa.me/919307974659?text=' + encodeURIComponent(msg);
      }
    }
    if (routeSelect) {
      routeSelect.addEventListener('change', updateRoute);
      updateRoute();
    }

    // Hourly tab
    var hourSelect = document.getElementById('calc-hours');
    var hourResultSedan = document.getElementById('hour-result-sedan');
    var hourResultSuv = document.getElementById('hour-result-suv');
    var hourWhatsapp = document.getElementById('hour-whatsapp-link');
    function updateHourly() {
      if (!hourSelect) return;
      var h = HOURLY_RATES[hourSelect.value];
      if (!h) return;
      hourResultSedan.textContent = '₹' + h.sedan.toLocaleString('en-IN');
      hourResultSuv.textContent = '₹' + h.suv.toLocaleString('en-IN');
      if (hourWhatsapp) {
        var msg = 'Hi Maheshwari Tours and Travels, I would like to book an hourly rental (' + h.label +
          '). Sedan fare: ₹' + h.sedan + ', SUV fare: ₹' + h.suv + '.';
        hourWhatsapp.href = 'https://wa.me/919307974659?text=' + encodeURIComponent(msg);
      }
    }
    if (hourSelect) {
      hourSelect.addEventListener('change', updateHourly);
      updateHourly();
    }

    // Outstation tab
    var kmInput = document.getElementById('calc-km');
    var outResultSedan = document.getElementById('out-result-sedan');
    var outResultSuv = document.getElementById('out-result-suv');
    var outResultPremium = document.getElementById('out-result-premium');
    var outWhatsapp = document.getElementById('out-whatsapp-link');
    function updateOutstation() {
      if (!kmInput) return;
      var km = Math.max(parseInt(kmInput.value, 10) || 0, OUTSTATION_MIN_KM);
      var sedan = km * OUTSTATION_PER_KM.sedan;
      var suv = km * OUTSTATION_PER_KM.suv;
      var premium = km * OUTSTATION_PER_KM.premium;
      outResultSedan.textContent = '₹' + sedan.toLocaleString('en-IN');
      outResultSuv.textContent = '₹' + suv.toLocaleString('en-IN');
      outResultPremium.textContent = '₹' + premium.toLocaleString('en-IN');
      if (outWhatsapp) {
        var msg = 'Hi Maheshwari Tours and Travels, I would like an outstation quote for approx ' + km +
          ' km. Sedan: ₹' + sedan + ', SUV: ₹' + suv + ', Premium SUV: ₹' + premium + '.';
        outWhatsapp.href = 'https://wa.me/919307974659?text=' + encodeURIComponent(msg);
      }
    }
    if (kmInput) {
      kmInput.addEventListener('input', updateOutstation);
      updateOutstation();
    }
  }

});
