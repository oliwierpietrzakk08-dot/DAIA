/* =====================================================================
   DAIA — shared shell: header, nav, cart drawer, measure modal, reveal
   ===================================================================== */

/* Flag JS as available (reveal-on-scroll hides content only when this is set). */
document.documentElement.classList.add("js");

/* ---------- Cart store (localStorage) ---------- */
const CART_KEY = "daia_cart_v1";
const Cart = {
  read() { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; } },
  write(items) { localStorage.setItem(CART_KEY, JSON.stringify(items)); document.dispatchEvent(new Event("cart:change")); },
  key(i) { return `${i.color}-${i.size}-${i.sleeve}`; },
  add(item) {
    const items = this.read();
    const found = items.find((x) => this.key(x) === this.key(item));
    if (found) found.qty += item.qty; else items.push(item);
    this.write(items);
  },
  setQty(k, qty) {
    let items = this.read();
    items = items.map((x) => (this.key(x) === k ? { ...x, qty } : x)).filter((x) => x.qty > 0);
    this.write(items);
  },
  remove(k) { this.write(this.read().filter((x) => this.key(x) !== k)); },
  count() { return this.read().reduce((n, x) => n + x.qty, 0); },
  total() { return this.read().reduce((n, x) => n + x.qty * PRODUCT.price, 0); },
};

/* ---------- Shell markup ---------- */
const NAV = [
  { label: "Shop", href: "shop.html" },
  { label: "Fit", href: "index.html#fit" },
  { label: "About", href: "index.html#about" },
  { label: "Size Guide", href: "#", measure: true },
];

function headerHTML() {
  const nav = NAV.map((n) => `<a href="${n.href}"${n.measure ? ' data-measure' : ''}>${n.label}</a>`).join("");
  return `
  <header class="header" id="siteHeader">
    <div class="wrap header__row">
      <nav class="header__nav">${nav}</nav>
      <button class="burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>
      <a class="brand" href="index.html">DAIA</a>
      <div class="header__actions">
        <button class="h-search label" aria-label="Search">Search</button>
        <a class="label" href="#" aria-label="Account">Account</a>
        <button class="label" id="cartBtn" aria-label="Cart">Cart <span class="cart-count" id="cartCount">(0)</span></button>
      </div>
    </div>
  </header>

  <div class="mnav" id="mnav">
    <div class="mnav__head">
      <a class="brand" href="index.html" style="padding-left:0">DAIA</a>
      <button class="label" id="mnavClose">Close</button>
    </div>
    ${NAV.map((n) => `<a href="${n.href}"${n.measure ? ' data-measure' : ''}>${n.label}</a>`).join("")}
  </div>`;
}

function footerHTML() {
  const col = (h, items) => `<div><h4>${h}</h4><ul>${items.map((i) => `<li><a href="${i[1]}"${i[2] ? ' data-measure' : ''}>${i[0]}</a></li>`).join("")}</ul></div>`;
  return `
  <footer class="footer">
    <div class="wrap">
      <div class="footer__grid">
        <div class="footer__brand">
          <a class="brand" href="index.html">DAIA</a>
          <p class="muted" style="max-width:34ch">One tee, built around the fit. Choose your standard size, then dial in the sleeve.</p>
        </div>
        ${col("Shop", [["The Tee", "shop.html"], ["Black", "product.html?color=black"], ["Off White", "product.html?color=white"], ["Navy", "product.html?color=navy"], ["Brown", "product.html?color=brown"]])}
        ${col("Help", [["Size Guide", "#", true], ["Shipping", "#"], ["Returns", "#"], ["Contact", "#"]])}
        ${col("Social", [["Instagram", "#"], ["TikTok", "#"]])}
      </div>
      <div class="footer__base">
        <span>© ${new Date().getFullYear()} DAIA</span>
        <div class="links"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Cookies</a></div>
      </div>
    </div>
  </footer>`;
}

