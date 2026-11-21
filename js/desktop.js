/* Desktop layer: screen rail, reveal-on-arrival, home header state, Beyond click-to-advance.
   Runs only at ≥1008px. */
(function () {
  if (!window.matchMedia('(min-width: 1008px)').matches) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var body = document.body, HH = 60;
  var screens = [].slice.call(document.querySelectorAll('[data-dscr]'));
  function go(el) { if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }

  function q(root, sel) { return [].slice.call(root.querySelectorAll(sel)); }
  function targets(s) {
    var c = s.classList;
    if (c.contains('hero')) return [];
    if (c.contains('editorial__text') || c.contains('editorial__figure')) return [].slice.call(s.children);
    if (c.contains('work')) return q(s, '.card');
    if (c.contains('pdp')) return q(s, '.pdp__head > *, .pdp__meta, .accs, .pdp__body > .btn');
    if (c.contains('exp-overview')) return q(document, '.care__side > *').concat(q(s, 'tr'));
    if (c.contains('exp-group')) return q(s, '.exp-group__label, .exp');
    if (c.contains('gal__item')) { var n = s.nextElementSibling; return q(s, 'img, .gal__text').concat(n ? q(n, '.gal__intro > *, img, .gal__text') : []); }
    if (c.contains('care') && s.querySelector('.exp-overview')) return q(s, '.care__side > *, .exp-overview tr');
    if (c.contains('care') && s.querySelector('.vals')) return q(s, '.vals li');
    if (c.contains('care')) return q(s, '.care__side > *, .care__main > p, .field, .btn');
    if (c.contains('rec')) return q(s, '.centered');
    if (c.contains('footer')) return q(s, '.footer__next, .footer__inner, .footer__copy');
    return [];
  }
  screens.forEach(function (s) {
    var list = targets(s);
    list.forEach(function (el, i) { el.classList.add('rv'); el.style.setProperty('--i', Math.min(i, 10)); });
    s._rv = list;
  });

  var dots = [];
  if (screens.length > 1) {
    var rail = document.createElement('nav'); rail.className = 'rail'; rail.setAttribute('aria-label', 'Screens');
    screens.forEach(function (s, i) {
      var b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Go to screen ' + (i + 1));
      b.addEventListener('click', function () { go(s); });
      rail.appendChild(b); dots.push(b);
    });
    body.appendChild(rail);
  }
  var current = -1;
  function track() {
    var best = 0, bd = Infinity;
    screens.forEach(function (s, k) { var d = Math.abs(s.getBoundingClientRect().top - HH); if (d < bd) { bd = d; best = k; } });
    if (best === current) return; current = best;
    dots.forEach(function (d, k) { d.setAttribute('aria-current', k === best ? 'true' : 'false'); });
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting && e.intersectionRatio >= 0.3) (e.target._rv || []).forEach(function (el) { el.classList.add('in'); }); });
    track();
  }, { threshold: [0, 0.3, 0.6, 1] });
  screens.forEach(function (s) { io.observe(s); });
  window.addEventListener('scroll', track, { passive: true }); track();

  /* case pages: if the details would run past the screen, start with accordions collapsed */
  var pdp = document.querySelector('.pdp[data-dscr]');
  if (pdp && pdp.scrollHeight > window.innerHeight - HH + 2) [].forEach.call(pdp.querySelectorAll('.acc'), function (d) { d.open = false; });

  /* wheel / trackpad: one gesture = one screen; taller screens scroll normally until their edge */
  var lock = false, lastWheel = 0, unlockAt = 0;
  function idx() { var best = 0, bd = Infinity; screens.forEach(function (s, k) { var d = Math.abs(s.getBoundingClientRect().top - HH); if (d < bd) { bd = d; best = k; } }); return best; }
  window.addEventListener('wheel', function (e) {
    if (e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
    var now = Date.now(), gap = now - lastWheel; lastWheel = now;
    if (document.getElementById('drawer') && !document.getElementById('drawer').hidden) return;
    if (e.target.closest && e.target.closest('dialog[open]')) return;
    var i = idx(), s = screens[i], r = s.getBoundingClientRect(), down = e.deltaY > 0;
    if (!lock) {
      if (down && r.bottom > window.innerHeight + 2) return;      /* let a tall screen scroll to its end */
      if (!down && r.top < HH - 2) return;
    }
    e.preventDefault();
    if (lock) { if (now < unlockAt || gap < 140) return; lock = false; }
    var t = screens[i + (down ? 1 : -1)];
    if (!t && down) { var last = screens[screens.length - 1]; if (last.getBoundingClientRect().bottom > window.innerHeight + 2) { window.scrollBy({ top: e.deltaY, behavior: 'auto' }); } return; }
    if (!t) return;
    lock = true; unlockAt = now + 750;
    go(t);
  }, { passive: false });

  var hero = document.querySelector('.hero');
  if (hero) {
    var past = function () { body.classList.toggle('d-past', hero.getBoundingClientRect().bottom <= HH + 1); };
    window.addEventListener('scroll', past, { passive: true }); past();
  }

  [].forEach.call(document.querySelectorAll('.gal__item img'), function (img) {
    img.addEventListener('click', function () {
      var li = img.closest('.gal__item'); var row = li.hasAttribute('data-dscr') ? li : li.previousElementSibling;
      go(screens[screens.indexOf(row) + 1]);
    });
  });
})();
