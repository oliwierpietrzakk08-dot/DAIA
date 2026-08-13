/* =====================================================================
   DAIA — product configurator
   Flow: colour -> size -> sleeve fit -> (model image swaps) -> add to cart
   ===================================================================== */
document.addEventListener("DOMContentLoaded", initProduct);

const state = { color: "black", size: null, sleeve: null, mainIndex: 0 };

function initProduct() {
  const params = new URLSearchParams(location.search);
  const c = params.get("color");
  if (c && COLORS[c]) state.color = c;

  buildSwatches();
  buildSizes();
  buildSleeves();
  buildAccordion();
  renderColor();
  renderGallery();

  document.getElementById("addBtn").addEventListener("click", addToCart);
  document.getElementById("buybarBtn").addEventListener("click", () => {
    if (!state.size || !state.sleeve) {
      document.getElementById("sleeveBlock").scrollIntoView({ behavior: "smooth", block: "center" });
    } else addToCart();
  });
  initBuybar();
}

/* ---- Colour ---- */
function buildSwatches() {
  document.getElementById("swatches").innerHTML = COLOR_ORDER.map((k) => `
    <button class="swatch" data-color="${k}" aria-label="${COLORS[k].name}"
      style="background:${COLORS[k].hex}"></button>`).join("");
  document.querySelectorAll(".swatch").forEach((b) =>
    b.addEventListener("click", () => { state.color = b.dataset.color; renderColor(); renderGallery(); }));
}
function renderColor() {
  const c = COLORS[state.color];
  document.querySelectorAll(".swatch").forEach((b) =>
    b.setAttribute("aria-pressed", b.dataset.color === state.color));
  document.getElementById("colorLabel").textContent = c.name;
  document.getElementById("crumbColor").textContent = c.name.charAt(0) + c.name.slice(1).toLowerCase();
  document.getElementById("price").textContent = fmtPrice(PRODUCT.price);
  const url = new URL(location);
  url.searchParams.set("color", state.color);
  history.replaceState({}, "", url);
  updateAddState();
}

/* ---- Size ---- */
function buildSizes() {
  document.getElementById("sizes").innerHTML = PRODUCT.sizes.map((s) => {
    const on = PRODUCT.sizesAvailable.includes(s);
    return `<button class="chip" data-size="${s}" ${on ? "" : "disabled"}>${s}</button>`;
  }).join("");
  document.querySelectorAll("[data-size]").forEach((b) =>
    b.addEventListener("click", () => { state.size = b.dataset.size; renderSize(); }));
}
function renderSize() {
  document.querySelectorAll("[data-size]").forEach((b) =>
    b.setAttribute("aria-pressed", b.dataset.size === state.size));
  const block = document.getElementById("sleeveBlock");
  block.classList.remove("hidden");
  if (!state.sleeve) block.scrollIntoView({ behavior: "smooth", block: "nearest" });
  updateAddState();
}

/* ---- Sleeve fit ---- */
function buildSleeves() {
  document.getElementById("sleeveOpts").innerHTML = PRODUCT.sleeveFits.map((s) => `
    <button class="sleeve-opt" data-sleeve="${s.id}">
      <span class="num">${s.circ.replace(" cm", "")}</span>
      <span class="fit">${s.fit}</span>
    </button>`).join("");
  document.querySelectorAll("[data-sleeve]").forEach((b) =>
    b.addEventListener("click", () => { state.sleeve = b.dataset.sleeve; renderSleeve(); }));
}
function renderSleeve() {
  const s = PRODUCT.sleeveFits.find((x) => x.id === state.sleeve);
  document.querySelectorAll("[data-sleeve]").forEach((b) =>
    b.setAttribute("aria-pressed", b.dataset.sleeve === state.sleeve));
  document.getElementById("sleeveCirc").textContent = s ? `${s.circ} · ${s.flat} flat` : "—";
  document.getElementById("modelMeta").innerHTML = s
    ? `Model ${PRODUCT.model.height} / ${PRODUCT.model.weight} · wearing ${s.label}`
    : "";
  // Swap the model image (index 0) to the selected sleeve variant — real, per-variant asset.
  state.mainIndex = 0;
  renderGallery();
  updateAddState();
}

