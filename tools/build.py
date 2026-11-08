#!/usr/bin/env python3
"""Generates the static pages (home + case studies) from tools/cases.json.
Run from the repo root:  python3 tools/build.py
"""
import json, html, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
CASES = json.loads((ROOT / "tools" / "cases.json").read_text())
SITE = "https://dkang120.github.io/daniel-website/"
EMAIL = "kangd4u@gmail.com"
LINKEDIN = "https://www.linkedin.com/in/danielkanggg"
INSTAGRAM = "https://instagram.com/daniellllkang1"
FORMSPREE = "https://formspree.io/f/xvzdbkqk"
e = html.escape


def head(title, desc, prefix, url, image="images/og.jpg"):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}{image}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#2B231F">
<link rel="icon" href="{prefix}images/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500&family=JetBrains+Mono&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{prefix}css/style.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
"""


def nav(prefix, home=False):
    h = "" if home else f"{prefix}index.html"
    links = [("Work", f"{h}#work"), ("About", f"{h}#about"), ("Experience", f"{h}#experience"), ("Contact", f"{h}#contact")]
    items = "".join(f'<a href="{u}">{t}</a>' for t, u in links)
    brand = "Daniel Kang" if home else "← Daniel Kang"
    return f"""<div class="announce label-s">Open to sales &amp; marketing roles · Graduating May 2027 · <a href="{prefix}assets/Daniel-Kang-Resume.pdf" target="_blank" rel="noopener">Download résumé ↗</a></div>
<header class="nav" id="nav">
  <a class="nav-brand" href="{prefix}index.html">{brand}</a>
  <nav class="nav-links label-m" aria-label="Primary">{items}</nav>
  <div class="nav-right"><a class="btn btn-secondary" href="{prefix}assets/Daniel-Kang-Resume.pdf" target="_blank" rel="noopener">Résumé ↗</a></div>
  <button class="menu-btn label-m" aria-expanded="false" aria-controls="mobile-menu">Menu</button>
</header>
<div class="mobile-menu" id="mobile-menu" role="dialog" aria-label="Menu">
  <button class="close label-m" aria-label="Close menu">Close</button>
  {items}
  <a class="btn btn-primary" href="{prefix}assets/Daniel-Kang-Resume.pdf" target="_blank" rel="noopener">Download résumé ↗</a>
</div>
"""


def foot(prefix):
    return f'<script src="{prefix}js/main.js"></script>\n</body>\n</html>\n'


def case_row(c, prefix):
    outs = "".join(f'<li><span class="n">{n}</span><span class="body-m">{e(o)}</span></li>' for n, o in zip(["I", "II", "III"], c["outcomes"]))
    href = f"{prefix}work/{c['slug']}/"
    return f"""<article class="case reveal">
  <a class="case-img" href="{href}" aria-label="{e(c['title'])} case study"><img src="{prefix}images/{c['image']}" alt="{e(c['imageAlt'])}" width="1248" height="954" loading="lazy"></a>
  <div class="case-copy">
    <p class="mono c-accent">{e(c['no'])}</p>
    <h3 class="h1">{e(c['title'])}</h3>
    <p class="body-l c-2">{e(c['summary'])}</p>
    <ul class="outcomes">{outs}</ul>
    <a class="link" href="{href}">Read case study <span class="arr">→</span></a>
  </div>
