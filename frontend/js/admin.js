const FIELDS = {
  products: [
    [
      'brand_id',
      'Hãng',
      'select',
      () => db.brands.map(b => [b.id, b.name])
    ],
    ['name', 'Tên sản phẩm'],
    ['storage', 'Dung lượng'],
    ['p_color', 'Màu sắc'],
    ['description', 'Mô tả', 'area'],
    ['price', 'Giá bán', 'number'],
    ['quantity', 'Tồn kho', 'number'],
    [
      'status',
      'Trạng thái',
      'select',
      () => [
        ['active', 'Đang bán'],
        ['hidden', 'Ẩn']
      ]
    ]
  ],
  brands: [
    ['name', 'Tên hãng'],
    ['description', 'Mô tả'],
    [
      'status',
      'Trạng thái',
      'select',
      () => [
        ['active', 'Hiển thị'],
        ['hidden', 'Ẩn']
      ]
    ]
  ],
  employees: [
    ['full_name', 'Họ tên'],
    ['username', 'Tên đăng nhập'],
    ['password', 'Mật khẩu'],
    ['phone', 'Số điện thoại'],
    [
      'role_id',
      'Vai trò',
      'select',
      () => db.roles.map(r => [r.id, r.name])
    ],
    [
      'status',
      'Trạng thái',
      'select',
      () => [
        ['active', 'Đang làm'],
        ['locked', 'Khóa']
      ]
    ]
  ]
};

function edit(c, id) {
  const f = FIELDS[c],
    v = id ? db[c].find(x => x.id == id) : {};
  modal(`<h3>${ id ? 'Sửa' : 'Thêm' }</h3>
    <div class="fg">${ f.map(x => `<label>${ x[1] }${ x[2] == 'select' ? `<select data-k="${ x[0] }">${ x[3]().map(o => `<option value="${ o[0] }" ${ o[0] == v[x[0]] ? 'selected' : '' }>${ esc(o[1]) }</option>`).join('') }</select>` : x[2] == 'area' ? `<textarea data-k="${ x[0] }">${ esc(v[x[0]]) }</textarea>` : `<input data-k="${ x[0] }" type="${ x[2] || 'text' }" value="${ esc(v[x[0]]) }">` }</label>`).join('') }</div>
    <div class="row">
    <button class="ghost" onclick="closeM()">Hủy</button>
    <button class="pri" onclick="saveE('${ c }',${ id || 0 })">Lưu</button>
    </div>`);
}

function aCrud(c) {
  const rows = {
      products: p => [
        p.id,
        ph(p, 's'),
        esc(p.name),
        esc(brand(p.brand_id)),
        p.storage,
        esc(p.p_color),
        money(p.price),
        p.quantity + ' ' + stock(p),
        p.status == 'active' ? 'Đang bán' : 'Ẩn'
      ],
      brands: b => [
        b.id,
        esc(b.name),
        esc(b.description),
        db.products.filter(p => p.brand_id == b.id).length + ' sản phẩm',
        b.status == 'active' ? 'Hiển thị' : 'Ẩn'
      ],
      employees: e => [
        e.id,
        esc(e.full_name),
        esc(e.username),
        esc(e.phone),
        esc(db.roles.find(r => r.id == e.role_id)?.name),
        e.status == 'active' ? 'Đang làm' : 'Khóa'
      ]
    }[c],
    h = {
      products: [
        'ID',
        '',
        'Tên',
        'Hãng',
        'Bộ nhớ',
        'Màu',
        'Giá',
        'Tồn kho',
        'Trạng thái'
      ],
      brands: [
        'ID',
        'Hãng',
        'Mô tả',
        'Số lượng',
        'Trạng thái'
      ],
      employees: [
        'ID',
        'Họ tên',
        'Tài khoản',
        'SĐT',
        'Vai trò',
        'Trạng thái'
      ]
    }[c];
  return `<div class="bar">
    <button class="pri" onclick="edit('${ c }')">Thêm mới</button>
    </div>` + tbl([...h, ''], db[c].map(x => [
    ...rows(x),
    `<button class="ghost sm" onclick="edit('${ c }',${ x.id })">Sửa</button> <button class="dng sm" onclick="del('${ c }',${ x.id })">Xóa</button>`
  ]));
}

