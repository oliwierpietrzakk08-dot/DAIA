/**
 * DAIA — placeholder image generator
 * -----------------------------------
 * Produces one SVG file per color / view / sleeve-fit variant.
 * These are intentional editorial placeholders (technical flat-lays + model
 * silhouettes). Replace them with real photography by dropping files with the
 * SAME NAME into /assets/img/<color>/ — the site references paths only, so no
 * code changes are required. See README.
 *
 * Run:  node tools/generate-placeholders.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dir, "..", "assets", "img");

const PAPER = "#EDEAE3";
const PAPER_DEEP = "#E4E0D7";
const INK = "#141414";

/* Per-color rendering palette (studio-on-paper look) */
const COLORS = {
  black: { label: "BLACK", garment: "#191919", stroke: "#191919", swatch: "#141414", tint: PAPER },
  white: { label: "OFF WHITE", garment: "#F6F3EC", stroke: "#B9B3A6", swatch: "#EDEAE1", tint: PAPER_DEEP },
  navy:  { label: "NAVY", garment: "#25313E", stroke: "#25313E", swatch: "#26333F", tint: PAPER },
  brown: { label: "BROWN", garment: "#5B4634", stroke: "#5B4634", swatch: "#5C4632", tint: PAPER },
};

/* Sleeve opening → vertical length of the sleeve hem edge (px). Bigger = wider. */
const SLEEVE_PX = { "28": 148, "29.5": 168, "31": 190, "33": 214 };

const W = 1000, H = 1250;

/* Minimal jersey t-shirt outline. `open` = sleeve opening length in px. */
function teePath(open) {
  const sy = 452;               // shoulder line
  const neckHalf = 80, neckDip = 60;
  const shTipY = 466;
  const sleeveTopY = 486;
  const sleeveBotY = sleeveTopY + open;
  const hemY = 1066;
  const R = (x) => x, L = (x) => 1000 - x; // right / mirrored-left helpers
  // right-side vertices, top→bottom
  const pts = [
    `M ${L(422)} ${sy}`,
    `Q 500 ${sy + neckDip} ${R(422)} ${sy}`, // neck dip (422 mirrored = 578)
    `L ${R(300)} ${shTipY}`,                 // right shoulder tip (x=700)
    `L ${R(158)} ${sleeveTopY}`,             // sleeve outer top (x=842)
    `L ${R(158)} ${sleeveBotY}`,             // sleeve outer bottom (opening edge)
    `L ${R(312)} ${sleeveBotY - 6}`,         // right underarm (x=688)
    `L ${R(292)} ${hemY}`,                   // body hem right (x=708)
    `Q 500 ${hemY + 30} ${L(292)} ${hemY}`,  // hem sweep to left (x=292)
    `L ${L(312)} ${sleeveBotY - 6}`,         // left underarm
    `L ${L(158)} ${sleeveBotY}`,             // left sleeve outer bottom
    `L ${L(158)} ${sleeveTopY}`,             // left sleeve outer top
    `L ${L(300)} ${shTipY}`,                 // left shoulder tip
    "Z",
  ];
  return pts.join(" ");
}

