/* PhoneHub - lõi dùng chung: dữ liệu, giỏ hàng, đơn hàng, đăng nhập, header */
const PAGE = document.body.dataset.page;

const U = u => u == '#/' ? 'index.html' : u.startsWith('#/product/') ? 'product.html?id=' + u.slice(10) : u.slice(2) + '.html';

const nav = u => {
  location.href = U(u);
};

const cur = () => PAGE == 'store' ? '#/' : PAGE == 'product' ? '#/product/' + new URLSearchParams(location.search).get('id') : '#/' + PAGE;

const $ = s => document.querySelector(s);

const money = n => Number(n || 0).toLocaleString('vi-VN') + '₫',
  now = () => new Date().toISOString().slice(0, 16).replace('T', ' '),
  nid = a => a.reduce((m, x) => Math.max(m, x.id), 0) + 1;

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
}[c]));

const COL = {
  'Titan tự nhiên': '#b8b2a7',
  'Đen': '#1d1f24',
  'Trắng': '#e9e7e1',
  'Xanh': '#3b6fb6',
  'Tím': '#8d7bb5',
  'Vàng': '#d9b45a',
  'Xám': '#6b7078'
};

const ST = {
  pending: ['Chờ xác nhận', 'warn'],
  confirmed: ['Đã xác nhận', 'ok'],
  completed: ['Hoàn thành', 'ok'],
  cancelled: ['Đã hủy', 'bad']
};

let F = {
    brand: 0,
    q: '',
    sort: '',
    price: ''
  },
  pos = [],
  posQ = '',
  tab = 'dash',
  posCus = {
    name: '',
    phone: ''
  };

const brand = id => db.brands.find(b => b.id == id)?.name || '—';

const toast = m => {
  const t = $('#toast');
  t.textContent = m;
  t.style.display = 'block';
  clearTimeout(toast.h);
  toast.h = setTimeout(() => t.style.display = 'none', 2200);
};

const modal = h => {
    $('#mc').innerHTML = h;
    $('#modal').classList.add('on');
  },
  closeM = () => $('#modal').classList.remove('on');

$('#modal').onclick = e => {
  if (e.target.id == 'modal')
    closeM();
};

const ph0 = (p, c = '') => `<div class="ph ${ c }" style="--c:${ COL[p.p_color] || '#444' }">
    <i>
    </i>
    </div>`;

const stag = s => `<span class="tag ${ ST[s][1] }">${ ST[s][0] }</span>`;
const stock = p => p.quantity <= 0 ? '<span class="tag bad">Hết hàng</span>' : p.quantity <= 5 ? `<span class="tag warn">Còn ${ p.quantity }</span>` : '';

const tbl = (h, r) => `<div class="scroll">
    <table>
    <tr>${ h.map(x => `<th>${ x }</th>`).join('') }</tr>${ r.map(x => `<tr>${ x.map(c => `<td>${ c }</td>`).join('') }</tr>`).join('') || `<tr>
    <td colspan=${ h.length } class="empty">Chưa có dữ liệu</td>
    </tr>` }</table>
    </div>`;

const pr = id => db.products.find(p => p.id == id);

function loginM(reg) {
  modal(reg ? `<h3>Đăng ký khách hàng</h3>
    <div class="fg">
    <label>Họ tên<input id="a1">
    </label>
    <label>Tên đăng nhập<input id="a2">
    </label>
    <label>Số điện thoại<input id="a3">
    </label>
    <label>Mật khẩu<input id="a4" type="password">
    </label>
    </div>
    <div class="row">
    <button class="ghost" onclick="loginM()">Đã có tài khoản</button>
    <button class="pri" onclick="doReg()">Tạo tài khoản</button>
    </div>` : `<h3>Đăng nhập</h3>
    <div class="fg">
    <label>Tên đăng nhập<input id="a1">
    </label>
    <label>Mật khẩu<input id="a2" type="password">
    </label>
    </div>
    <p style="color:var(--mute);font-size:13px">Dùng thử: khách <b>khach/123</b> · quản trị <b>admin/123</b> · nhân viên <b>nv1/123</b>
    </p>
    <div class="row">
    <button class="ghost" onclick="loginM(1)">Đăng ký</button>
    <button class="pri" onclick="doLogin()">Đăng nhập</button>
    </div>`);
}

