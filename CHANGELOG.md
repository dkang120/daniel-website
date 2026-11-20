# Changelog

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
