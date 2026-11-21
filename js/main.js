(function () {
  /* mobile menu */
  var d = document.getElementById('drawer');
  var b = document.querySelector('.header__burger');
  var c = document.querySelector('.drawer__close');
  function setMenu(o) { d.hidden = !o; b.setAttribute('aria-expanded', o); document.body.classList.toggle('no-scroll', o); }
  b.addEventListener('click', function () { setMenu(true); });
  c.addEventListener('click', function () { setMenu(false); });


  /* Letter of recommendation dialog */
  [].forEach.call(document.querySelectorAll('[data-letter]'), function (btn) {
    var dlg = document.getElementById(btn.dataset.letter);
    if (!dlg || typeof dlg.showModal !== 'function') return;
    btn.addEventListener('click', function () { dlg.showModal(); });
    dlg.querySelector('.letter__close').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  });

  /* Contact form: Formspree, with a mailto fallback */
  var form = document.getElementById('contact-form');
  if (form) {
    var status = form.querySelector('.form__status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim(), email = form.email.value.trim();
      if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
        status.textContent = 'Please add your name and a valid email.';
        (!name ? form.name : form.email).focus();
        return;
      }
      status.textContent = 'Sending…';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error('send failed'); form.classList.add('sent'); status.textContent = 'Thanks — I’ll reply within a day.'; })
        .catch(function () {
          var body = ['Name: ' + name, 'Email: ' + email, 'Reaching out about: ' + (form.reason.value || '—'), '', form.message.value].join('\n');
          window.location.href = 'mailto:kangd4u@gmail.com?subject=' + encodeURIComponent('Hello from ' + name) + '&body=' + encodeURIComponent(body);
          status.textContent = 'Opening your email app…';
        });
    });
  }


  /* case-study photo stack: click / arrow keys / swipe sends the top photo away to the back */
  (function () {
    var cs = document.querySelector('.cs');
    if (!cs) return;
    var cards = [].slice.call(cs.querySelectorAll('.cs__card')), n = cards.length;
    var live = cs.querySelector('.cs__sr'), top = 0, busy = false, drag = null, moved = false;
    var red = window.matchMedia('(prefers-reduced-motion: reduce)');
    function pos(i) { return (i - top + n) % n; }
    function layout() {
      cards.forEach(function (c, i) { c.dataset.p = pos(i); });
      live.textContent = 'Photo ' + (top + 1) + ' of ' + n;
    }
    function reflow(el) { void el.offsetWidth; }
    function next(dirSide) {                       /* top card leaves toward dirSide (-1 left, 1 right) and goes to the back */
      if (busy || n < 2) return;
      busy = true;
      var out = cards[top], cls = dirSide > 0 ? 'is-out-r' : 'is-out-l';
      var wait = red.matches ? 0 : 520;
      out.classList.add(cls);
      top = (top + 1) % n;
      cards.forEach(function (c, i) { if (c !== out) c.dataset.p = pos(i); });
      live.textContent = 'Photo ' + (top + 1) + ' of ' + n;
      setTimeout(function () {
        out.classList.add('no-tr'); out.dataset.p = n - 1; out.classList.remove(cls); out.style.transform = '';
        reflow(out); out.classList.remove('no-tr'); busy = false;
      }, wait);
    }
    function prev() {                              /* back card returns to the top from the left */
      if (busy || n < 2) return;
      busy = true;
      var back = cards[(top - 1 + n) % n];
      back.classList.add('no-tr', 'is-out-l'); back.dataset.p = 0; reflow(back);
      back.classList.remove('no-tr');
      top = (top - 1 + n) % n;
      cards.forEach(function (c, i) { if (c !== back) c.dataset.p = pos(i); });
      reflow(back); back.classList.remove('is-out-l');
      live.textContent = 'Photo ' + (top + 1) + ' of ' + n;
      setTimeout(function () { busy = false; }, red.matches ? 0 : 720);
    }
    cs.addEventListener('click', function () { if (moved) { moved = false; return; } next(-1); });
    cs.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); next(-1); } else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    });
    cs.addEventListener('touchstart', function (e) {
      if (busy) return;
      drag = { x: e.touches[0].clientX, y: e.touches[0].clientY, on: false, dx: 0, el: cards[top] };
    }, { passive: true });
    cs.addEventListener('touchmove', function (e) {
      if (!drag) return;
      var dx = e.touches[0].clientX - drag.x, dy = e.touches[0].clientY - drag.y;
      if (!drag.on) {
        if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) return;
        drag.on = true; drag.el.classList.add('no-tr');
      }
      drag.dx = dx;
      drag.el.style.transform = 'translateX(' + dx + 'px) rotate(' + (dx / 14) + 'deg)';
    }, { passive: true });
    cs.addEventListener('touchend', function () {
      if (!drag) return;
      var s = drag; drag = null;
      if (!s.on) return;
      moved = true; setTimeout(function () { moved = false; }, 400);
      s.el.classList.remove('no-tr'); reflow(s.el);
      if (Math.abs(s.dx) > cs.offsetWidth * 0.18) { s.el.style.transform = ''; next(s.dx > 0 ? 1 : -1); }
      else { s.el.style.transform = ''; }
    }, { passive: true });
  })();

  /* hero gallery: one image at a time; click / arrow keys / swipe */
  var hero = document.querySelector('.hero');
  if (!hero) { document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); }); return; }
  var slides = [].slice.call(hero.querySelectorAll('.hero__slide'));
  var cur = 0, busy = false;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var DUR = 560, EASE = 'cubic-bezier(0.65, 0, 0.35, 1)';

  function tone(i) { document.body.classList.toggle('hero-dark', slides[i].dataset.tone === 'dark'); }
  /* open on the photo that fits the visitor's time of day: morning Uji, afternoon Nara, evening Jerusalem sunset, night SF café */
  var hr = new Date().getHours();
  var part = hr >= 5 && hr < 12 ? 'morning' : hr < 17 ? 'afternoon' : hr < 21 ? 'evening' : 'night';
  var START = { morning: 0, afternoon: 1, evening: 3, night: 4 }[part];
  if (START >= slides.length) START = 0;
  cur = START;
  slides.forEach(function (s, i) { s.setAttribute('aria-hidden', i === START ? 'false' : 'true'); });
  slides[START].classList.add('is-active'); tone(START);
  var hi = document.createElement('span'); hi.className = 'board-hi'; hi.setAttribute('aria-hidden', 'true');
  hi.textContent = part === 'night' ? 'good night ☾' : 'good ' + part + ' ✦';
  hero.appendChild(hi);

  /* split-flap departures board: the caption flips letter by letter to the new city */
  var board = (function () {
    var caps = slides.map(function (s) { var c = s.querySelector('.hero__caption'); return c ? c.textContent.trim().toUpperCase() : ''; });
    var el = document.createElement('div'); el.className = 'board'; el.setAttribute('aria-hidden', 'true');
    var plane = document.createElement('span'); plane.className = 'board__p'; plane.textContent = '✈'; el.appendChild(plane);
    hero.appendChild(el); hero.classList.add('has-board');
    var CH = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ,.', tiles = [], timers = [];
    function tile() { var t = document.createElement('span'); t.className = 'board__t'; var i = document.createElement('i'); i.textContent = ' '; t.appendChild(i); el.appendChild(t); tiles.push(t); return t; }
    function put(t, c) { var i = t.firstChild; if (i.textContent === c) return; i.textContent = c; t.classList.remove('f'); void t.offsetWidth; t.classList.add('f'); }
    function set(text, instant) {
      timers.forEach(clearTimeout); timers = [];
      var n = Math.max(text.length, tiles.length);
      while (tiles.length < n) tile();
      for (var k = 0; k < n; k++) (function (k) {
        var t = tiles[k], target = text[k] || ' ';
        if (instant || reduce.matches) { t.firstChild.textContent = target; return; }
        var cur = CH.indexOf(t.firstChild.textContent); if (cur < 0) cur = 0;
        var steps = 4 + Math.floor(Math.random() * 4) + Math.min(k, 12) % 5, step = 0;
        (function tick() {
          step++;
          if (step >= steps) { put(t, target); return; }
          cur = (cur + 1) % CH.length; put(t, CH[cur]);
          timers.push(setTimeout(tick, 42));
        })();
      })(k);
      /* drop surplus tiles once the flip settles */
      timers.push(setTimeout(function () {
        while (tiles.length > text.length && tiles[tiles.length - 1].firstChild.textContent === ' ') el.removeChild(tiles.pop());
      }, 700));
    }
    set(caps[START].replace(/./g, ' '), true);
    setTimeout(function () { set(caps[START]); hi.classList.add('show'); }, 500);
    return { to: function (i) { set(caps[i]); } };
  })();

  function go(dir) {
    if (busy || slides.length < 2) return;
    var next = (cur + dir + slides.length) % slides.length;
    var a = slides[cur], n = slides[next];
    tone(next); board.to(next);
    n.setAttribute('aria-hidden', 'false'); a.setAttribute('aria-hidden', 'true');
    function done() {
      a.classList.remove('is-active', 'is-moving'); n.classList.remove('is-moving'); n.classList.add('is-active');
      cur = next; busy = false;
    }
    if (reduce.matches || !a.animate) { done(); return; }
    busy = true;
    a.classList.add('is-moving'); n.classList.add('is-moving');
    var o = { duration: DUR, easing: EASE, fill: 'both' };
    a.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(' + (-100 * dir) + '%)' }], o);
    var anim = n.animate([{ transform: 'translateX(' + (100 * dir) + '%)' }, { transform: 'translateX(0)' }], o);
    anim.onfinish = function () { a.getAnimations().forEach(function (x) { x.cancel(); }); n.getAnimations().forEach(function (x) { x.cancel(); }); done(); };
  }

  hero.addEventListener('click', function () { go(1); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { setMenu(false); return; }
    if (e.altKey || e.ctrlKey || e.metaKey || !d.hidden) return;
    var t = e.target.tagName;
    if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); go(1); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); go(-1); }
  });

  /* touch swipe */
  var x0 = null, y0 = null, swiped = false;
  hero.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; swiped = false; }, { passive: true });
  hero.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { swiped = true; go(dx < 0 ? 1 : -1); }
  }, { passive: true });
  hero.addEventListener('click', function (e) { if (swiped) { e.stopImmediatePropagation(); swiped = false; } }, true);

  /* one-time nudge: the photo slides over a little to reveal the next one, then settles back */
  (function () {
    var KEY = 'dk-hero-nudged', touched = false;
    try { if (localStorage.getItem(KEY)) return; } catch (e) {}
    if (reduce.matches || slides.length < 2 || !slides[0].animate) return;
    ['click', 'keydown', 'touchstart'].forEach(function (t) {
      (t === 'keydown' ? document : hero).addEventListener(t, function () { touched = true; }, { once: true, passive: true });
    });
    setTimeout(function () {
      if (touched || busy || cur !== START || document.hidden) return;
      try { localStorage.setItem(KEY, '1'); } catch (e) {}
      var a = slides[START], n = slides[(START + 1) % slides.length];
      busy = true;
      a.classList.add('is-moving'); n.classList.add('is-moving');
      var o = { duration: 1500, easing: 'ease-in-out', fill: 'both' };
      a.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-9%)', offset: .45 }, { transform: 'translateX(0)' }], o);
      var anim = n.animate([{ transform: 'translateX(100%)' }, { transform: 'translateX(91%)', offset: .45 }, { transform: 'translateX(100%)' }], o);
      anim.onfinish = function () {
        a.getAnimations().forEach(function (x) { x.cancel(); }); n.getAnimations().forEach(function (x) { x.cancel(); });
        a.classList.remove('is-moving'); n.classList.remove('is-moving'); busy = false;
      };
    }, 2400);
  })();
})();