const disc = p => 5 + p.id * 3 % 16,
  oldP = p => Math.round(p.price / (1 - disc(p) / 100) / 10000) * 10000,
  rate = p => (4.5 + p.id % 5 / 10).toFixed(1);

let bi = 0,
  bt = 0,
  tm = 0;

function header() {
  const r = cur(),
    a = h => r.startsWith(h) ? 'on' : '',
    n = cart().list.reduce((s, i) => s + i.quantity, 0);
  $('#hd').innerHTML = `<div class="hp">Miễn phí giao nội thành · Trả góp 0% · Bảo hành chính hãng 12 tháng</div>
    <div class="hw">
    <a class="logo" href="index.html">PhoneHub</a>
    <div class="cat">
    <button>☰ Danh mục</button>
    <div class="mega">
    <div>${ db.brands.filter(b => b.status == 'active').map(b => `<button onclick="goBrand(${ b.id })">${ esc(b.name) }<span style="color:var(--mute)">${ db.products.filter(p => p.brand_id == b.id && p.status == 'active').length }</span>
    </button>`).join('') }</div>
    </div>
    </div>
    <div class="hs">
    <input id="hs" placeholder="Bạn tìm điện thoại nào hôm nay?" value="${ esc(F.q) }" oninput="hsearch(this.value)" onkeydown="if(event.key=='Enter'&&PAGE!='store')nav('#/')">
    </div>
    <div class="hl">
    <a class="${ a('#/care') }" href="care.html">Chăm sóc</a>${ isEmp() ? `<a class="${ a('#/pos') }" href="pos.html">Bán hàng</a>` : '' }${ isEmp() ? `<a class="${ a('#/admin') }" href="admin.html">Quản lý</a>` : '' }<a href="cart.html" onclick="drawer(1);return false">Giỏ hàng<span class="badge">${ n }</span>
    </a>${ ses ? `<a class="${ a('#/account') }" href="account.html" title="Xem thông tin tài khoản">${ esc(me()?.full_name || me()?.username || ('#' + me()?.id)) }</a>
    <button class="lk" onclick="logout()">Thoát</button>` : `<button class="lk" onclick="loginM()">Đăng nhập</button>` }</div>
    </div>`;
}

function hsearch(v) {
  F.q = v;
  if ($('#pl'))
    list2();
  else {
    nav('#/');
    setTimeout(() => {
      const i = $('#hs');
      i.focus();
      i.setSelectionRange(99, 99);
    }, 60);
  }
}

function goBrand(id) {
  F.brand = id;
  if (cur() == '#/')
    render();
  else
    nav('#/');
  setTimeout(() => $('#pl') && $('#pl').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  }), 80);
}

function pcard(p) {
  return `<div class="card pc" onclick="pdetail(${ p.id })">
    <span class="dc">-${ disc(p) }%</span>${ ph(p) }<div class="nm">${ esc(p.name) }</div>
    <div class="meta">${ p.storage } · ${ esc(p.p_color) }</div>
    <div class="pr">${ money(p.price) } <span class="old">${ money(oldP(p)) }</span>
    </div>
    <div class="meta">★ ${ rate(p) } · Trả góp 0%</div>
    <div>${ stock(p) }</div>
    <button class="pri" ${ p.quantity <= 0 ? 'disabled' : '' } onclick="event.stopPropagation();addCart(${ p.id })">Thêm vào giỏ</button>
    </div>`;
}

function drawer(open) {
  let d = $('#dw');
  if (!open) {
    d && d.classList.remove('on');
    return;
  }
  if (!d) {
    d = document.createElement('div');
    d.id = 'dw';
    document.body.append(d);
  }
  const was = d.classList.contains('on'),
    L = cart().list,
    t = L.reduce((s, i) => s + pr(i.product_id).price * i.quantity, 0);
  d.innerHTML = `<div class="ov" onclick="drawer()">
    </div>
    <aside>
    <div class="bar" style="justify-content:space-between">
    <h3 style="margin:0">Giỏ hàng (${ L.length })</h3>
    <button class="ghost sm" onclick="drawer()">Đóng</button>
    </div>
    <div style="flex:1;overflow:auto">${ L.map(i => {
    const p = pr(i.product_id);
    return `<div class="line">${ ph(p, 's') }<div class="g">
    <b>${ esc(p.name) }</b>
    <br>
    <small>${ money(p.price) }</small>
    <br>
    <span class="qty">
    <button onclick="dq(${ p.id },-1)">−</button>${ i.quantity }<button onclick="dq(${ p.id },1)">+</button>
    </span>
    </div>
    <button class="ghost sm" onclick="delCart(${ p.id });drawer(1)">Xóa</button>
    </div>`;
  }).join('') || '<div class="empty">Giỏ hàng đang trống.</div>' }</div>
    <div class="tot">
    <span>Tạm tính</span>
    <span>${ money(t) }</span>
    </div>
    <button class="pri" ${ L.length ? '' : 'disabled' } onclick="drawer();nav('#/cart')">Xem giỏ và đặt hàng</button>
    </aside>`;
  if (!was)
    requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('on')));
}

