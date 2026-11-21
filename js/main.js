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


  /* "keep going" nudge disappears after the first scroll */
  var kg = document.querySelector('.keep-going');
  if (kg) window.addEventListener('scroll', function () { if (window.scrollY > 40) kg.classList.add('gone'); }, { passive: true });

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
  /* open on the photo that fits the visitor's time of day */
  var hr = new Date().getHours();
  var part = hr >= 5 && hr < 12 ? 'morning' : hr < 17 ? 'afternoon' : hr < 21 ? 'evening' : 'night';
  var START = { morning: 0, afternoon: 2, evening: 4, night: 4 }[part];   /* Uji, Seoul, SF café, SF café — never Jerusalem or Nara */
  if (START >= slides.length) START = 0;
  cur = START;
  slides.forEach(function (s, i) { s.setAttribute('aria-hidden', i === START ? 'false' : 'true'); });
  slides[START].classList.add('is-active'); tone(START);
  /* hand-drawn doodles of Daniel's life (matcha, soft serve, travel, fitness, golf) orbit his head on the opening photo */
  (function () {
    var img = slides[START].querySelector('.hero__img');
    if (!img || !img.dataset.me) return;
    var ICONS = {"matcha": ["M26.9,30.1 L26.6,31.9 L26.5,34.3 L26.5,37.0 L26.5,40.1 L26.6,43.4 L26.8,46.9 L27.0,50.4 L27.3,53.9 L27.6,57.2 L27.9,60.4 L28.3,63.5 L28.8,66.7 L29.4,70.1 L30.0,73.4 L30.6,76.7 L31.3,79.9 L31.9,82.8 L32.6,85.3 L33.2,87.5 L33.9,89.2 L36.1,88.8 L36.3,87.1 L36.3,84.8 L36.2,82.2 L36.0,79.2 L35.8,76.0 L35.5,72.7 L35.1,69.3 L34.8,65.9 L34.4,62.7 L34.1,59.6 L33.7,56.6 L33.3,53.3 L32.9,49.8 L32.4,46.4 L31.9,42.9 L31.3,39.7 L30.8,36.6 L30.3,33.9 L29.7,31.6 L29.1,29.9Z", "M34.8,90.1 L35.6,90.7 L36.7,91.2 L38.0,91.7 L39.5,92.2 L41.1,92.7 L42.9,93.2 L44.7,93.5 L46.5,93.8 L48.3,94.0 L50.0,94.1 L51.7,94.0 L53.5,93.8 L55.3,93.5 L57.1,93.2 L58.9,92.7 L60.5,92.2 L62.0,91.7 L63.3,91.2 L64.4,90.7 L65.2,90.1 L64.8,87.9 L63.9,87.6 L62.6,87.5 L61.2,87.5 L59.7,87.5 L58.0,87.5 L56.3,87.6 L54.6,87.7 L53.0,87.8 L51.4,87.9 L50.0,87.9 L48.6,87.9 L47.0,87.8 L45.4,87.7 L43.7,87.6 L42.0,87.5 L40.3,87.5 L38.8,87.5 L37.4,87.5 L36.1,87.6 L35.2,87.9Z", "M66.1,89.2 L66.8,87.5 L67.4,85.3 L68.1,82.8 L68.7,79.9 L69.4,76.7 L70.0,73.4 L70.6,70.1 L71.2,66.7 L71.7,63.5 L72.1,60.4 L72.4,57.2 L72.7,53.9 L73.0,50.4 L73.2,46.9 L73.4,43.4 L73.5,40.1 L73.5,37.0 L73.5,34.3 L73.4,31.9 L73.1,30.1 L70.9,29.9 L70.3,31.6 L69.7,33.9 L69.2,36.6 L68.7,39.7 L68.1,42.9 L67.6,46.4 L67.1,49.8 L66.7,53.3 L66.3,56.6 L65.9,59.6 L65.6,62.7 L65.2,65.9 L64.9,69.3 L64.5,72.7 L64.2,76.0 L64.0,79.2 L63.8,82.2 L63.7,84.8 L63.7,87.1 L63.9,88.8Z", "M24.1,31.0 L25.7,31.2 L27.8,31.1 L30.2,31.0 L32.8,30.8 L35.7,30.6 L38.7,30.4 L41.7,30.1 L44.6,29.9 L47.4,29.8 L50.0,29.8 L52.6,29.8 L55.4,29.9 L58.3,30.1 L61.3,30.4 L64.3,30.6 L67.2,30.8 L69.8,31.0 L72.2,31.1 L74.3,31.2 L75.9,31.0 L76.1,29.0 L74.6,28.4 L72.7,27.8 L70.4,27.2 L67.8,26.6 L64.9,26.0 L62.0,25.4 L58.9,25.0 L55.8,24.6 L52.8,24.3 L50.0,24.2 L47.2,24.3 L44.2,24.6 L41.1,25.0 L38.0,25.4 L35.1,26.0 L32.2,26.6 L29.6,27.2 L27.3,27.8 L25.4,28.4 L23.9,29.0Z", "M32.4,50.8 L33.1,50.7 L33.9,50.4 L34.8,50.1 L35.8,49.6 L36.8,49.2 L37.8,48.8 L38.8,48.5 L39.6,48.2 L40.4,48.1 L40.8,48.2 L41.2,48.3 L41.7,48.6 L42.4,49.1 L43.1,49.7 L44.0,50.4 L44.9,51.2 L45.9,52.0 L47.1,52.7 L48.4,53.3 L50.0,53.5 L51.6,53.3 L52.9,52.7 L54.1,52.0 L55.1,51.2 L56.0,50.4 L56.9,49.7 L57.6,49.1 L58.3,48.6 L58.8,48.3 L59.2,48.2 L59.6,48.1 L60.4,48.2 L61.2,48.5 L62.2,48.8 L63.2,49.2 L64.2,49.6 L65.2,50.1 L66.1,50.4 L66.9,50.7 L67.6,50.8 L68.4,49.2 L68.0,48.7 L67.5,48.2 L66.7,47.6 L65.9,46.9 L64.9,46.2 L63.8,45.5 L62.7,44.9 L61.5,44.3 L60.3,44.0 L58.8,43.8 L57.4,44.1 L56.1,44.6 L55.0,45.2 L53.9,46.0 L53.0,46.7 L52.1,47.3 L51.3,47.9 L50.7,48.3 L50.2,48.5 L50.0,48.5 L49.8,48.5 L49.3,48.3 L48.7,47.9 L47.9,47.3 L47.0,46.7 L46.1,46.0 L45.0,45.2 L43.9,44.6 L42.6,44.1 L41.2,43.8 L39.7,44.0 L38.5,44.3 L37.3,44.9 L36.2,45.5 L35.1,46.2 L34.1,46.9 L33.3,47.6 L32.5,48.2 L32.0,48.7 L31.6,49.2Z", "M55.9,29.3 L56.6,28.7 L57.3,27.8 L58.0,26.6 L58.7,25.3 L59.4,24.0 L60.1,22.5 L60.7,21.1 L61.4,19.6 L62.0,18.3 L62.5,17.2 L63.0,16.1 L63.5,14.9 L64.1,13.8 L64.7,12.6 L65.2,11.4 L65.7,10.2 L66.2,9.2 L66.5,8.2 L66.8,7.3 L66.8,6.5 L65.2,5.5 L64.5,5.8 L63.8,6.4 L63.1,7.2 L62.3,8.0 L61.4,9.0 L60.6,10.0 L59.7,11.2 L58.9,12.4 L58.2,13.6 L57.5,14.8 L56.9,16.1 L56.3,17.6 L55.8,19.1 L55.3,20.7 L54.9,22.3 L54.5,23.8 L54.2,25.3 L54.1,26.6 L54.0,27.7 L54.1,28.7Z", "M38.2,62.7 L38.9,62.7 L39.8,62.5 L40.8,62.3 L41.9,62.0 L43.0,61.7 L44.1,61.5 L45.0,61.4 L45.8,61.3 L46.0,61.4 L45.8,61.3 L45.7,61.2 L45.7,61.7 L45.8,62.5 L45.7,63.5 L45.6,64.6 L45.4,65.7 L45.2,66.8 L44.9,67.7 L44.6,68.4 L44.5,68.7 L44.3,68.9 L43.9,69.2 L43.2,69.4 L42.5,69.6 L41.7,69.8 L40.9,69.9 L40.2,69.9 L39.6,69.8 L39.3,69.7 L39.3,69.8 L39.3,69.8 L39.1,69.4 L39.0,68.7 L38.9,67.7 L38.9,66.7 L38.9,65.6 L38.9,64.5 L38.9,63.5 L38.9,62.7 L38.7,62.0 L37.3,62.0 L37.1,62.5 L36.8,63.3 L36.6,64.2 L36.3,65.3 L36.1,66.4 L35.9,67.6 L35.8,68.8 L35.8,69.9 L36.1,71.1 L36.7,72.2 L37.7,72.9 L38.8,73.3 L39.9,73.6 L41.0,73.6 L42.2,73.6 L43.3,73.4 L44.5,73.1 L45.6,72.7 L46.6,72.1 L47.5,71.3 L48.2,70.2 L48.7,69.0 L49.1,67.8 L49.3,66.4 L49.5,65.0 L49.6,63.6 L49.5,62.3 L49.4,61.1 L49.0,59.9 L48.2,58.7 L46.9,58.1 L45.6,58.0 L44.5,58.2 L43.3,58.5 L42.1,59.0 L41.0,59.5 L39.9,60.0 L39.0,60.5 L38.3,61.0 L37.8,61.3Z", "M53.2,66.7 L53.8,66.7 L54.6,66.5 L55.5,66.3 L56.5,66.0 L57.5,65.8 L58.4,65.6 L59.3,65.4 L59.9,65.4 L60.1,65.4 L59.9,65.3 L59.8,65.3 L59.9,65.7 L60.0,66.4 L60.1,67.3 L60.1,68.3 L60.0,69.3 L59.9,70.2 L59.7,71.0 L59.5,71.6 L59.4,71.8 L59.3,71.8 L59.0,72.0 L58.4,72.3 L57.6,72.5 L56.8,72.7 L56.0,72.7 L55.2,72.8 L54.6,72.7 L54.2,72.7 L54.2,72.7 L54.2,72.8 L54.1,72.6 L54.0,72.0 L53.9,71.1 L53.9,70.2 L53.9,69.2 L53.9,68.3 L53.9,67.4 L53.9,66.6 L53.7,66.0 L52.3,66.0 L52.1,66.4 L51.8,67.1 L51.6,67.9 L51.3,68.9 L51.1,69.9 L50.9,71.0 L50.8,72.1 L50.9,73.1 L51.1,74.2 L51.8,75.3 L52.8,75.9 L53.9,76.3 L54.9,76.5 L56.1,76.5 L57.2,76.5 L58.4,76.3 L59.5,76.1 L60.6,75.7 L61.6,75.1 L62.6,74.2 L63.2,73.2 L63.6,72.0 L63.8,70.8 L63.9,69.6 L63.9,68.3 L63.9,67.1 L63.7,65.8 L63.4,64.7 L62.9,63.7 L62.1,62.7 L60.9,62.1 L59.7,62.1 L58.6,62.3 L57.6,62.6 L56.5,63.1 L55.5,63.6 L54.6,64.1 L53.8,64.6 L53.2,65.0 L52.8,65.3Z"], "softserve": ["M32.0,54.4 L32.5,57.3 L33.4,61.3 L34.7,66.3 L36.1,71.8 L37.8,77.4 L39.6,82.9 L41.6,87.9 L43.7,92.1 L46.1,95.3 L50.0,97.1 L53.9,95.3 L56.3,92.1 L58.4,87.9 L60.4,82.9 L62.2,77.4 L63.9,71.8 L65.3,66.3 L66.6,61.3 L67.5,57.3 L68.0,54.4 L66.0,53.6 L64.5,56.2 L62.8,60.1 L61.0,64.9 L59.0,70.2 L56.9,75.6 L54.9,80.8 L52.9,85.4 L51.0,88.9 L49.6,90.8 L50.0,90.9 L50.4,90.8 L49.0,88.9 L47.1,85.4 L45.1,80.8 L43.1,75.6 L41.0,70.2 L39.0,64.9 L37.2,60.1 L35.5,56.2 L34.0,53.6Z", "M30.8,54.9 L31.9,55.6 L33.2,56.1 L34.9,56.7 L36.8,57.4 L38.9,58.0 L41.1,58.5 L43.3,59.0 L45.6,59.4 L47.8,59.7 L50.0,59.8 L52.2,59.7 L54.4,59.4 L56.7,59.0 L58.9,58.5 L61.1,58.0 L63.2,57.4 L65.1,56.7 L66.8,56.1 L68.1,55.6 L69.2,54.9 L68.8,53.1 L67.6,52.8 L66.1,52.9 L64.3,53.0 L62.3,53.2 L60.2,53.4 L58.1,53.6 L55.9,53.9 L53.8,54.1 L51.8,54.2 L50.0,54.2 L48.2,54.2 L46.2,54.1 L44.1,53.9 L41.9,53.6 L39.8,53.4 L37.7,53.2 L35.7,53.0 L33.9,52.9 L32.4,52.8 L31.2,53.1Z", "M40.6,64.5 L41.3,65.6 L42.4,66.9 L43.9,68.3 L45.5,69.9 L47.4,71.4 L49.3,72.9 L51.1,74.1 L52.9,75.2 L54.4,76.1 L55.6,76.5 L56.4,75.5 L55.7,74.4 L54.6,73.1 L53.1,71.7 L51.5,70.1 L49.6,68.6 L47.7,67.1 L45.9,65.9 L44.1,64.8 L42.6,63.9 L41.4,63.5Z", "M57.5,63.6 L56.4,64.2 L55.0,65.2 L53.5,66.5 L51.8,68.1 L50.2,69.8 L48.6,71.5 L47.2,73.3 L46.0,74.9 L45.0,76.4 L44.5,77.6 L45.5,78.4 L46.6,77.8 L48.0,76.8 L49.5,75.5 L51.2,73.9 L52.8,72.2 L54.4,70.5 L55.8,68.7 L57.0,67.1 L58.0,65.6 L58.5,64.4Z", "M30.9,53.4 L30.8,52.8 L30.4,52.0 L29.9,51.2 L29.4,50.3 L28.9,49.3 L28.5,48.5 L28.2,47.7 L28.0,47.1 L28.0,46.8 L28.1,46.8 L28.3,46.6 L28.7,46.2 L29.4,45.7 L30.2,45.1 L31.2,44.6 L32.2,44.1 L33.3,43.6 L34.4,43.3 L35.5,43.0 L36.4,42.8 L37.3,42.8 L38.3,42.9 L39.4,43.1 L40.7,43.4 L42.0,43.7 L43.5,44.1 L45.0,44.5 L46.6,44.8 L48.3,45.0 L50.0,45.1 L51.7,45.0 L53.4,44.8 L55.0,44.5 L56.5,44.1 L58.0,43.7 L59.3,43.4 L60.6,43.1 L61.7,42.9 L62.7,42.8 L63.6,42.8 L64.5,43.0 L65.6,43.3 L66.7,43.6 L67.8,44.1 L68.8,44.6 L69.8,45.1 L70.6,45.7 L71.3,46.2 L71.7,46.6 L71.9,46.8 L72.0,46.8 L72.0,47.1 L71.8,47.7 L71.5,48.5 L71.1,49.3 L70.6,50.3 L70.1,51.2 L69.6,52.0 L69.2,52.8 L69.1,53.4 L70.9,54.6 L71.4,54.3 L71.9,53.8 L72.6,53.1 L73.4,52.3 L74.2,51.4 L74.9,50.4 L75.6,49.3 L76.1,48.1 L76.3,46.7 L76.1,45.2 L75.5,43.9 L74.7,42.9 L73.7,41.9 L72.6,41.0 L71.4,40.2 L70.2,39.4 L68.8,38.7 L67.4,38.1 L65.9,37.5 L64.4,37.2 L62.8,37.0 L61.2,37.0 L59.6,37.2 L58.1,37.5 L56.5,37.8 L55.1,38.1 L53.7,38.4 L52.4,38.7 L51.1,38.8 L50.0,38.9 L48.9,38.8 L47.6,38.7 L46.3,38.4 L44.9,38.1 L43.5,37.8 L41.9,37.5 L40.4,37.2 L38.8,37.0 L37.2,37.0 L35.6,37.2 L34.1,37.5 L32.6,38.1 L31.2,38.7 L29.8,39.4 L28.6,40.2 L27.4,41.0 L26.3,41.9 L25.3,42.9 L24.5,43.9 L23.9,45.2 L23.7,46.7 L23.9,48.1 L24.4,49.3 L25.1,50.4 L25.8,51.4 L26.6,52.3 L27.4,53.1 L28.1,53.8 L28.6,54.3 L29.1,54.6Z", "M37.1,39.9 L37.3,39.3 L37.4,38.4 L37.4,37.5 L37.4,36.5 L37.4,35.5 L37.4,34.6 L37.5,33.7 L37.7,33.0 L37.9,32.6 L38.0,32.5 L38.3,32.3 L38.8,32.0 L39.5,31.7 L40.4,31.4 L41.3,31.1 L42.4,30.8 L43.4,30.6 L44.5,30.3 L45.5,30.2 L46.4,30.0 L47.3,30.0 L48.1,29.9 L49.0,29.9 L49.9,30.0 L50.8,30.1 L51.7,30.2 L52.6,30.3 L53.5,30.5 L54.3,30.7 L55.2,30.9 L56.1,31.1 L57.0,31.3 L57.9,31.6 L58.7,31.8 L59.5,32.1 L60.2,32.4 L60.8,32.6 L61.4,32.9 L61.7,33.2 L61.9,33.3 L62.1,33.5 L62.3,33.8 L62.4,34.4 L62.5,35.2 L62.6,36.1 L62.6,36.9 L62.6,37.8 L62.6,38.6 L62.7,39.4 L62.9,39.9 L65.1,40.1 L65.4,39.7 L65.6,39.1 L65.9,38.3 L66.2,37.4 L66.4,36.4 L66.7,35.4 L66.8,34.3 L66.8,33.1 L66.6,31.9 L66.1,30.7 L65.3,29.7 L64.5,28.9 L63.7,28.2 L62.7,27.6 L61.7,27.0 L60.7,26.6 L59.7,26.1 L58.7,25.8 L57.7,25.4 L56.8,25.1 L55.8,24.8 L54.8,24.6 L53.7,24.3 L52.6,24.1 L51.5,23.9 L50.3,23.8 L49.2,23.7 L48.0,23.7 L46.8,23.8 L45.6,24.0 L44.4,24.2 L43.2,24.5 L41.9,24.8 L40.7,25.2 L39.4,25.7 L38.2,26.2 L37.0,26.9 L35.9,27.6 L34.9,28.4 L34.0,29.5 L33.3,30.8 L33.0,32.2 L33.0,33.5 L33.1,34.8 L33.4,36.0 L33.7,37.1 L34.0,38.1 L34.3,38.9 L34.6,39.6 L34.9,40.1Z", "M44.9,27.3 L45.4,26.8 L45.9,26.0 L46.3,25.2 L46.7,24.2 L47.2,23.2 L47.6,22.2 L48.0,21.3 L48.4,20.5 L48.8,19.9 L49.0,19.6 L49.3,19.4 L49.6,19.2 L50.0,19.0 L50.4,18.8 L50.9,18.7 L51.3,18.6 L51.6,18.5 L51.9,18.5 L51.9,18.5 L51.7,18.4 L51.4,18.2 L51.4,18.1 L51.4,18.2 L51.6,18.6 L51.8,19.1 L52.0,19.7 L52.1,20.4 L52.3,21.1 L52.5,21.8 L52.8,22.5 L53.0,23.1 L53.2,23.7 L53.4,24.3 L53.6,25.0 L53.8,25.6 L54.1,26.3 L54.3,26.9 L54.5,27.4 L54.7,27.8 L55.0,28.1 L57.0,27.9 L57.2,27.5 L57.3,27.0 L57.3,26.4 L57.4,25.8 L57.4,25.1 L57.4,24.4 L57.4,23.6 L57.4,22.9 L57.3,22.2 L57.2,21.5 L57.2,20.9 L57.1,20.2 L57.1,19.5 L57.0,18.7 L56.8,17.9 L56.7,17.1 L56.4,16.2 L56.0,15.3 L55.3,14.4 L54.3,13.6 L53.2,13.2 L52.1,13.0 L51.2,13.1 L50.2,13.2 L49.3,13.4 L48.3,13.8 L47.4,14.3 L46.5,14.8 L45.7,15.5 L45.0,16.4 L44.3,17.4 L43.9,18.5 L43.5,19.7 L43.3,20.9 L43.1,22.1 L43.0,23.2 L42.9,24.3 L42.9,25.3 L42.9,26.1 L43.1,26.7Z"], "plane": ["M14.4,52.9 L21.0,50.2 L30.4,45.7 L41.6,40.1 L53.6,34.3 L65.1,28.9 L75.2,24.7 L82.4,22.5 L84.0,22.0 L83.4,23.1 L80.6,29.5 L75.3,38.5 L68.6,48.7 L61.3,59.1 L54.2,68.5 L48.3,75.9 L44.4,80.0 L43.5,80.7 L44.3,80.8 L43.8,78.9 L43.4,75.2 L43.1,70.8 L42.6,66.2 L41.6,61.9 L39.5,58.6 L36.6,56.6 L33.3,55.1 L29.7,53.9 L25.9,53.0 L22.3,52.3 L19.0,51.7 L16.2,51.3 L14.3,51.0 L13.7,53.0 L15.7,53.7 L18.4,54.5 L21.6,55.3 L25.1,56.3 L28.6,57.3 L31.8,58.6 L34.6,60.0 L36.5,61.4 L37.5,63.4 L38.2,66.8 L38.5,71.1 L38.6,75.5 L38.9,79.7 L40.0,83.3 L43.6,85.7 L47.6,84.0 L52.2,79.4 L58.5,71.9 L65.9,62.5 L73.4,52.0 L80.3,41.6 L85.7,32.2 L88.9,24.6 L88.0,18.0 L81.4,17.0 L73.2,19.6 L62.9,24.2 L51.4,30.0 L39.6,36.3 L28.7,42.4 L19.6,47.5 L13.6,51.1Z", "M38.5,60.6 L41.9,58.5 L46.4,55.2 L51.7,51.2 L57.4,46.6 L63.4,41.7 L69.3,36.7 L74.9,31.9 L79.8,27.4 L83.8,23.6 L86.5,20.6 L85.5,19.4 L82.1,21.5 L77.6,24.8 L72.3,28.8 L66.6,33.4 L60.6,38.3 L54.7,43.3 L49.1,48.1 L44.2,52.6 L40.2,56.4 L37.5,59.4Z", "M37.3,60.2 L37.2,61.2 L37.2,62.4 L37.4,63.8 L37.6,65.3 L37.9,67.0 L38.3,68.7 L38.7,70.4 L39.1,72.0 L39.6,73.4 L40.1,74.7 L40.6,75.8 L41.1,76.9 L41.7,77.9 L42.3,78.8 L42.9,79.6 L43.4,80.4 L43.9,81.0 L44.4,81.6 L44.9,82.0 L45.4,82.3 L46.6,81.7 L46.6,81.1 L46.5,80.4 L46.2,79.7 L46.0,78.9 L45.6,78.1 L45.3,77.2 L45.0,76.3 L44.6,75.3 L44.3,74.3 L43.9,73.3 L43.6,72.1 L43.1,70.7 L42.7,69.2 L42.2,67.6 L41.6,66.0 L41.0,64.4 L40.4,63.0 L39.9,61.6 L39.3,60.6 L38.7,59.8Z", "M29.7,63.3 L28.6,63.0 L27.4,63.0 L26.0,63.3 L24.5,64.0 L23.3,65.6 L23.7,66.9 L25.7,67.3 L27.3,67.1 L28.6,66.5 L29.6,65.7 L30.3,64.7Z", "M14.4,70.5 L12.6,70.9 L11.2,71.9 L10.1,73.2 L9.3,74.8 L9.2,76.7 L10.3,77.4 L12.0,76.7 L13.1,75.7 L14.1,74.5 L14.9,73.2 L15.4,71.5Z", "M7.9,84.7 L7.7,86.4 L8.3,88.0 L9.4,89.4 L10.7,90.4 L12.5,90.8 L13.4,89.7 L13.1,88.1 L12.4,86.9 L11.6,85.8 L10.6,84.9 L9.2,84.1Z", "M19.6,92.1 L21.4,92.4 L22.9,91.9 L24.2,91.0 L25.2,89.8 L25.5,88.2 L24.5,87.2 L23.0,87.4 L21.9,87.9 L20.8,88.6 L19.9,89.5 L19.1,90.9Z", "M25.7,81.4 L25.8,79.6 L25.2,78.2 L24.2,77.0 L22.9,76.1 L21.4,76.0 L20.5,77.1 L20.8,78.5 L21.3,79.5 L22.0,80.5 L23.0,81.4 L24.4,82.0Z"], "dumbbell": ["M30.1,51.0 L31.3,51.3 L32.8,51.5 L34.7,51.6 L36.7,51.7 L38.9,51.7 L41.2,51.7 L43.5,51.7 L45.8,51.7 L47.9,51.7 L49.9,51.7 L51.9,51.8 L54.1,51.9 L56.4,52.0 L58.7,52.1 L61.0,52.2 L63.2,52.3 L65.2,52.4 L67.1,52.3 L68.6,52.3 L69.9,52.0 L70.1,50.0 L69.0,49.5 L67.5,49.0 L65.7,48.6 L63.7,48.1 L61.5,47.6 L59.2,47.2 L56.9,46.8 L54.5,46.6 L52.2,46.4 L50.1,46.3 L47.9,46.2 L45.6,46.3 L43.3,46.5 L40.9,46.8 L38.6,47.1 L36.4,47.4 L34.4,47.8 L32.6,48.2 L31.1,48.5 L29.9,49.0Z", "M20.8,33.7 L20.1,34.6 L19.4,35.7 L18.8,37.0 L18.1,38.6 L17.4,40.3 L16.8,42.2 L16.3,44.1 L15.9,46.1 L15.6,48.1 L15.5,50.0 L15.6,51.9 L15.9,53.9 L16.3,55.9 L16.8,57.8 L17.4,59.7 L18.1,61.4 L18.8,63.0 L19.4,64.3 L20.1,65.4 L20.8,66.3 L23.2,65.7 L23.5,64.6 L23.6,63.3 L23.5,61.8 L23.4,60.1 L23.2,58.3 L23.0,56.5 L22.8,54.7 L22.7,53.0 L22.5,51.4 L22.5,50.0 L22.5,48.6 L22.7,47.0 L22.8,45.3 L23.0,43.5 L23.2,41.7 L23.4,39.9 L23.5,38.2 L23.6,36.7 L23.5,35.4 L23.2,34.3Z", "M27.7,29.8 L27.0,31.0 L26.4,32.4 L25.8,34.2 L25.3,36.2 L24.7,38.4 L24.2,40.7 L23.8,43.0 L23.5,45.4 L23.3,47.8 L23.2,50.0 L23.3,52.2 L23.5,54.6 L23.8,57.0 L24.2,59.3 L24.7,61.6 L25.3,63.8 L25.8,65.8 L26.4,67.6 L27.0,69.0 L27.7,70.2 L30.3,69.8 L30.7,68.6 L30.9,67.0 L31.0,65.1 L31.0,63.1 L31.0,60.9 L31.0,58.6 L30.9,56.3 L30.8,54.1 L30.8,51.9 L30.8,50.0 L30.8,48.1 L30.8,45.9 L30.9,43.7 L31.0,41.4 L31.0,39.1 L31.0,36.9 L31.0,34.9 L30.9,33.0 L30.7,31.4 L30.3,30.2Z", "M76.8,34.3 L76.5,35.4 L76.4,36.7 L76.5,38.2 L76.6,39.9 L76.8,41.7 L77.0,43.5 L77.2,45.3 L77.3,47.0 L77.5,48.6 L77.5,50.0 L77.5,51.4 L77.3,53.0 L77.2,54.7 L77.0,56.5 L76.8,58.3 L76.6,60.1 L76.5,61.8 L76.4,63.3 L76.5,64.6 L76.8,65.7 L79.2,66.3 L79.9,65.4 L80.6,64.3 L81.2,63.0 L81.9,61.4 L82.6,59.7 L83.2,57.8 L83.7,55.9 L84.1,53.9 L84.4,51.9 L84.5,50.0 L84.4,48.1 L84.1,46.1 L83.7,44.1 L83.2,42.2 L82.6,40.3 L81.9,38.6 L81.2,37.0 L80.6,35.7 L79.9,34.6 L79.2,33.7Z", "M69.7,30.2 L69.3,31.4 L69.1,33.0 L69.0,34.9 L69.0,36.9 L69.0,39.1 L69.0,41.4 L69.1,43.7 L69.2,45.9 L69.2,48.1 L69.2,50.0 L69.2,51.9 L69.2,54.1 L69.1,56.3 L69.0,58.6 L69.0,60.9 L69.0,63.1 L69.0,65.1 L69.1,67.0 L69.3,68.6 L69.7,69.8 L72.3,70.2 L73.0,69.0 L73.6,67.6 L74.2,65.8 L74.7,63.8 L75.3,61.6 L75.8,59.3 L76.2,57.0 L76.5,54.6 L76.7,52.2 L76.8,50.0 L76.7,47.8 L76.5,45.4 L76.2,43.0 L75.8,40.7 L75.3,38.4 L74.7,36.2 L74.2,34.2 L73.6,32.4 L73.0,31.0 L72.3,29.8Z", "M11.1,43.9 L10.4,44.6 L10.0,45.7 L9.5,46.9 L9.2,48.3 L9.0,49.8 L9.0,51.3 L9.1,52.7 L9.3,54.0 L9.6,55.1 L10.1,55.9 L11.9,56.1 L12.6,55.4 L13.0,54.3 L13.5,53.1 L13.8,51.7 L14.0,50.2 L14.0,48.7 L13.9,47.3 L13.7,46.0 L13.4,44.9 L12.9,44.1Z", "M87.1,44.1 L86.6,44.9 L86.3,46.0 L86.1,47.3 L86.0,48.7 L86.0,50.2 L86.2,51.7 L86.5,53.1 L87.0,54.3 L87.4,55.4 L88.1,56.1 L89.9,55.9 L90.4,55.1 L90.7,54.0 L90.9,52.7 L91.0,51.3 L91.0,49.8 L90.8,48.3 L90.5,46.9 L90.0,45.7 L89.6,44.6 L88.9,43.9Z"], "golf": ["M41.0,92.0 L41.5,89.7 L41.9,86.6 L42.3,83.0 L42.7,79.0 L43.0,74.6 L43.3,70.0 L43.6,65.3 L43.7,60.7 L43.9,56.2 L43.9,52.0 L43.9,47.8 L43.7,43.3 L43.6,38.7 L43.3,34.0 L43.0,29.4 L42.7,25.0 L42.3,21.0 L41.9,17.4 L41.5,14.3 L41.0,12.0 L39.0,12.0 L38.6,14.4 L38.4,17.5 L38.3,21.1 L38.2,25.2 L38.1,29.6 L38.1,34.2 L38.1,38.8 L38.1,43.4 L38.1,47.8 L38.1,52.0 L38.1,56.2 L38.1,60.6 L38.1,65.2 L38.1,69.8 L38.1,74.4 L38.2,78.8 L38.3,82.9 L38.4,86.5 L38.6,89.6 L39.0,92.0Z", "M39.9,14.0 L40.8,14.3 L42.0,14.6 L43.4,14.9 L45.0,15.1 L46.7,15.4 L48.5,15.7 L50.3,16.1 L52.1,16.4 L53.8,16.8 L55.4,17.3 L57.2,17.9 L59.3,18.5 L61.6,19.3 L63.9,20.0 L66.1,20.8 L68.2,21.6 L69.9,22.3 L71.1,23.0 L71.6,23.3 L71.2,22.4 L71.6,20.9 L71.6,20.9 L70.7,21.3 L69.2,21.8 L67.4,22.4 L65.4,23.0 L63.2,23.7 L61.1,24.3 L59.0,25.0 L57.2,25.7 L55.5,26.4 L53.6,27.1 L51.7,27.9 L49.8,28.7 L47.9,29.5 L46.0,30.3 L44.3,31.1 L42.8,31.8 L41.6,32.4 L40.7,33.1 L41.3,34.9 L42.4,34.8 L43.8,34.6 L45.4,34.2 L47.2,33.7 L49.1,33.2 L51.1,32.6 L53.2,32.1 L55.2,31.5 L57.1,30.9 L58.8,30.3 L60.5,29.8 L62.5,29.3 L64.6,28.8 L66.8,28.3 L69.0,27.7 L71.0,27.1 L72.8,26.4 L74.4,25.7 L76.0,24.4 L76.8,21.6 L75.5,19.3 L74.0,18.2 L72.2,17.3 L70.2,16.5 L67.9,15.7 L65.5,14.9 L63.1,14.3 L60.7,13.6 L58.5,13.1 L56.6,12.7 L54.7,12.3 L52.8,12.1 L50.8,11.9 L48.9,11.8 L47.0,11.7 L45.3,11.7 L43.7,11.7 L42.3,11.8 L41.1,11.9 L40.1,12.0Z", "M24.2,90.8 L25.2,90.7 L26.5,90.4 L28.0,90.1 L29.6,89.6 L31.3,89.2 L33.1,88.8 L34.9,88.4 L36.7,88.1 L38.4,88.0 L40.0,87.9 L41.7,88.1 L43.8,88.3 L46.1,88.7 L48.4,89.1 L50.7,89.6 L52.7,90.1 L54.5,90.6 L55.8,91.1 L56.3,91.3 L55.8,90.0 L56.2,88.8 L55.7,89.1 L54.4,89.7 L52.6,90.3 L50.5,90.9 L48.3,91.6 L46.0,92.1 L43.7,92.6 L41.7,92.9 L40.0,93.1 L38.5,93.0 L36.8,92.8 L35.0,92.4 L33.2,91.9 L31.4,91.4 L29.7,90.8 L28.1,90.3 L26.6,89.8 L25.3,89.4 L24.3,89.3 L23.7,90.7 L24.6,91.3 L25.7,91.9 L27.1,92.6 L28.6,93.4 L30.3,94.2 L32.2,95.0 L34.1,95.7 L36.0,96.3 L38.0,96.8 L40.0,96.9 L42.1,96.9 L44.4,96.7 L46.8,96.3 L49.3,95.8 L51.7,95.2 L54.0,94.5 L56.0,93.8 L57.7,93.1 L59.1,92.2 L60.2,90.0 L59.0,87.7 L57.6,86.9 L55.9,86.3 L53.8,85.8 L51.6,85.3 L49.2,84.8 L46.7,84.5 L44.3,84.2 L42.0,84.1 L40.0,84.1 L38.1,84.2 L36.1,84.6 L34.2,85.1 L32.3,85.7 L30.4,86.3 L28.7,87.0 L27.1,87.6 L25.8,88.2 L24.6,88.8 L23.8,89.2Z", "M64.3,82.7 L64.8,82.7 L65.4,82.6 L66.0,82.4 L66.8,82.2 L67.5,82.0 L68.2,81.8 L68.8,81.7 L69.2,81.6 L69.4,81.7 L69.2,81.7 L69.1,81.6 L69.2,81.9 L69.4,82.3 L69.6,82.8 L69.8,83.4 L70.0,84.0 L70.1,84.5 L70.1,85.0 L70.1,85.2 L70.1,85.1 L70.2,84.9 L70.0,85.1 L69.7,85.3 L69.2,85.6 L68.6,85.8 L68.0,86.0 L67.5,86.2 L67.0,86.3 L66.8,86.3 L66.9,86.4 L67.0,86.5 L66.8,86.4 L66.6,86.0 L66.3,85.5 L66.1,84.8 L65.8,84.1 L65.6,83.4 L65.3,82.7 L65.0,82.2 L64.7,81.8 L63.3,82.2 L63.2,82.6 L63.1,83.1 L63.1,83.8 L63.1,84.6 L63.2,85.5 L63.3,86.3 L63.5,87.2 L63.8,88.0 L64.3,88.9 L65.1,89.6 L66.2,90.0 L67.1,90.1 L68.0,90.1 L69.0,89.9 L69.9,89.7 L70.8,89.4 L71.7,89.0 L72.5,88.5 L73.2,87.9 L73.9,86.9 L74.2,85.9 L74.3,84.9 L74.2,83.9 L74.0,83.0 L73.7,82.1 L73.3,81.2 L72.9,80.4 L72.3,79.6 L71.7,78.9 L70.8,78.3 L69.7,78.1 L68.7,78.2 L67.8,78.5 L67.0,78.8 L66.3,79.3 L65.6,79.7 L64.9,80.2 L64.4,80.6 L64.0,81.0 L63.7,81.3Z"]};
    var order = ['matcha', 'plane', 'softserve', 'dumbbell', 'golf'];
    var me = img.dataset.me.split(',').map(parseFloat);
    var wrap = document.createElement('div'); wrap.className = 'doodles'; wrap.setAttribute('aria-hidden', 'true');
    var els = order.map(function (k, i) {
      var d = document.createElement('span'); d.className = 'doodle doodle--' + k; d.style.setProperty('--i', i);
      d.innerHTML = '<svg viewBox="0 0 100 100">' + ICONS[k].map(function (p) { return '<path d="' + p + '"/>'; }).join('') + '</svg>';
      wrap.appendChild(d); return d;
    });
    slides[START].appendChild(wrap);
    function place() {
      var W = hero.clientWidth, H = hero.clientHeight, iw = img.naturalWidth, ih = img.naturalHeight;
      if (!iw) return;
      var cs = getComputedStyle(img), fit = cs.objectFit, pos = cs.objectPosition.split(' ').map(function (v) { return parseFloat(v) / 100; });
      var box = img.getBoundingClientRect(), hb = hero.getBoundingClientRect();
      var bw = box.width, bh = box.height, bx = box.left - hb.left, by = box.top - hb.top;
      var sc = fit === 'contain' ? Math.min(bw / iw, bh / ih) : Math.max(bw / iw, bh / ih);
      var rw = iw * sc, rh = ih * sc, ox = bx + (bw - rw) * (fit === 'contain' ? .5 : pos[0]), oy = by + (bh - rh) * (fit === 'contain' ? .5 : pos[1]);
      var cx = ox + me[0] * rw, cy = oy + me[1] * rh, R = Math.max(me[2] * rw, W < 1008 ? 22 : 30);
      var size = Math.max(R * .95, W < 1008 ? 28 : 40), orbit = R * 2.35 + size * .25;
      var top = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 60) + 8;
      /* fan the icons in an arc over the head; if there isn't room above, swing the arc down the sides */
      /* candidate spots every 12° around the head; keep the ones fully on screen and clear of the face, spread the icons across them */
      var cands = [];
      for (var deg = -230; deg <= 50; deg += 12) {
        var ra = deg * Math.PI / 180, x = cx + Math.cos(ra) * orbit * 1.12, y = cy + Math.sin(ra) * orbit;
        if (x - size / 2 < 10 || x + size / 2 > W - 10 || y - size / 2 < top || y + size / 2 > H - 70) continue;
        if (y > cy + R * 1.1) continue;                                   /* stay at head height or above, off the body */
        cands.push([x, y, deg]);
      }
      if (cands.length < els.length) {                                     /* tight frame: widen the orbit and try again */
        orbit *= 1.35; cands = [];
        for (var deg2 = -230; deg2 <= 50; deg2 += 10) {
          var rb = deg2 * Math.PI / 180, x2 = cx + Math.cos(rb) * orbit * 1.12, y2 = cy + Math.sin(rb) * orbit;
          if (x2 - size / 2 < 10 || x2 + size / 2 > W - 10 || y2 - size / 2 < top || y2 + size / 2 > H - 70 || y2 > cy + R * 1.4) continue;
          cands.push([x2, y2, deg2]);
        }
      }
      var picks = els.map(function (d, i) { return cands.length ? cands[Math.round(i * (cands.length - 1) / Math.max(1, els.length - 1))] : [cx, cy - orbit, -90]; });
      els.forEach(function (d, i) {
        var x = picks[i][0], y = picks[i][1];
        d.style.width = d.style.height = size + 'px'; d.style.left = (x - size / 2) + 'px'; d.style.top = (y - size / 2) + 'px';
        d.style.setProperty('--r', ((i % 2 ? 1 : -1) * (6 + i * 2)) + 'deg');
      });
      /* white or ink per doodle, from the photo underneath (color-analysis: fix contrast by moving lightness) */
      try {
        var cv = place.cv || (place.cv = document.createElement('canvas')), k = 240 / iw;
        cv.width = 240; cv.height = Math.round(ih * k);
        var cx2 = cv.getContext('2d', { willReadFrequently: true }); cx2.drawImage(img, 0, 0, cv.width, cv.height);
        els.forEach(function (el) {
          var r = el.getBoundingClientRect(), x0 = (r.left - hb.left - ox) / rw * cv.width, y0 = (r.top - hb.top - oy) / rh * cv.height;
          var w = Math.max(2, r.width / rw * cv.width), hh = Math.max(2, r.height / rh * cv.height);
          x0 = Math.max(0, Math.min(cv.width - 2, x0)); y0 = Math.max(0, Math.min(cv.height - 2, y0));
          var dd = cx2.getImageData(x0, y0, Math.min(w, cv.width - x0), Math.min(hh, cv.height - y0)).data, ys = [];
          var f = function (c) { c /= 255; return c <= .04045 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4); };
          for (var q = 0; q < dd.length; q += 4) ys.push(.2126 * f(dd[q]) + .7152 * f(dd[q + 1]) + .0722 * f(dd[q + 2]));
          ys.sort(function (a, b) { return a - b; });
          el.classList.toggle('ink', false);   /* white everywhere; the casing + shade handle light areas */
        });
      } catch (e) {}
    }
    if (img.complete) place(); else img.addEventListener('load', place);
    window.addEventListener('resize', place);
  })();

  /* desktop: whimsical "there's more" hint, leaves after the first click/swipe/key */
  var more = (function () {
    var el = document.createElement('div'); el.className = 'hero__more'; el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12h13"/><path d="M13 6l6 6-6 6"/></svg>';
    hero.appendChild(el);
    var gone = false, t = setTimeout(function () { if (!gone) el.classList.add('show'); }, 2200);
    function hide() { if (gone) return; gone = true; clearTimeout(t); el.classList.remove('show'); el.classList.add('gone'); }
    hero.addEventListener('pointerdown', hide, { once: true });
    return { hide: hide };
  })();

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
    tone(next); board.to(next); more.hide();
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
