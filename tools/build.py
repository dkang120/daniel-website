#!/usr/bin/env python3
"""Daniel Kang portfolio — layout draft modelled on therow.com (measured spec in THE-ROW-SPEC.md)."""
import os, pathlib, json, html

ROOT = pathlib.Path(__file__).resolve().parent.parent
NAME = "Daniel Kang"
NAV = [("About", "about"), ("Work", "work"), ("Experience", "experience"),
       ("Beyond", "beyond"), ("Recommendation", "recommendation"), ("Connect", "connect")]
LINKS = {
    "LinkedIn": "https://www.linkedin.com/in/danielkanggg",
    "Instagram": "https://instagram.com/daniellllkang1",
    "Résumé": "assets/Daniel-Kang-Resume.pdf",
}
EMAIL = "kangd4u@gmail.com"
import hashlib as _h
ASSET_V = _h.md5((ROOT / "css/style.css").read_bytes() + (ROOT / "js/main.js").read_bytes()).hexdigest()[:8]

# Hero gallery: (alt, caption, object-position desktop, object-position mobile, header tone over the image)
HERO = [
    ("Nara, Japan", "Nara, Japan", "50% 35%", "50% 50%", "dark"),
    ("Byodo-in, Uji, Japan", "Uji, Japan", "50% 55%", "50% 60%", "light"),
    ("Fitting room mirror selfie", "Seoul, South Korea", "50% 60%", "50% 50%", "light"),
    ("Jerusalem at sunset", "Jerusalem, Israel", "50% 25%", "10% 50%", "light"),
    ("Café", "San Francisco, USA", "50% 55%", "85% 50%", "dark"),
    ("Street reflected in a convex mirror", "Seoul, South Korea", "50% 55%", "50% 50%", "dark"),
]


ORDER = [2, 1, 3, 4, 5, 6]  # file numbers in display order: Uji first, Nara second


ARROW = ('<svg class="hero__arrow" viewBox="0 0 240 120" fill="none" aria-hidden="true" focusable="false">'
         '<path d="M236 100 C200 112 182 58 150 78 S128 122 104 90 S70 22 26 38"/><path d="M46 20 L24 38 L48 54"/></svg>')


def hero_html():
    slides = []
    for pos_i, n in enumerate(ORDER, 1):
        i = n
        alt, cap, pos, posm, tone = HERO[n - 1]
        eager = 'loading="eager"' + (' fetchpriority="high"' if pos_i == 1 else ' fetchpriority="low"')
        slides.append(
            f'<div class="hero__slide{f" hero__slide--fit hero__slide--fit{n}" if n in (4, 5) else ""}" data-tone="{tone}"{"" if pos_i == 1 else " aria-hidden=\"true\""}>'
            f'<img class="hero__img" src="images/hero-{i}-2000.webp" '
            f'srcset="images/hero-{i}-900.webp 900w, images/hero-{i}-2000.webp 2000w" sizes="100vw" '
            f'alt="{alt}" style="--pd:{pos};--pm:{posm}" draggable="false" {eager}>'
            + (ARROW + '<span class="hero__note" aria-hidden="true">hi, it\'s me!</span>' if n == 2 else "")
            + (f'<span class="hero__caption">{cap}</span>' if cap else "") + "</div>"
        )
    return (
        '<section class="hero" aria-roledescription="carousel" aria-label="Photo gallery" tabindex="0">'
        + "".join(slides) + "</section>"
    )


