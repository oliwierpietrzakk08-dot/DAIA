/* =====================================================================
   DAIA — collection page
   ===================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("collection");
  if (!grid) return;
  grid.innerHTML = COLOR_ORDER.map((colorKey) => {
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
  }).join("");
});