/* ---- Gallery ---- */
function currentImages() {
  const imgs = galleryImgs(state.color).slice();
  imgs[0] = { src: modelImg(state.color, state.sleeve || "31"), alt: "Model wearing THE TEE", isModel: true };
  return imgs;
}
function renderGallery() {
  const imgs = currentImages();
  const main = document.getElementById("mainImg");
  main.classList.add("swapping");
  setTimeout(() => {
    main.src = imgs[state.mainIndex].src;
    main.alt = imgs[state.mainIndex].alt;
    main.classList.remove("swapping");
  }, 160);

  document.getElementById("thumbs").innerHTML = imgs.map((im, i) => `
    <button class="thumb ${i === state.mainIndex ? "active" : ""}" data-idx="${i}">
      <img src="${im.src}" alt="${im.alt}" loading="lazy">
    </button>`).join("");
  document.querySelectorAll("[data-idx]").forEach((b) =>
    b.addEventListener("click", () => { state.mainIndex = +b.dataset.idx; renderGallery(); }));
}

/* ---- Accordion ---- */
function buildAccordion() {
  const items = [
    { t: "Material & specs", body: `<ul>${PRODUCT.material.map((m) => `<li>${m}</li>`).join("")}<li>${PRODUCT.base}</li></ul>` },
    { t: "The sleeve system", body: `<p>Pick your standard size, then dial the sleeve opening: 28 / 29,5 / 31 / 33 cm. The body stays identical — only the opening changes, so the fit is yours without altering the silhouette.</p>` },
    { t: "Shipping & returns", body: `<p>Dispatched within 1–2 business days. 30-day returns on unworn items. Shipping is calculated at checkout.</p>` },
    { t: "Care", body: `<p>Wash cold, inside out. Do not tumble dry. Pre-shrunk cotton keeps its fit wash after wash.</p>` },
  ];
  document.getElementById("accordion").innerHTML = items.map((it, i) => `
    <div class="accordion__item ${i === 0 ? "open" : ""}">
      <button class="accordion__btn"><span class="label">${it.t}</span><span class="accordion__ic">+</span></button>
      <div class="accordion__panel" style="${i === 0 ? "max-height:260px" : ""}"><div class="accordion__panel-inner">${it.body}</div></div>
    </div>`).join("");
  document.querySelectorAll(".accordion__btn").forEach((btn) =>
    btn.addEventListener("click", () => {
      const item = btn.closest(".accordion__item");
      const panel = item.querySelector(".accordion__panel");
      const open = item.classList.toggle("open");
      panel.style.maxHeight = open ? panel.scrollHeight + 40 + "px" : "0";
    }));
}

/* ---- Add to cart ---- */
function updateAddState() {
  const ready = state.color && state.size && state.sleeve;
  const btn = document.getElementById("addBtn");
  const bbtn = document.getElementById("buybarBtn");
  const s = PRODUCT.sleeveFits.find((x) => x.id === state.sleeve);
  document.getElementById("buybarSpec").textContent =
    `THE TEE · ${COLORS[state.color].name}${state.size ? " · " + state.size : ""}${s ? " · " + s.label : ""}`;
  document.getElementById("buybarPrice").textContent = fmtPrice(PRODUCT.price);
  if (ready) {
    btn.disabled = false; bbtn.disabled = false;
    btn.textContent = `Add to bag — ${COLORS[state.color].name} · ${state.size} · ${s.label}`;
    bbtn.textContent = "Add";
  } else {
    btn.disabled = true; bbtn.disabled = true;
    btn.textContent = state.size ? "Select sleeve fit" : "Select size";
    bbtn.textContent = "Select";
  }
}
function addToCart() {
  if (!(state.color && state.size && state.sleeve)) return;
  Cart.add({ color: state.color, size: state.size, sleeve: state.sleeve, qty: 1 });
  UI.openDrawer();
}

/* Show sticky buy bar once user scrolls past the main add button */
function initBuybar() {
  const bar = document.getElementById("buybar");
  const anchor = document.getElementById("addBtn");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => bar.classList.toggle("show", !en.isIntersecting));
  }, { threshold: 0 });
  io.observe(anchor);
}
