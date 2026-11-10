const ICONS = {
  Fashion: '<path d="M8 3L3 6l2 4 3-1v12h8V9l3 1 2-4-5-3a4 4 0 0 1-8 0z"/>',
  Shoes: '<path d="M2 17v-4l5-1 3-5 3 3 6 2a3 3 0 0 1 3 3v2H2z"/>',
  Accessories: '<circle cx="12" cy="12" r="5"/><path d="M9 7l1-4h4l1 4M9 17l1 4h4l1-4"/>',
  All: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>'
};

const HEART = '<svg viewBox="0 0 24 24"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"/></svg>';
const BACK = '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>';
const CLOSE = '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>';

const SIZES = {
  Fashion: ["S", "M", "L", "XL"],
  Shoes: ["40", "41", "42", "43", "44"],
  Accessories: []
};

// Add an "img" field (e.g. img: "images/coat.jpg") to show a real photo.

const PRODUCTS = [
  {
    id: 1,
    name: "Noir Wool Coat",
    category: "Fashion",
    price: 289,
    desc: "A tailored long coat in dense black wool with a clean, structured line. Warm, refined and made to last.",
    img: "https://images.unsplash.com/photo-1548126032-079a0fb0099d?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 2,
    name: "Silk Evening Shirt",
    category: "Fashion",
    price: 149,
    desc: "Fluid silk with a soft sheen and a relaxed drape.",
    img: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 3,
    name: "Tailored Blazer",
    category: "Fashion",
    price: 219,
    desc: "A sharp single-breasted blazer with a modern cut.",
    img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 4,
    name: "Onyx Leather Sneakers",
    category: "Shoes",
    price: 175,
    desc: "Minimal low-top sneakers in smooth black leather.",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 5,
    name: "Gold-Trim Loafers",
    category: "Shoes",
    price: 199,
    desc: "Classic loafers finished with a subtle gold detail.",
    img: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 6,
    name: "Chelsea Boots",
    category: "Shoes",
    price: 235,
    desc: "Sleek ankle boots with elastic side panels.",
    img: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 7,
    name: "Aurum Chrono Watch",
    category: "Accessories",
    price: 349,
    desc: "A black-dial chronograph with gold accents.",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 8,
    name: "Leather Card Holder",
    category: "Accessories",
    price: 79,
    desc: "Slim full-grain leather card holder with four slots.",
    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85"
  }
];


const CATEGORIES = ["All", "Fashion", "Shoes", "Accessories"];

/* ---------- Shop settings ---------- */
// stock = units available, rating = average stars, reviews = number of reviews
// Chelsea Boots (id 6) is set to 0 stock so you can see the "Sold out" state.
const META = {
  1: { stock: 5, rating: 4.8, reviews: 124 },
  2: { stock: 12, rating: 4.6, reviews: 87 },
  3: { stock: 8, rating: 4.7, reviews: 63 },
  4: { stock: 20, rating: 4.9, reviews: 210 },
  5: { stock: 3, rating: 4.5, reviews: 41 },
  6: { stock: 0, rating: 4.7, reviews: 95 },
  7: { stock: 6, rating: 4.9, reviews: 158 },
  8: { stock: 30, rating: 4.4, reviews: 72 }
};
const COUPONS = {
  SITAX10: { type: "pct", value: 10, label: "10% off" },
  WELCOME20: { type: "flat", value: 20, label: "$20 off" }
};
const SHIPPING_FEE = 10;   // charged when the order is under FREE_SHIP
const FREE_SHIP = 200;     // free shipping from this amount
const PAYMENTS = [
  ["cod", "Cash on delivery"],
  ["kbz", "KBZPay"],
  ["wave", "Wave Pay"],
  ["card", "Credit / Debit card"]
];
const PAY_NAME = { cod: "Cash on delivery", kbz: "KBZPay", wave: "Wave Pay", card: "Credit / Debit card" };

const state = {
  category: "All",
  query: "",
  sort: "featured",
  view: "home",
  wishlist: new Set(load("nova_wishlist", [])),
  cart: load("nova_cart", []),
  orders: load("nova_orders", []),
  coupon: null,
  pay: "cod",
  detailId: null,
  detailSize: null,
  user: null
};

const $ = (id) => document.getElementById(id);

function load(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return Array.isArray(v) ? v : fallback;
  } catch (e) {
    return fallback;
  }
}

function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}

function loadObj(key) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v && typeof v === "object" && !Array.isArray(v) ? v : null;
  } catch (e) {
    return null;
  }
}

function findProduct(id) {
  return PRODUCTS.find(function (p) { return p.id === id; });
}

// Database (Supabase). If config.js has no URL/key the shop runs in local demo mode.
const CFG = window.SHOP_CONFIG || {};
const SB = (CFG.url && CFG.key && window.supabase) ? window.supabase.createClient(CFG.url, CFG.key) : null;

// merge shop data into products; saved stock levels (after orders) win over defaults
const savedStock = SB ? {} : (loadObj("nova_stock") || {});
PRODUCTS.forEach(function (p) {
  const m = META[p.id] || {};
  p.stock = savedStock[p.id] != null ? savedStock[p.id] : (m.stock != null ? m.stock : 10);
  p.rating = m.rating || 4.5;
  p.reviews = m.reviews || 0;
});

