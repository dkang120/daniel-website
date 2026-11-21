/* TMU story: stages drive the photo stack, result stats count up, campus dots fill to 54%. */
(function () {
  var star = document.querySelector('.star'); if (!star) return;
  var secs = [].slice.call(star.querySelectorAll('.star__sec'));
  var cs = document.querySelector('.cs');
  var desk = window.matchMedia('(min-width: 1008px)').matches;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var res = star.querySelector('.star__sec--result'), counted = false, timer = null, auto = true;

  [].forEach.call(star.querySelectorAll('.campus--fill i'), function (d, i) { d.style.setProperty('--d', i); });

  function countUp() {
    if (counted) return; counted = true;
    star.querySelector('.campus--fill').classList.add('on');
    [].forEach.call(res.querySelectorAll('[data-count]'), function (b) {
      var to = +b.dataset.count, suf = b.dataset.suffix || '', t0 = null, dur = reduce ? 0 : 1300;
      if (!dur) { b.textContent = to + suf; return; }
      (function tick(t) { t0 = t0 || t; var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        b.textContent = Math.round(to * e) + suf; if (k < 1) requestAnimationFrame(tick); })(performance.now());
    });
  }

  function activate(s) {
    secs.forEach(function (x) { x.classList.toggle('is-active', x === s); });
    if (cs && cs.goTo) cs.goTo(+s.dataset.photo);
    if (s === res) countUp();
  }

  if (desk) {
    secs.forEach(function (s) {
      function pick() { auto = false; clearTimeout(timer); activate(s); }
      s.addEventListener('click', pick);
      s.addEventListener('mouseenter', pick);
      s.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
    });
    if (cs) ['click', 'touchstart', 'keydown'].forEach(function (ev) { cs.addEventListener(ev, function () { auto = false; clearTimeout(timer); }, { passive: true }); });
    /* one guided pass: 01 → 04, then rest on the result */
    function tour(i) { if (!auto) return; activate(secs[i]); if (i < secs.length - 1) timer = setTimeout(function () { tour(i + 1); }, 3200); }
    setTimeout(function () { tour(0); }, reduce ? 0 : 1100);
  } else {
    /* mobile: count up when the result scrolls into view */
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { countUp(); io.disconnect(); } }); }, { threshold: .4 });
    io.observe(res);
  }
})();