function frame(inner, bg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img">
<rect width="${W}" height="${H}" fill="${bg}"/>
${inner}
</svg>`;
}

const META = (t) =>
  `font-family="Helvetica Neue, Arial, sans-serif" fill="${INK}" ${t}`;

/* ---------- view renderers ---------- */

function flatLay(color, view) {
  const c = COLORS[color];
  const filled = color === "white";
  const d = teePath(SLEEVE_PX["31"]); // standard sleeve for generic flat-lays
  const garment = filled
    ? `<path d="${d}" fill="${c.garment}" stroke="${c.stroke}" stroke-width="2"/>`
    : `<path d="${d}" fill="${c.garment}"/>`;
  const back = view === "back";
  const collar = back
    ? `<path d="M 452 512 Q 500 542 548 512" fill="none" stroke="${c.tint}" stroke-width="3" opacity="0.5"/>`
    : `<path d="M 430 470 Q 500 520 570 470" fill="none" stroke="${c.tint}" stroke-width="3" opacity="0.55"/>`;
  return frame(
    `${garment}${collar}
     <text x="70" y="110" ${META('font-size="26" letter-spacing="4"')}>THE TEE</text>
     <text x="70" y="1180" ${META('font-size="22" letter-spacing="6" opacity="0.55"')}>${c.label} · ${view.toUpperCase()}</text>
     <rect x="900" y="88" width="30" height="30" fill="${c.swatch}" stroke="rgba(0,0,0,.15)"/>`,
    c.tint
  );
}

function modelShot(color, fit) {
  const c = COLORS[color];
  const d = teePath(SLEEVE_PX[fit]);
  const filled = color === "white";
  const garment = filled
    ? `<path d="${d}" fill="${c.garment}" stroke="${c.stroke}" stroke-width="2"/>`
    : `<path d="${d}" fill="${c.garment}"/>`;
  // Clean editorial frame: only a subtle sleeve-opening bracket + corner mark.
  // Model / sleeve meta is provided by the page (HTML overlay), so real photos
  // drop in with no baked-in text to clash. The sleeve WIDTH differs per file.
  return frame(
    `<g transform="translate(0,-8)">${garment}</g>
     <line x1="842" y1="486" x2="928" y2="486" stroke="${INK}" stroke-width="1.5" opacity="0.5"/>
     <line x1="842" y1="${486 + SLEEVE_PX[fit]}" x2="928" y2="${486 + SLEEVE_PX[fit]}" stroke="${INK}" stroke-width="1.5" opacity="0.5"/>
     <line x1="920" y1="486" x2="920" y2="${486 + SLEEVE_PX[fit]}" stroke="${INK}" stroke-width="1.5" opacity="0.5"/>
     <text x="70" y="110" ${META('font-size="26" letter-spacing="4"')}>THE TEE</text>
     <rect x="900" y="88" width="30" height="30" fill="${c.swatch}" stroke="rgba(0,0,0,.15)"/>`,
    c.tint
  );
}

function detail(color, kind) {
  const c = COLORS[color];
  let art = "";
  if (kind === "fabric") {
    // jersey knit texture
    let lines = "";
    for (let y = 250; y < 1000; y += 26)
      for (let x = 180; x < 820; x += 18)
        lines += `<line x1="${x}" y1="${y}" x2="${x + 9}" y2="${y + 13}" stroke="${c.garment}" stroke-width="6" opacity="0.9" stroke-linecap="round"/>`;
    art = `<g>${lines}</g>
      <text x="70" y="1160" ${META('font-size="20" letter-spacing="6" opacity="0.55"')}>FABRIC · 185 GSM · RING-SPUN</text>`;
  } else if (kind === "collar") {
    art = `<path d="M 250 760 Q 500 560 750 760" fill="none" stroke="${c.garment}" stroke-width="46" stroke-linecap="round"/>
      <path d="M 250 800 Q 500 610 750 800" fill="none" stroke="${c.tint}" stroke-width="3" opacity="0.6"/>
      <text x="70" y="1160" ${META('font-size="20" letter-spacing="6" opacity="0.55"')}>COLLAR · RIBBED</text>`;
  } else {
    // sleeve hem with measurement
    art = `<rect x="300" y="360" width="400" height="470" fill="${c.garment}"/>
      <line x1="300" y1="900" x2="700" y2="900" stroke="${INK}" stroke-width="1.5"/>
      <line x1="300" y1="885" x2="300" y2="915" stroke="${INK}" stroke-width="1.5"/>
      <line x1="700" y1="885" x2="700" y2="915" stroke="${INK}" stroke-width="1.5"/>
      <text x="500" y="960" text-anchor="middle" ${META('font-size="30" letter-spacing="2"')}>FLAT × 2 = OPENING</text>
      <text x="70" y="1160" ${META('font-size="20" letter-spacing="6" opacity="0.55"')}>SLEEVE · MEASURED FLAT</text>`;
  }
  return frame(
    `${art}
     <text x="70" y="110" ${META('font-size="26" letter-spacing="4"')}>THE TEE</text>
     <rect x="900" y="88" width="30" height="30" fill="${c.swatch}" stroke="rgba(0,0,0,.15)"/>`,
    c.tint
  );
}

/* ---------- write files ---------- */
let count = 0;
for (const color of Object.keys(COLORS)) {
  const dir = resolve(OUT, color);
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, "front.svg"), flatLay(color, "front"));
  writeFileSync(resolve(dir, "back.svg"), flatLay(color, "back"));
  writeFileSync(resolve(dir, "detail-fabric.svg"), detail(color, "fabric"));
  writeFileSync(resolve(dir, "detail-collar.svg"), detail(color, "collar"));
  writeFileSync(resolve(dir, "detail-sleeve.svg"), detail(color, "sleeve"));
  count += 5;
  for (const fit of Object.keys(SLEEVE_PX)) {
    writeFileSync(resolve(dir, `model-${fit}.svg`), modelShot(color, fit));
    count++;
  }
}
console.log(`Generated ${count} placeholder SVGs in assets/img/`);