function saveStock() {
  if (SB) return; // stock lives in the database
  const o = {};
  PRODUCTS.forEach(function (p) { o[p.id] = p.stock; });
  try { localStorage.setItem("nova_stock", JSON.stringify(o)); } catch (e) {}
}

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function sheetBar(title, closeOne) {
  return '<div class="sheet-bar">' +
    '<button class="icon-btn" ' + (closeOne ? 'data-closeone="' + closeOne + '"' : 'data-close') + ' aria-label="Back">' + BACK + '</button>' +
    '<span class="sheet-title">' + title + '</span><span style="width:44px"></span></div>';
}

function imageHTML(p) {
  return p.img
    ? '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy">'
    : '<svg class="glyph" viewBox="0 0 24 24">' + ICONS[p.category] + '</svg>';
}

/* ---------- Product cards ---------- */
// i >= 0 plays the staggered entrance animation, i < 0 renders without it
function cardHTML(p, i) {
  const active = state.wishlist.has(p.id);
  const anim = i >= 0 ? ' enter" style="--i:' + Math.min(i, 8) : '';
  return '<article class="card' + anim + '" data-id="' + p.id + '">' +
    '<div class="card-img">' + imageHTML(p) +
    (p.stock <= 0 ? '<span class="soldout">SOLD OUT</span>' : (p.stock <= 3 ? '<span class="soldout low">ONLY ' + p.stock + ' LEFT</span>' : '')) +
    '<button class="wish-btn' + (active ? ' active' : '') + '" data-id="' + p.id + '" aria-label="Toggle wishlist">' + HEART + '</button>' +
    '</div>' +
    '<div class="card-body">' +
    '<p class="card-cat">' + p.category + '</p>' +
    '<p class="card-name">' + p.name + '</p>' +
    '<div class="card-foot"><p class="card-price">$' + p.price + '</p>' +
    '<p class="card-rate">\u2605 ' + p.rating.toFixed(1) + '</p></div>' +
    '</div></article>';
}

function renderChips() {
  $("chips").innerHTML = CATEGORIES.map(function (c) {
    return '<button class="chip' + (c === state.category ? ' active' : '') + '" data-cat="' + c + '">' + c + '</button>';
  }).join("");
}

function renderProducts(animate) {
  const q = state.query.trim().toLowerCase();
  const list = PRODUCTS.filter(function (p) {
    const matchCat = state.category === "All" || p.category === state.category;
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
    return matchCat && matchQ;
  });
  if (state.sort === "low") list.sort(function (a, b) { return a.price - b.price; });
  else if (state.sort === "high") list.sort(function (a, b) { return b.price - a.price; });
  else if (state.sort === "rating") list.sort(function (a, b) { return b.rating - a.rating; });
  $("productGrid").innerHTML = list.map(function (p, i) { return cardHTML(p, animate ? i : -1); }).join("");
  $("homeEmpty").classList.toggle("hidden", list.length > 0);
}

function renderWishlist(animate) {
  const list = PRODUCTS.filter(function (p) { return state.wishlist.has(p.id); });
  $("wishGrid").innerHTML = list.map(function (p, i) { return cardHTML(p, animate ? i : -1); }).join("");
  $("wishEmpty").classList.toggle("hidden", list.length > 0);
  $("wishCount").textContent = list.length;
}

function renderCategoryList() {
  $("catList").innerHTML = CATEGORIES.map(function (c) {
    const count = c === "All" ? PRODUCTS.length : PRODUCTS.filter(function (p) { return p.category === c; }).length;
    return '<button class="cat-tile" data-cat="' + c + '">' +
      '<span class="cat-icon"><svg viewBox="0 0 24 24">' + ICONS[c] + '</svg></span>' +
      '<span><strong>' + c + '</strong><small>' + count + ' products</small></span></button>';
  }).join("");
}

/* ---------- Views and nav ---------- */
function moveBubble(instant) {
  const bubble = $("navBubble");
  const active = document.querySelector(".nav-item.active");
  if (!bubble || !active) return;
  if (instant) bubble.style.transition = "none";
  bubble.style.width = active.offsetWidth + "px";
  bubble.style.transform = "translateX(" + active.offsetLeft + "px)";
  if (instant) {
    void bubble.offsetWidth;
    bubble.style.transition = "";
  }
}

function showView(name) {
  state.view = name;
  document.querySelectorAll(".view").forEach(function (v) {
    v.classList.toggle("active", v.id === "view-" + name);
  });
  document.querySelectorAll(".nav-item").forEach(function (b) {
    b.classList.toggle("active", b.dataset.view === name);
  });
  if (name === "wishlist") renderWishlist(true);
  if (name === "profile") { renderOrders(); syncOrders(); }
  moveBubble(false);
  window.scrollTo({ top: 0 });
}

function setCategory(cat) {
  state.category = cat;
  renderChips();
  renderProducts(true);
}

