// Outstation fare estimator. Rates are read from the <option data-rate> values in the page,
// so the visible rate table, the calculator and the structured data come from one source.
(function () {
  function money(n) { return '₹' + Math.round(n).toLocaleString('en-IN'); }
  document.querySelectorAll('[data-fare-calc]').forEach(function (root) {
    var veh = root.querySelector('.fc-vehicle'), trip = root.querySelector('.fc-trip'),
        km = root.querySelector('.fc-km'), days = root.querySelector('.fc-days'),
        total = root.querySelector('.fc-total'), lines = root.querySelector('.fc-lines'),
        cta = root.querySelector('.fc-cta'), hint = root.querySelector('.fc-hint'),
        minKm = parseFloat(root.getAttribute('data-min-km')) || 250, wa = root.getAttribute('data-wa'), dest = '';
    var NEW = '<span class="sr-only"> (opens in a new tab)</span>';
    function setLink(msg) { cta.href = 'https://wa.me/' + wa + '?text=' + encodeURIComponent(msg); }
    function li(t) { var e = document.createElement('li'); e.textContent = t; lines.appendChild(e); }
    function update() {
      lines.innerHTML = '';
      var opt = veh.options[veh.selectedIndex], rate = parseFloat(opt.getAttribute('data-rate')) || 0;
      var name = opt.getAttribute('data-name'), seats = opt.getAttribute('data-seats');
      var d = parseInt(days.value, 10), k = parseFloat(km.value), round = trip.value === 'round';
      var base = 'Hi Maheshwari Tours and Travels, I would like to enquire about an outstation trip. Vehicle: ' + name + ' (' + seats + ' seats).';
      var daysOk = d >= 1 && d <= 30, kmOk = k >= 1 && k <= 3000;
      km.removeAttribute('aria-invalid'); days.removeAttribute('aria-invalid');
      if (km.value !== '' && !kmOk) { km.setAttribute('aria-invalid', 'true'); total.textContent = 'Enter a distance between 1 and 3000 km'; setLink(base + ' Please share a quote.'); return; }
      if (!daysOk) { days.setAttribute('aria-invalid', 'true'); total.textContent = 'Enter 1 to 30 days'; setLink(base + ' Please share a quote.'); return; }
      if (!rate) {
        total.textContent = 'Quote on request';
        li(name + ' is quoted individually. Tap Enquire now with your route and dates.');
        setLink(base + (kmOk ? ' Distance: ' + k + ' km' + (round ? ' (round trip)' : ' (one way)') + '.' : '') + ' Days: ' + d + '. Please share a quote.');
        return;
      }
      if (!kmOk) { total.textContent = 'Enter the distance to see an estimate'; setLink(base + ' Days: ' + d + '. Please share a quote.'); return; }
      var dist = k * (round ? 2 : 1), min = minKm * d, billable = Math.max(dist, min), fare = billable * rate;
      total.textContent = money(fare);
      li('Vehicle: ' + name + ', ' + seats + ' seats at ' + money(rate) + ' per km');
      li('Trip distance: ' + dist + ' km (' + (round ? 'round trip' : 'one way') + ')');
      li('Billable distance: ' + billable + ' km' + (billable > dist ? ' (minimum ' + minKm + ' km per day applies)' : ''));
      li(billable + ' km × ' + money(rate) + ' = ' + money(fare) + ', driver allowance included. Tolls and permit tax extra.');
      setLink(base + (dest ? ' Destination: ' + dest + '.' : '') + ' Distance: ' + k + ' km' + (round ? ' (round trip)' : ' (one way)') + '. Days: ' + d +
        '. Estimate shown on website: ' + money(fare) + ' (indicative, please confirm the exact price).');
    }
    root.querySelectorAll('.fc-chip').forEach(function (c) {
      c.addEventListener('click', function () { km.value = c.getAttribute('data-km'); dest = c.getAttribute('data-dest'); update(); });
    });
    km.addEventListener('input', function () { dest = ''; update(); });
    [veh, trip, days].forEach(function (el) { el.addEventListener('input', update); el.addEventListener('change', update); });
    update();
  });
})();
