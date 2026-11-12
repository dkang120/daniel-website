// Daniel Kang — Portfolio 2027

// Sticky nav: hairline appears once you scroll
const nav = document.getElementById('nav');
const onScroll = () => nav && nav.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu
const menuBtn = document.querySelector('.menu-btn');
const menu = document.getElementById('mobile-menu');
if (menuBtn && menu) {
  const closeBtn = menu.querySelector('.close');
  const setOpen = (open) => {
    menu.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) closeBtn.focus(); else menuBtn.focus();
  };
  menuBtn.addEventListener('click', () => setOpen(true));
  closeBtn.addEventListener('click', () => setOpen(false));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) setOpen(false); });
}

// Restrained reveal for case rows
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && reveals.length) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add('in'));
}

// Contact form: Formspree, with a mailto fallback
const form = document.getElementById('contact-form');
if (form) {
  const status = form.querySelector('.form-status');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    if (!name || !email || !/^\S+@\S+\.\S+$/.test(email)) {
      status.textContent = 'Please add your name and a valid email.';
      (!name ? form.name : form.email).focus();
      return;
    }
    status.textContent = 'Sending…';
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error('send failed');
      form.classList.add('sent');
      status.textContent = 'Thanks — I’ll reply within 48 hours.';
    } catch (err) {
      const body = ['Name: ' + name, 'Email: ' + email, 'Company: ' + (form.company.value || '—'),
        'Reaching out about: ' + (form.reason.value || '—'), '', form.message.value].join('\n');
      window.location.href = 'mailto:kangd4u@gmail.com?subject=' + encodeURIComponent('Hello from ' + name) + '&body=' + encodeURIComponent(body);
      status.textContent = 'Opening your email app…';
    }
  });
}

// Stats bento: count-up when each cell scrolls into view
const counters = document.querySelectorAll('.count');
if (counters.length) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = (el, v) => {
    const dec = +el.dataset.dec;
    let out = dec ? v.toFixed(dec) : Math.round(v).toString();
    if (el.dataset.comma === '1') out = Number(out).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    return el.dataset.pre + out + el.dataset.suf;
  };
  const run = (el) => {
    const to = parseFloat(el.dataset.to), dur = 1400, t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(el, to * e);
      if (p < 1) requestAnimationFrame(tick); else el.textContent = fmt(el, to);
    };
    requestAnimationFrame(tick);
  };
  if (!reduce && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const el = en.target, i = +(el.closest('.bcell')?.style.getPropertyValue('--i') || 0);
          el.textContent = fmt(el, 0);
          setTimeout(() => run(el), i * 90 + 150);
          cio.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(el => { el.textContent = fmt(el, 0); cio.observe(el); });
  }
}

// Letters of recommendation: full-letter dialog
document.querySelectorAll('.letter-open').forEach(btn => {
  const dlg = document.getElementById(btn.dataset.letter);
  if (!dlg || typeof dlg.showModal !== 'function') return;
  btn.addEventListener('click', () => dlg.showModal());
  dlg.querySelector('.letter-close').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
});