</article>"""


def home():
    p = ""
    order = ["tmu", "fieldnote", "close"]
    stats = [("25%", "Lead-to-member conversion", "Fitness 19 · consultative tours"),
             ("650+", "Members in 3 months", "TMU Business Network · 54% of campus"),
             ("1,000+", "Prospects called", "University recruitment · CA, AZ, TX"),
             ("3.5%", "Interaction rate, first 30 days", "JC in Me · 18,500+ views"),
             ("14K", "Audience I sold into", "High-ticket coaching · commission"),
             ("$20K", "Funding pitch", "Texas youth nonprofit · board pitch")]
    stat_html = "".join(f'<div class="stat"><p class="numeral">{n}</p><p class="h3-italic">{l}</p><p class="label-s">{c}</p></div>' for n, l, c in stats)
    exp = [("[01] Sales", "Lead Service Specialist", "Fitness 19", "Convert 25% of leads and walk-ins into memberships through consultative tours; sell personal training on commission.", "Dublin, CA · Sep 2026 – Now"),
           ("[02] Marketing", "Digital Marketing Intern", "SYNK", "Support Meta and TikTok paid campaigns; build weekly Sprout Social + GA4 reports; coordinate creator briefs.", "Pleasanton, CA · Jun 2026 – Now"),
           ("[03] Sales", "High-Ticket Sales Closer", "Online fitness coaching", "Closed high-ticket coaching offers on commission from a 14K-follower audience.", "Remote · Aug – Oct 2026"),
           ("[04] Growth", "Co-Founder &amp; Social Media Manager", "TMU Business Network", "Grew to 650+ members in 3 months; matched students with Big Four professionals.", "Santa Clarita, CA · Mar 2026 – Now"),
           ("[05] Sales", "Student Recruitment Associate", "The Master’s University", "Cold-called 1,000+ prospective students across CA, AZ and TX.", "Santa Clarita, CA · Jan – May 2026"),
           ("[06] Social", "Social Media Manager", "JC in Me", "3.5% interaction rate on 18,500+ views in the first 30 days; AI-assisted content workflow.", "Santa Clarita, CA · Sep 2025 – May 2026"),
           ("[07] Web", "Freelance Web Designer", 'Dos Bros Detailing · HK Animal Hospital', 'Designed and launched sites for <a class="u" href="https://dosbrosdetailing.club" target="_blank" rel="noopener">a detailing business</a> and <a class="u" href="https://hkanimalhospital.vet" target="_blank" rel="noopener">a veterinary hospital</a>.', "California · 2025 – 2026")]
    exp_html = "".join(f'<li class="exp"><p class="mono">{t}</p><div class="exp-main"><h3 class="h3">{r}</h3><p class="co">{c}</p><p class="body-m pretty">{d}</p></div><p class="meta label-s">{m}</p></li>' for t, r, c, d, m in exp)
    life = [("b-han", "life-han-river.webp", "Daniel and a friend by the Han River at night", "Han River, Seoul"),
            ("b-street", "life-osaka-street.webp", "Late-night street food with a friend in Japan", "Street eats, Japan"),
            ("b-nara", "life-nara-deer.webp", "Feeding deer in Nara", "Nara, Japan"),
            ("b-cafe", "life-cafe-hopping.webp", "Matcha from Wabicha café", "Café hopping"),
            ("b-kyoto", "life-uji-bridge.webp", "Daniel on a bridge in Kyoto", "Kyoto, Japan")]
    life_html = "".join(f'<figure class="{c}"><img src="images/{s}" alt="{a}" loading="lazy"><figcaption class="label-s">{cap}</figcaption></figure>' for c, s, a, cap in life)
    cases_html = "\n".join(case_row(CASES[k], p) for k in order)
    out = head("Daniel Kang — Sales + Marketing",
               "Daniel Kang — sales and marketing in the San Francisco Bay Area. 25% lead-to-member conversion, a 650+ member business network built from scratch, and a brand taken from name to live storefront. Business Marketing, The Master’s University ’27.",
               p, SITE)
    out += nav(p, home=True)
    out += f"""<main id="main">

<section class="hero" id="top">
  <div class="inner hero-grid">
    <div class="hero-copy">
      <div class="hero-head">
        <p class="label-m c-2">Sales + Marketing · San Francisco Bay Area</p>
        <div class="hero-name-group">
          <h1 class="display-xl">Daniel Kang</h1>
          <p class="h1">Conversations that close.<br><em>Communities that grow.</em></p>
        </div>
      </div>
      <div class="hero-body">
        <p class="body-l">Business Marketing at The Master’s University, class of 2027. I close memberships at Fitness 19, support paid social at SYNK, and co-founded a 650-member business network.</p>
        <div class="hero-ctas">
          <a class="btn btn-primary" href="#work">See case studies</a>
          <a class="link" href="assets/Daniel-Kang-Resume.pdf" target="_blank" rel="noopener">Résumé <span class="arr">↗</span></a>
        </div>
      </div>
    </div>
    <div class="hero-photo"><img src="images/hero-portrait.webp" alt="Daniel Kang at a café, holding a camera" width="900" height="919" fetchpriority="high"></div>
  </div>
</section>

<section class="section bg-inverse" aria-labelledby="numbers-label">
  <div class="inner">
    <p class="label-m c-muted" id="numbers-label">By the numbers</p>
    <div class="stats">{stat_html}</div>
  </div>
</section>

