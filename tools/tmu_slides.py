#!/usr/bin/env python3
"""TMU Business Network SOAR slides (960x1200), same system as the case-close slides:
Poppins, white canvas, purple accent, 82px left margin, letterspaced DANIEL KANG footer."""
import pathlib
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
IMG = ROOT / "images"
F = "/usr/share/fonts/truetype/google-fonts/Poppins-%s.ttf"
W, H, M = 960, 1200, 82
INK, ACC, GREY = (17, 17, 17), (110, 63, 224), (128, 128, 128)


EXTRA = {"SemiBold": "/tmp/fnt/package/files/poppins-latin-600-normal.woff",
         "ExtraBold": "/tmp/fnt/package/files/poppins-latin-900-normal.woff"}  # from npm @fontsource/poppins


def font(w, s): return ImageFont.truetype(EXTRA.get(w, F % w), s)


def spaced(d, xy, text, f, fill, track, anchor_center=False):
    widths = [d.textlength(ch, font=f) for ch in text]
    total = sum(widths) + track * (len(text) - 1)
    x, y = xy
    if anchor_center: x = (W - total) / 2
    for ch, w in zip(text, widths):
        d.text((x, y), ch, font=f, fill=fill); x += w + track


def wrap(d, text, f, maxw):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if d.textlength(t, font=f) <= maxw: cur = t
        else: lines.append(cur); cur = w
    lines.append(cur); return lines


def rich(d, x, y, parts, f, maxw, lh):
    """parts: list of (text, color). Word-wraps across colored runs."""
    words = [(w, c) for t, c in parts for w in t.split()]
    cx, cy, space = x, y, d.textlength(" ", font=f)
    for w, c in words:
        wl = d.textlength(w, font=f)
        if cx > x and cx + wl > x + maxw: cx, cy = x, cy + lh
        d.text((cx, cy), w, font=f, fill=c); cx += wl + space
    return cy + lh


def photo(canvas, name, box, focus=(.5, .5), r=18):
    x0, y0, x1, y1 = box; bw, bh = x1 - x0, y1 - y0
    im = Image.open(IMG / name).convert("RGB")
    s = max(bw / im.width, bh / im.height); im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    left = min(max(0, round((im.width - bw) * focus[0])), im.width - bw)
    top = min(max(0, round((im.height - bh) * focus[1])), im.height - bh)
    im = im.crop((left, top, left + bw, top + bh))
    mask = Image.new("L", (bw, bh), 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, bw - 1, bh - 1), r, fill=255)
    canvas.paste(im, (x0, y0), mask)


def base():
    c = Image.new("RGB", (W, H), "white"); d = ImageDraw.Draw(c)
    spaced(d, (0, 1108), "DANIEL KANG", font("Medium", 21), INK, 9, anchor_center=True)
    return c, d


def numbered(d, y, items, f=None, gap=22, num="dash"):
    f = f or font("SemiBold", 36); lh = 50
    for i, t in enumerate(items, 1):
        d.text((M, y), f"{i}." if num == "num" else "–", font=f, fill=ACC)
        for j, line in enumerate(wrap(d, t, f, W - M - 150 - 40)):
            d.text((M + 68, y + j * lh), line, font=f, fill=INK)
        y += lh * len(wrap(d, t, f, W - M - 150 - 40)) + gap
    return y


def letter_badge(d, ch, y=96):
    d.rounded_rectangle((M, y, M + 92, y + 92), 20, fill=ACC)
    f = font("Bold", 58); tw = d.textlength(ch, font=f)
    d.text((M + 46 - tw / 2, y + 4), ch, font=f, fill="white")


slides = []

# 1. Cover
c, d = base()
rich(d, M, 84, [("Rule I grow by:", ACC), ("Run a community like a sales funnel.", INK)], font("SemiBold", 44), W - 2 * M, 64)
spaced(d, (M, 300), "COMMUNITY CASE STUDY:", font("Medium", 22), GREY, 5)
fb = font("ExtraBold", 92)
d.text((M - 4, 340), "0 TO 650+", font=fb, fill=INK)
d.text((M - 4, 440), "IN 3 MONTHS", font=fb, fill=INK)
photo(c, "case-tmu-1.webp", (M, 590, W - M, 1050), (.45, .5))
slides.append((c, "Cover: how TMU Business Network grew from 0 to 650+ members in 3 months"))

# 2. Starting line
c, d = base()
d.text((M, 84), "The starting line:", font=font("SemiBold", 46), fill=ACC)
d.text((M, 150), "One campus. No network.", font=font("SemiBold", 40), fill=INK)
cols = [("1,200", "students"), ("0", "members"), ("0", "events")]
cw = (W - 2 * M) / 3
for i, (n, l) in enumerate(cols):
    x = M + i * cw
    d.text((x, 250), n, font=font("Bold", 76), fill=INK if i == 0 else ACC)
    d.text((x + 2, 350), l, font=font("Medium", 28), fill=GREY)
y = rich(d, M, 430, [("The job:", ACC), ("connect students with working professionals in respected fields, from scratch.", INK)], font("SemiBold", 34), W - 2 * M, 48)
photo(c, "case-tmu-2.webp", (M, 610, W - M, 1050), (.5, .55))
slides.append((c, "The starting line: 1,200 students, 0 members, 0 events"))

