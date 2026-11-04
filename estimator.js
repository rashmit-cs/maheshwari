// Goa taxi fare estimator. Rates are read from data-* attributes in the page markup.
(function () {
  function money(n) { return '₹' + Math.round(n).toLocaleString('en-IN'); }
  var FP = window.FUEL_PRICES;
  function rng(a, b) { return '₹' + a.toFixed(2) + (b > a ? ' to ₹' + b.toFixed(2) : ''); }
  if (FP) {
    document.querySelectorAll('[data-fuel="petrol"]').forEach(function (e) { e.textContent = rng(FP.petrolLow, FP.petrolHigh); });
    document.querySelectorAll('[data-fuel="diesel"]').forEach(function (e) { e.textContent = rng(FP.dieselLow, FP.dieselHigh); });
    document.querySelectorAll('[data-fuel="date"]').forEach(function (e) { e.textContent = FP.date; });
  }
  document.querySelectorAll('[data-estimator]').forEach(function (root) {
    function q(s) { return root.querySelector(s); }
    var veh = q('.es-vehicle'), seat = q('.es-seat'), air = q('.es-air'), sight = q('.es-sight'), num = q('.es-km-num'), rngEl = q('.es-km-range'), kmOut = q('.es-km-out'),
        total = q('.es-total'), lines = q('.es-lines'), cta = q('.es-cta'), cmp = q('.es-cmp'),
        rent = q('.es-rent'), days = q('.es-days'), fuel = q('.es-fuel'), mpl = q('.es-mpl'), dep = q('.es-dep'), cd = q('.es-cdist'),
        fSeat = q('.es-f-seat'), fCustom = q('.es-f-custom'), customTxt = q('.es-custom'), fAir = q('.es-f-air'), fSight = q('.es-f-sight'), fKm = q('.es-f-km'), sub = q('.es-slider-sub'),
        shortKm = parseFloat(root.getAttribute('data-short-km')) || 25, wa = root.getAttribute('data-wa'),
        price = FP ? { petrol: (FP.petrolLow + FP.petrolHigh) / 2, diesel: (FP.dieselLow + FP.dieselHigh) / 2 } : { petrol: parseFloat(root.getAttribute('data-petrol')), diesel: parseFloat(root.getAttribute('data-diesel')) },
        cdTouched = false, lastV = null;
    function mode() { return root.querySelector('input[name="mode"]:checked').value; }
    function li(t) { var e = document.createElement('li'); e.textContent = t; lines.appendChild(e); }
    function link(msg) { cta.href = 'https://wa.me/' + wa + '?text=' + encodeURIComponent(msg); }
    function clamp(v) { v = parseFloat(v); if (isNaN(v)) return NaN; return Math.min(300, Math.max(5, v)); }
    function update() {
      lines.innerHTML = ''; cmp.innerHTML = '';
      var m = mode(), o = veh.options[veh.selectedIndex], vk = veh.value, bus = o.getAttribute('data-kind') === 'bus', rate = parseFloat(o.getAttribute('data-rate')) || 0,
          name = o.getAttribute('data-name'), seats = o.getAttribute('data-seats'), col = o.getAttribute('data-col');
      var so = seat.options[seat.selectedIndex], sname = so.textContent;
      if (bus) { name = 'Tempo Traveller / Bus, ' + sname; }
      var ro = air.options[air.selectedIndex], rtype = ro.getAttribute('data-type'), isCustom = m === 'airport' && rtype === 'custom';
      fSeat.hidden = !bus; fAir.hidden = m !== 'airport'; fSight.hidden = m !== 'sight'; fKm.hidden = !(m === 'oneway' || m === 'round' || isCustom); fCustom.hidden = !isCustom;
      if (sub) sub.textContent = m === 'round' ? ' (each way)' : ' (one way)';
      var km = clamp(num.value); num.removeAttribute('aria-invalid');
      var fare = null, dist = null, label = '', note = '';
      if (m === 'oneway' || m === 'round') {
        if (isNaN(km)) { num.setAttribute('aria-invalid', 'true'); total.textContent = 'Enter 5 to 300 km'; link('Hi Maheshwari Tours and Travels, I would like a taxi quote. Vehicle: ' + name + '.'); return; }
        dist = km * (m === 'round' ? 2 : 1); label = (m === 'round' ? 'Round trip' : 'One-way') + ', ' + km + ' km' + (m === 'round' ? ' each way' : '');
        if (bus || !rate) { note = 'Tempo Traveller and bus trips by distance are quoted on request. Tap Book on WhatsApp.'; }
        else if (km < shortKm) { note = 'Trips under ' + shortKm + ' km are priced as city or route fares. Tap Book on WhatsApp for the exact price.'; }
        else { fare = dist * rate; }
      } else if (m === 'airport') {
        var a = ro;
        if (isCustom) {
          if (isNaN(km)) { num.setAttribute('aria-invalid', 'true'); total.textContent = 'Enter 5 to 300 km'; link('Hi Maheshwari Tours and Travels, I would like a taxi quote. Vehicle: ' + name + '.'); return; }
          dist = km; label = 'Custom route' + (customTxt.value.trim() ? ' (' + customTxt.value.trim() + ')' : '') + ', ' + km + ' km';
          if (bus || !rate) note = 'Tempo Traveller and bus trips by distance are quoted on request. Tap Book on WhatsApp.';
          else if (km < shortKm) note = 'Short hops are priced as route fares (the nearest listed short trips start from about ₹600 for a sedan). Tap Book on WhatsApp for the exact price.';
          else fare = km * rate;
        } else {
          dist = parseFloat(a.getAttribute('data-km')); label = a.textContent.replace('↔', 'to / from');
          if (bus) { if (rtype === 'airport') { var bv = parseFloat(so.getAttribute('data-air')); label = 'Airport pickup and drop'; if (bv) fare = bv; } else note = 'Tempo Traveller and bus fares are listed for airport pickup and drop. For this route, tap Book on WhatsApp for a quote.'; }
          else { var v = col ? parseFloat(a.getAttribute('data-' + col)) : 0; if (v) fare = v; else note = name + ' fares for this route are quoted on request.'; }
        }
      } else {
        var s = sight.options[sight.selectedIndex]; dist = parseFloat(s.getAttribute('data-km')); label = s.textContent;
        if (bus) {
          if (s.getAttribute('data-pk') === '8') { fare = parseFloat(so.getAttribute('data-day')); label = '8 hours, 80 km'; }
          else note = 'Only the 8 hour / 80 km day package is priced for Tempo Traveller and buses. Other packages are quoted on request.';
        } else {
          var sv = col === 'sedan' || col === 'suv' ? parseFloat(s.getAttribute('data-' + col)) : 0;
          if (sv) fare = sv; else note = name + ' is quoted on request for this package.';
        }
      }
      var msg = 'Hi Maheshwari Tours and Travels, I would like to book a taxi. Vehicle: ' + name + (bus ? '' : ' (' + seats + ' seats)') + '. Trip: ' + label + '.';
      if (fare === null) {
        total.textContent = 'Quote on request'; if (note) li(note);
        link(msg + ' Please share a quote.');
      } else {
        total.textContent = money(fare);
        li('Vehicle: ' + name);
        li('Trip: ' + label);
        if (m === 'oneway' || m === 'round') li(dist + ' km × ' + money(rate) + ' per km = ' + money(fare) + ', driver and fuel included. Tolls and permit tax extra.');
        else if (isCustom) li(dist + ' km × ' + money(rate) + ' per km = ' + money(fare) + ', driver and fuel included. Tolls and permit tax extra.');
        else if (m === 'airport') li(bus ? 'Airport pickup and drop fare. Confirm tolls and parking at booking.' : 'Fixed route fare, the same each way. Tolls and parking included.');
        else li('Fixed package fare for 8 hours / 80 km. Extra hours and kilometres are charged separately.');
        link(msg + ' Estimate shown on website: ' + money(fare) + ' (indicative, please confirm the exact price).');
      }
      if (!isNaN(km)) { if (rngEl.value != km) rngEl.value = km; kmOut.textContent = km + ' km'; }
      // ---- comparison ----
      if (bus) { cmp.textContent = 'The self-drive comparison is for cars. For a group, message us and we will suggest the best vehicle.'; return; }
      var mp = parseFloat(o.getAttribute('data-mpl')) || 16;
      if (lastV !== vk) { mpl.value = mp; lastV = vk; fuel.value = (vk === 'ertiga' || vk === 'innova') ? 'diesel' : 'petrol'; }
      if (!cdTouched && dist) cd.value = dist;
      var r = parseFloat(rent.value), d = parseInt(days.value, 10), mp2 = parseFloat(mpl.value), c = parseFloat(cd.value), dp = parseFloat(dep.value);
      if (!(r >= 0) || !(d >= 1 && d <= 30) || !(mp2 > 0) || !(c >= 1)) { cmp.textContent = 'Fill in the rental, days, mileage and distance to compare.'; return; }
      var fp = price[fuel.value], fcost = (c / mp2) * fp, self = r * d + fcost;
      var h = document.createElement('div');
      function row(t, v) { var p = document.createElement('p'); p.className = 'cmp-row'; var a1 = document.createElement('span'), b1 = document.createElement('b'); a1.textContent = t; b1.textContent = v; p.appendChild(a1); p.appendChild(b1); h.appendChild(p); }
      row('Self-drive: rental ' + money(r * d) + ' + fuel ' + money(fcost) + ' (' + c + ' km at ' + mp2 + ' km/l, ' + fuel.value + ' about ₹' + fp.toFixed(2) + '/l)', money(self));
      var p0 = document.createElement('p');
      if (fare !== null) {
        row('Taxi: estimated fare', money(fare));
        var diff = self - fare; p0.className = 'cmp-verdict';
        if (Math.abs(diff) < 1) p0.textContent = 'On these numbers the two cost about the same.';
        else if (diff > 0) p0.textContent = 'Estimated saving with our taxi: ' + money(diff) + '.';
        else p0.textContent = 'On these numbers self-drive is cheaper by ' + money(-diff) + '. A taxi adds a driver, no navigating and no deposit.';
      } else { p0.className = 'cmp-verdict'; p0.textContent = 'Taxi fare is quoted on request for this choice, so we cannot compare yet.'; }
      h.appendChild(p0);
      var n = document.createElement('p'); n.className = 'fc-hint';
      n.textContent = 'Not counted for either option: parking, tolls and extra charges. The ' + money(dp || 0) + ' refundable deposit is money tied up for the rental period, not money saved, and damage deductions depend on the rental agreement. Fuel prices are dated reference values.';
      h.appendChild(n); cmp.appendChild(h);
    }
    rngEl.addEventListener('input', function () { num.value = rngEl.value; update(); });
    num.addEventListener('input', update);
    cd.addEventListener('input', function () { cdTouched = true; update(); });
    root.querySelectorAll('input[name="mode"]').forEach(function (r) { r.addEventListener('change', function () { cdTouched = false; update(); }); });
    [veh, seat, air, sight, rent, days, fuel, mpl, dep, customTxt].forEach(function (el) { el.addEventListener('input', update); el.addEventListener('change', update); });
    [air, sight].forEach(function (el) { el.addEventListener('change', function () { cdTouched = false; update(); }); });
    update();
  });
})();
