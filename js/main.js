// ── Cursor — rAF-throttled ──
const cursor = document.getElementById('cursor');
let cursorX = 0, cursorY = 0, cursorRAF = null;
document.addEventListener('mousemove', e => {
  cursorX = e.clientX;
  cursorY = e.clientY;
  if (!cursorRAF) {
    cursorRAF = requestAnimationFrame(() => {
      cursor.style.left = cursorX + 'px';
      cursor.style.top  = cursorY + 'px';
      cursorRAF = null;
    });
  }
});
document.querySelectorAll('a, button, .nav-dot, .num-item, .value-card, .exp-item').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('bloom'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('bloom'));
});

// ── Scroll spy: side dots + top nav ──
const sections = document.querySelectorAll('section');
const dots     = document.querySelectorAll('.nav-dot');
const topLinks = document.querySelectorAll('.topnav-links a');
const topnav   = document.getElementById('topnav');

const spy = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const idx = Array.from(sections).indexOf(entry.target);
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    const id = entry.target.id;
    topLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
    // Dark sections get light nav text
    topnav.classList.toggle('on-dark', entry.target.dataset.dark === 'true');
  });
}, { threshold: 0.35 });

['hero', 'numbers', 'contact'].forEach(id => {
  const s = document.getElementById(id);
  if (s) s.dataset.dark = 'true';
});
sections.forEach(s => spy.observe(s));

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    sections[+dot.dataset.section].scrollIntoView({ behavior: 'smooth' });
  });
});

// ── Reveal-on-scroll ──
const revealEls = document.querySelectorAll('.num-item, .exp-item, .value-card');
const revealer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach((el, i) => {
  el.style.transitionDelay = (i % 6) * 70 + 'ms';
  revealer.observe(el);
});

// ── Contact form: Formspree via fetch, mailto fallback ──
const form = document.getElementById('intake-form');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name  = document.getElementById('f-name').value.trim();
    const email = document.getElementById('f-email').value.trim();
    if (!name || !email) {
      [['f-name', name], ['f-email', email]].forEach(([id, val]) => {
        document.getElementById(id).style.borderBottomColor = val ? '' : '#c45a4a';
      });
      return;
    }

    const showSuccess = () => {
      form.querySelectorAll('.form-field, .form-row, .form-submit, .contact-form-sub').forEach(el => el.style.display = 'none');
      document.getElementById('form-success').classList.add('active');
    };

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) throw new Error('Formspree error');
      showSuccess();
    } catch (err) {
      const fields = {
        Name: name,
        Email: email,
        Company: document.getElementById('f-company').value.trim() || '—',
        'Reaching out about': document.getElementById('f-reason').value || '—',
        Message: document.getElementById('f-msg').value.trim() || '—'
      };
      const body = Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join('\n\n');
      window.location.href = `mailto:kangd4u@gmail.com?subject=${encodeURIComponent('Hello from ' + name)}&body=${encodeURIComponent(body)}`;
      showSuccess();
    }
  });
}
