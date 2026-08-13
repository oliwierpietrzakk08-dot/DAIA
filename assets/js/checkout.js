/* =====================================================================
   DAIA — checkout (demo: no real payment)
   ===================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  renderSummary();
  document.querySelectorAll('input[name="shipping"]').forEach((r) =>
    r.addEventListener("change", renderSummary));

  const form = document.getElementById("checkoutForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!Cart.count()) { alert("Your bag is empty."); return; }
    let ok = true;
    form.querySelectorAll("[required]").forEach((f) => {
      const bad = !String(f.value).trim();
      f.style.borderColor = bad ? "#b23b3b" : "";
      if (bad) ok = false;
    });
    if (!ok) { form.querySelector("[style*='b23b3b']")?.focus(); return; }
    confirmOrder();
  });
});

function shippingCost() {
  const el = document.querySelector('input[name="shipping"]:checked');
  return el ? Number(el.dataset.cost) : 0;
}

function renderSummary() {
  const items = Cart.read();
  const wrap = document.getElementById("summaryItems");
  if (!items.length) {
    wrap.innerHTML = `<p class="muted" style="padding:10px 0 20px">Your bag is empty. <a class="link-underline" href="shop.html">Shop</a></p>`;
  } else {
    wrap.innerHTML = items.map((i) => {
      const s = PRODUCT.sleeveFits.find((x) => x.id === i.sleeve);
      return `
      <div class="line-item">
        <div class="line-item__img"><img src="${modelImg(i.color, i.sleeve)}" alt=""></div>
        <div class="line-item__meta">
          <span class="name">${PRODUCT.name} <span class="muted">×${i.qty}</span></span>
          <span class="spec">${COLORS[i.color].name}</span>
          <span class="spec">Size ${i.size} · ${s ? s.label : i.sleeve}</span>
        </div>
        <div class="line-item__right"><span>${fmtPrice(i.qty * PRODUCT.price)}</span></div>
      </div>`;
    }).join("");
  }
  const sub = Cart.total();
  const ship = items.length ? shippingCost() : 0;
  document.getElementById("sumSubtotal").textContent = fmtPrice(sub);
  document.getElementById("sumShipping").textContent = ship ? fmtPrice(ship) : "—";
  document.getElementById("sumTotal").textContent = fmtPrice(sub + ship);
  document.getElementById("payTotal").textContent = fmtPrice(sub + ship);
}

function confirmOrder() {
  const total = Cart.total() + shippingCost();
  const main = document.querySelector("main.wrap");
  Cart.write([]); // clear bag
  main.innerHTML = `
    <div class="page-head" style="min-height:60vh;display:flex;flex-direction:column;justify-content:center;text-align:center;align-items:center">
      <span class="eyebrow label">Order confirmed</span>
      <h1 style="margin:14px 0">Thank you.</h1>
      <p style="max-width:40ch">Your order for ${fmtPrice(total)} is confirmed. A receipt is on its way to your inbox. This is a demo — no payment was taken.</p>
      <a class="btn" href="index.html" style="margin-top:30px">Back to home</a>
    </div>`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