document.body.insertAdjacentHTML('beforeend', '<button id="up" aria-label="Lên đầu trang" onclick="scrollTo({top:0})">↑</button>');

addEventListener('scroll', () => {
  $('#up').classList.toggle('on', scrollY > 500);
  $('#hd').classList.toggle('sc', scrollY > 10);
}, { passive: true });

addEventListener('keydown', e => {
  if (e.key == 'Escape') {
    closeM();
    drawer();
  }
});

const SL = [
    'Màn hình',
    'Chip',
    'RAM',
    'Camera sau',
    'Pin',
    'Hđh'
  ],
  SP = {
    1: '6.7" OLED 120Hz;Apple A17 Pro;8GB;48MP + 12MP + 12MP;4422mAh, sạc 27W;iOS 17',
    2: '6.1" OLED Super Retina;Apple A16 Bionic;6GB;48MP + 12MP;3349mAh, sạc 20W;iOS 17',
    3: '6.1" OLED Super Retina;Apple A15 Bionic;6GB;12MP + 12MP;3279mAh, sạc 20W;iOS 16',
    4: '6.8" Dynamic AMOLED 2X 120Hz;Snapdragon 8 Gen 3;12GB;200MP + 50MP + 12MP + 10MP;5000mAh, sạc 45W;Android 14',
    5: '6.6" Super AMOLED 120Hz;Exynos 1480;8GB;50MP + 12MP + 5MP;5000mAh, sạc 25W;Android 14',
    6: '6.7" Dynamic AMOLED 2X gập;Snapdragon 8 Gen 2;8GB;12MP + 12MP;3700mAh, sạc 25W;Android 13',
    7: '6.36" AMOLED 120Hz;Snapdragon 8 Gen 3;12GB;50MP Leica x3;4610mAh, sạc 90W;Android 14',
    8: '6.67" AMOLED 120Hz;Snapdragon 7s Gen 2;8GB;200MP + 8MP + 2MP;5100mAh, sạc 67W;Android 13',
    9: '6.7" AMOLED 120Hz;Dimensity 7050;8GB;64MP + 8MP + 2MP;5000mAh, sạc 67W;Android 14',
    10: '6.72" IPS 90Hz;Snapdragon 685;8GB;108MP + 2MP;5000mAh, sạc 33W;Android 13'
  };

SL[5] = 'Hệ điều hành';

const legacySpecsOf = p => p.specs ? p.specs.split('\n').filter(l => l.includes(':')).map(l => [
  l.split(':')[0].trim(),
  l.slice(l.indexOf(':') + 1).trim()
]) : (SP[p.id] || '').split(';').filter(Boolean).map((v, i) => [SL[i], v]);

const SPEC_LABELS = [
  'M\u00e0n h\u00ecnh',
  'Chip',
  'RAM',
  'Camera sau',
  'Pin',
  'H\u1ec7 \u0111i\u1ec1u h\u00e0nh'
];

const specsFromValues = values => values.map((value, index) => [SPEC_LABELS[index], value]);

