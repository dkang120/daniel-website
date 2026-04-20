// ── Cursor — rAF-throttled, zero jank ──
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
document.querySelectorAll('a, .service-item, .work-card, .work-preview, .nav-dot').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('bloom'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('bloom'));
});

// ── Nav dots & scroll spy ──
const sections = document.querySelectorAll('section');
const dots     = document.querySelectorAll('.nav-dot');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const idx = Array.from(sections).indexOf(entry.target);
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => navObserver.observe(s));

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    sections[+dot.dataset.section].scrollIntoView({ behavior: 'smooth' });
  });
});

// ── Work / WebDesign preview: iframe auto-size + looping auto-scroll ──
// FIX: loop is fully stopped when user interacts (no idle spin).
// FIX: staggered starts so all 3 work cards never animate simultaneously.
// FIX: preview-hk correctly watches #webdesign, not #work.
function setupWorkCard(cardId, sectionId, startDelay) {
  const preview = document.getElementById(cardId);
  if (!preview) return;
  const iframe  = preview.querySelector('iframe');

  let scrollAnim     = null;
  let pauseTimeout   = null;
  let resumeTimeout  = null;
  let isUserActive   = false;

  // ── iframe height sizing ──
  function sizeIframe() {
    if (!iframe) return;
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      const h   = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);
      iframe.style.height = h + 'px';
    } catch (e) {
      iframe.style.height = '2400px'; // cross-origin fallback
    }
  }
  if (iframe) {
    iframe.addEventListener('load', () => {
      setTimeout(sizeIframe, 50);
      setTimeout(sizeIframe, 400);
    });
  }

  // ── stop everything cleanly ──
  function stopAutoScroll() {
    if (scrollAnim)   { cancelAnimationFrame(scrollAnim);  scrollAnim  = null; }
    if (pauseTimeout) { clearTimeout(pauseTimeout);         pauseTimeout = null; }
    // do NOT cancel resumeTimeout here — that belongs to interaction handlers
  }

  // ── looping scroll (NO idle spin when paused) ──
  function startAutoScroll() {
    stopAutoScroll();
    const max = preview.scrollHeight - preview.clientHeight;
    if (max <= 0) return;

    const duration = 14000;
    let startTime = null;
    let direction = 1;
    let fromPos   = preview.scrollTop;
    let targetPos = max;

    function step(ts) {
      // If user is active, the loop is fully stopped (this frame is never reached).
      if (!startTime) startTime = ts;
      const t      = Math.min((ts - startTime) / duration, 1);
      const eased  = t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2) / 2;
      preview.scrollTop = fromPos + (targetPos - fromPos) * eased;

      if (t >= 1) {
        direction *= -1;
        fromPos    = preview.scrollTop;
        targetPos  = direction === 1 ? max : 0;
        startTime  = null;
        scrollAnim = null;
        pauseTimeout = setTimeout(() => {
          pauseTimeout = null;
          if (!isUserActive) scrollAnim = requestAnimationFrame(step);
        }, 900);
        return;
      }
      scrollAnim = requestAnimationFrame(step);
    }
    scrollAnim = requestAnimationFrame(step);
  }

  // ── user interaction: stop loop, restart after idle ──
  function userPause(resumeAfterMs) {
    isUserActive = true;
    stopAutoScroll();
    clearTimeout(resumeTimeout);
    resumeTimeout = setTimeout(() => {
      isUserActive  = false;
      resumeTimeout = null;
      startAutoScroll();
    }, resumeAfterMs);
  }

  // Wheel inside preview — directional overscroll control:
  //   scrolling DOWN at preview bottom → allow chaining to page snap (next section)
  //   scrolling UP   at preview top   → contain (don't snap back to previous section)
  // No stopPropagation — letting the event reach html is what makes page snap work.
  preview.addEventListener('wheel', e => {
    if (e.deltaY > 0) {
      // going down: allow chaining at bottom so user can scroll to next section
      preview.style.overscrollBehaviorY = 'auto';
    } else {
      // going up: contain so we don't accidentally snap to previous section
      preview.style.overscrollBehaviorY = 'contain';
    }
    userPause(1800);
  }, { passive: true });

  // Hover — pause scroll; resume when mouse leaves
  preview.addEventListener('mouseenter', () => {
    isUserActive = true;
    stopAutoScroll();
    clearTimeout(resumeTimeout);
    resumeTimeout = null;
  });
  preview.addEventListener('mouseleave', () => {
    userPause(600);
  });

  // ── Intersection observer on the correct parent section ──
  const targetSection = document.getElementById(sectionId || 'work');
  if (!targetSection) return;

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Staggered start to avoid all cards animating in the same frame
        setTimeout(() => {
          if (!isUserActive) startAutoScroll();
        }, startDelay || 600);
      } else {
        stopAutoScroll();
        clearTimeout(resumeTimeout);
        resumeTimeout  = null;
        isUserActive   = false;
        preview.scrollTop = 0;
      }
    });
  }, { threshold: 0.4 });

  sectionObserver.observe(targetSection);
}

// Stagger work cards by 400ms each so RAF loops don't all start simultaneously
setupWorkCard('preview-1',  'work',      600);
setupWorkCard('preview-2',  'work',     1000);
setupWorkCard('preview-3',  'work',     1400);
// ── Intake form: graceful submit ──
const intakeForm = document.getElementById('intake-form');
if (intakeForm) {
  intakeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name = document.getElementById('f-name').value.trim();
    const email = document.getElementById('f-email').value.trim();
    if (!name || !email) {
      // Visually flag empties
      [['f-name', name], ['f-email', email]].forEach(([id, val]) => {
        const el = document.getElementById(id);
        el.style.borderBottomColor = val ? '' : '#c45a4a';
      });
      return;
    }

    // Compose mailto fallback so Daniel actually receives the inquiry
    const fields = {
      Name: name,
      Email: email,
      Business: document.getElementById('f-business').value.trim() || '—',
      'Project type': document.getElementById('f-project').value || '—',
      'Budget range': document.getElementById('f-budget').value || '—',
      Message: document.getElementById('f-msg').value.trim() || '—'
    };
    const body = Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join('\n\n');
    const mailto = `mailto:kangd4u@gmail.com?subject=${encodeURIComponent('New project inquiry from ' + name)}&body=${encodeURIComponent(body)}`;

    // Open user's mail client
    window.location.href = mailto;

    // Show success state, hide form fields
    intakeForm.querySelectorAll('.form-field, .form-row, .form-submit, .contact-form-sub').forEach(el => {
      el.style.display = 'none';
    });
    document.getElementById('form-success').classList.add('active');
  });
}