<section class="section" id="work" aria-labelledby="work-title">
  <div class="inner">
    <div class="head">
      <p class="label-m">Selected work</p>
      <h2 class="display-l" id="work-title">Three stories, <em>real results.</em></h2>
    </div>
    <div class="cases">
{cases_html}
    </div>
  </div>
</section>

<section class="section bg-alt" id="about" aria-labelledby="about-title">
  <div class="inner">
    <p class="label-m c-2">About</p>
    <div class="about-grid">
      <h2 class="h1" id="about-title">A marketer who<br><em>knows how to close.</em></h2>
      <div class="about-copy">
        <p class="body-l">I’ve worked both ends of the funnel: building audiences and communities online, then turning that interest into sign-ups face to face.</p>
        <p class="body-m c-2">Fluent in English and Korean. Certified in HubSpot Inbound and Social Media Marketing, and a NASM-certified personal trainer, which is how I ended up selling gym memberships.</p>
        <p class="mono c-2">Meta Ads · TikTok&nbsp;Ads · GA4 · Sprout&nbsp;Social · HubSpot · Klaviyo<br>Figma · Canva · Claude</p>
      </div>
    </div>
  </div>
</section>

<section class="section" id="experience" aria-labelledby="exp-title">
  <div class="inner">
    <div class="head-row">
      <div class="head">
        <p class="label-m">Experience</p>
        <h2 class="h1" id="exp-title">Where I’ve <em>put in the reps.</em></h2>
      </div>
      <a class="btn btn-secondary" href="assets/Daniel-Kang-Resume.pdf" target="_blank" rel="noopener">Download résumé ↗</a>
    </div>
    <ol class="exp-list">{exp_html}</ol>
  </div>
</section>

<section class="section" style="padding-top:0" aria-labelledby="life-title">
  <div class="inner">
    <div class="life-head">
      <div class="head">
        <p class="label-m">Life outside work</p>
        <h2 class="h1" id="life-title">Off the clock, <em>still curious.</em></h2>
      </div>
      <p class="body-m">A semester abroad in Japan, late nights on the Han River, and always down to try the spot with the longest line.</p>
    </div>
    <div class="bento">{life_html}</div>
  </div>
</section>

<section class="section bg-alt" aria-labelledby="values-title">
  <div class="inner">
    <div class="head">
      <p class="label-m">Values</p>
      <h2 class="h1" id="values-title">What I bring <em>beyond the résumé.</em></h2>
    </div>
    <div class="values">
      <div class="value"><p class="n">I</p><h3 class="h2-alt">Lead by serving</h3><p class="body-m">Founded Youth Back 2 Christ, a weekly mentorship community of 20+ members.</p></div>
      <div class="value"><p class="n">II</p><h3 class="h2-alt">Make the ask</h3><p class="body-m">Pitched a $20,000 funding request to a board of philanthropists for a Texas youth nonprofit.</p></div>
      <div class="value"><p class="n">III</p><h3 class="h2-alt">Meet people where they are</h3><p class="body-m">Five service trips: Japan, India, Türkiye, Kyrgyzstan and Israel.</p></div>
    </div>
  </div>
</section>

{contact(p)}
</main>
"""
    out += foot(p)
    return out


def contact(p):
    return f"""<section class="contact bg-inverse" id="contact" aria-labelledby="contact-title">
  <div class="inner">
    <div class="contact-grid">
      <div class="contact-copy">
        <p class="label-m">Hiring for sales or marketing?</p>
        <h2 class="display-xl" id="contact-title">Let’s <em>talk.</em></h2>
        <a class="contact-email" href="mailto:{EMAIL}">{EMAIL}</a>
        <div class="contact-links label-m">
          <a href="{LINKEDIN}" target="_blank" rel="noopener">LinkedIn ↗</a>
          <a href="{p}assets/Daniel-Kang-Resume.pdf" target="_blank" rel="noopener">Résumé ↗</a>
          <a href="{INSTAGRAM}" target="_blank" rel="noopener">Instagram ↗</a>
        </div>
      </div>
      <form class="form" id="contact-form" action="{FORMSPREE}" method="POST" novalidate>
        <div class="field"><label class="label-s" for="f-name">Name</label><input id="f-name" name="name" type="text" autocomplete="name" required></div>
        <div class="field"><label class="label-s" for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
        <div class="field"><label class="label-s" for="f-company">Company</label><input id="f-company" name="company" type="text" autocomplete="organization"></div>
        <div class="field"><label class="label-s" for="f-reason">Reaching out about</label>
          <select id="f-reason" name="reason"><option value="">Select one</option><option>Full-time role</option><option>Internship</option><option>Freelance project</option><option>Just connecting</option></select></div>
        <div class="field"><label class="label-s" for="f-msg">Message</label><textarea id="f-msg" name="message" rows="4" placeholder="The role, the team, or what you’d like to talk about."></textarea></div>
        <button class="btn btn-light" type="submit">Send message →</button>
        <p class="form-status body-s" role="status" aria-live="polite"></p>
      </form>
    </div>
    <footer class="footer label-s"><span>© 2026 Daniel Kang</span><span>Sales + Marketing · San Francisco Bay Area</span></footer>
  </div>