function drawerHTML() {
  return `
  <div class="overlay" id="overlay"></div>
  <aside class="drawer" id="cartDrawer" aria-label="Cart">
    <div class="drawer__head">
      <span class="label">Your bag</span>
      <button class="label" id="cartClose">Close</button>
    </div>
    <div class="drawer__body" id="cartBody"></div>
    <div class="drawer__foot" id="cartFoot"></div>
  </aside>`;
}

function measureModalHTML() {
  return `
  <div class="modal" id="measureModal" role="dialog" aria-modal="true" aria-label="How to measure">
    <div class="modal__card">
      <div class="modal__media">
        <svg width="320" height="320" viewBox="0 0 320 320" fill="none" stroke="#141414">
          <path d="M60 120 L110 90 L160 105 L210 90 L260 120 L235 155 L215 145 L215 240 L105 240 L105 145 L85 155 Z" stroke-width="2" fill="#E4E0D7"/>
          <line x1="215" y1="118" x2="260" y2="118" stroke-width="1.2"/>
          <line x1="215" y1="112" x2="215" y2="124" stroke-width="1.2"/>
          <line x1="260" y1="112" x2="260" y2="124" stroke-width="1.2"/>
          <text x="237" y="106" font-size="13" text-anchor="middle" fill="#141414" stroke="none" font-family="Helvetica Neue">14,75</text>
        </svg>
      </div>
      <div class="modal__body">
        <button class="modal__close" data-close-modal>Close</button>
        <span class="eyebrow label">Size Guide</span>
        <h3>Measure your sleeve</h3>
        <p class="muted">The sleeve number is the circumference of the sleeve opening — not your biceps. It’s the easiest measurement to match from a shirt you already love.</p>
        <ol>
          <li>Lay a t-shirt you like flat, sleeve smoothed out.</li>
          <li>Measure the width of the sleeve opening, edge to edge.</li>
          <li>Multiply by two — that’s your opening circumference.</li>
        </ol>
        <div class="measure-eq">
          <span class="big">14,75</span><span class="muted">cm flat</span>
          <span class="big">×2</span>
          <span class="big">= 29,5</span><span class="muted">cm → S/29,5</span>
        </div>
        <p class="muted" style="margin-top:22px">The body stays the same across every sleeve option. Only the opening changes.</p>
      </div>
    </div>
  </div>`;
}

/* ---------- Cart drawer render ---------- */
function renderCart() {
  const items = Cart.read();
  const body = document.getElementById("cartBody");
  const foot = document.getElementById("cartFoot");
  document.querySelectorAll("#cartCount").forEach((el) => (el.textContent = `(${Cart.count()})`));
  if (!body) return;

  if (!items.length) {
    body.innerHTML = `<div class="drawer__empty"><p>Your bag is empty.</p><a class="link-underline" href="shop.html" style="margin-top:16px;display:inline-block">Shop the tee</a></div>`;
    foot.innerHTML = "";
    return;
  }
  body.innerHTML = items.map((i) => {
    const k = Cart.key(i);
    const sleeve = PRODUCT.sleeveFits.find((s) => s.id === i.sleeve);
    return `
    <div class="line-item">
      <div class="line-item__img"><img src="${modelImg(i.color, i.sleeve)}" alt=""></div>
      <div class="line-item__meta">
        <span class="name">${PRODUCT.name}</span>
        <span class="spec">${COLORS[i.color].name}</span>
        <span class="spec">Size ${i.size} · Sleeve ${sleeve ? sleeve.label : i.sleeve}</span>
        <div class="qty">
          <button data-qty="dec" data-k="${k}" aria-label="Decrease">–</button>
          <span>${i.qty}</span>
          <button data-qty="inc" data-k="${k}" aria-label="Increase">+</button>
        </div>
      </div>
      <div class="line-item__right">
        <button class="line-item__remove" data-remove="${k}">Remove</button>
        <span>${fmtPrice(i.qty * PRODUCT.price)}</span>
      </div>
    </div>`;
  }).join("");

  foot.innerHTML = `
    <div class="drawer__total"><span class="muted">Subtotal</span><span>${fmtPrice(Cart.total())}</span></div>
    <p class="mini" style="margin-bottom:16px">Shipping calculated at checkout.</p>
    <a class="btn btn--block" href="checkout.html">Proceed to checkout</a>`;

  body.querySelectorAll("[data-qty]").forEach((b) => b.addEventListener("click", () => {
    const k = b.dataset.k, item = Cart.read().find((x) => Cart.key(x) === k);
    if (!item) return;
    Cart.setQty(k, item.qty + (b.dataset.qty === "inc" ? 1 : -1));
  }));
  body.querySelectorAll("[data-remove]").forEach((b) => b.addEventListener("click", () => Cart.remove(b.dataset.remove)));
}

