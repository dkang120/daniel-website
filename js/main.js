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

// Letters of recommendation: full-letter dialog
document.querySelectorAll('.letter-open').forEach(btn => {
  const dlg = document.getElementById(btn.dataset.letter);
  if (!dlg || typeof dlg.showModal !== 'function') return;
  btn.addEventListener('click', () => dlg.showModal());
  dlg.querySelector('.letter-close').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
});