# 3-5. S, O, A
SOA = [
    ("S", "Strengths:", "What we already had.",
     ["Official backing from TMU Career Services", "Professionals at firms like Deloitte, EY and KPMG", "Three co-founders splitting the work"],
     "case-tmu-3.webp", (.4, .5), "S for Strengths: Career Services backing, Big Four contacts, three co-founders"),
    ("O", "Opportunities:", "Where the gap was.",
     ["No official way for students to meet working professionals", "Campus fairs and weekly bulletins already reach every student", "Instagram and LinkedIn to stay present between events"],
     None, None, "O for Opportunities: no official path to professionals, existing campus channels"),
    ("A", "Aspirations:", "What we built toward.",
     ["Every student one coffee chat away from a professional", "A weekly rhythm students rely on", "A direct student-to-industry pipeline"],
     "case-tmu-4.webp", (.6, .5), "A for Aspirations: every student one coffee chat from a professional"),
]
for ch, head, sub, items, ph, foc, alt in SOA:
    c, d = base()
    letter_badge(d, ch)
    d.text((M + 120, 96), head, font=font("SemiBold", 46), fill=ACC)
    d.text((M + 120, 150), sub, font=font("SemiBold", 34), fill=INK)
    y = numbered(d, 270, items, num="num")
    if ph:
        photo(c, ph, (M, max(y + 20, 660), W - M, 1050), foc)
    else:
        # channel chips, drawn in the deck's line style
        d.text((M, max(y + 10, 690)), "Channels we could use on day one:", font=font("Medium", 28), fill=GREY)
        chips = ["Campus fairs", "Bulletins", "Coffee chats", "Zoom", "Instagram", "LinkedIn"]
        fx, x, yy = font("SemiBold", 34), M, max(y + 60, 760)
        for t in chips:
            tw = d.textlength(t, font=fx)
            if x + tw + 60 > W - M: x, yy = M, yy + 104
            d.rounded_rectangle((x, yy, x + tw + 60, yy + 78), 39, outline=INK, width=5)
            d.text((x + 30, yy + 15), t, font=fx, fill=INK)
            x += tw + 60 + 18
    slides.append((c, alt))

# 6. Results
c, d = base()
letter_badge(d, "R")
d.text((M + 120, 96), "Results:", font=font("SemiBold", 46), fill=ACC)
d.text((M + 120, 150), "Three months in.", font=font("SemiBold", 34), fill=INK)
stats = [("650+", "members"), ("54%", "of the student body"), ("10+", "Big Four matches"), ("1,300+", "LinkedIn engagements")]
cw = (W - 2 * M) / 2
for i, (n, l) in enumerate(stats):
    x, y = M + (i % 2) * cw, 300 + (i // 2) * 250
    d.text((x, y), n, font=font("Bold", 96), fill=INK)
    d.text((x + 4, y + 130), l, font=font("Medium", 30), fill=GREY)
d.line((M, 830, W - M, 830), fill=(225, 225, 225), width=3)
rich(d, M, 870, [("Cadence:", ACC), ("1–2 events a week, about 20 attendees each.", INK)], font("SemiBold", 36), W - 2 * M, 52)
slides.append((c, "R for Results: 650+ members, 54% of students, 10+ Big Four matches, 1,300+ LinkedIn engagements"))

# 7. Takeaway funnel
c, d = base()
d.text((M, 84), "What I learned:", font=font("SemiBold", 46), fill=ACC)
for j, line in enumerate(wrap(d, "Community growth runs like a sales funnel.", font("SemiBold", 40), W - 2 * M)):
    d.text((M, 150 + j * 56), line, font=font("SemiBold", 40), fill=INK)
bands = [("Reach", "where they already are"), ("Offer", "one clear reason to join"), ("Repeat", "on a schedule they trust")]
top, bh, gap = 330, 200, 26
for i, (t, s) in enumerate(bands):
    y0, y1 = top + i * (bh + gap), top + i * (bh + gap) + bh
    inset0, inset1 = 40 + i * 72, 40 + i * 72 + 62
    poly = [(M + inset0 - 40, y0), (W - M - inset0 + 40, y0), (W - M - inset1 + 40, y1), (M + inset1 - 40, y1)]
    d.polygon(poly, outline=INK, width=6, fill=(244, 240, 255) if i == 2 else None)
    ft, fs = font("Bold", 46), font("Medium", 26)
    d.text(((W - d.textlength(t, font=ft)) / 2, y0 + 44), t, font=ft, fill=ACC if i == 2 else INK)
    d.text(((W - d.textlength(s, font=fs)) / 2, y0 + 112), s, font=fs, fill=GREY)
slides.append((c, "What I learned: reach, offer, repeat. Community growth runs like a sales funnel"))

if __name__ == "__main__":
    for i, (im, alt) in enumerate(slides, 1):
        im.save(IMG / f"case-tmu-soar-{i}.webp", "WEBP", quality=88, method=6)
        print(i, (IMG / f"case-tmu-soar-{i}.webp").stat().st_size // 1024, "KB", alt)
