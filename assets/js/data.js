/* =====================================================================
   DAIA — SINGLE SOURCE OF TRUTH
   Edit prices, copy, colors and image paths here. To use real photos,
   replace the SVG files in /assets/img/<color>/ with same-named files
   (any extension) and update the paths below if the extension changes.
   ===================================================================== */

const PRODUCT = {
  id: "the-tee",
  name: "THE TEE",
  price: 59,
  currency: "PLN",
  material: ["100% cotton", "185 GSM", "Ring-spun", "Pre-shrunk"],
  base: "B&C E190 production base",
  sizes: ["XS", "S", "M", "L", "XL"],
  // Which sizes are in stock right now (S is the priority size for launch).
  sizesAvailable: ["S"],
  // Sleeve fit = circumference of the SLEEVE OPENING (flat width × 2).
  sleeveFits: [
    { id: "28",   label: "S/28",   flat: "14 cm",    circ: "28 cm",   fit: "SMALLER ARM" },
    { id: "29.5", label: "S/29,5", flat: "14,75 cm", circ: "29,5 cm", fit: "MEDIUM ARM" },
    { id: "31",   label: "S/31",   flat: "15,5 cm",  circ: "31 cm",   fit: "LARGER ARM" },
    { id: "33",   label: "S/33",   flat: "16,5 cm",  circ: "33 cm",   fit: "FULLER ARM" },
  ],
  model: { height: "188 CM", weight: "60 KG", wearing: "S" },
};

const COLORS = {
  black: { key: "black", name: "BLACK",     hex: "#141414" },
  white: { key: "white", name: "OFF WHITE", hex: "#EDEAE1" },
  navy:  { key: "navy",  name: "NAVY",      hex: "#26333F" },
  brown: { key: "brown", name: "BROWN",     hex: "#5C4632" },
};
const COLOR_ORDER = ["black", "white", "navy", "brown"];

/* Image manifest — all colourways share one matching campaign photo system. */
function imgBase(color) { return `assets/img/${color}`; }
function photoBase(color) { return `assets/img/products/the-tee/${color}`; }
function modelImg(color, fitId) {
  return `${photoBase(color)}/s${fitId.replace(".", "")}.png`;
}
function galleryImgs(color) {
  const b = photoBase(color);
  const colorName = COLORS[color].name.toLowerCase();
  return [
    { src: `${b}/s31.png`, alt: `Model wearing THE TEE in ${colorName}`, isModel: true },
    { src: `${b}/front.png`, alt: `Front view of THE TEE in ${colorName}` },
    { src: `${b}/three-quarter.png`, alt: `Three-quarter view of THE TEE in ${colorName}` },
    { src: `${b}/side.png`, alt: `Side view of THE TEE in ${colorName}` },
    { src: `${b}/back.png`, alt: `Back view of THE TEE in ${colorName}` },
    { src: `${b}/collar.png`, alt: `Collar detail of THE TEE in ${colorName}` },
    { src: `${b}/sleeve.png`, alt: `Sleeve detail of THE TEE in ${colorName}` },
    { src: `${b}/fabric.png`, alt: `Cotton fabric detail of THE TEE in ${colorName}` },
  ];
}

function fmtPrice(v) {
  return `${v.toLocaleString("pl-PL")} ${PRODUCT.currency}`;
}