def page(slug, label, content=None, prefix=None, cls="is-inner", title=None, desc=None):
    home = slug is None
    if prefix is None:
        prefix = "" if home else "../"
    title = title or (NAME if home else f"{label} – {NAME}")
    nav = "".join(
        f'<li><a href="{prefix}{s}/"{" aria-current=\"page\"" if s == slug else ""}>{l}</a></li>' for l, s in NAV
    )
    drawer = "".join(f'<li><a href="{prefix}{s}/">{l}</a></li>' for l, s in NAV)
    def lis(items):
        return "".join(f'<li><a href="{prefix}{s}/">{l}</a></li>' for l, s in items)
    pages_a, pages_b = lis(NAV[:3]), lis(NAV[3:])
    elsewhere = "".join(
        f'<li><a href="{(prefix + u) if not u.startswith("http") else u}"{" target=\"_blank\" rel=\"noopener\"" if u.startswith("http") else ""}>{l}</a></li>'
        for l, u in LINKS.items()
    )
    if home:
        main = hero_html()
        body_cls = "is-home"
    else:
        main = f'<main class="page">{content or ""}</main>'
        body_cls = cls
    if home:
        main = f"<main>{main}</main>"
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc or "Daniel Kang — social media, paid social and sales."}">
<link rel="icon" href="{prefix}images/favicon.svg">
<link rel="stylesheet" href="{prefix}css/style.css?v={ASSET_V}">
</head>
<body class="{body_cls}">
<header class="header" id="header">
  <div class="header__wrap">
    <div class="header__item header__item--fill">
      <button class="header__burger" type="button" aria-label="Open menu" aria-controls="drawer" aria-expanded="false"><svg width="20" height="15" viewBox="0 0 20 15" fill="none" stroke="currentColor"><path d="M0 .5h20M0 7.5h20M0 14.5h20"/></svg></button>
      <ul class="nav">{nav}</ul>
    </div>
    <div class="header__item header__item--logo"><a class="logo" href="{prefix}" aria-label="{NAME}">{NAME.upper()}</a></div>
    <div class="header__item header__item--fill header__item--right"></div>
  </div>
</header>
<div class="drawer" id="drawer" hidden>
  <div class="drawer__top"><span>Menu</span><button class="drawer__close" type="button" aria-label="Close menu"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor"><path d="M.5.5l14 14M14.5.5l-14 14"/></svg></button></div>
  <ul class="drawer__list">{drawer}</ul>
  <ul class="drawer__list drawer__list--secondary">{elsewhere}</ul>
</div>
{main}
<footer class="footer">
  <div class="footer__inner">
    <div class="footer__col footer__col--lead"><p>{NAME}</p><p class="muted">Bay Area, California</p><p class="footer__cv"><a href="{prefix}core-values/">Core Values</a></p></div>
    <ul class="footer__col">{pages_a}</ul>
    <ul class="footer__col">{pages_b}</ul>
    <ul class="footer__col">{elsewhere}</ul>
    <ul class="footer__col footer__col--last"><li><a href="mailto:{EMAIL}">{EMAIL}</a></li></ul>
  </div>
  <p class="footer__copy">{NAME} © 2026</p>
</footer>
<script src="{prefix}js/main.js?v={ASSET_V}"></script>
</body>
</html>
"""



e = html.escape
CASES = json.load(open(ROOT / "tools" / "cases.json"))
CASE_ORDER = ["tmu", "fieldnote", "close", "modellab"]
TOOLBAR = lambda prefix, label: (f'<div class="toolbar"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="{prefix}">{NAME}</a>'
                                 f'<span class="dot">•</span><span>{label}</span></nav></div>')

# ---------- About ----------
def about():
    return """<section class="editorial">
  <div class="editorial__text">
    <p>I’m drawn to the place where content, design and technology meet, and to how combining them changes the way people live, create and connect. Nothing moves me more than watching someone grow in something they love.</p>
    <p>That’s why I’m a marketer who knows how to close. I’ve worked both ends of the funnel, building audiences and communities online, then turning that interest into sign-ups in person.</p>
    <p>Along the way I picked up the credentials to match: HubSpot certifications in Inbound and Social Media Marketing, and a NASM personal training certification, which is how I ended up selling gym memberships.</p>
    <p>Fluent in Korean and English.</p>
  </div>
  <figure class="editorial__figure"><img src="../images/about-portrait.webp" alt="Daniel mid-swing at a golf range at dusk" width="1000" height="1333" loading="eager"><figcaption>Daniel Kang.</figcaption></figure>