const aCus = () => tbl([
  'ID',
  'Họ tên',
  'Tài khoản',
  'SĐT',
  'Email',
  'Địa chỉ',
  'Số đơn',
  'Tổng chi tiêu'
], db.customers.map(c => {
  const os = db.orders.filter(o => o.customer_id == c.id && o.status != 'cancelled');
  return [
    c.id,
    esc(c.full_name),
    esc(c.username),
    `<a href="tel:${ esc(c.phone) }">${ esc(c.phone) }</a>`,
    esc(c.email),
    esc(c.address),
    os.length,
    money(os.reduce((s, o) => s + o.total_amount, 0))
  ];
}));

function ptbl() {
  return tbl([
    'ID',
    'Ảnh',
    'Tên',
    'Hãng',
    'Bộ nhớ',
    'Màu',
    'Giá',
    'Tồn kho',
    'Hiển thị',
    ''
  ], db.products.filter(p => (p.name + brand(p.brand_id)).toLowerCase().includes(apq.toLowerCase())).map(p => [
    p.id,
    ph(p, 's'),
    `<a href="product.html?id=${ p.id }">${ esc(p.name) }</a>`,
    esc(brand(p.brand_id)),
    p.storage,
    esc(p.p_color),
    money(p.price),
    p.quantity + ' ' + stock(p),
    `<button class="ghost sm" onclick="togP(${ p.id })">${ p.status == 'active' ? 'Đang bán' : 'Đang ẩn' }</button>`,
    `<button class="ghost sm" onclick="pform(${ p.id })">Sửa</button>${ p.status == 'active' ? ` <button class="dng sm" onclick="del('products',${ p.id })">Xóa</button>` : '' }`
  ]));
}

const aProd = () => `<div class="bar">
    <button class="pri" onclick="pform()">Thêm sản phẩm</button>
    <input placeholder="Tìm sản phẩm…" value="${ esc(apq) }" oninput="apq=this.value;$('#apt').innerHTML=ptbl()">
    </div>
    <div id="apt">${ ptbl() }</div>`;

const _ac = aCrud;
aCrud = c => c == 'products' ? aProd() : _ac(c);

boot(vAdmin);

// Thêm / sửa hãng và nhân viên (mật khẩu để trống khi sửa = giữ nguyên)

// Xóa sản phẩm / hãng / nhân viên (server kiểm tra các ràng buộc)

// Ẩn / hiện sản phẩm

// Tổng quan: số liệu do MySQL tính sẵn (GET /api/admin/stats)

FIELDS.employees.splice(4, 0, ['email', 'Email']);

// Tab nào cần quyền gì: Employee xem/xử lý đơn, Manager thêm sản phẩm, hãng, hóa đơn, Admin thêm khách hàng, nhân viên
const TABS = [
  ['dash', 'Tổng quan', 'MANAGER'],
  ['orders', 'Đơn hàng', 'EMPLOYEE'],
  ['invoices', 'Hóa đơn', 'MANAGER'],
  ['products', 'Sản phẩm', 'MANAGER'],
  ['brands', 'Hãng', 'MANAGER'],
  ['customers', 'Khách hàng', 'ADMIN'],
  ['care', 'Chăm sóc', 'MANAGER'],
  ['employees', 'Nhân viên', 'ADMIN'],
];
const tabsFor = () => TABS.filter((t) => RANK[roleKey()] >= RANK[t[2]] && (t[0] != 'care' || FEATURES.tickets));

function vAdmin() {
  const tabs = tabsFor();
  if (!tabs.some((t) => t[0] == tab)) tab = tabs[0][0];
  return `<h2>Quản lý cửa hàng</h2>
    <div class="tabs">${tabs.map((t) => `<button class="${tab == t[0] ? 'on' : ''}" onclick="tab='${t[0]}';render()">${t[1]}</button>`).join('')}</div>` + {
    dash: aDash,
    orders: aOrders,
    invoices: aInv,
    products: () => aCrud('products'),
    brands: () => aCrud('brands'),
    customers: aCus,
    care: aCare,
    employees: () => aCrud('employees'),
  }[tab]();
}