/* ---------- Overlay coordination ---------- */
const UI = {
  openDrawer() { this.showOverlay(); document.getElementById("cartDrawer").classList.add("open"); },
  closeDrawer() { document.getElementById("cartDrawer").classList.remove("open"); this.hideOverlay(); },
  openMenu() { this.showOverlay(); document.getElementById("mnav").classList.add("open"); },
  closeMenu() { document.getElementById("mnav").classList.remove("open"); this.hideOverlay(); },
  openModal() { document.getElementById("measureModal").classList.add("open"); this.showOverlay(); },
  closeModal() { document.getElementById("measureModal").classList.remove("open"); this.hideOverlay(); },
  showOverlay() { document.getElementById("overlay").classList.add("open"); document.body.style.overflow = "hidden"; },
  hideOverlay() {
    document.getElementById("overlay").classList.remove("open");
    document.body.style.overflow = "";
  },
  closeAll() { this.closeDrawer(); this.closeMenu(); this.closeModal(); },
};

/* ---------- Boot ---------- */
function mountShell() {
  const header = document.getElementById("mount-header");
  if (header) header.innerHTML = headerHTML();
  const footer = document.getElementById("mount-footer");
  if (footer) footer.innerHTML = footerHTML();
  document.body.insertAdjacentHTML("beforeend", drawerHTML() + measureModalHTML());

  document.getElementById("cartBtn")?.addEventListener("click", () => UI.openDrawer());
  document.getElementById("cartClose")?.addEventListener("click", () => UI.closeDrawer());
  document.getElementById("burger")?.addEventListener("click", () => UI.openMenu());
  document.getElementById("mnavClose")?.addEventListener("click", () => UI.closeMenu());
  document.getElementById("overlay")?.addEventListener("click", () => UI.closeAll());
  document.querySelectorAll("[data-measure]").forEach((el) =>
    el.addEventListener("click", (e) => { e.preventDefault(); UI.closeMenu(); UI.openModal(); }));
  document.querySelectorAll("[data-close-modal]").forEach((el) => el.addEventListener("click", () => UI.closeModal()));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") UI.closeAll(); });
  document.addEventListener("cart:change", renderCart);

  renderCart();
  initReveal();
  initHeaderHide();
}

/* Reveal on scroll — progressive enhancement with a safety net so content
   is never left invisible (e.g. if IntersectionObserver never fires). */
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  els.forEach((el) => io.observe(el));
  // Fallback: reveal anything still hidden after a short delay.
  const flush = () => els.forEach((el) => el.classList.add("in"));
  window.addEventListener("load", () => setTimeout(flush, 1400));
  setTimeout(flush, 2500);
}

/* Hide header on scroll down, show on scroll up */
function initHeaderHide() {
  const h = document.getElementById("siteHeader");
  let last = 0;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (y > last && y > 200) h.style.transform = "translateY(-100%)";
    else h.style.transform = "none";
    last = y;
  }, { passive: true });
}

document.addEventListener("DOMContentLoaded", mountShell);
