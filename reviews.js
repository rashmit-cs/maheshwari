// REAL customer reviews only. Add one only with the customer's permission, exactly as they wrote it.
// Example entry (delete the slashes to use):
// { name: 'First name', trip: 'Airport transfer, Oct 2026', text: 'Their exact words.' },
window.CUSTOMER_REVIEWS = [
];
(function () {
  var box = document.getElementById('review-list'); if (!box) return;
  var R = window.CUSTOMER_REVIEWS || []; if (!R.length) return;
  var ul = document.createElement('ul'); ul.className = 'review-items';
  R.forEach(function (r) {
    var li = document.createElement('li'), p = document.createElement('p'), c = document.createElement('p');
    p.className = 'review-text'; p.textContent = '“' + r.text + '”'; c.className = 'review-by'; c.textContent = r.name + (r.trip ? ', ' + r.trip : '');
    li.appendChild(p); li.appendChild(c); ul.appendChild(li);
  });
  var h = document.createElement('h3'); h.textContent = 'What customers say'; box.appendChild(h); box.appendChild(ul);
  var n = document.createElement('p'); n.className = 'table-note'; n.textContent = 'Shared by customers with their permission.'; box.appendChild(n);
})();
