# DAIA — storefront

Static, build-free storefront for a minimalist t-shirt brand. Core idea:
**one tee, standard size + individual sleeve fit.**

## Run
Just open `index.html` in a browser, or serve the folder:
```bash
python3 -m http.server 5173
```
Then visit http://localhost:5173

## Structure
```
index.html      Landing (hero, sleeve system, collection preview)
shop.html       Collection — 4 colours
product.html    Product page + configurator (colour → size → sleeve → cart)
checkout.html   Demo checkout
assets/css/style.css   Design system (tokens, components, responsive)
assets/js/data.js      Single source of truth: price, colours, sizes, sleeves, image manifest
assets/js/app.js       Shell: header, nav, cart drawer, measure modal, cart store
assets/js/{landing,shop,product,checkout}.js   Page logic
assets/img/<colour>/   Placeholder images (one per view + one per sleeve variant)
tools/generate-placeholders.mjs   Regenerates the SVG placeholders
```

## Replacing placeholders with real photos
The site references image **paths only** — architecture is ready for one photo
per sleeve variant. Drop real files into `assets/img/<colour>/` using the same
names:
```
front, back, detail-fabric, detail-sleeve, detail-collar,
model-28, model-29.5, model-31, model-33
```
If you use `.jpg`/`.webp` instead of `.svg`, update the extensions in
`assets/js/data.js` (`modelImg`, `galleryImgs`). Nothing else changes — the
sleeve selector already swaps to a distinct image file per fit (no CSS faking).

## Editing content
Price, colours, sizes, sleeve numbers and copy live in `assets/js/data.js`.
Currently: **59 PLN**, colours Black / Off White / Navy / Brown, launch size **S**
with sleeve openings 28 / 29,5 / 31 / 33 cm.