function setHeart(el, on) {
  const was = el.classList.contains("active");
  el.classList.toggle("active", on);
  if (on && !was) {
    el.classList.remove("pop");
    void el.offsetWidth;
    el.classList.add("pop");
  }
}

function toggleWish(id) {
  const on = !state.wishlist.has(id);
  if (on) state.wishlist.add(id);
  else state.wishlist.delete(id);
  save("nova_wishlist", Array.from(state.wishlist));

  // update the hearts in place so the cards do not replay their entrance animation
  document.querySelectorAll('.wish-btn[data-id="' + id + '"], .wish-d[data-id="' + id + '"]').forEach(function (el) {
    setHeart(el, on);
  });
  $("wishCount").textContent = state.wishlist.size;
  if (state.view === "wishlist") renderWishlist(false);
}

/* ---------- Sheets and toast ---------- */
let toastTimer;
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { t.classList.remove("show"); }, 1800);
}

function openSheet(id) {
  const s = $(id);
  s.classList.add("open");
  s.scrollTop = 0;
  document.body.classList.add("lock");
}

function closeSheets() {
  document.querySelectorAll(".sheet").forEach(function (s) { s.classList.remove("open"); });
  document.body.classList.remove("lock");
  state.detailId = null;
}

function closeOne(id) {
  $(id).classList.remove("open");
  if (!document.querySelector(".sheet.open")) document.body.classList.remove("lock");
}

/* ---------- Product detail ---------- */
function openDetail(id) {
  const p = findProduct(id);
  if (!p) return;
  state.detailId = id;
  state.detailSize = null;
  const sizes = SIZES[p.category];
  const active = state.wishlist.has(id);
  const soldOut = p.stock <= 0;
  const stockTxt = soldOut ? '<span class="stock out">Out of stock</span>'
    : p.stock <= 3 ? '<span class="stock low">Only ' + p.stock + ' left</span>'
    : '<span class="stock ok">In stock</span>';
  const rel = PRODUCTS.filter(function (x) { return x.category === p.category && x.id !== p.id; });
  $("detailSheet").innerHTML =
    '<div class="sheet-bar">' +
      '<button class="icon-btn" data-close aria-label="Back">' + BACK + '</button>' +
      '<span class="sheet-title">DETAILS</span>' +
      '<button class="icon-btn wish-d' + (active ? ' active' : '') + '" data-id="' + id + '" aria-label="Toggle wishlist">' + HEART + '</button>' +
    '</div>' +
    '<div class="detail-img">' + imageHTML(p) + '</div>' +
    '<p class="label">' + p.category.toUpperCase() + '</p>' +
    '<h2 class="detail-name">' + p.name + '</h2>' +
    '<p class="detail-price">$' + p.price + '</p>' +
    '<p class="rate">\u2605 ' + p.rating.toFixed(1) + ' <span>(' + p.reviews + ' reviews)</span> ' + stockTxt + '</p>' +
    '<p class="detail-desc">' + p.desc + '</p>' +
    (sizes.length
      ? '<p class="label">SIZE</p><div class="sizes">' +
        sizes.map(function (s) { return '<button class="size" data-size="' + s + '">' + s + '</button>'; }).join("") +
        '</div>'
      : '') +
    '<div class="perks"><span>Free shipping over $' + FREE_SHIP + '</span><span>7-day returns</span></div>' +
    (rel.length
      ? '<p class="label">YOU MAY ALSO LIKE</p><div class="related">' + rel.map(function (x) { return cardHTML(x, -1); }).join("") + '</div>'
      : '') +
    '<div class="detail-bar"><button class="btn-gold" id="addBtn"' + (soldOut ? ' disabled' : '') + '>' + (soldOut ? 'SOLD OUT' : 'ADD TO CART') + '</button></div>';
  openSheet("detailSheet");
}

function addToCart() {
  const p = findProduct(state.detailId);
  if (!p) return;
  if (SIZES[p.category].length && !state.detailSize) {
    toast("Please select a size");
    return;
  }
  if (p.stock <= 0) { toast("Sorry, this item is sold out"); return; }
  const size = state.detailSize || "";
  const inCart = state.cart.reduce(function (n, i) { return i.id === p.id ? n + i.qty : n; }, 0);
  if (inCart >= p.stock) { toast("Only " + p.stock + " in stock"); return; }
  const found = state.cart.find(function (i) { return i.id === p.id && i.size === size; });
  if (found) found.qty += 1;
  else state.cart.push({ id: p.id, size: size, qty: 1 });
  save("nova_cart", state.cart);
  updateBadge();
  toast("Added to cart");

  const btn = $("addBtn");
  if (btn) {
    btn.textContent = "ADDED";
    btn.classList.add("done");
    setTimeout(function () {
      btn.textContent = "ADD TO CART";
      btn.classList.remove("done");
    }, 1200);
  }
}

/* ---------- Cart ---------- */
function cartCount() {
  return state.cart.reduce(function (n, i) { return n + i.qty; }, 0);
}

function cartSubtotal() {
  return state.cart.reduce(function (sum, i) { return sum + findProduct(i.id).price * i.qty; }, 0);
}