function aOrders() {
  const staff = (o) => o.employee_name || db.employees.find((e) => e.id == o.employee_id)?.full_name || (o.employee_id ? '#' + o.employee_id : '—');
  return tbl(
    ['Mã đơn', 'Khách', 'Điện thoại', 'Tổng tiền', 'Trạng thái', 'Ngày tạo', 'NV xử lý', ''],
    db.orders.slice().sort((a, b) => b.id - a.id).map((o) => [
      o.order_code,
      esc(o.customer_name),
      esc(o.customer_phone),
      money(o.total_amount),
      stag(o.status),
      o.created_at,
      esc(staff(o)),
      `<button class="ghost sm" onclick="detail(${o.id})">Xem</button> `
        + (o.status == 'pending' ? `<button class="pri sm" onclick="setStatus(${o.id},'confirmed')">Xác nhận</button> ` : '')
        + (o.status == 'confirmed' ? `<button class="pri sm" onclick="setStatus(${o.id},'completed')">Hoàn thành</button> ` : '')
        + (['pending', 'confirmed'].includes(o.status) ? `<button class="dng sm" onclick="cancelOrderPopup(${o.id})">Hủy</button>` : ''),
    ])
  );
}

const aInv = () => tbl(
  ['Mã hóa đơn', 'Đơn hàng', 'Nhân viên', 'Tổng tiền', 'Ngày xuất'],
  db.invoices.slice().sort((a, b) => b.id - a.id).map((i) => [
    i.invoice_code,
    esc(i.order_code || db.orders.find((o) => o.id == i.order_id)?.order_code || '#' + i.order_id),
    esc(i.employee_name || db.employees.find((e) => e.id == i.employee_id)?.full_name || '—'),
    money(i.total_amount),
    i.created_at,
  ])
);

// Thêm / sửa hãng và nhân viên (mật khẩu để trống khi sửa = giữ nguyên)
async function saveE(c, id) {
  const o = {};
  document.querySelectorAll('#mc [data-k]').forEach((e) => {
    const k = e.dataset.k;
    const f = FIELDS[c].find((x) => x[0] == k);
    o[k] = f[2] == 'number' || (f[2] == 'select' && /^\d+$/.test(e.value)) ? +e.value : e.value;
  });
  if (!(o.name || o.full_name)) return toast('Vui lòng nhập tên');
  const r = await act(() => (c == 'brands' ? S.brandSave(id, o) : S.employeeSave(id, o)));
  if (!r) return;
  closeM();
  await loadData();
  render();
}

function pform(id) {
  const p = id ? pr(id) : { brand_id: db.brands[0]?.id, p_color: 'Đen', status: 'active', price: 0, quantity: 0 };
  const colors = Object.keys(COL);
  if (p.p_color && !colors.includes(p.p_color)) colors.push(p.p_color);
  const opts = (a, v) => a.map((x) => `<option value="${esc(x[0])}" ${x[0] == v ? 'selected' : ''}>${esc(x[1])}</option>`).join('');
  modal(`<h3>${id ? 'Sửa' : 'Thêm'} sản phẩm</h3>
    <div class="fg">
      <label>Hãng<select id="f1">${opts(db.brands.map((b) => [b.id, b.name]), p.brand_id)}</select></label>
      <label>Tên sản phẩm<input id="f2" value="${esc(p.name)}"></label>
      <label>Dung lượng<input id="f3" value="${esc(p.storage)}" placeholder="256GB"></label>
      <label>Màu sắc<select id="f4">${opts(colors.map((k) => [k, k]), p.p_color)}</select></label>
      <label>Giá bán (đ)<input id="f5" type="number" min="0" value="${p.price}"></label>
      <label>Tồn kho<input id="f6" type="number" min="0" value="${p.quantity}"></label>
      <label>Mô tả ngắn<textarea id="f7">${esc(p.description)}</textarea></label>
      ${FEATURES.extraProductColumns ? `<label>Thông số kỹ thuật (mỗi dòng "Tên: giá trị")<textarea id="f8" rows="6">${esc(id ? specText(p) : '')}</textarea></label>` : ''}
      <label>Trạng thái<select id="f9">${opts([['active', 'Đang bán'], ['hidden', 'Ẩn']], p.status)}</select></label>
      <label>Link ảnh (image_url)<input id="f10" value="${esc(p.image_url)}" placeholder="https://..."></label>
    </div>
    <div class="row"><button class="ghost" onclick="closeM()">Hủy</button><button class="pri" onclick="saveP(${id || 0})">Lưu sản phẩm</button></div>`);
}

async function saveP(id) {
  const g = (k) => $('#' + k).value.trim();
  const name = g('f2');
  const price = +g('f5');
  if (!name) return toast('Vui lòng nhập tên sản phẩm');
  if (!(price > 0)) return toast('Giá bán phải lớn hơn 0');
  const p = {
    brand_id: +g('f1'),
    name,
    storage: g('f3'),
    p_color: g('f4'),
    price,
    quantity: Math.max(0, +g('f6') || 0),
    description: g('f7'),
    specs: $('#f8') ? $('#f8').value : '',
    status: g('f9'),
    image_url: g('f10'),
    gallery: [],
  };
  const r = await act(() => S.productSave(id, p));
  if (!r) return;
  closeM();
  await loadData();
  render();
  toast(id ? 'Đã cập nhật sản phẩm' : 'Đã thêm sản phẩm');
}