</section>"""


def case_page(key):
    c = CASES[key]
    p = "../../"
    url = f"{SITE}work/{c['slug']}/"
    meta = "".join(f'<div><dt class="label-s">{e(k)}</dt><dd class="body-m">{e(v)}</dd></div>' for k, v in c["meta"])
    if key == "close":
        steps = "".join(f'<li><div class="t"><h3 class="h3">{e(h)}</h3></div><p class="body-l">{e(b)}</p></li>' for h, b in c["approach"])
    else:
        steps = "".join(f'<li><div class="t"><span class="mono">{i:02d}</span><h3 class="h3">{e(h)}</h3></div><p class="body-l">{e(b)}</p></li>' for i, (h, b) in enumerate(c["approach"], 1))
    stats = "".join(f'<div class="stat"><p class="numeral">{e(n)}</p><p class="h3-italic">{e(l)}</p></div>' for n, l in c["results"])
    nk = CASES[c["next"]]
    out = head(f"{c['title']} — Daniel Kang", c["lede"], p, url, image=f"images/{c['image'].replace('.webp','-og.jpg')}")
    out += nav(p)
    out += f"""<main id="main">
<section class="cs-header">
  <div class="inner" style="display:flex;flex-direction:column;gap:24px;width:100%">
    <a class="link cs-back" href="{p}index.html#work"><span class="arr">←</span> All work</a>
    <p class="mono c-accent">{e(c['no'])}</p>
    <h1 class="display-xl">{e(c['title'])}</h1>
    <p class="h2 cs-lede balance">{e(c['lede'])}</p>
    <dl class="cs-meta">{meta}</dl>
  </div>
</section>
<div class="cs-hero-img"><div class="inner"><img src="{p}images/{c['image']}" alt="{e(c['imageAlt'])}" width="1248" height="954" fetchpriority="high"></div></div>

<section class="section bg-alt">
  <div class="inner cs-split">
    <div class="head"><p class="mono">01</p><h2 class="h1">The challenge</h2></div>
    <p class="h2 pretty">{e(c['challenge'])}</p>
  </div>
</section>

<section class="section">
  <div class="inner">
    <div class="head"><p class="mono c-2">02</p><h2 class="h1">{'The framework' if key == 'close' else 'What I did'}</h2></div>
    <ol class="steps">{steps}</ol>
  </div>
</section>

<section class="section bg-inverse">
  <div class="inner">
    <div class="head"><p class="mono">03</p><h2 class="h1">Results</h2></div>
    <div class="cs-stats">{stats}</div>
  </div>
</section>

<section class="section">
  <div class="inner cs-split">
    <div class="head"><p class="mono">04</p><h2 class="h1">{e(c['takeawayTitle'])}</h2></div>
    <p class="h2 pretty">{e(c['takeaway'])}</p>
  </div>
</section>

<section class="cs-next bg-alt">
  <div class="inner" style="display:flex;flex-direction:column;gap:12px">
    <p class="label-m c-2">Next case study</p>
    <a href="{p}work/{nk['slug']}/"><span class="display-l">{e(nk['title'])} <span class="arr">→</span></span></a>
  </div>
</section>
{contact(p)}
</main>
"""
    out += foot(p)
    return out


if __name__ == "__main__":
    (ROOT / "index.html").write_text(home())
    for k, c in CASES.items():
        d = ROOT / "work" / c["slug"]
        d.mkdir(parents=True, exist_ok=True)
        (d / "index.html").write_text(case_page(k))
    print("built: index.html +", ", ".join(f"work/{c['slug']}/" for c in CASES.values()))