function totals() {
  const sub = cartSubtotal();
  const c = state.coupon && COUPONS[state.coupon];
  let disc = 0;
  if (c) disc = c.type === "pct" ? Math.round(sub * c.value / 100) : Math.min(c.value, sub);
  const after = sub - disc;
  const ship = after === 0 || after >= FREE_SHIP ? 0 : SHIPPING_FEE;
  return { sub: sub, disc: disc, ship: ship, total: after + ship };
}

function summaryHTML() {
  const t = totals();
  return '<div class="summary">' +
    '<div class="sum-row"><span>Subtotal</span><span>$' + t.sub + '</span></div>' +
    (t.disc ? '<div class="sum-row disc"><span>Discount (' + state.coupon + ')</span><span>\u2212$' + t.disc + '</span></div>' : '') +
    '<div class="sum-row"><span>Shipping</span><span>' + (t.ship ? '$' + t.ship : 'Free') + '</span></div>' +
    '<div class="sum-row total"><span>Total</span><span>$' + t.total + '</span></div>' +
  '</div>';
}

let lastCount = cartCount();
function updateBadge() {
  const n = cartCount();
  const badge = $("cartBadge");
  badge.textContent = n;
  badge.classList.toggle("hidden", n === 0);
  if (n > lastCount) {
    badge.classList.remove("bump");
    void badge.offsetWidth;
    badge.classList.add("bump");
  }
  lastCount = n;
}

function renderCart() {
  const bar = '<div class="sheet-bar">' +
    '<button class="icon-btn" data-close aria-label="Back">' + BACK + '</button>' +
    '<span class="sheet-title">YOUR CART</span><span style="width:42px"></span></div>';

  if (!state.cart.length) {
    $("cartSheet").innerHTML = bar + '<p class="empty">Your cart is empty.<br>Add something you love.</p>';
    return;
  }

  const rows = state.cart.map(function (i) {
    const p = findProduct(i.id);
    const key = i.id + "|" + i.size;
    return '<div class="cart-row">' +
      '<div class="cart-thumb">' + imageHTML(p) + '</div>' +
      '<div class="cart-info">' +
        '<p class="card-name">' + p.name + '</p>' +
        '<p class="card-cat">' + (i.size ? 'Size ' + i.size : p.category) + '</p>' +
        '<div class="qty"><button data-act="dec" data-key="' + key + '">\u2212</button><span>' + i.qty + '</span><button data-act="inc" data-key="' + key + '">+</button></div>' +
      '</div>' +
      '<div class="cart-side">' +
        '<button class="rm" data-act="rm" data-key="' + key + '" aria-label="Remove">' + CLOSE + '</button>' +
        '<p class="card-price">$' + (p.price * i.qty) + '</p>' +
      '</div></div>';
  }).join("");

  const t = totals();
  const left = FREE_SHIP - (t.sub - t.disc);
  const ship = left > 0
    ? '<p class="ship-note">Add <b>$' + left + '</b> more for free shipping</p>'
    : '<p class="ship-note ok">You get free shipping</p>';
  const coupon = state.coupon
    ? '<div class="coupon applied"><span class="tag">' + state.coupon + ' \u00b7 ' + COUPONS[state.coupon].label + '</span><button data-act="nocoupon" data-key="">Remove</button></div>'
    : '<div class="coupon"><input id="couponInput" placeholder="Promo code" autocomplete="off" autocapitalize="characters"><button id="couponBtn">APPLY</button></div>';

  $("cartSheet").innerHTML = bar +
    '<div class="cart-list">' + rows + '</div>' +
    ship + coupon + summaryHTML() +
    '<div class="detail-bar"><button class="btn-gold" id="checkoutBtn">CHECKOUT \u00b7 $' + t.total + '</button></div>';
}

function applyCoupon() {
  const code = $("couponInput").value.trim().toUpperCase();
  if (!code) { toast("Enter a promo code"); return; }
  if (!COUPONS[code]) { toast("Invalid promo code"); return; }
  state.coupon = code;
  const top = $("cartSheet").scrollTop;
  renderCart();
  $("cartSheet").scrollTop = top;
  toast("Promo applied: " + COUPONS[code].label);
}

function openCart() {
  renderCart();
  openSheet("cartSheet");
}

function changeCart(act, key, btn) {
  if (act === "nocoupon") {
    state.coupon = null;
    const top = $("cartSheet").scrollTop;
    renderCart();
    $("cartSheet").scrollTop = top;
    return;
  }
  const idx = state.cart.findIndex(function (i) { return i.id + "|" + i.size === key; });
  if (idx < 0) return;

  if (act === "inc") {
    const p = findProduct(state.cart[idx].id);
    const inCart = state.cart.reduce(function (n, i) { return i.id === p.id ? n + i.qty : n; }, 0);
    if (inCart >= p.stock) { toast("Only " + p.stock + " in stock"); return; }
  }

  const willRemove = act === "rm" || (act === "dec" && state.cart[idx].qty <= 1);

  function apply() {
    if (act === "inc") state.cart[idx].qty += 1;
    if (act === "dec") state.cart[idx].qty -= 1;
    if (willRemove) state.cart.splice(idx, 1);
    save("nova_cart", state.cart);
    updateBadge();
    const top = $("cartSheet").scrollTop;
    renderCart();
    $("cartSheet").scrollTop = top;
  }

  const row = btn.closest(".cart-row");
  if (willRemove && row) {
    row.classList.add("out");
    setTimeout(apply, 200);
  } else {
    apply();
  }
}