const specsByBrand = (p, brandName) => {
  const name = String(p.name || '').toLowerCase();
  const currentBrand = String(brandName || '').toLowerCase();

  if (currentBrand.includes('apple') || name.includes('iphone')) {
    if (name.includes('14'))
      return specsFromValues(['6.1" Super Retina XDR OLED', 'Apple A15 Bionic', '6GB', '12MP + 12MP', '3279mAh, s\u1ea1c 20W', 'iOS 16']);
    if (name.includes('13'))
      return specsFromValues(['6.1" Super Retina XDR OLED', 'Apple A15 Bionic', '4GB', '12MP + 12MP', '3227mAh, s\u1ea1c 20W', 'iOS 15']);
    if (name.includes('12'))
      return specsFromValues(['6.1" Super Retina XDR OLED', 'Apple A14 Bionic', '4GB', '12MP + 12MP', '2815mAh, s\u1ea1c 20W', 'iOS 14']);
    return specsFromValues(['6.1" Liquid Retina LCD', 'Apple A13 Bionic', '4GB', '12MP + 12MP', '3110mAh, s\u1ea1c 18W', 'iOS 13']);
  }

  if (currentBrand.includes('samsung')) {
    if (name.includes('s23'))
      return specsFromValues(['6.8" Dynamic AMOLED 2X, 120Hz', 'Snapdragon 8 Gen 2 for Galaxy', '8GB/12GB', '200MP + 10MP + 10MP + 12MP', '5000mAh, s\u1ea1c 45W', 'Android 13']);
    if (name.includes('s22'))
      return specsFromValues(['6.8" Dynamic AMOLED 2X, 120Hz', 'Snapdragon 8 Gen 1', '8GB/12GB', '108MP + 10MP + 10MP + 12MP', '5000mAh, s\u1ea1c 45W', 'Android 12']);
    if (name.includes('s21'))
      return specsFromValues(['6.8" Dynamic AMOLED 2X, 120Hz', 'Exynos 2100', '12GB', '108MP + 10MP + 10MP + 12MP', '5000mAh, s\u1ea1c 25W', 'Android 11']);
    return specsFromValues(['6.9" Dynamic AMOLED 2X, 120Hz', 'Exynos 990', '12GB', '108MP + 48MP + 12MP + 0.3MP', '5000mAh, s\u1ea1c 45W', 'Android 10']);
  }

  if (currentBrand.includes('xiaomi'))
    return specsFromValues(['6.36" AMOLED, 120Hz', 'Snapdragon 8 Gen 3', '12GB', '50MP Leica + 50MP + 50MP', '4610mAh, s\u1ea1c 90W', 'HyperOS (Android 14)']);
  if (currentBrand.includes('oppo'))
    return specsFromValues(['6.7" AMOLED, 120Hz', 'Dimensity 7300-Energy', '12GB', '50MP + 8MP + 2MP', '5000mAh, s\u1ea1c 80W', 'ColorOS 14 (Android 14)']);
  if (currentBrand.includes('vivo'))
    return specsFromValues(['6.78" AMOLED, 120Hz', 'Snapdragon 7 Gen 3', '12GB', '50MP ZEISS + 50MP', '5500mAh, s\u1ea1c 80W', 'Funtouch OS 14 (Android 14)']);

  return specsFromValues(['6.5" IPS LCD', 'Octa-core', '8GB', '50MP + 2MP', '5000mAh, s\u1ea1c nhanh', 'Android']);
};

const specsOf = p => {
  if (p.specs) {
    const parsed = p.specs.split('\n').filter(line => line.includes(':')).map(line => [
      line.slice(0, line.indexOf(':')).trim(),
      line.slice(line.indexOf(':') + 1).trim()
    ]).filter(([key, value]) => key && value);
    if (parsed.length) return parsed;
  }
  return specsByBrand(p, brand(p.brand_id));
};

const specText = p => specsOf(p).map(x => x.join(': ')).join('\n');

const art = (p, v) => {
  const c = COL[p.p_color] || '#444',
    n = esc(p.name);
  let b;
  if (v == 0)
    b = `<rect x="95" y="30" width="110" height="240" rx="18" fill="${ c }"/>
    <rect x="101" y="36" width="98" height="228" rx="13" fill="url(#w)"/>
    <rect x="136" y="42" width="28" height="7" rx="4" fill="#000" opacity=".6"/>
    <text x="150" y="110" text-anchor="middle" font-size="26" font-weight="700" fill="#fff">9:41</text>
    <text x="150" y="130" text-anchor="middle" font-size="8" fill="#fff" opacity=".85">${ n }</text>`;
  else if (v == 1)
    b = `<rect x="95" y="30" width="110" height="240" rx="18" fill="${ c }"/>
    <rect x="104" y="40" width="48" height="52" rx="12" fill="#000" opacity=".35"/>
    <circle cx="118" cy="55" r="9" fill="#111" stroke="#888"/>
    <circle cx="118" cy="77" r="9" fill="#111" stroke="#888"/>
    <circle cx="138" cy="66" r="9" fill="#111" stroke="#888"/>
    <text x="150" y="170" text-anchor="middle" font-size="12" font-weight="700" fill="#fff" opacity=".6">${ esc(brand(p.brand_id)) }</text>`;
  else
    b = `<rect x="140" y="28" width="22" height="244" rx="8" fill="${ c }"/>
    <rect x="156" y="28" width="6" height="244" rx="3" fill="#000" opacity=".25"/>
    <rect x="138" y="90" width="3" height="30" rx="1.5" fill="#999"/>
    <rect x="138" y="130" width="3" height="30" rx="1.5" fill="#999"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
    <defs>
    <linearGradient id="w" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#2b6bff"/>
    <stop offset="1" stop-color="#d1488f"/>
    </linearGradient>
    <radialGradient id="g">
    <stop offset="0" stop-color="#fff"/>
    <stop offset="1" stop-color="#e3e6df"/>
    </radialGradient>
    </defs>
    <rect width="300" height="300" fill="url(#g)"/>
    <ellipse cx="150" cy="282" rx="70" ry="7" fill="#000" opacity=".12"/>${ b }</svg>`;
};