</section>"""

VALUES = [
    "live boldly. you miss 100% of the shots you don’t take.",
    "always be grateful for what you have in pursuit of what you want.",
    "be the least important person in the room. surround yourself with people you aspire to be.",
    "be humble enough to learn from anyone, but strong enough to stand for what you believe.",
    "money ≠ wealth. true wealth comes from relationships.",
    "mistakes only prove you are trying.",
    "true beauty comes from within: the kindness you show and the way you make others feel.",
    "you only live once, so say yes more than you say no.",
    "starting today is always better than never starting :D",
    "everyone’s path is different. learn to embrace yours.",
    "don’t worry about anything. pray instead!",
    "pain is inevitable, suffering is an option.",
]

def values():
    half = (len(VALUES) + 1) // 2
    def col(items, start):
        return "<ol start=\"%d\">%s</ol>" % (start, "".join(f"<li>{e(v)}</li>" for v in items))
    return f'''<div class="care">
  <aside class="care__side"><h1>Core Values</h1></aside>
  <div class="care__main vals">{col(VALUES[:half], 1)}{col(VALUES[half:], half + 1)}</div>
</div>'''

# ---------- Work ----------
def work():
    cards = ""
    write(ROOT / "core-values" / "index.html", page("core-values", "Core Values", values(), desc="Core values: Daniel Kang."))
    for k in CASE_ORDER:
        c = CASES[k]
        no = c["no"].split(" — ")[0]
        cards += (f'<li class="card"><a href="{c["slug"]}/"><div class="card__img"><img src="../images/{c["image"]}" alt="{e(c["imageAlt"])}" loading="lazy"></div>'
                  f'<div class="card__meta"><span class="card__title">{e(c["title"])}</span><span class="card__no">{no}</span></div></a></li>')
    return TOOLBAR("../", "Work") + f'<ul class="grid">{cards}</ul>'

def case(k):
    c = CASES[k]
    nxt = CASES[c["next"]]
    meta = "".join(f'<div><dt>{e(a)}</dt><dd>{e(b)}</dd></div>' for a, b in c["meta"])
    steps = "".join(f'<li><span class="acc__h">{e(h)}</span><span class="acc__b">{e(b)}</span></li>' for h, b in c["approach"])
    stats = "".join(f'<li><span class="stat__n">{e(n)}</span><span class="stat__l">{e(l)}</span></li>' for n, l in c["results"])
    learned = "".join(f'<li><span class="acc__h">{e(h)}</span><span class="acc__b">{e(b)}</span></li>' for h, b in c.get("learned", []))
    acc = (f'<details class="acc" open><summary>The challenge<span class="acc__i"></span></summary><p>{e(c["challenge"])}</p></details>'
           f'<details class="acc"><summary>Approach<span class="acc__i"></span></summary><ol class="steps">{steps}</ol></details>'
           + (f'<details class="acc"><summary>{e(c["learnedTitle"])}<span class="acc__i"></span></summary><ol class="steps">{learned}</ol></details>' if c.get("learned") else f'<details class="acc"><summary>Results<span class="acc__i"></span></summary><ul class="stats">{stats}</ul></details>') +
           f'<details class="acc"><summary>{e(c.get("takeawayTitle","Takeaway"))}<span class="acc__i"></span></summary><p>{e(c["takeaway"])}</p></details>')
    return f"""<section class="pdp">
  <div class="pdp__gallery"><img src="../../images/{c.get('pageImage', c['image'])}" alt="{e(c['imageAlt'])}" width="{c.get('pageDims',[1234,1851])[0]}" height="{c.get('pageDims',[1234,1851])[1]}" loading="eager"></div>
  <div class="pdp__info">
    <nav class="pdp__crumbs" aria-label="Breadcrumb"><a href="../">Work</a><span class="dot">•</span><span>{e(c['title'])}</span></nav>
    <h1 class="pdp__title">{e(c['title'])}</h1>
    <p class="pdp__no">{e(c['no'])}</p>
    <p class="pdp__lede">{e(c['lede'])}</p>
    <dl class="pdp__meta">{meta}</dl>
    <div class="accs">{acc}</div>
    <a class="btn" href="../{nxt['slug']}/">Next: {e(nxt['title'])}</a>
  </div>