/* ---------- Checkout and orders ---------- */
function formField(id, label, value, type, ac) {
  return '<div class="field"><input id="' + id + '" type="' + type + '" placeholder=" " autocomplete="' + ac + '" value="' + esc(value || "") + '">' +
    '<label for="' + id + '">' + label + '</label></div>';
}

function openCheckout() {
  if (!state.cart.length) return;
  // stop if something in the cart is no longer available
  for (let k = 0; k < state.cart.length; k++) {
    const it = state.cart[k], p = findProduct(it.id);
    const total = state.cart.reduce(function (n, i) { return i.id === p.id ? n + i.qty : n; }, 0);
    if (total > p.stock) { toast(p.name + ": only " + p.stock + " left"); return; }
  }
  const a = loadObj("nova_addr") || {};
  const defName = a.name || (state.user && !state.user.guest ? state.user.name : "");
  const t = totals();
  $("checkoutSheet").innerHTML =
    sheetBar("CHECKOUT", "checkoutSheet") +
    '<p class="label" style="margin-top:6px">DELIVERY DETAILS</p><div class="form">' +
      formField("coName", "Full name", defName, "text", "name") +
      formField("coPhone", "Phone number", a.phone, "tel", "tel") +
      formField("coAddr", "Address", a.addr, "text", "street-address") +
      formField("coCity", "City / Township", a.city, "text", "address-level2") +
      formField("coNote", "Note (optional)", "", "text", "off") +
    '</div>' +
    '<p class="label">PAYMENT METHOD</p><div class="pays" id="pays">' +
      PAYMENTS.map(function (m) {
        return '<button class="pay' + (m[0] === state.pay ? ' active' : '') + '" data-pay="' + m[0] + '"><span class="dot"></span>' + m[1] + '</button>';
      }).join("") +
    '</div>' +
    '<p class="ship-note">Demo shop. No real payment is taken.</p>' +
    '<p class="label">ORDER SUMMARY</p>' + summaryHTML() +
    '<p class="auth-error" id="coError"></p>' +
    '<div class="detail-bar"><button class="btn-gold" id="placeBtn">PLACE ORDER \u00b7 $' + t.total + '</button></div>';
  openSheet("checkoutSheet");
}

function coError(msg) {
  const el = $("coError");
  el.textContent = msg;
  el.classList.toggle("show", !!msg);
  if (msg) el.scrollIntoView({ block: "center", behavior: "smooth" });
}

function placeOrder() {
  const name = $("coName").value.trim();
  const phone = $("coPhone").value.trim();
  const addr = $("coAddr").value.trim();
  const city = $("coCity").value.trim();
  const note = $("coNote").value.trim();

  if (!name) return coError("Please enter your name.");
  if (!/^[+0-9][0-9\s\-]{6,}$/.test(phone)) return coError("Please enter a valid phone number.");
  if (addr.length < 5) return coError("Please enter your delivery address.");
  if (!city) return coError("Please enter your city or township.");
  coError("");

  const t = totals();
  const items = state.cart.map(function (i) {
    const p = findProduct(i.id);
    return { id: p.id, name: p.name, size: i.size, qty: i.qty, price: p.price };
  });
  const order = {
    id: "SX" + Date.now().toString().slice(-7),
    date: new Date().toISOString(),
    items: items,
    sub: t.sub, disc: t.disc, ship: t.ship, total: t.total,
    coupon: state.coupon,
    pay: state.pay,
    ship_to: { name: name, phone: phone, addr: addr, city: city, note: note },
    status: "Processing"
  };

  if (SB) {
    // the server checks stock, recalculates prices and saves the order
    const btn = $("placeBtn");
    const label = btn.textContent;
    btn.disabled = true;
    btn.textContent = "PLACING ORDER...";
    const fail = function (msg) {
      btn.disabled = false;
      btn.textContent = label;
      coError(msg);
    };
    Promise.resolve(SB.rpc("place_order", { p_order: order })).then(function (res) {
      if (res.error) {
        fail(/stock|available/i.test(res.error.message)
          ? "Sorry, an item just went out of stock. Please review your cart."
          : "Could not place the order. Please try again.");
        loadRemote();
        return;
      }
      const r = res.data || {};
      order.sub = r.sub; order.disc = r.disc; order.ship = r.ship; order.total = r.total;
      finishOrder(order, name, phone, addr, city);
      loadRemote();
    }).catch(function () { fail("No connection. Please try again."); });
    return;
  }

  // demo mode: take items out of stock on this phone
  state.cart.forEach(function (i) { findProduct(i.id).stock -= i.qty; });
  saveStock();
  finishOrder(order, name, phone, addr, city);
}

