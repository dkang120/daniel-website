#!/usr/bin/env python3
"""Daniel Kang portfolio — layout draft modelled on therow.com (measured spec in THE-ROW-SPEC.md)."""
import os, pathlib

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

# Hero gallery: (alt, caption, object-position desktop, object-position mobile, header tone over the image)
HERO = [
    ("Nara, Japan", "Nara, Japan", "50% 64%", "50% 50%", "dark"),
    ("Byodo-in, Uji, Japan", "Uji, Japan", "50% 55%", "50% 60%", "light"),
    ("Fitting room mirror selfie", "Seoul, South Korea", "50% 60%", "50% 50%", "light"),
    ("Jerusalem at sunset", "Jerusalem, Israel", "50% 25%", "45% 50%", "light"),
    ("Café", "San Francisco, USA", "50% 55%", "20% 50%", "dark"),
    ("Street reflected in a convex mirror", "Seoul, South Korea", "50% 55%", "50% 50%", "dark"),
]


def hero_html():
    slides = []
    for i, (alt, cap, pos, posm, tone) in enumerate(HERO, 1):
        eager = 'loading="eager"' + (' fetchpriority="high"' if i == 1 else ' fetchpriority="low"')
        slides.append(
            f'<div class="hero__slide" data-tone="{tone}"{"" if i == 1 else " aria-hidden=\"true\""}>'
            f'<img class="hero__img" src="images/hero-{i}-2000.webp" '
            f'srcset="images/hero-{i}-900.webp 900w, images/hero-{i}-2000.webp 2000w" sizes="100vw" '
            f'alt="{alt}" style="--pd:{pos};--pm:{posm}" draggable="false" {eager}>'
            + (f'<span class="hero__caption">{cap}</span>' if cap else "") + "</div>"
        )
    return (
        '<section class="hero" aria-roledescription="carousel" aria-label="Photo gallery" tabindex="0">'
        + "".join(slides) + "</section>"
    )


def page(slug, label):
    home = slug is None
    prefix = "" if home else "../"
    title = NAME if home else f"{label} – {NAME}"
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
        main = (
            f'<main class="page"><div class="toolbar"><nav class="breadcrumbs" aria-label="Breadcrumb">'
            f'<a href="{prefix}">{NAME}</a><span class="dot">•</span><span>{label}</span></nav></div>'
            f'<div class="page__body"></div></main>'
        )
        body_cls = "is-inner"
    if home:
        main = f"<main>{main}</main>"
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="Daniel Kang — social media, paid social and sales.">
<link rel="icon" href="{prefix}images/favicon.svg">
<link rel="stylesheet" href="{prefix}css/style.css">
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
    <div class="footer__col footer__col--lead"><p>{NAME}</p><p class="muted">Bay Area, California</p></div>
    <ul class="footer__col">{pages_a}</ul>
    <ul class="footer__col">{pages_b}</ul>
    <ul class="footer__col">{elsewhere}</ul>
    <ul class="footer__col footer__col--last"><li><a href="mailto:{EMAIL}">{EMAIL}</a></li></ul>
  </div>
  <p class="footer__copy">{NAME} © 2026</p>
</footer>
<script src="{prefix}js/main.js"></script>
</body>
</html>
"""


def main():
    (ROOT / "index.html").write_text(page(None, ""))
    for label, slug in NAV:
        d = ROOT / slug
        d.mkdir(exist_ok=True)
        (d / "index.html").write_text(page(slug, label))
    print("built", 1 + len(NAV), "pages")


if __name__ == "__main__":
    main()