</section>"""

# ---------- Experience ----------
EXP = [
    ('Marketing and social', [
        ('tmu-bn', 'TMU Business Network', 'Co-Founder & Director of Marketing', 'Newhall, CA', 'Mar 2026 – Now', 'Grew to 650+ members in 3 months; matched students with Big Four professionals.'),
        ('modellab', 'ModelLab', 'Founder', 'Online', 'Nov 2026 – Now', 'Built an interactive investing education website to simplify investing strategies for beginners.'),
        ('jcinme', 'JC in Me', 'Social Media Manager', 'Santa Clarita, CA', 'Sep 2025 – May 2026', '3.5% interaction rate on 18,500+ views in the first 30 days; AI-assisted content workflow.'),
    ]),
    ('Sales', [
        ('fitness-19', 'Fitness 19', 'Lead Service Specialist', 'Dublin, CA', 'Sep 2026 – Now', 'Convert 60% of facility tours into memberships (industry average ~38%) with needs-based tours; sell 15 memberships a month against an 8-member target; sell personal training on commission.'),
        ('coaching', 'Online fitness coaching', 'High-Ticket Sales Closer', 'Remote', 'Aug – Oct 2026', 'Closed high-ticket coaching offers on commission from a 14K-follower audience.'),
    ]),
    ('Other', [
        ('tmu', 'The Master’s University', 'Student Recruitment Associate', 'Newhall, CA', 'Jan – May 2026', 'Cold-called 1,000+ prospective students across CA, AZ and TX.'),
        ('freelance', 'Dos Bros · HK Animal Hospital', 'Freelance Web Designer', 'California', '2025 – 2026', 'Designed and launched sites for <a class="u" href="https://dosbrosdetailing.club" target="_blank" rel="noopener">a detailing business</a> and <a class="u" href="https://hkanimalhospital.vet" target="_blank" rel="noopener">a veterinary hospital</a>.'),
    ]),
]
FLAT = [x for _, g in EXP for x in g]
CASE_OF = {'tmu-bn':'tmu','modellab':'modellab','fitness-19':'close','coaching':'close','tmu':'close'}

def experience():
    side = "".join(f'<li><a href="#{i}">{e(c)}</a></li>' for i, c, *_ in FLAT)
    rows = ""
    for g, items in EXP:
        rows += f'<tr class="tbl__group"><td colspan="2">{e(g)}</td></tr>'
        rows += "".join(f'<tr><td><a href="#{i}">{e(r)}</a><span class="muted"> · {e(c)}</span></td><td>{e(d)}</td></tr>' for i, c, r, w, d, _ in items)
    det = "".join(f'<section class="exp" id="{i}"><h2>{e(r)} · {e(c)}</h2><p class="muted">{e(w)} · {e(d)}</p><p>{b}</p>' + (f'<p><a class="u" href="../work/{CASE_OF[i]}/">Read the case</a></p>' if i in CASE_OF else '') + '</section>' for i, c, r, w, d, b in FLAT)
    return f"""<div class="care">
  <aside class="care__side"><h1>Experience</h1><ul>{side}</ul></aside>
  <div class="care__main">
    <table class="tbl"><thead><tr><th>Role</th><th>Dates</th></tr></thead><tbody>{rows}</tbody></table>
    <hr class="care__rule">
    {det}
  </div>
</div>"""

# ---------- Beyond ----------
LIFE = [
    ('life-olives.webp', 'Walking in Jerusalem at sunset', 'Mount of Olives', 'Jerusalem, Israel'),
    ('life-yummy-matcha.webp', 'Daniel and friends with matcha and soft serve', 'Soft serve', 'Palo Alto, California'),
    ('life-cafe-hopping.webp', 'Matcha from Wabicha café', 'Yummy matcha', 'Osaka, Japan'),
    ('life-uji-bridge.webp', 'Daniel on a bridge in Kyoto', 'Uji bridge', 'Uji, Japan'),
    ('life-nara-deer.webp', 'Feeding deer in Nara', 'Feeding the deer', 'Nara, Japan'),
    ('life-han-river.webp', 'Daniel and a friend by the Han River at night', 'Han River', 'Seoul, South Korea'),
]

def beyond():
    items = "".join(f'<li class="gal__item"><img src="../images/{s}" alt="{e(a)}" loading="lazy"><div class="gal__text"><p>{e(t)}</p><p class="muted">{e(pl)}</p></div></li>' for s, a, t, pl in LIFE)
    return f'<ul class="gal">{items}</ul>'

# ---------- Recommendation ----------
LETTER = {
    "org": "JC in Me", "name": "Leslie Bess", "role": "JC in Me",
    "quote": "Daniel is remarkably creative, but equally practical.",
    "paras": [
        "I had the pleasure of working with Daniel as our Social Media Manager at JC in Me, where he handled everything end-to-end: strategy, content creation, design, and posting.",
        "What makes Daniel truly stand out is that he works like an owner. He doesn’t wait to be told what to do - he brings fresh ideas, takes feedback quickly, and continuously refines his work until it’s right. He understood our brand voice and target audience rapidly, and every piece of content he created felt completely true to who we are.",
        "Daniel is remarkably creative, but equally practical. He focuses on what will genuinely connect with people and drive action, not just what looks good visually. Beyond his technical skills, he is a clear communicator, highly dependable, and an absolute pleasure to work with.",
        "If you are hiring for a marketing, social media, or brand role, Daniel will bring energy, initiative, and genuine care for results. I recommend him without hesitation."],
    "close": "Love JC in Me & Sincerely,",
}

def recommendation():
    L = LETTER
    paras = "".join(f"<p>{e(x)}</p>" for x in L["paras"])
    return f"""<section class="centered">
  <blockquote class="centered__quote">“{e(L['quote'])}”</blockquote>
  <p class="centered__by"><em>{e(L['name'])}, {e(L['role'])}</em></p>
  <button class="linkbtn" type="button" data-letter="letter-1">Read the full letter</button>