function finishOrder(order, name, phone, addr, city) {
  state.orders.unshift(order);
  save("nova_orders", state.orders);
  try { localStorage.setItem("nova_addr", JSON.stringify({ name: name, phone: phone, addr: addr, city: city })); } catch (e) {}

  state.cart = [];
  state.coupon = null;
  save("nova_cart", state.cart);
  updateBadge();
  renderProducts(false);
  renderWishlist(false);
  renderOrders();
  closeSheets();
  showOrder(order.id, true);
}

function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) + ", " +
    d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function showOrder(id, isNew) {
  const o = state.orders.find(function (x) { return x.id === id; });
  if (!o) return;
  const lines = o.items.map(function (i) {
    return '<div class="sum-row"><span>' + esc(i.name) + (i.size ? ' (' + esc(i.size) + ')' : '') + ' \u00d7 ' + i.qty + '</span><span>$' + (i.price * i.qty) + '</span></div>';
  }).join("");
  const s = o.ship_to;
  $("orderSheet").innerHTML =
    sheetBar(isNew ? "ORDER PLACED" : "ORDER " + o.id) +
    (isNew ? '<div class="success"><div class="success-ic"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>' +
      '<h2>Thank you, ' + esc(s.name.split(" ")[0]) + '!</h2><p>Your order <b>' + o.id + '</b> has been received.</p></div>' : '') +
    '<div class="order-meta"><span class="status ' + o.status.toLowerCase() + '">' + o.status + '</span><span>' + fmtDate(o.date) + '</span></div>' +
    '<p class="label">ITEMS</p><div class="summary">' + lines + '</div>' +
    '<p class="label">PAYMENT</p><div class="summary">' +
      '<div class="sum-row"><span>Subtotal</span><span>$' + o.sub + '</span></div>' +
      (o.disc ? '<div class="sum-row disc"><span>Discount (' + esc(o.coupon) + ')</span><span>\u2212$' + o.disc + '</span></div>' : '') +
      '<div class="sum-row"><span>Shipping</span><span>' + (o.ship ? '$' + o.ship : 'Free') + '</span></div>' +
      '<div class="sum-row total"><span>Total</span><span>$' + o.total + '</span></div>' +
      '<div class="sum-row"><span>Method</span><span>' + PAY_NAME[o.pay] + '</span></div>' +
    '</div>' +
    '<p class="label">DELIVER TO</p><div class="summary addr">' +
      '<p><b>' + esc(s.name) + '</b></p><p>' + esc(s.phone) + '</p><p>' + esc(s.addr) + ', ' + esc(s.city) + '</p>' +
      (s.note ? '<p class="muted">Note: ' + esc(s.note) + '</p>' : '') +
    '</div>' +
    (o.status === "Processing" && !SB ? '<button class="btn-outline" data-cancel="' + o.id + '">CANCEL ORDER</button>' : '') +
    '<button class="btn-gold keep" data-close>CONTINUE SHOPPING</button>';
  openSheet("orderSheet");
}

function cancelOrder(id) {
  const o = state.orders.find(function (x) { return x.id === id; });
  if (!o || o.status !== "Processing") return;
  if (!confirm("Cancel order " + id + "?")) return;
  o.status = "Cancelled";
  o.items.forEach(function (i) {
    const p = findProduct(i.id);
    if (p) p.stock += i.qty;
  });
  saveStock();
  save("nova_orders", state.orders);
  renderProducts(false);
  renderOrders();
  showOrder(id, false);
  toast("Order cancelled");
}

function renderOrders() {
  $("orderCount").textContent = state.orders.length;
  $("orderEmpty").classList.toggle("hidden", state.orders.length > 0);
  $("orderList").innerHTML = state.orders.map(function (o) {
    const n = o.items.reduce(function (s, i) { return s + i.qty; }, 0);
    return '<button class="order-row" data-order="' + o.id + '">' +
      '<span><strong>' + o.id + '</strong><small>' + fmtDate(o.date) + ' \u00b7 ' + n + (n === 1 ? ' item' : ' items') + '</small></span>' +
      '<span class="order-right"><b>$' + o.total + '</b><em class="status ' + o.status.toLowerCase() + '">' + o.status + '</em></span></button>';
  }).join("");
}

/* ---------- Login ---------- */
const auth = { mode: "signin", busy: false };

// Simple local hash. This is a demo login that lives only on this phone.
function hashPass(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return String(h);
}

function setMode(mode) {
  auth.mode = mode;
  $("auth").classList.toggle("signup", mode === "signup");
  $("authTabs").classList.toggle("signup", mode === "signup");
  document.querySelectorAll(".auth-tab").forEach(function (b) {
    b.classList.toggle("active", b.dataset.mode === mode);
  });
  $("authSubmit").querySelector(".btn-text").textContent = mode === "signup" ? "CREATE ACCOUNT" : "SIGN IN";
  $("authPass").setAttribute("autocomplete", mode === "signup" ? "new-password" : "current-password");
  showError("");
}

