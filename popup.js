// WhatsApp enquiry popup: opens once per browser tab after a short wait. No tracking, nothing is sent until the visitor taps a button.
(function () {
  var WA = '919307974659', DELAY = 30000;
  try { if (sessionStorage.getItem('mtt-popup-closed')) return; } catch (e) {}
  if (document.querySelector('.mobile-menu.open, .modal-overlay.open')) { /* page busy: still schedule */ }
  var TOURS = ['Complete Goa Experience (4 days)', 'Dudhsagar Waterfall & Nature Tour', 'Goa Adventure & Water Sports Tour', 'Goa Explorer Tour (3 days)', 'Goa Highlights Tour (2 days)',
    'Goa Temples & Spice Plantation Tour', 'North Goa Hidden Beaches Tour', 'North Goa Sightseeing Tour', 'Old Goa Heritage & Panjim City Tour', 'South Goa Beaches & Scenic Tour'];
  function pick(n) { var a = TOURS.slice(), r = []; while (r.length < n && a.length) r.push(a.splice(Math.floor(Math.random() * a.length), 1)[0]); return r; }
  function link(t) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent('Hi Maheshwari Tours and Travels, ' + t); }
  var opener = null, box, overlay;
  function close() {
    try { sessionStorage.setItem('mtt-popup-closed', '1'); } catch (e) {}
    if (overlay) overlay.remove(); overlay = null;
    document.removeEventListener('keydown', onKey);
    if (opener && opener.focus) opener.focus();
  }
  function onKey(e) {
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;
    var f = box.querySelectorAll('a[href], button'); if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function show() {
    if (overlay || document.querySelector('.modal-overlay.open')) return;
    opener = document.activeElement;
    var t = pick(2), items = [
      ['Airport transfer (Dabolim or Mopa)', 'I would like an airport transfer quote.'],
      ['8 hour / 80 km day package', 'I would like to book an 8 hour / 80 km day package.'],
      [t[0], 'I am interested in the "' + t[0] + '" package. Please share details.'],
      [t[1], 'I am interested in the "' + t[1] + '" package. Please share details.'],
      ['Outstation trip', 'I would like a quote for an outstation trip.'],
      ['Tempo Traveller or bus for a group', 'I need a Tempo Traveller or bus for a group.']];
    overlay = document.createElement('div'); overlay.className = 'mtt-pop-overlay';
    box = document.createElement('div'); box.className = 'mtt-pop'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-labelledby', 'mtt-pop-title');
    var h = '<button type="button" class="mtt-pop-x" aria-label="Close">×</button><p class="mtt-pop-eyebrow">Maheshwari Tours and Travels</p><h2 id="mtt-pop-title">Planning a Goa trip?</h2>' +
      '<p class="mtt-pop-sub">Tap what you need. WhatsApp opens with your message ready, and we reply with the fare and availability.</p><ul class="mtt-pop-list">';
    items.forEach(function (it) { h += '<li><a href="' + link(it[1]) + '" target="_blank" rel="noopener noreferrer">' + it[0].replace(/&/g, '&amp;') + '<span class="sr-only"> (opens WhatsApp in a new tab)</span></a></li>'; });
    h += '</ul><p class="mtt-pop-foot"><a href="' + link('I have a question about a trip in Goa.') + '" target="_blank" rel="noopener noreferrer">Or message us your own question<span class="sr-only"> (opens WhatsApp in a new tab)</span></a> · <button type="button" class="mtt-pop-no">No thanks</button></p>';
    box.innerHTML = h; overlay.appendChild(box); document.body.appendChild(overlay);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    box.querySelector('.mtt-pop-x').addEventListener('click', close); box.querySelector('.mtt-pop-no').addEventListener('click', close);
    box.querySelectorAll('.mtt-pop-list a, .mtt-pop-foot a').forEach(function (a) { a.addEventListener('click', function () { try { sessionStorage.setItem('mtt-popup-closed', '1'); } catch (e) {} }); });
    document.addEventListener('keydown', onKey);
    box.querySelector('.mtt-pop-list a').focus();
  }
  setTimeout(show, DELAY);
})();
