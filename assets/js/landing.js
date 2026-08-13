/* =====================================================================
   DAIA — landing interactions
   ===================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // Sleeve number showcase
  const showcase = document.getElementById("sleeveShowcase");
  if (showcase) {
    showcase.innerHTML = PRODUCT.sleeveFits.map((s) => `
      <div class="sleeve-cell">
        <div class="sleeve-cell__num">${s.circ.replace(" cm", "")}</div>
        <div class="sleeve-cell__fit label">${s.fit}</div>
        <div class="sleeve-cell__bar" style="transform:scaleX(${0.55 + PRODUCT.sleeveFits.indexOf(s) * 0.15})"></div>
      </div>`).join("");
  }

  // Collection preview cards
  const grid = document.getElementById("collectionPreview");
  if (grid) grid.innerHTML = COLOR_ORDER.map(cardHTML).join("");
});

function cardHTML(colorKey) {
  const c = COLORS[colorKey];
  const g = galleryImgs(colorKey);
  return `
  <a class="pcard" href="product.html?color=${colorKey}">
    <div class="pcard__media">
      <img class="front" src="${g[0].src}" alt="${PRODUCT.name} in ${c.name}" loading="lazy">
      <img class="back" src="${g[1].src}" alt="" loading="lazy">
    </div>
    <div class="pcard__info">
      <div>
        <div class="name">${PRODUCT.name}</div>
        <div class="pcard__color">${c.name}</div>
      </div>
      <div class="price">${fmtPrice(PRODUCT.price)}</div>
    </div>
  </a>`;
}
