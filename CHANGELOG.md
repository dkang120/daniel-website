# Changelog

## 2026-11-21 — Unslop pass (Charles Liu's skill)

- About (desktop): the long text is now left-aligned in a 560px column instead of centred (a deliberate deviation from The Row's centred editorial template, for readability).
- Work: Fieldnote thumbnail background recoloured from #f4f0ed to the card's #f8f6f5, so it no longer reads as a box inside the card.
- Cache tags bumped: style.css v=f2, thumb-fieldnote v=3.

## 2026-11-20 — Beyond as an art gallery; Nara off the opener rotation

- Hero openers: morning Uji, afternoon Seoul fitting room, evening and night SF café (never Jerusalem or Nara).
- Beyond (desktop): art-gallery wall. Every print is the same size, two per screen, each in a thin black frame with a white mat on a warm wall (#f3f0ec) under a soft gallery light, with a white museum placard below ("No. 01", italic title, place, coordinates) and a centred "BEYOND" room title. Removed "Six snapshots from outside work."

## 2026-11-20 — Hero: life doodles replace "hi, it's me!"

- Removed the "hi, it's me!" note and arrow.
- Five hand-drawn doodles of Daniel's life (iced matcha, soft serve, paper plane, dumbbell, golf flag), drawn as tapered marker strokes, pop in one by one around his head on whichever photo opens, then bob gently. Spots are chosen from candidates around the head that are fully on screen, clear of the face and off the body (`data-me` = face centre + radius).
- Legibility (color-analysis pass): white strokes with a tight dark casing and a soft shade; every doodle passes on all four openers at 1440/1280 desktop and 393/360 mobile (min Lc 54, median 84).
- Beyond unchanged.

## 2026-11-20 — Hero arrow placement + legibility, arrow chip, Beyond sizes

- "hi, it's me!": arrow tip lands beside Daniel with a small gap (Uji target derived from the original layout), same note spacing as the original; Seoul arrow comes from the left. Openers unchanged (Uji / Nara / SF café / Seoul).
- Legibility (color-analysis pass): dark casing and a soft shade behind the white arrow and note; they switch to ink with a white halo when the photo underneath is light. All four openers pass on desktop and mobile (arrows Lc 51–98, notes Lc 58–104).
- Desktop hero hint is now a small white arrow chip (ink arrow, gentle nudge) instead of handwritten text.
- Beyond (desktop): the smaller photo is ~84% of the large one; both 4:5, offset and alternating.

## 2026-11-20 — Hero openers, desktop hint, Beyond spreads, Experience polish

- Hero: "hi, it's me!" now lands on whichever photo opens and points at Daniel (face positions stored as `data-me`; placed by measuring the rendered photo, mirrored or stacked when space is tight). Openers: morning Uji, afternoon Nara, evening SF café, night Seoul fitting room. Jerusalem is never the opener.
- Desktop hero: progress bars removed; handwritten "psst… there's more →" appears after ~2s and leaves on first click.
- Beyond (desktop): editorial spreads with one large and one offset small photo per screen, alternating sides, 01–06 index numbers, small-caps city and coordinates, big "Beyond" title.
- Experience: smaller content type on mobile; "keep going ↓" nudge on desktop and mobile (fades in ~2s after landing, here and on About; fixed to the viewport bottom).

## 2026-11-20 — Desktop hero progress bars

- Desktop only: Stories-style progress bars under the header (one per photo; seen = solid, current fills in), layered above the header fade so they stay bright on dark photos. Mobile keeps its dots.

## 2026-11-20 — About: "keep going" nudge

- Handwritten "keep going ↓" (Caveat, soft grey, bobbing arrow) at the bottom of About's first screen on mobile and desktop; fades after the first scroll.

## 2026-11-20 — Departures board, time-of-day hero, desktop screen-by-screen

- Hero caption is now a split-flap departures board ("✈ NARA, JAPAN") that flips letter by letter on every slide change (desktop + mobile).
- Hero opens on the photo that fits the visitor's local time (morning Uji, afternoon Nara, evening Jerusalem, night San Francisco), with a handwritten "good evening ✦"-style greeting.
- Desktop (`css/desktop.css` + `js/desktop.js`, ≥1008px): screen-by-screen snapping, with one wheel notch or trackpad flick per screen; reveal animations; "Next: <page> →" end card above the footer; Experience sidebar pinned, plus category labels, bolder roles and hairlines; Work shows all four cards on one screen; Beyond one row per screen; Core Values, Recommendation and Connect one screen each; hero is a full 100vh. Verified at 1440×900, 1280×720 and 1920×1080.
- About: removed "which is how I ended up selling gym memberships".

## 2026-11-20 — Mobile polish + faster hero

- Hero photos slide faster on mobile and desktop (900ms → 560ms, crisper ease).
- Experience (mobile): "Experience" title pinned under the header while the three groups move beneath it; bolder role titles, smaller grey meta, hairlines between roles.
- Core Values (mobile): title pinned; only the values slide in (from the left, staggered).
- Recommendation (mobile): quotes 19 → 17px, names and links 14px.
- Screen dots on the right slightly smaller.

## 2026-11-20 — Experience categories stand out

- Category labels (Marketing & Social, Sales, Other) are now uppercase, letter-spaced ink labels: with a short rule on the desktop table, and a hairline running to the edge on mobile. Was italic grey.

## 2026-11-20 — Mobile rebuild (screen-by-screen)

Desktop is pixel-identical (verified at 1440 and 1100 on all 11 pages). All mobile work lives in `css/mobile.css` + `js/mobile.js`, loaded only at ≤1007px; mobile-only markup uses `.m-only` (hidden on desktop).

**Audit fixes**
- Fixed dead "Read the case" links on Experience (`/work/close/` → `/work/the-close/`, `/work/tmu/` → `/work/tmu-business-network/`).
- Sticky header on mobile; on Home it turns solid once you pass the photo.
- Tap targets 44–48px (menu button, drawer rows, footer links, buttons, accordions, breadcrumbs, form fields).
- Form text 16px (no iOS zoom), dropdown chevron, full-width button, labels aligned.
- Footer → end-card screen: "Next: <page>" link + compact 2-column links.
- Page titles on About, Work, Experience, Beyond, Core Values, Recommendation, Connect.
- Experience: duplicate table hidden; roles grouped (Marketing and social / Sales / Other).
- Home: intro screen ("A marketer who can close.") with See my work / Résumé / Get in touch.
- About text left-aligned; body text 15px on mobile.
- Swipe indicators: hero dots + one-time "Swipe for more photos" hint; dots + "1 / 8 · swipe" on case photo stacks.
- Recommendation: both quotes on one screen, letters open as a full-screen sheet.

**Screen-by-screen**
- Mandatory scroll snapping: every swipe moves exactly one screen (`[data-scr]`), sized to the phone (svh). Verified to fit exactly at 390×844, 375×667, 430×932 and 360×740.
- Each screen is self-contained: Beyond = one photo + caption + "n / 6"; Work = two cards per screen; case studies = photo + headline, then details + Next; Core Values = six per screen; Experience = one group per screen.
- Content eases in as each screen arrives; screen dots on the right (tap to jump); Beyond photos tap to advance; accordions open one at a time with a smooth height animation (start collapsed if they would overflow the screen).

*Deviations from therow.com mobile:* sticky header, snapping, larger type/targets, end-card footer, page titles, home intro, indicators.

## 2026-11-20 — ModelLab case page removed

- Deleted `work/modellab/` and its images (`case-modellab.webp`, `case-modellab-og.jpg`); removed from the sitemap.
- Experience → ModelLab link now opens modellab.hidanielkang.com in a new tab ("Visit ModelLab"). The Work card and TMU "Next" button already link out.

## 2026-11-20 — Color pass (Charles Liu color-analysis skill)

Measured all 12 pages at 1440×900 and 390×844, plus all 6 hero slides (APCA Lc).
- Neutrals merged into one warm family, tinted to the #f8f6f5 tile (H 49°, C 0.005): text #1D1B19 (was #1c1b1b/#212121/#000), grey text #6D6967 (was #6a6a6a, Lc 77), rules #DAD6D5 (was #ddd/#d6d6d6). 7 greys → 4. *Deviates slightly from the measured therow.com values.*
- Form field lines #d8d7d5 → #C8C5C3 (Lc 21 → 31, field-edge floor 30).
- Experience group labels: opacity .6 → var(--light) (Lc 71.5 → 77).
- Home header: dark fade on dark slides .32 → .55 and 110 → 140px (white nav over bright sky Lc 42 → 58–83); new white fade (.4) on light slides so the 11px logo reaches Lc 74–83. *Not in the therow reference.*
- Hero captions: tighter shadow plus a soft eased shade in the bottom-right corner. Worst case Lc 26–65 → 75–106 across all slides and sizes. *Not in the therow reference.*

## 2026-11-20 — ModelLab refresh

- New ModelLab thumbnail: current purple app icon + Open Sauce wordmark (`images/thumb-modellab.webp`, cache-busted `?v=2`). Geometry matches the measured original: wordmark at the same letter positions (x 494–706, y 367–404, ±1px), icon 64×64 at x 397 in the old mark's width, centered on the tile midline.
- ModelLab links now point to modellab.hidanielkang.com (Work card, TMU "Next" button, case page).
- Case page copy updated: text buddy as the core (Claude on Twilio), dropped email gate, $4.99/mo Pro plan on Stripe, updated stack.
- Experience entry for ModelLab updated to match.

## 2026-11-13 — Work page update

### Work page
- Added thumbnails for all four projects (`images/thumb-*.webp`, 1106×772, tile `#f8f6f5`, 20px radius, 553:386 ratio, measured against the reference tiles).
  - **TMU Business Network:** 2×3 logo grid (Deloitte, KPMG, EY, Thrivent, Elegant Writing, Fractional Controller).
  - **ModelLab:** logo centered in the tile.
  - **The Close:** mock sales dashboard (conversion, audience, calls, states, role table; chart labeled "Illustrative trend").
  - **Fieldnote:** 2×2 mosaic of the brand concept deck slides.
- Fieldnote card now opens the deck PDF (`files/Fieldnote-Brand-Concept.pdf`) in a new tab.
- Card labels: "The Close · Sales" and "Fieldnote · Brand Concept".
- Work order: TMU, ModelLab, The Close, Fieldnote.
- Added alt text for every thumbnail.

### TMU Business Network case page
- Replaced the AI-generated image with four real event photos (`images/case-tmu-1..4.webp`).
- New photo-stack gallery: tilted cards, click or swipe sends the top photo to the back; touch drag follows the finger; arrow keys work; left arrow brings the last photo back.
- Gallery code: `gallery()` in `tools/build.py`, `.cs` styles in `css/style.css`, stack logic in `js/main.js`.

### The Close case page
- Content rewritten to the new sales framework: new lede, challenge and summary line.
- Approach section renamed "How I run a call" with four phases: Open (~10%), Discover (~80%), Close (~10%), Follow up.
- Removed the "7 P's" mention from the takeaway.

### Case study "Next" buttons
- Now follow the Work order: TMU, ModelLab, The Close, Fieldnote, back to TMU.
- ModelLab and Fieldnote open externally (live site, PDF) in a new tab.

### TMU thumbnail
- Row spacing tightened (96px to 78px).

### Mobile menu
- Added "Core Values" to the menu list (after the first four pages).
- Added an info block under the list: Location (Bay Area, California) and Email (mailto link).
- Secondary links (elsewhere) spacing reduced from 60px to 40px; info block sits 60px below the main list, rows 20px apart, labels in the light grey.

### Fieldnote brand concept deck
- Rebuilt to measured reference specs (type sizes, hairlines, margins, swatches).
- All photography remade in an editorial style with the new frosted bottle (text printed on the glass, black cylinder cap).

### Code
- `tools/build.py`: `WORK_ORDER`, `WORK_CAT`, `EXTERNAL`, `THUMB_ALT`; thumbnails rendered via `<img>`.
- `css/style.css`: `.card__img` sizing and cover fit; Work grid is 2-up (single column under 640px, 24px gap, max width 1130px); card meta gap 7px; drawer info styles.
- All pages regenerated.

### The Close case page: sales carousel
- Replaced the AI hero image with an 8-slide hand-drawn carousel ("How I run a sales call"), shown as the same click/swipe photo stack as the TMU case page, in a portrait 4:5 variant.
- Slides follow Shelby Sapp's public call framework in my own words: cover, 10/80/10 shape, four Discover questions, presenting in their words, the close, objections, "not yet", after the call.
- New portrait gallery style (`.cs--p`), slide images `case-close-1..8.webp`, updated image alt text.
- `tools/cases.json` was re-saved with 2-space indent, so its diff is noisy.

## Known caveats
- Deloitte, KPMG and EY marks are typeset approximations, not official artwork.
- Elegant Writing and Fractional Controller marks are placeholder wordmarks.

### ModelLab thumbnail
- `images/thumb-modellab.webp` now shows the redesigned ModelLab logo (curve mark + lowercase wordmark), same 1106x772 canvas, background and text height (37px) as before. Other thumbnails untouched.

- 2026-11-16: Fieldnote brand concept deck: recentered slide 1 bottle photos; slides 3 and 4 bottles moved down with the added headroom filled in brand clay tones (slide 3 cap completed).
- 2026-11-16: Fieldnote card thumbnail (`images/thumb-fieldnote.webp`) regenerated from the updated deck slides, same 2×2 layout.
- 2026-11-16: Résumé PDF replaced with the new version (`assets/Daniel-Kang-Resume.pdf`, link cache-buster ?v=2).

## 2026-11-21 — TMU story page, Fieldnote split page, Skills page

### TMU Business Network case page
- Rebuilt in The Close's format: a 7-slide portrait carousel (`images/case-tmu-soar-1..7.webp`, generated by `tools/tmu_slides.py`): cover, starting line, S, O, A, R, takeaway funnel.
- Accordions removed: challenge, SOAR (S/O/A one-liners + R stats), "How we did it" (the 4 plan points, 2×2) are all visible at once. Fits one screen at 1280×800 and up.
- "Why it matters" moved onto slide 7; Channels row dropped from meta (covered by the plan).

### Work page
- TMU thumbnail is now the networking-mixer photo (`thumb-tmu.webp`, cover fit).
- Fieldnote card opens the new `work/fieldnote/` page instead of the PDF.

### Fieldnote page (`work/fieldnote/`)
- Two panes side by side: the brand deck (PDF rendered to `images/fieldnote-deck-1..7.webp`, scrollable, with an Open PDF link) and the live site (iframe of dkang120.github.io/fieldnote).
- Mobile: same two panes, swipe sideways between them.
- The Close's "Next" button now goes here.

### Skills page (`skills/`)
- New page after Experience in the header, drawer and footer on every page. Lists Software, Skills, Certifications and Languages from the résumé.

### Code
- Asset versions bumped to `?v=g1`. `tools/build.py` NAV updated, but build.py is still behind the hand-edited HTML, so don't run it.
- 2026-11-21 (later): TMU case page goes back to the original 4-photo gallery (SOAR slides removed; `tools/tmu_slides.py` kept if they're wanted again). SOAR, plan, results and a one-line "Why it matters" stay in the text column, which still fits one screen down to 1440×720. Asset versions bumped to `?v=g2`.
- 2026-11-21: Résumé PDF replaced with the latest Google Doc export (skills moved up top; High Ticket Sales → Conversion Optimization). Skills page updated to match. Résumé links now ?v=3.
- 2026-11-21: TMU story block changed from SOAR to Challenge → Opportunity → Results (standalone challenge section folded in).
