# Changelog

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

### Known caveats
- Deloitte, KPMG and EY marks are typeset approximations, not official artwork.
- Elegant Writing and Fractional Controller marks are placeholder wordmarks.
