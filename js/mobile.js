/* Mobile layer: screen rail, reveal-on-arrival, swipe indicators, header state, smooth accordions.
   Runs only at ≤1007px; desktop is untouched. */
(function () {
  var mq = window.matchMedia('(max-width: 1007px)');
  if (!mq.matches) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement, body = document.body;
  var screens = [].slice.call(document.querySelectorAll('[data-scr]'));

  function go(el) { if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }

  /* ---- reveal: children of each screen ease in when it arrives ---- */
  var REVEAL = {
    'hero': null,
    'intro': '.intro > *',
    'editorial__text': '.editorial__text > *',
    'editorial__figure': '.editorial__figure > *',
    'toolbar': null,
    'pdp__gallery': null,
    'pdp__body': '.pdp__meta, .accs, .story, .star__sec, .pdp__body > .btn',
    'exp-group': '.m-title, .exp-group__label, .exp',
    'gal__item': '.gal__text',
    'vals__scr': 'li',
    'rec': '.m-title, .centered',
    'skills': '.m-title, .skills__grp, .skills__src',
    'care': '.m-title, .care__main > p, .field, .btn',
    'footer': '.footer__next, .footer__inner, .footer__copy'
  };
  function targets(scr) {
    for (var k in REVEAL) {
      if (scr.classList.contains(k)) {
        if (!REVEAL[k]) return [];
        return [].slice.call(scr.querySelectorAll(REVEAL[k].split(', ').map(function (s) { return s.replace('.' + k + ' > ', ':scope > '); }).join(', ')));
      }
    }
    return [];
  }
  /* case pages: headline under the photo reveals with screen 1 */
  var extra = new Map();
  var gal = document.querySelector('.pdp__gallery[data-scr]');
  if (gal) extra.set(gal, [].slice.call(document.querySelectorAll('.pdp__head > *')));
  var wk = document.querySelector('.toolbar[data-scr]');
  if (wk) {
    var cards = [].slice.call(document.querySelectorAll('.card'));
    extra.set(wk, cards.slice(0, 2)); extra.set(cards[2], cards.slice(2));
  }

  screens.forEach(function (s) {
    var list = targets(s).concat(extra.get(s) || []);
    list.forEach(function (el, i) { el.classList.add('rv'); el.style.setProperty('--i', Math.min(i, 8)); });
    s._rv = list;
  });

  /* ---- rail: one dot per screen, tap to jump ---- */
  var rail = null, dots = [];
  if (screens.length > 2) {
    rail = document.createElement('nav'); rail.className = 'rail'; rail.setAttribute('aria-label', 'Screens');
    screens.forEach(function (s, i) {
      var b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Go to screen ' + (i + 1));
      b.addEventListener('click', function () { go(s); });
      rail.appendChild(b); dots.push(b);
    });
    body.appendChild(rail);
  }

  var current = -1;
  function setCurrent(i) {
    if (i === current) return; current = i;
    dots.forEach(function (d, k) { d.setAttribute('aria-current', k === i ? 'true' : 'false'); });
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && e.intersectionRatio >= 0.35) {
        (e.target._rv || []).forEach(function (el) { el.classList.add('in'); });
      }
    });
    /* current = the screen whose top is nearest the header */
    var best = 0, bd = Infinity, hh = 50;
    screens.forEach(function (s, k) { var d = Math.abs(s.getBoundingClientRect().top - hh); if (d < bd) { bd = d; best = k; } });
    setCurrent(best);
  }, { threshold: [0, 0.35, 0.6, 1] });
  screens.forEach(function (s) { io.observe(s); });
  window.addEventListener('scroll', function () {
    var best = 0, bd = Infinity;
    screens.forEach(function (s, k) { var d = Math.abs(s.getBoundingClientRect().top - 50); if (d < bd) { bd = d; best = k; } });
    setCurrent(best);
  }, { passive: true });

  /* ---- home: solid header once past the photo; dots + one-time hint on the hero ---- */
  var hero = document.querySelector('.hero');
  if (hero) {
    var past = function () { body.classList.toggle('m-past', hero.getBoundingClientRect().bottom <= 60); };
    window.addEventListener('scroll', past, { passive: true }); past();

    var slides = [].slice.call(hero.querySelectorAll('.hero__slide'));
    var hd = document.createElement('div'); hd.className = 'hero__dots'; hd.setAttribute('aria-hidden', 'true');
    slides.forEach(function () { hd.appendChild(document.createElement('span')); });
    hero.appendChild(hd);
    var paint = function () {
      var a = slides.findIndex(function (s) { return s.classList.contains('is-active'); });
      [].forEach.call(hd.children, function (d, i) { d.classList.toggle('on', i === a); });
    };
    paint();
    new MutationObserver(paint).observe(hero, { subtree: true, attributes: true, attributeFilter: ['class'] });

    var hint = document.createElement('div'); hint.className = 'hero__hint'; hint.textContent = 'Swipe for more photos';
    hero.appendChild(hint);
    var KEY = 'dk-m-hint';
    try { if (!localStorage.getItem(KEY)) {
      setTimeout(function () { hint.classList.add('show'); }, 900);
      var hide = function () { hint.classList.remove('show'); try { localStorage.setItem(KEY, '1'); } catch (e) {} };
      setTimeout(hide, 4200); hero.addEventListener('touchstart', hide, { once: true, passive: true });
    } } catch (e) {}
  }

  /* ---- case photo stacks: dots + counter ---- */
  [].forEach.call(document.querySelectorAll('.cs'), function (cs) {
    var cards = [].slice.call(cs.querySelectorAll('.cs__card')), n = cards.length;
    var bar = document.createElement('div'); bar.className = 'cs-dots'; bar.setAttribute('aria-hidden', 'true');
    cards.forEach(function () { bar.appendChild(document.createElement('i')); });
    var lab = document.createElement('b'); bar.appendChild(lab);
    cs.parentNode.appendChild(bar);
    var paint = function () {
      var top = cards.findIndex(function (c) { return c.dataset.p === '0'; });
      [].forEach.call(bar.querySelectorAll('i'), function (d, i) { d.classList.toggle('on', i === top); });
      lab.textContent = (top + 1) + ' / ' + n + (top === 0 ? ' · swipe' : '');
    };
    paint();
    new MutationObserver(paint).observe(cs, { subtree: true, attributes: true, attributeFilter: ['data-p'] });
  });

  /* ---- Beyond: tap a photo to move to the next one ---- */
  [].forEach.call(document.querySelectorAll('.gal__item img'), function (img) {
    img.addEventListener('click', function () {
      var i = screens.indexOf(img.closest('[data-scr]'));
      go(screens[i + 1]);
    });
  });

  /* ---- accordions: one open at a time, smooth height ---- */
  var accs = [].slice.call(document.querySelectorAll('.acc'));
  function animate(d, open) {
    var sum = d.querySelector('summary');
    var start = d.offsetHeight;
    if (open) d.open = true;
    var end = open ? d.scrollHeight : sum.offsetHeight;
    if (reduce || !d.animate) { d.open = open; return; }
    d.style.overflow = 'hidden';
    var a = d.animate([{ height: start + 'px' }, { height: end + 'px' }], { duration: 320, easing: 'cubic-bezier(.2,.7,.2,1)' });
    a.onfinish = function () { d.style.overflow = ''; if (!open) d.open = false; };
  }
  /* if the details screen would run past one screen, start with everything collapsed */
  var pb = document.querySelector('.pdp__body');
  if (pb && pb.scrollHeight > window.innerHeight - 50 + 2) accs.forEach(function (d) { d.open = false; });
  accs.forEach(function (d) {
    d.querySelector('summary').addEventListener('click', function (e) {
      e.preventDefault();
      var opening = !d.open;
      if (opening) accs.forEach(function (o) { if (o !== d && o.open) animate(o, false); });
      animate(d, opening);
    });
  });
})();
