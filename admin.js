(function () {
  "use strict";

  var CFG = window.SHOP_CONFIG || {};
  var $ = function (id) { return document.getElementById(id); };
  var STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"];
  var CATS = ["Fashion", "Shoes", "Accessories"];
  var PAY_NAME = { cod: "Cash on delivery", kbz: "KBZPay", wave: "Wave Pay", card: "Credit / Debit card" };

  var SB = null;
  var tab = "dashboard";
  var orderFilter = "All";
  var data = { products: [], orders: [], coupons: [] };
  var editing = { id: null, active: true };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function money(n) { return "$" + (Math.round(Number(n || 0) * 100) / 100); }
  function fmtDate(iso) {
    var d = new Date(iso);
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short" }) + ", " +
      d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  }

  var toastTimer;
  function toast(msg) {
    var t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  /* ---------- Login ---------- */
  function loginError(msg) {
    var el = $("adError");
    el.textContent = msg;
    el.classList.toggle("show", !!msg);
  }

  function showLogin() {
    $("adLogin").classList.remove("hidden");
    document.body.classList.add("lock");
    $("adPass").value = "";
  }

  function enterAdmin() {
    $("adLogin").classList.add("hidden");
    document.body.classList.remove("lock");
    $("adSubmit").classList.remove("loading");
    loadAll();
  }

  async function checkAdmin(user) {
    var res = await SB.from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (res.error || !res.data || res.data.role !== "admin") {
      await SB.auth.signOut();
      loginError("This account is not an admin.");
      showLogin();
      return false;
    }
    enterAdmin();
    return true;
  }

  async function signIn() {
    var email = $("adEmail").value.trim();
    var pass = $("adPass").value;
    if (!email || !pass) { loginError("Enter your email and password."); return; }
    loginError("");
    $("adSubmit").classList.add("loading");
    var res = await SB.auth.signInWithPassword({ email: email, password: pass });
    if (res.error) {
      $("adSubmit").classList.remove("loading");
      loginError("Wrong email or password.");
      return;
    }
    var ok = await checkAdmin(res.data.user);
    if (!ok) $("adSubmit").classList.remove("loading");
  }

  async function signOut() {
    await SB.auth.signOut();
    data = { products: [], orders: [], coupons: [] };
    $("adminMain").innerHTML = "";
    showLogin();
  }

  /* ---------- Load data ---------- */
  async function loadAll() {
    var r = await Promise.all([
      SB.from("products").select("*").order("id"),
      SB.from("orders").select("*").order("created_at", { ascending: false }).limit(500),
      SB.from("coupons").select("*").order("code")
    ]);
    if (r[0].error || r[1].error || r[2].error) {
      toast("Could not load data. Check the database setup.");
    }
    data.products = r[0].data || [];
    data.orders = r[1].data || [];
    data.coupons = r[2].data || [];
    render();
  }

  /* ---------- Views ---------- */
  function render() {
    document.querySelectorAll("#tabs .chip").forEach(function (c) {
      c.classList.toggle("active", c.dataset.tab === tab);
    });
    var html = "";
    if (tab === "dashboard") html = viewDashboard();
    else if (tab === "orders") html = viewOrders();
    else if (tab === "products") html = viewProducts();
    else html = viewCoupons();
    $("adminMain").innerHTML = html;
  }

  function viewDashboard() {
    var live = data.orders.filter(function (o) { return o.status !== "Cancelled"; });
    var today = new Date().toDateString();
    var todays = live.filter(function (o) { return new Date(o.created_at).toDateString() === today; });
    var sum = function (a) { return a.reduce(function (s, o) { return s + Number(o.total || 0); }, 0); };
    var pending = data.orders.filter(function (o) { return o.status === "Processing"; }).length;
    var low = data.products.filter(function (p) { return p.active && p.stock <= 3; });

    var sold = {};
    live.forEach(function (o) {
      (o.items || []).forEach(function (i) { sold[i.name] = (sold[i.name] || 0) + Number(i.qty); });
    });
    var top = Object.keys(sold).map(function (k) { return [k, sold[k]]; })
      .sort(function (a, b) { return b[1] - a[1]; }).slice(0, 5);

    return '<div class="ad-stats">' +
      stat(todays.length, "Orders today") +
      stat(money(sum(todays)), "Sales today") +
      stat(pending, "To process") +
      stat(money(sum(live)), "Total sales") +
      '</div>' +
      '<h3 class="ad-h">Low or out of stock</h3>' +
      (low.length ? '<div class="ad-list">' + low.map(function (p) {
        return '<button class="ad-row" data-editp="' + p.id + '"><span class="grow"><strong>' + esc(p.name) +
          '</strong><small>' + p.category + '</small></span><b>' + (p.stock <= 0 ? "Sold out" : p.stock + " left") + '</b></button>';
      }).join("") + '</div>' : '<p class="ad-empty" style="margin-top:0">All products are well stocked.</p>') +
      '<h3 class="ad-h">Best sellers</h3>' +
      (top.length ? '<div class="ad-list">' + top.map(function (t) {
        return '<div class="ad-row"><span class="grow"><strong>' + esc(t[0]) + '</strong></span><b>' + t[1] + ' sold</b></div>';
      }).join("") + '</div>' : '<p class="ad-empty" style="margin-top:0">No sales yet.</p>');
  }

  function stat(num, label) {
    return '<div class="stat"><span class="stat-num">' + num + '</span><span class="stat-label">' + label + '</span></div>';
  }

  function viewOrders() {
    var filters = ["All"].concat(STATUSES);
    var chips = '<div class="chips" style="padding-top:6px">' + filters.map(function (f) {
      var n = f === "All" ? data.orders.length : data.orders.filter(function (o) { return o.status === f; }).length;
      return '<button class="chip' + (f === orderFilter ? ' active' : '') + '" data-ofilter="' + f + '">' + f + ' (' + n + ')</button>';
    }).join("") + '</div>';
    var list = data.orders.filter(function (o) { return orderFilter === "All" || o.status === orderFilter; });
    if (!list.length) return chips + '<p class="ad-empty">No orders here.</p>';
    return chips + '<div class="ad-list" style="margin-top:12px">' + list.map(function (o) {
      var n = (o.items || []).reduce(function (s, i) { return s + Number(i.qty); }, 0);
      return '<button class="ad-row" data-oid="' + esc(o.id) + '"><span class="grow"><strong>' + esc(o.id) + ' · ' +
        esc(o.ship_to && o.ship_to.name) + '</strong><small>' + fmtDate(o.created_at) + ' · ' + n + (n === 1 ? ' item' : ' items') +
        '</small></span><span style="text-align:right"><b>' + money(o.total) + '</b><br><em class="status ' +
        o.status.toLowerCase() + '">' + o.status + '</em></span></button>';
    }).join("") + '</div>';
  }

  function viewProducts() {
    return '<div class="ad-top"><button class="btn-gold" data-newp>+ ADD PRODUCT</button></div>' +
      '<div class="ad-list" style="margin-top:14px">' + data.products.map(function (p) {
        var img = p.image_url ? '<img class="ad-thumb" src="' + esc(p.image_url) + '" alt="">' : '<span class="ad-thumb"></span>';
        return '<button class="ad-row' + (p.active ? '' : ' off') + '" data-editp="' + p.id + '">' + img +
          '<span class="grow"><strong>' + esc(p.name) + '</strong><small>' + p.category + ' · ' +
          (p.stock <= 0 ? 'Sold out' : p.stock + ' in stock') + (p.active ? '' : ' · Hidden') +
          '</small></span><b>' + money(p.price) + '</b></button>';
      }).join("") + '</div>' +
      (data.products.length ? '' : '<p class="ad-empty">No products yet.</p>');
  }

  function viewCoupons() {
    return '<h3 class="ad-h" style="margin-top:8px">New promo code</h3>' +
      '<div class="field"><input id="cCode" placeholder=" " autocapitalize="characters" autocomplete="off"><label for="cCode">Code (e.g. SUMMER15)</label></div>' +
      '<div class="row2">' +
        '<div class="sel-wrap"><span>Type</span><select class="sel" id="cType"><option value="pct">Percent off</option><option value="flat">Amount off ($)</option></select></div>' +
        '<div class="field"><input id="cValue" type="number" inputmode="decimal" min="1" placeholder=" "><label for="cValue">Value</label></div>' +
      '</div>' +
      '<button class="btn-gold" data-addc style="height:46px;font-size:13px">ADD CODE</button>' +
      '<h3 class="ad-h">All codes</h3>' +
      (data.coupons.length ? '<div class="ad-list">' + data.coupons.map(function (c) {
        return '<div class="ad-row' + (c.active ? '' : ' off') + '"><span class="grow"><strong>' + esc(c.code) + '</strong><small>' +
          (c.type === "pct" ? c.value + "% off" : "$" + c.value + " off") + (c.active ? '' : ' · Off') +
          '</small></span><button class="ad-btn mute" data-ctoggle="' + esc(c.code) + '">' + (c.active ? 'Turn off' : 'Turn on') +
          '</button><button class="ad-btn danger" data-cdel="' + esc(c.code) + '">Delete</button></div>';
      }).join("") + '</div>' : '<p class="ad-empty">No promo codes.</p>');
  }

  /* ---------- Sheets ---------- */
  function openSheet(html) {
    var s = $("adSheet");
    s.innerHTML = html;
    s.classList.add("open");
    s.scrollTop = 0;
    document.body.classList.add("lock");
  }
  function closeSheet() {
    $("adSheet").classList.remove("open");
    document.body.classList.remove("lock");
  }
  function bar(title) {
    return '<div class="sheet-bar"><button class="icon-btn" data-closesheet aria-label="Back"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>' +
      '<span class="sheet-title">' + title + '</span><span style="width:44px"></span></div>';
  }

  /* ----- order detail ----- */
  function openOrder(id) {
    var o = data.orders.find(function (x) { return x.id === id; });
    if (!o) return;
    var s = o.ship_to || {};
    var lines = (o.items || []).map(function (i) {
      return '<div class="sum-row"><span>' + esc(i.name) + (i.size ? ' (' + esc(i.size) + ')' : '') + ' × ' + i.qty +
        '</span><span>' + money(i.price * i.qty) + '</span></div>';
    }).join("");
    var cancelled = o.status === "Cancelled";
    var btns = STATUSES.map(function (st) {
      var lock = cancelled && st !== "Cancelled";
      return '<button class="size' + (st === o.status ? ' active' : '') + '" data-setstatus="' + st + '" data-oid="' + esc(o.id) + '"' +
        (lock ? ' disabled style="opacity:.4"' : '') + '>' + st + '</button>';
    }).join("");
    var phone = esc(s.phone);
    openSheet(bar("ORDER " + esc(o.id)) +
      '<div class="order-meta"><span class="status ' + o.status.toLowerCase() + '">' + o.status + '</span><span>' + fmtDate(o.created_at) + '</span></div>' +
      '<p class="label">CHANGE STATUS</p><div class="statuses">' + btns + '</div>' +
      '<p class="hint">' + (cancelled ? 'Cancelled orders cannot be reopened.' : 'Cancelling an order puts the items back in stock.') + '</p>' +
      '<p class="label">ITEMS</p><div class="summary">' + lines + '</div>' +
      '<p class="label">PAYMENT</p><div class="summary">' +
        '<div class="sum-row"><span>Subtotal</span><span>' + money(o.subtotal) + '</span></div>' +
        (Number(o.discount) ? '<div class="sum-row disc"><span>Discount (' + esc(o.coupon) + ')</span><span>−' + money(o.discount) + '</span></div>' : '') +
        '<div class="sum-row"><span>Shipping</span><span>' + (Number(o.shipping) ? money(o.shipping) : 'Free') + '</span></div>' +
        '<div class="sum-row total"><span>Total</span><span>' + money(o.total) + '</span></div>' +
        '<div class="sum-row"><span>Method</span><span>' + (PAY_NAME[o.payment] || esc(o.payment)) + '</span></div>' +
      '</div>' +
      '<p class="label">CUSTOMER</p><div class="summary addr">' +
        '<p><b>' + esc(s.name) + '</b></p><p><a href="tel:' + phone + '">' + phone + '</a></p>' +
        '<p>' + esc(s.addr) + ', ' + esc(s.city) + '</p>' +
        (s.note ? '<p class="muted">Note: ' + esc(s.note) + '</p>' : '') + '</div>');
  }

  async function setStatus(id, status) {
    var o = data.orders.find(function (x) { return x.id === id; });
    if (!o || o.status === status) return;
    if (status === "Cancelled" && !confirm("Cancel order " + id + "? The items go back in stock.")) return;
    var res = await SB.from("orders").update({ status: status }).eq("id", id);
    if (res.error) { toast("Could not update the order."); return; }
    toast("Status: " + status);
    await loadAll();
    openOrder(id);
  }

  /* ----- product form ----- */
  function field(id, label, value, type, extra) {
    return '<div class="field"><input id="' + id + '" type="' + (type || "text") + '" placeholder=" " value="' + esc(value) + '" ' + (extra || "") + '>' +
      '<label for="' + id + '">' + label + '</label></div>';
  }

  function openProduct(id) {
    var p = id ? data.products.find(function (x) { return x.id === id; }) : null;
    editing = { id: id || null, active: p ? !!p.active : true };
    p = p || { name: "", category: "Fashion", price: "", stock: 10, image_url: "", description: "", rating: 4.5 };
    openSheet(bar(id ? "EDIT PRODUCT" : "NEW PRODUCT") +
      '<div style="margin-top:8px">' +
      field("pName", "Product name", p.name) +
      '<div class="sel-wrap"><span>Category</span><select class="sel" id="pCat">' + CATS.map(function (c) {
        return '<option' + (c === p.category ? ' selected' : '') + '>' + c + '</option>';
      }).join("") + '</select></div>' +
      '<div class="row2">' + field("pPrice", "Price ($)", p.price, "number", 'inputmode="decimal" min="0" step="0.01"') +
      field("pStock", "Stock", p.stock, "number", 'inputmode="numeric" min="0" step="1"') + '</div>' +
      field("pImg", "Image URL", p.image_url, "url") +
      field("pDesc", "Description", p.description) +
      field("pRating", "Rating (0 to 5)", p.rating, "number", 'inputmode="decimal" min="0" max="5" step="0.1"') +
      '<button class="toggle' + (editing.active ? ' on' : '') + '" id="pActive" type="button">Show in shop<i></i></button>' +
      '<p class="hint">Hidden products stay saved but customers cannot see them.</p>' +
      '</div>' +
      '<div class="ad-sheet-actions">' +
        '<button class="btn-gold" data-savep>SAVE</button>' +
        (id ? '<button class="btn-outline" style="margin-top:0;color:#d98b7a;border-color:rgba(217,139,122,.5)" data-delp="' + id + '">DELETE PRODUCT</button>' : '') +
      '</div>');
  }

  async function saveProduct() {
    var name = $("pName").value.trim();
    var price = Number($("pPrice").value);
    var stock = parseInt($("pStock").value, 10);
    var rating = Number($("pRating").value);
    if (!name) { toast("Enter a product name"); return; }
    if (!(price >= 0) || $("pPrice").value === "") { toast("Enter a valid price"); return; }
    if (!(stock >= 0)) { toast("Enter a valid stock number"); return; }
    if (!(rating >= 0 && rating <= 5)) { toast("Rating must be 0 to 5"); return; }
    var row = {
      name: name, category: $("pCat").value, price: price, stock: stock,
      image_url: $("pImg").value.trim(), description: $("pDesc").value.trim(),
      rating: rating, active: editing.active
    };
    var res = editing.id
      ? await SB.from("products").update(row).eq("id", editing.id)
      : await SB.from("products").insert(row);
    if (res.error) { toast("Could not save: " + res.error.message); return; }
    toast("Saved");
    closeSheet();
    loadAll();
  }

  async function deleteProduct(id) {
    if (!confirm("Delete this product for good? You can hide it instead.")) return;
    var res = await SB.from("products").delete().eq("id", id);
    if (res.error) { toast("Could not delete."); return; }
    toast("Deleted");
    closeSheet();
    loadAll();
  }

  /* ----- coupons ----- */
  async function addCoupon() {
    var code = $("cCode").value.trim().toUpperCase().replace(/\s+/g, "");
    var type = $("cType").value;
    var value = Number($("cValue").value);
    if (!/^[A-Z0-9]{3,20}$/.test(code)) { toast("Code: 3 to 20 letters or numbers"); return; }
    if (!(value > 0) || (type === "pct" && value > 100)) { toast("Enter a valid value"); return; }
    var res = await SB.from("coupons").insert({ code: code, type: type, value: value });
    if (res.error) { toast(res.error.code === "23505" ? "That code already exists" : "Could not add the code"); return; }
    toast("Code added");
    loadAll();
  }

  async function toggleCoupon(code) {
    var c = data.coupons.find(function (x) { return x.code === code; });
    if (!c) return;
    var res = await SB.from("coupons").update({ active: !c.active }).eq("code", code);
    if (res.error) { toast("Could not update."); return; }
    loadAll();
  }

  async function deleteCoupon(code) {
    if (!confirm("Delete code " + code + "?")) return;
    var res = await SB.from("coupons").delete().eq("code", code);
    if (res.error) { toast("Could not delete."); return; }
    loadAll();
  }

  /* ---------- Events ---------- */
  document.addEventListener("click", function (e) {
    var t = e.target;
    var el;

    if (t.closest("#adSubmit")) { if (SB) signIn(); return; }
    if (t.closest("#logoutBtn")) { signOut(); return; }
    if (t.closest("#refreshBtn")) { loadAll().then(function () { toast("Updated"); }); return; }
    if (t.closest("[data-closesheet]")) { closeSheet(); return; }

    el = t.closest("[data-tab]");
    if (el) { tab = el.dataset.tab; render(); window.scrollTo({ top: 0 }); return; }

    el = t.closest("[data-ofilter]");
    if (el) { orderFilter = el.dataset.ofilter; render(); return; }

    el = t.closest("[data-setstatus]");
    if (el) { if (!el.disabled) setStatus(el.dataset.oid, el.dataset.setstatus); return; }

    el = t.closest("[data-oid]");
    if (el) { openOrder(el.dataset.oid); return; }

    if (t.closest("[data-newp]")) { openProduct(null); return; }
    el = t.closest("[data-editp]");
    if (el) { openProduct(Number(el.dataset.editp)); return; }

    if (t.closest("#pActive")) {
      editing.active = !editing.active;
      $("pActive").classList.toggle("on", editing.active);
      return;
    }
    if (t.closest("[data-savep]")) { saveProduct(); return; }
    el = t.closest("[data-delp]");
    if (el) { deleteProduct(Number(el.dataset.delp)); return; }

    if (t.closest("[data-addc]")) { addCoupon(); return; }
    el = t.closest("[data-ctoggle]");
    if (el) { toggleCoupon(el.dataset.ctoggle); return; }
    el = t.closest("[data-cdel]");
    if (el) { deleteCoupon(el.dataset.cdel); return; }
  });

  $("adCard").addEventListener("keydown", function (e) {
    if (e.key === "Enter" && SB) signIn();
  });

  /* ---------- Start ---------- */
  async function start() {
    showLogin();
    if (!CFG.url || !CFG.key || !window.supabase) {
      loginError("Add your Supabase URL and key to config.js first.");
      return;
    }
    SB = window.supabase.createClient(CFG.url, CFG.key);
    var s = await SB.auth.getSession();
    if (s.data && s.data.session) await checkAdmin(s.data.session.user);
  }
  start();
})();
