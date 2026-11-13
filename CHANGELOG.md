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

### Fieldnote brand concept deck
- Rebuilt to measured reference specs (type sizes, hairlines, margins, swatches).
- All photography remade in an editorial style with the new frosted bottle (text printed on the glass, black cylinder cap).

### Code
- `tools/build.py`: `WORK_ORDER`, `WORK_CAT`, `EXTERNAL`, `THUMB_ALT`; thumbnails rendered via `<img>`.
- `css/style.css`: `.card__img` sizing and cover fit.
- All pages regenerated.

### Known caveats
- Deloitte, KPMG and EY marks are typeset approximations, not official artwork.
- Elegant Writing and Fractional Controller marks are placeholder wordmarks.