function showError(msg) {
  const el = $("authError");
  el.textContent = msg;
  el.classList.toggle("show", !!msg);
  if (msg) {
    const card = $("authCard");
    card.classList.remove("shake");
    void card.offsetWidth;
    card.classList.add("shake");
  }
}

function applyUser() {
  const u = state.user;
  if (!u) return;
  $("profileName").textContent = u.name;
  $("profileSub").textContent = u.guest ? "Welcome to SITAX SHOP" : u.email;
  $("logoutBtn").textContent = u.guest ? "SIGN IN" : "SIGN OUT";
}

function hideAuth() {
  const el = $("auth");
  el.classList.add("leaving");
  setTimeout(function () {
    el.classList.add("hidden");
    el.classList.remove("leaving");
    document.body.classList.remove("lock");
    const btn = $("authSubmit");
    btn.classList.remove("loading");
    $("authPass").value = "";
    auth.busy = false;
  }, 600);
}

function showAuth() {
  ["authName", "authEmail", "authPass"].forEach(function (id) { $(id).value = ""; });
  $("authPass").type = "password";
  $("eyeBtn").classList.remove("shown");
  $("authSubmit").classList.remove("loading");
  $("auth").classList.remove("hidden", "leaving");
  setMode("signin");
  auth.busy = false;
  document.body.classList.add("lock");
}

function finishLogin(user) {
  state.user = user;
  try { localStorage.setItem("nova_session", JSON.stringify(user)); } catch (e) {}
  applyUser();
  hideAuth();
  setTimeout(function () {
    toast(user.guest ? "Welcome to SITAX" : "Welcome, " + user.name.split(" ")[0]);
  }, 350);
}

function submitAuth() {
  if (auth.busy) return;
  const name = $("authName").value.trim();
  const email = $("authEmail").value.trim().toLowerCase();
  const pass = $("authPass").value;

  if (auth.mode === "signup" && !name) { showError("Please enter your name."); return; }
  if (!/^\S+@\S+\.\S+$/.test(email)) { showError("Please enter a valid email address."); return; }
  if (pass.length < 6) { showError("Password must be at least 6 characters."); return; }

  const hash = hashPass(email + ":" + pass);
  let user;

  if (auth.mode === "signup") {
    try { localStorage.setItem("nova_account", JSON.stringify({ name: name, email: email, hash: hash })); } catch (e) {}
    user = { name: name, email: email };
  } else {
    const acct = loadObj("nova_account");
    if (!acct || acct.email !== email) { showError("No account found. Please create one first."); return; }
    if (acct.hash !== hash) { showError("Incorrect password."); return; }
    user = { name: acct.name, email: email };
  }

  showError("");
  auth.busy = true;
  $("authSubmit").classList.add("loading");
  setTimeout(function () { finishLogin(user); }, 900);
}

function logout() {
  try { localStorage.removeItem("nova_session"); } catch (e) {}
  state.user = null;
  closeSheets();
  showView("home");
  showAuth();
}

/* ---------- Loading screen ---------- */
// Replays the home screen and nav animations once the loading screen leaves
function playIntro() {
  if (!state.user) return;
  const home = $("view-home");
  home.classList.remove("active");
  void home.offsetWidth;
  home.classList.add("active");
  renderProducts(true);

  const nav = document.querySelector(".nav-item.active");
  if (nav) {
    nav.classList.remove("active");
    void nav.offsetWidth;
    nav.classList.add("active");
  }
}

function startSplash() {
  const el = $("splash");
  // speed comes from --k in style.css (1 = normal, 0.7 = faster, 1.3 = slower)
  const k = parseFloat(getComputedStyle(el).getPropertyValue("--k")) || 1;
  const MIN = 5600 * k; // when the gold starts draining away, in milliseconds
  let loaded = document.readyState === "complete";

  window.addEventListener("load", function () { loaded = true; });
  setTimeout(function () { loaded = true; }, MIN + 1500); // safety net

  function drain() {
    el.classList.add("drain");
    setTimeout(function () {
      document.body.classList.add("ready");
      playIntro();
    }, 200 * k);
    setTimeout(function () { el.classList.add("hidden"); }, 1150 * k);
  }

  function check() {
    if (loaded) drain();
    else setTimeout(check, 100);
  }
  setTimeout(check, MIN);
}