</section>
<dialog class="letter" id="letter-1" aria-label="Letter of recommendation from {e(L['name'])}">
  <button class="letter__close" type="button" aria-label="Close letter">Close</button>
  <div class="letter__paper"><p class="letter__org">{e(L['org'])}</p><p>To Whom It May Concern,</p>{paras}<p class="letter__sign">{e(L['close'])}</p><p><strong>{e(L['name'])}</strong><br>{e(L['org'])}</p></div>
</dialog>"""

# ---------- Connect ----------
def connect():
    side = (f'<li><a href="mailto:{EMAIL}">Email</a></li>'
            f'<li><a href="{LINKS["LinkedIn"]}" target="_blank" rel="noopener">LinkedIn</a></li>'
            f'<li><a href="{LINKS["Instagram"]}" target="_blank" rel="noopener">Instagram</a></li>'
            f'<li><a href="../{LINKS["Résumé"]}" target="_blank" rel="noopener">Résumé</a></li>')
    return f"""<div class="care">
  <aside class="care__side"><h1>Connect</h1><ul>{side}</ul></aside>
  <div class="care__main">
    <p>Looking for a marketer who can close? Send a note and I’ll reply within a day.</p>
    <form class="form" id="contact-form" action="https://formspree.io/f/xvzdbkqk" method="POST" novalidate>
      <div class="field"><label for="f-name">Name</label><input id="f-name" name="name" type="text" autocomplete="name" required></div>
      <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
      <div class="field"><label for="f-reason">Reaching out about</label><select id="f-reason" name="reason"><option value="">Select one</option><option>Full-time role</option><option>Internship</option><option>Freelance project</option><option>Just connecting</option></select></div>
      <div class="field"><label for="f-msg">Message</label><textarea id="f-msg" name="message" rows="5"></textarea></div>
      <button class="btn btn--dark" type="submit">Send message</button>
      <p class="form__status" role="status" aria-live="polite"></p>
    </form>
  </div>
</div>"""


def write(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text)


def main():
    write(ROOT / "index.html", page(None, ""))
    builders = {"about": about, "work": work, "experience": experience, "beyond": beyond,
                "recommendation": recommendation, "connect": connect}
    descs = {"about": "About Daniel Kang — a marketer who knows how to close.",
             "work": "Selected work: TMU Business Network, Fieldnote, The Close and ModelLab.",
             "experience": "Marketing and sales experience, 2025 to now.",
             "beyond": "Beyond work: Seoul, Nara, Uji and the Bay Area.",
             "recommendation": "A letter of recommendation for Daniel Kang.",
             "connect": "Get in touch with Daniel Kang."}
    for label, slug in NAV:
        write(ROOT / slug / "index.html", page(slug, label, builders[slug](), desc=descs[slug]))
    for k in CASE_ORDER:
        c = CASES[k]
        write(ROOT / "work" / c["slug"] / "index.html",
              page("work", "Work", case(k), prefix="../../", cls="is-inner is-case",
                   title=f"{c['title']} – {NAME}", desc=c["lede"]))
    print("built", 2 + len(NAV) + len(CASE_ORDER), "pages")


if __name__ == "__main__":
    main()
