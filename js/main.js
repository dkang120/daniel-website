(function () {
  /* mobile menu */
  var d = document.getElementById('drawer');
  var b = document.querySelector('.header__burger');
  var c = document.querySelector('.drawer__close');
  function setMenu(o) { d.hidden = !o; b.setAttribute('aria-expanded', o); document.body.classList.toggle('no-scroll', o); }
  b.addEventListener('click', function () { setMenu(true); });
  c.addEventListener('click', function () { setMenu(false); });

  /* hero gallery: one image at a time; click / arrow keys / swipe */
  var hero = document.querySelector('.hero');
  if (!hero) { document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); }); return; }
  var slides = [].slice.call(hero.querySelectorAll('.hero__slide'));
  var cur = 0, busy = false;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var DUR = 900, EASE = 'cubic-bezier(0.645, 0.045, 0.355, 1)';

  function tone(i) { document.body.classList.toggle('hero-dark', slides[i].dataset.tone === 'dark'); }
  slides[0].classList.add('is-active'); tone(0);

  function go(dir) {
    if (busy || slides.length < 2) return;
    var next = (cur + dir + slides.length) % slides.length;
    var a = slides[cur], n = slides[next];
    tone(next);
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
})();