// Xóa sản phẩm / hãng / nhân viên (nhân viên: API chỉ khóa tài khoản). Server kiểm tra các ràng buộc
async function del(c, id) {
  if (!confirm(c == 'products' ? 'Xóa sản phẩm này? Thao tác không thể hoàn tác.' : 'Xóa mục này?')) return;
  if (c == 'employees' && id == ses.id) return toast('Không thể xóa chính bạn');
  const del = { products: S.productDelete, brands: S.brandDelete, employees: S.employeeDelete }[c];
  const r = await act(() => del(id));
  if (!r) return;
  await loadData();
  render();
  toast('Đã xóa');
}

// Ẩn / hiện sản phẩm
async function togP(id) {
  const p = pr(id);
  const r = await act(() => S.productSave(id, { ...p, status: p.status == 'active' ? 'hidden' : 'active' }));
  if (!r) return;
  await loadData();
  render();
}

async function ticketDone(id) {
  const r = await act(() => S.ticketDone(id));
  if (!r) return;
  await loadData();
  render();
}

function aCare() {
  return '<h3>Yêu cầu hỗ trợ từ khách hàng</h3>' + tbl(
    ['Ngày', 'Khách', 'SĐT', 'Chủ đề', 'Nội dung', 'Trạng thái'],
    db.tickets.map((t) => [
      t.created_at,
      esc(t.name),
      `<a href="tel:${esc(t.phone)}">${esc(t.phone)}</a>`,
      esc(t.topic),
      esc(t.message),
      t.done ? '<span class="tag ok">Đã xử lý</span>' : `<button class="pri sm" onclick="ticketDone(${t.id})">Đánh dấu đã xử lý</button>`,
    ])
  );
}

// Tổng quan: doanh thu/số lượng lấy từ GET /orders/stats, còn lại tính từ danh sách đã nạp
function aDash() {
  const s = db.stats || {};
  const count = (k) => db.orders.filter((o) => o.status == k).length;
  const revenue = num(pick(s, ['total_revenue', 'revenue'], db.orders.filter((o) => o.status == 'completed').reduce((t, o) => t + o.total_amount, 0)));
  const orders = num(pick(s, ['total_orders', 'order_count'], db.orders.length));
  const customers = pick(s, ['total_customers', 'customer_count'], db.customers.length || '—');
  const products = pick(s, ['total_products', 'product_count'], db.products.length);
  const bs = Object.keys(ST).map((k) => [k, count(k)]);
  const mb = Math.max(1, ...bs.map((x) => x[1]));
  const recent = db.orders.slice().sort((a, b) => b.id - a.id).slice(0, 5);
  const low = db.products.filter((p) => p.quantity <= 5);
  return `<div class="stats">
    <div class="card stat"><b>${money(revenue)}</b><span>Tổng doanh thu</span></div>
    <div class="card stat"><b>${orders}</b><span>Số đơn hàng</span></div>
    <div class="card stat"><b>${customers}</b><span>Khách hàng</span></div>
    <div class="card stat"><b>${products}</b><span>Tổng sản phẩm</span></div>
  </div>
  <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr))">
    <div class="card"><h3>Đơn hàng theo trạng thái</h3>${bs.map(([k, n]) => `<div class="hb"><span class="t">${ST[k][0]}</span><span class="b" style="width:${n / mb * 55}%"></span>${n}</div>`).join('')}</div>
    <div class="card"><h3>Đơn hàng gần đây</h3>${recent.map((o) => `<div class="line"><div class="g"><b>${o.order_code}</b><br><small style="color:var(--mute)">${esc(o.customer_name)}</small></div>${stag(o.status)}<b>${money(o.total_amount)}</b></div>`).join('') || '<div class="empty">Chưa có đơn hàng.</div>'}</div>
    <div class="card"><h3>Cần nhập thêm hàng</h3>${low.map((p) => `<div class="line"><div class="g">${esc(p.name)} ${p.storage}</div>${stock(p) || '<span class="tag bad">Hết hàng</span>'}</div>`).join('') || '<div class="empty">Tồn kho ổn định.</div>'}</div>
  </div>`;
}