const imgs = p => p.image_url ? [p.image_url, ...p.gallery || []] : [0, 1, 2].map(v => 'data:image/svg+xml;utf8,' + encodeURIComponent(art(p, v)));

const ph = (p, c = '') => `<div class="ph ${ c }">
    <img src="${ imgs(p)[0] }" alt="${ esc(p.name) }" loading="lazy">
    </div>`;

let gi = 0,
  pq = 1,
  apq = '',
  pimg = [];

function loginM(reg) {
  nav(reg ? '#/register' : '#/login');
}

function pdetail(id) {
  nav('#/product/' + id);
}

/* ---- bộ định tuyến theo trang ---- */
const persistF = () => {
  try {
    sessionStorage.setItem('F', JSON.stringify(F));
  } catch (e) {
  }
};

try {
  Object.assign(F, JSON.parse(sessionStorage.getItem('F')) || {});
} catch (e) {
}

function hsearch(v) {
  F.q = v;
  persistF();
  if (PAGE == 'store' && $('#pl'))
    list2();
}

function goBrand(id) {
  F.brand = id;
  persistF();
  if (PAGE == 'store') {
    render();
    setTimeout(() => $('#pl') && $('#pl').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    }), 80);
  } else
    nav('#/');
}

let VIEW = () => '',
  AFTER = () => {
  };

function render() {
  header();
  const bad = PAGE == 'pos' && !isEmp() || PAGE == 'admin' && !isEmp() || PAGE == 'account' && !ses;
  $('#app').innerHTML = bad ? '<div class="empty">Bạn cần đăng nhập bằng tài khoản phù hợp để vào trang này.<br><br><a class="pri" style="display:inline-block" href="login.html">Đăng nhập</a></div>' : VIEW();
  if (!bad)
    AFTER();
}

/* ---- người dùng, giỏ hàng, đơn hàng (gọi API) ---- */

const cartQty = (id) => (cart().list.find((i) => i.product_id == id) || { quantity: 0 }).quantity;

const afterCart = () => {
  render();
  if ($('#dw')?.classList.contains('on')) drawer(1);
};

// Đặt số lượng của một sản phẩm trong giỏ (qty <= 0 là xóa). Khách đăng nhập: lưu trong MySQL

/* ---- đăng nhập / đăng xuất ---- */

// Mỗi trang gọi boot(): nạp dữ liệu từ MySQL rồi vẽ giao diện

/* ---- quyền, giỏ hàng, đơn hàng, đăng nhập ---- */
const isEmp = () => ses?.t == 'e';
const roleKey = () => (isEmp() ? roleOf(CUR) : null);
const isManager = () => ['MANAGER', 'ADMIN'].includes(roleKey());
const isAdmin = () => roleKey() == 'ADMIN';
const me = () => CUR;

function cart() {
  return { list: ses?.t == 'c' ? db.cart_items : db.guest };
}

// Đặt số lượng một sản phẩm trong giỏ (qty <= 0 là xóa). Khách đăng nhập: lưu qua API
async function cartSet(id, qty) {
  if (qty > pr(id).quantity) return toast('Không đủ hàng trong kho');
  if (ses?.t == 'c') {
    const had = cartQty(id) > 0;
    const done = await act(async () => {
      if (qty <= 0) await S.cart.remove(id);
      else if (had) await S.cart.set(id, qty);
      else await S.cart.add(id, qty);
      db.cart_items = await S.cart.get();
      return true;
    });
    return !!done;
  }
  db.guest = db.guest.filter((i) => i.product_id != id);
  if (qty > 0) db.guest.push({ product_id: id, quantity: qty });
  saveGuest();
  return true;
}

