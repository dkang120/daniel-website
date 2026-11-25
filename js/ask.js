/* Ask Daniel — a small Q&A sidebar. Answers are written by Daniel, not generated. */
(function () {
  var script = document.currentScript;
  var base = new URL('../', script.src).href; // site root

  var QA = [
    { id: 'roles', q: 'What roles are you looking for?',
      k: ['role', 'roles', 'looking', 'job', 'position', 'intern', 'internship', 'hire', 'hiring', 'seeking'],
      a: 'Social media, digital marketing and paid social roles first, with sales roles (SDR / BDR) second. I’m drawn to DTC, consumer and fitness or wellness brands. I graduate in May 2027.' },
    { id: 'result', q: 'What’s your best result?',
      k: ['best', 'result', 'proud', 'impact', 'achievement', 'win', 'tmu', 'grow', 'growth'],
      a: 'Co-founding TMU Business Network: we grew from zero to 650+ members in three months, 54% of the student body, and matched 10+ students with people at Deloitte, EY and KPMG.',
      link: ['Read the case', 'work/tmu-business-network/'] },
    { id: 'sell', q: 'Can you actually sell?',
      k: ['sell', 'sales', 'close', 'closing', 'closer', 'quota', 'target', 'convert', 'conversion', 'fitness 19', 'gym'],
      a: 'Yes. At Fitness 19 I turned 60% of tours into memberships in my first two months, 188% of the monthly target. My approach is simple: they talk 80% of the call, I find the gap, then make the decision easy.',
      link: ['How I run a call', 'work/the-close/'] },
    { id: 'social', q: 'What have you done in social media?',
      k: ['social', 'instagram', 'content', 'jc in me', 'engagement', 'followers', 'brand', 'rebrand'],
      a: 'I ran JC in Me’s Instagram end to end: strategy, design and posting. In the last 90 days a Reels-led strategy drove 155,000+ views, up 400%+, and grew the account to 1,000+ followers, with 69% of views from non-followers.',
      link: ['See the work', 'work/jc-in-me/'] },
    { id: 'tools', q: 'What tools do you use?',
      k: ['tool', 'tools', 'software', 'skill', 'skills', 'figma', 'canva', 'hubspot', 'klaviyo', 'meta', 'ads', 'ai', 'certified', 'certification'],
      a: 'Meta Ads Manager, Klaviyo, HubSpot, Figma, Canva, Framer, Excel, Claude, Supabase and the Gemini API. I hold a Google Ads Search certificate and HubSpot certifications in Inbound and Social Media Marketing.',
      link: ['All skills', 'skills/'] },
    { id: 'where', q: 'Where are you based?',
      k: ['where', 'based', 'location', 'remote', 'hybrid', 'relocate', 'bay area', 'sf', 'san francisco', 'live'],
      a: 'The Bay Area. I’m open to remote roles and to in-person or hybrid roles in San Francisco and the East Bay.' },
    { id: 'lang', q: 'What languages do you speak?',
      k: ['language', 'languages', 'korean', 'speak', 'bilingual'],
      a: 'English and Korean.' },
    { id: 'contact', q: 'How do I reach you?',
      k: ['contact', 'reach', 'email', 'call', 'talk', 'connect', 'linkedin', 'resume', 'résumé', 'cv', 'chat'],
      a: 'Email me at kangd4u@gmail.com, or connect with me on LinkedIn. My résumé is below.',
      link: ['Résumé (PDF)', 'assets/Daniel-Kang-Resume.pdf?v=9'] }
  ];
  var FALLBACK = 'I don’t have a written answer for that one yet. Email me at kangd4u@gmail.com and I’ll answer it myself.';

  function track(name, props) { try { window.posthog && window.posthog.capture(name, props); } catch (e) {} }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; }

  var btn = el('button', 'ask-btn', 'Ask Daniel');
  btn.type = 'button';
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'ask-panel');

  var panel = el('section', 'ask');
  panel.id = 'ask-panel';
  panel.hidden = true;
  panel.setAttribute('aria-label', 'Ask Daniel');

  var head = el('div', 'ask__head');
  var title = el('div');
  title.appendChild(el('p', 'ask__t', 'Ask Daniel'));
  title.appendChild(el('p', 'ask__s muted', 'Answers written by me, not a bot.'));
  var close = el('button', 'ask__x');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close');
  close.innerHTML = '<svg width="11" height="11" viewBox="0 0 15 15" fill="none" stroke="currentColor"><path d="M.5.5l14 14M14.5.5l-14 14"/></svg>';
  head.appendChild(title); head.appendChild(close);

  var log = el('div', 'ask__log');
  log.setAttribute('aria-live', 'polite');
  var chips = el('div', 'ask__chips');
  var form = el('form', 'ask__form');
  var input = el('input', 'ask__in');
  input.type = 'text'; input.placeholder = 'Ask anything…'; input.setAttribute('aria-label', 'Your question'); input.maxLength = 200;
  var send = el('button', 'ask__send', 'Send'); send.type = 'submit';
  form.appendChild(input); form.appendChild(send);

  panel.appendChild(head); panel.appendChild(log); panel.appendChild(chips); panel.appendChild(form);
  document.body.appendChild(btn); document.body.appendChild(panel);

  // Mobile home: keep the photo hero clean; show the button once past it.
  if (document.body.classList.contains('is-home')) {
    var mq = window.matchMedia('(max-width:1007px)');
    var onScroll = function () { btn.classList.toggle('ask-btn--hide', mq.matches && window.scrollY < window.innerHeight * 0.6 && panel.hidden); };
    window.addEventListener('scroll', onScroll, { passive: true }); mq.addEventListener('change', onScroll); onScroll();
  }

  var asked = {};
  function renderChips() {
    chips.innerHTML = '';
    QA.forEach(function (item) {
      if (asked[item.id]) return;
      var c = el('button', 'ask__chip', item.q); c.type = 'button';
      c.addEventListener('click', function () { ask(item.q, item, 'suggested'); });
      chips.appendChild(c);
    });
  }

  function answer(item) {
    var a = el('div', 'ask__msg ask__msg--a');
    a.appendChild(el('p', null, item ? item.a : FALLBACK));
    if (item && item.link) {
      var l = el('a', 'u', item.link[0] + ' →');
      l.href = base + item.link[1];
      a.appendChild(l);
    } else if (!item) {
      var m = el('a', 'u', 'Email me →'); m.href = 'mailto:kangd4u@gmail.com'; a.appendChild(m);
    }
    log.appendChild(a);
    log.scrollTop = log.scrollHeight;
  }

  function match(text) {
    var t = ' ' + text.toLowerCase() + ' ', best = null, score = 0;
    QA.forEach(function (item) {
      var s = 0;
      item.k.forEach(function (k) { if (t.indexOf(k) !== -1) s += k.length; });
      if (s > score) { score = s; best = item; }
    });
    return best;
  }

  function ask(text, item, source) {
    log.appendChild(el('div', 'ask__msg ask__msg--q', text));
    if (item) asked[item.id] = true;
    renderChips();
    track('ask_daniel_question', { question: text, matched: item ? item.id : 'none', source: source, page: location.pathname });
    var dots = el('div', 'ask__msg ask__msg--a ask__dots', '•••');
    log.appendChild(dots); log.scrollTop = log.scrollHeight;
    setTimeout(function () { dots.remove(); answer(item); }, 450);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = input.value.trim(); if (!v) return;
    input.value = '';
    ask(v, match(v), 'typed');
  });

  function setOpen(open) {
    panel.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('ask-open', open);
    if (open) {
      if (!log.childNodes.length) {
        var hi = el('div', 'ask__msg ask__msg--a');
        hi.appendChild(el('p', null, 'Hi, I’m Daniel. Pick a question or ask your own.'));
        log.appendChild(hi);
        renderChips();
      }
      track('ask_daniel_open', { page: location.pathname });
      if (window.matchMedia('(min-width:1008px)').matches) input.focus();
    } else { btn.focus(); }
  }
  btn.addEventListener('click', function () { setOpen(panel.hidden); });
  close.addEventListener('click', function () { setOpen(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) setOpen(false); });
})();