/* ---------- Events ---------- */
document.addEventListener("click", function (e) {
  const t = e.target;

  const tab = t.closest(".auth-tab");
  if (tab) { setMode(tab.dataset.mode); return; }

  if (t.closest("#eyeBtn")) {
    const input = $("authPass");
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    $("eyeBtn").classList.toggle("shown", show);
    return;
  }

  if (t.closest("#authSubmit")) { submitAuth(); return; }
  if (t.closest("#guestBtn")) { if (!auth.busy) finishLogin({ name: "Guest", guest: true }); return; }
  if (t.closest("#logoutBtn")) { logout(); return; }

  const wish = t.closest(".wish-btn");
  if (wish) { toggleWish(Number(wish.dataset.id)); return; }

  const wishD = t.closest(".wish-d");
  if (wishD) { toggleWish(Number(wishD.dataset.id)); return; }

  if (t.closest("[data-close]")) { closeSheets(); return; }

  const one = t.closest("[data-closeone]");
  if (one) { closeOne(one.dataset.closeone); return; }

  const pay = t.closest("[data-pay]");
  if (pay) {
    state.pay = pay.dataset.pay;
    document.querySelectorAll(".pay").forEach(function (b) { b.classList.toggle("active", b === pay); });
    return;
  }

  const cancel = t.closest("[data-cancel]");
  if (cancel) { cancelOrder(cancel.dataset.cancel); return; }

  const orderRow = t.closest("[data-order]");
  if (orderRow) { showOrder(orderRow.dataset.order, false); return; }

  if (t.closest("#couponBtn")) { applyCoupon(); return; }
  if (t.closest("#placeBtn")) { placeOrder(); return; }

  const act = t.closest("[data-act]");
  if (act) { changeCart(act.dataset.act, act.dataset.key, act); return; }

  const size = t.closest(".size");
  if (size) {
    state.detailSize = size.dataset.size;
    document.querySelectorAll(".size").forEach(function (b) {
      b.classList.toggle("active", b === size);
    });
    return;
  }

  if (t.closest("#addBtn")) { addToCart(); return; }
  if (t.closest("#checkoutBtn")) { openCheckout(); return; }
  if (t.closest("#cartBtn")) { openCart(); return; }

  const chip = t.closest(".chip");
  if (chip) { setCategory(chip.dataset.cat); return; }

  const tile = t.closest(".cat-tile");
  if (tile) { setCategory(tile.dataset.cat); showView("home"); return; }

  const nav = t.closest(".nav-item");
  if (nav) { showView(nav.dataset.view); return; }

  if (t.closest("#profileBtn")) { showView("profile"); return; }

  const card = t.closest(".card");
  if (card) openDetail(Number(card.dataset.id));
});

$("authCard").addEventListener("keydown", function (e) {
  if (e.key === "Enter") submitAuth();
});

$("searchInput").addEventListener("input", function (e) {
  state.query = e.target.value;
  renderProducts(false);
});

$("sortSelect").addEventListener("change", function (e) {
  state.sort = e.target.value;
  renderProducts(true);
});

window.addEventListener("resize", function () { moveBubble(true); });
window.addEventListener("load", function () { moveBubble(true); });

/* ---------- Database sync ---------- */
// Loads products and promo codes from the database (replaces the demo data)
async function loadRemote() {
  if (!SB) return;
  try {
    const res = await Promise.all([
      SB.from("products").select("*").eq("active", true).order("id"),
      SB.from("coupons").select("*").eq("active", true)
    ]);
    const pr = res[0], cp = res[1];
    if (pr.error) throw pr.error;
    PRODUCTS.length = 0;
    pr.data.forEach(function (r) {
      PRODUCTS.push({
        id: r.id, name: r.name, category: r.category, price: Number(r.price),
        desc: r.description || "", img: r.image_url || "",
        stock: r.stock, rating: Number(r.rating) || 4.5, reviews: r.reviews || 0
      });
    });
    if (!cp.error) {
      Object.keys(COUPONS).forEach(function (k) { delete COUPONS[k]; });
      cp.data.forEach(function (c) {
        COUPONS[c.code] = {
          type: c.type, value: Number(c.value),
          label: c.type === "pct" ? c.value + "% off" : "$" + c.value + " off"
        };
      });
      if (state.coupon && !COUPONS[state.coupon]) state.coupon = null;
    }
    // remove cart items whose product no longer exists
    state.cart = state.cart.filter(function (i) { return findProduct(i.id); });
    save("nova_cart", state.cart);
    $("prodCount").textContent = PRODUCTS.length;
    renderProducts(false);
    renderWishlist(false);
    renderCategoryList();
    updateBadge();
  } catch (e) {
    console.warn("Could not load shop data. Using local demo data.", e);
  }
}

// Refreshes the status (Shipped, Delivered...) of this phone's orders
async function syncOrders() {
  if (!SB || !state.orders.length) return;
  try {
    const ids = state.orders.map(function (o) { return o.id; });
    const res = await SB.rpc("order_status", { p_ids: ids });
    if (res.error || !res.data) return;
    let changed = false;
    res.data.forEach(function (r) {
      const o = state.orders.find(function (x) { return x.id === r.id; });
      if (o && o.status !== r.status) { o.status = r.status; changed = true; }
    });
    if (changed) { save("nova_orders", state.orders); renderOrders(); }
  } catch (e) {}
}

/* ---------- Start ---------- */
$("prodCount").textContent = PRODUCTS.length;
renderChips();
renderProducts(true);
renderCategoryList();
renderWishlist(false);
renderOrders();
updateBadge();
showView("home");
moveBubble(true);

const savedUser = loadObj("nova_session");
if (savedUser) {
  state.user = savedUser;
  applyUser();
  $("auth").classList.add("hidden");
} else {
  document.body.classList.add("lock");
  setMode("signin");
}

loadRemote();
startSplash();