async function addCart(id, go) {
  if (!(await cartSet(id, cartQty(id) + 1))) return;
  header();
  go ? nav('#/cart') : drawer(1);
}

async function qtyCart(id, d) {
  if (await cartSet(id, cartQty(id) + d)) afterCart();
}

async function delCart(id) {
  if (await cartSet(id, 0)) afterCart();
}

const dq = qtyCart;

// Nhân viên: confirmed -> approve, completed -> complete, cancelled -> cancel. Khách: chỉ hủy đơn của mình
async function setStatus(id, s, cancel_reason) {
  const done = await act(() =>
    ses.t == 'c'
      ? S.cancelMyOrder(id, cancel_reason)
      : S.orderAction(id, { confirmed: 'approve', completed: 'complete', cancelled: 'cancel' }[s], { cancel_reason })
  );
  if (!done) return;
  await loadData();
  render();
  toast('Đã cập nhật đơn hàng');
}

function cancelOrderPopup(id) {
  modal(`<h3>Hủy đơn hàng</h3>
    <p style="color:var(--mute)">Vui lòng nhập lý do hủy đơn hàng.</p>
    <label>Lý do hủy<textarea id="cancelReason" maxlength="255" rows="4" placeholder="Nhập lý do..."></textarea></label>
    <div class="row">
    <button class="ghost" onclick="closeM()">Không hủy</button>
    <button class="dng" onclick="confirmCancelOrder(${id})">Xác nhận hủy</button>
    </div>`);
  setTimeout(() => $('#cancelReason')?.focus(), 0);
}

async function confirmCancelOrder(id) {
  const cancel_reason = $('#cancelReason')?.value.trim();
  if (!cancel_reason) {
    return toast('Vui lòng nhập lý do hủy đơn hàng');
  }
  closeM();
  await setStatus(id, 'cancelled', cancel_reason);
}

async function detail(id) {
  const o = await act(() => (ses.t == 'c' ? S.myOrder(id) : S.order(id)));
  if (!o) return;
  modal(`<h3>${o.order_code} ${stag(o.status)}</h3>
    <p style="color:var(--mute)">${esc(o.customer_name)} · ${esc(o.customer_phone)}<br>${esc(o.shipping_address || 'Mua tại quầy')}</p>
    ${o.status == 'cancelled' && o.cancel_reason ? `<p><b>Lý do hủy:</b> ${esc(o.cancel_reason)}</p>` : ''}
    ${o.items.map((i) => `<div class="line"><div class="g">${esc(i.product_name)}<br><small style="color:var(--mute)">${i.quantity} × ${money(i.unit_price)}</small></div><b>${money(i.subtotal)}</b></div>`).join('')}
    <div class="tot"><span>Tổng cộng</span><span>${money(o.total_amount)}</span></div>
    <div class="row"><button class="ghost" onclick="closeM()">Đóng</button></div>`);
}

// Sau khi đăng nhập/đăng ký: đẩy giỏ hàng vãng lai vào giỏ của tài khoản (API không có lệnh gộp nên thêm từng món)
async function startSession() {
  if (ses?.t == 'c' && db.guest.length) {
    for (const i of db.guest) await act(() => S.cart.add(i.product_id, i.quantity));
  }
  db.guest = [];
  saveGuest();
}

async function doLogin() {
  const r = await act(async () => {
    await S.login($('#a1').value.trim(), $('#a2').value);
    return true;
  });
  if (!r) return;
  await startSession();
  nav(isEmp() ? '#/pos' : '#/');
}

function logout() {
  clearSession();
  nav('#/');
}

// Mỗi trang gọi boot(): nạp dữ liệu từ API rồi mới vẽ giao diện
async function boot(v, a) {
  VIEW = v;
  AFTER = a || (() => {});
  $('#app').innerHTML = '<div class="empty">Đang tải dữ liệu…</div>';
  try {
    await loadData();
  } catch (e) {
    $('#app').innerHTML = `<div class="empty">${esc(e.message)}<br><br><button class="pri" onclick="location.reload()">Thử lại</button></div>`;
    return;
  }
  render();
  $('#app').classList.add('pg');
}
