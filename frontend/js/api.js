/* =====================================================================
   PhoneHub - lớp kết nối với API của nhóm (PSM System)
   Mọi lệnh gọi API đều đi qua file này. Khi API đổi, chỉ cần sửa ở đây.
   Bảng đối chiếu chức năng <-> endpoint và các giả định: xem API_SYNC.md
   ===================================================================== */

/* ---------- 1. Cấu hình (nhóm chỉnh ở đây) ---------- */
const API_URL = 'http://localhost:3000/api';

// role_id -> quyền. Cần đối chiếu với bảng roles trong SQL của nhóm
const ROLE_KEYS = { 1: 'ADMIN', 2: 'MANAGER', 3: 'EMPLOYEE' };
const ROLES = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Manager' },
  { id: 3, name: 'Employee' },
];
const RANK = { EMPLOYEE: 1, MANAGER: 2, ADMIN: 3 };

// Chức năng giao diện có nhưng API/SQL của nhóm chưa có. Đổi thành true khi nhóm bổ sung
const FEATURES = {
  tickets: false, // yêu cầu hỗ trợ (trang Chăm sóc khách hàng)
  extraProductColumns: false, // cột specs, gallery của bảng products
};

const TOKEN_KEY = 'ph_token';
const USER_KEY = 'ph_user';
const GUEST_KEY = 'ph_guest';

/* ---------- 2. Bộ nhớ tạm của trang (dữ liệu thật nằm trong MySQL) ---------- */
const db = {
  roles: ROLES,
  employees: [],
  brands: [],
  products: [],
  customers: [],
  orders: [],
  invoices: [],
  tickets: [],
  cart_items: [],
  guest: [],
  stats: {},
};
let ses = null; // { t: 'c' | 'e', id }, null nếu chưa đăng nhập
let CUR = null; // thông tin người đang đăng nhập

/* ---------- 3. Tiện ích chuyển đổi dữ liệu ---------- */
const pick = (o, keys, d) => {
  for (const k of keys) if (o && o[k] !== undefined && o[k] !== null) return o[k];
  return d;
};
const num = (v) => (v === null || v === undefined || v === '' ? 0 : Number(v));
const lower = (s) => String(s || '').toLowerCase();
const dt = (s) => (s ? String(s).replace('T', ' ').slice(0, 16) : s);
const omit = ({ password, ...rest }) => rest;

// API trả camelCase hay snake_case đều được: frontend luôn dùng snake_case
const snake = (v) =>
  Array.isArray(v)
    ? v.map(snake)
    : v && typeof v == 'object'
      ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase()), snake(x)]))
      : v;

// Lấy mảng dữ liệu dù API bọc kiểu [..], { data: [..] }, { data: { items: [..] } }, { products: [..], pagination }
function listOf(res) {
  if (Array.isArray(res)) return res;
  if (res && typeof res == 'object') {
    for (const v of Object.values(res)) if (Array.isArray(v)) return v;
    for (const v of Object.values(res)) {
      const inner = v && typeof v == 'object' ? listOf(v) : [];
      if (inner.length) return inner;
    }
  }
  return [];
}
const objOf = (res) => (res && typeof res.data == 'object' && !Array.isArray(res.data) ? res.data : res || {});

// Trạng thái: API dùng ACTIVE/INACTIVE, giao diện dùng active/hidden (sản phẩm, hãng) hoặc active/locked (nhân viên)
const stIn = (s, off = 'hidden') => (['inactive', 'deleted'].includes(lower(s)) ? off : lower(s));
const stOut = (s) => ({ active: 'ACTIVE', hidden: 'INACTIVE', locked: 'INACTIVE' })[s] || String(s).toUpperCase();

const parseGallery = (g) => {
  if (Array.isArray(g)) return g;
  try {
    return JSON.parse(g || '[]');
  } catch (e) {
    return [];
  }
};

const nProduct = (p) => ({
  ...p,
  price: num(p.price),
  quantity: num(p.quantity),
  status: stIn(p.status),
  image_url: p.image_url || '',
  specs: p.specs || '',
  gallery: parseGallery(p.gallery),
  created_at: dt(p.created_at),
});
const nBrand = (b) => ({ ...b, status: stIn(b.status) });
const nCustomer = (c) => ({ ...omit(c), created_at: dt(c.created_at) });
const nEmployee = (e) => ({
  ...omit(e),
  status: stIn(e.status, 'locked'),
  role_id: num(e.role_id ?? e.role?.id),
  created_at: dt(e.created_at),
});
const nItem = (i) => ({
  ...i,
  product_id: i.product_id ?? i.product?.id,
  product_name: i.product_name || i.name || i.product?.name || '',
  quantity: num(i.quantity),
  unit_price: num(i.unit_price ?? i.price),
  subtotal: num(i.subtotal) || num(i.unit_price ?? i.price) * num(i.quantity),
});
const nOrder = (o) => ({
  ...o,
  status: lower(o.status),
  total_amount: num(o.total_amount),
  cancel_reason: o.cancel_reason || '',
  created_at: dt(o.created_at),
  items: (o.items || o.order_items || []).map(nItem),
});
const nInvoice = (i) => ({
  ...i,
  total_amount: num(i.total_amount),
  created_at: dt(i.created_at),
  employee_name: pick(i, ['employee_name', 'employee_full_name', 'full_name']),
});

// Quyền của nhân viên: ưu tiên tên vai trò (nếu API trả), sau đó role_id
function roleOf(u) {
  if (u.role_key) return u.role_key;
  const name = lower(u.role_name || (typeof u.role == 'string' ? u.role : u.role?.name));
  if (/admin/.test(name)) return 'ADMIN';
  if (/manager|quản lý/.test(name)) return 'MANAGER';
  return ROLE_KEYS[u.role_id] || 'EMPLOYEE';
}

/* ---------- 4. Phiên đăng nhập (sessionStorage, mất khi đóng tab) ---------- */
const saveGuest = () => sessionStorage.setItem(GUEST_KEY, JSON.stringify(db.guest));

function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  ses = null;
  CUR = null;
}

function restoreSession() {
  try {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const user = JSON.parse(sessionStorage.getItem(USER_KEY));
    if (token && user) {
      // Tương thích với session cũ đã lưu type CUSTOMER/EMPLOYEE.
      if (user.type == 'CUSTOMER') user.type = 'c';
      if (user.type == 'EMPLOYEE') user.type = 'e';
      sessionStorage.setItem(USER_KEY, JSON.stringify(user));
      CUR = user;
      ses = { t: user.type, id: user.id };
      return;
    }
  } catch (e) {}
  ses = null;
  CUR = null;
}

function setSession(token, user) {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  restoreSession();
}

// Đọc token + thông tin người dùng từ phản hồi đăng nhập
function sessionOf(res, type) {
  const d = objOf(res);
  const token = pick(d, ['token', 'access_token', 'jwt']) || pick(res, ['token', 'access_token', 'jwt']);
  const raw = pick(d, ['user', 'customer', 'employee', 'profile'], d);
  if (!token) throw new Error('Phản hồi đăng nhập không có token (xem hàm sessionOf trong api.js)');
  // Backend trả type là CUSTOMER/EMPLOYEE; frontend dùng mã nội bộ c/e.
  // Đặt type sau khi spread để dữ liệu backend không ghi đè mã nội bộ này.
  const user = type == 'e' ? nEmployee(raw) : nCustomer(raw);
  return { token, user: { ...user, type } };
}

/* ---------- 5. Gọi API ---------- */
async function api(path, method = 'GET', body) {
  const token = sessionStorage.getItem(TOKEN_KEY);
  let res;
  try {
    res = await fetch(API_URL + path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: 'Bearer ' + token }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (e) {
    throw new Error('Không kết nối được máy chủ. Hãy chạy backend.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) clearSession();
    const err = new Error(data.message || data.error || 'Có lỗi xảy ra');
    err.status = res.status;
    throw err;
  }
  return snake(data);
}

// Chạy một thao tác, báo lỗi bằng toast, trả về null nếu thất bại
async function act(fn) {
  try {
    return await fn();
  } catch (e) {
    toast(e.message);
    return null;
  }
}

const productBody = (p) => ({
  // product service/repository nhận camelCase; response vẫn được chuẩn hóa
  // về snake_case bởi api().
  brandId: p.brand_id,
  name: p.name,
  storage: p.storage,
  color: p.p_color,
  description: p.description,
  price: p.price,
  quantity: p.quantity,
  imageUrl: p.image_url,
  status: stOut(p.status),
  ...(FEATURES.extraProductColumns && { specs: p.specs, gallery: p.gallery }),
});

/* ---------- 6. Các hàm gọi API (S) - mỗi hàm ứng với endpoint trong tài liệu nhóm ---------- */
const S = {
  // Xác thực: khách -> /auth/login, thử tiếp /auth/employee-login nếu không phải khách
  async login(username, password) {
    const attempt = async (path, type) => sessionOf(await api(path, 'POST', { username, password }), type);
    let s;
    try {
      s = await attempt('/auth/customer/login', 'c');
    } catch (e) {
      if (!e.status || e.status >= 500) throw e;
      try {
        s = await attempt('/auth/employee/login', 'e');
      } catch (e2) {
        if (!e2.status || e2.status >= 500) throw e2;
        throw new Error('Sai tên đăng nhập hoặc mật khẩu');
      }
    }
    setSession(s.token, s.user);
  },
  async register(o) {
    // auth service nhận camelCase (khác với customer CRUD nhận snake_case)
    await api('/auth/customer/register', 'POST', {
      fullName: o.full_name,
      username: o.username,
      password: o.password,
      phone: o.phone,
      email: o.email,
      address: o.address,
    });
    await S.login(o.username, o.password);
  },
  async profile() {
    const u = nCustomer(objOf(await api(`/customers/${ses.id}`)));
    return { type: 'c', ...u };
  },
  async profileSave(o) {
    await api(`/customers/${ses.id}`, 'PUT', o);
    const u = await S.profile();
    setSession(sessionStorage.getItem(TOKEN_KEY), u);
    return u;
  },

  // Hãng
  async brands() {
    return listOf(await api('/brands')).map(nBrand);
  },
  brandSave(id, o) {
    const body = { name: o.name, description: o.description, status: stOut(o.status) };
    return id ? api(`/brands/${id}`, 'PUT', body) : api('/brands', 'POST', body);
  },
  brandDelete: (id) => api(`/brands/${id}`, 'DELETE'),

  // Sản phẩm
  async products() {
    // Backend mặc định limit=10 và tối đa 100 dòng/trang; nạp tiếp đến hết
    // để các màn hình quản trị không bị thiếu sản phẩm.
    const pageSize = 100;
    const products = [];
    for (let offset = 0; ; offset += pageSize) {
      const page = listOf(await api(`/products?limit=${pageSize}&offset=${offset}`));
      products.push(...page);
      if (page.length < pageSize) break;
    }
    return products.map(nProduct);
  },
  async adminProducts() {
    // Admin dùng endpoint riêng để nhận cả ACTIVE và INACTIVE.
    const pageSize = 100;
    const products = [];
    for (let offset = 0; ; offset += pageSize) {
      const page = listOf(await api(`/products/admin?limit=${pageSize}&offset=${offset}`));
      products.push(...page);
      if (page.length < pageSize) break;
    }
    return products.map(nProduct);
  },
  productSave(id, p) {
    return id ? api(`/products/${id}`, 'PATCH', productBody(p)) : api('/products', 'POST', productBody(p));
  },
  productDelete: (id) => api(`/products/${id}`, 'DELETE'),

  // Giỏ hàng + đặt hàng của khách (id lấy từ phiên đăng nhập)
  cart: {
    async get() {
      return listOf(await api(`/customers/${ses.id}/cart`)).map((i) => ({
        id: i.id,
        product_id: i.product_id ?? i.product?.id,
        quantity: num(i.quantity),
      }));
    },
    add: (productId, quantity) => api(`/customers/${ses.id}/cart`, 'POST', { productId, quantity }),
    set: (productId, quantity) => api(`/customers/${ses.id}/cart/${productId}`, 'PUT', { quantity }),
    remove: (productId) => api(`/customers/${ses.id}/cart/${productId}`, 'DELETE'),
    checkout: (shipping_address) => api(`/customers/${ses.id}/checkout`, 'POST', { shipping_address }),
  },
  async myOrders() {
    return listOf(await api(`/customers/${ses.id}/orders`)).map((o) => nOrder({ customer_id: ses.id, ...o }));
  },
  async myOrder(id) {
    return nOrder(objOf(await api(`/customers/${ses.id}/orders/${id}`)));
  },
  cancelMyOrder: (id, cancel_reason) => api(`/customers/${ses.id}/orders/${id}/cancel`, 'PUT', { cancel_reason }),

  // Đơn hàng (nhân viên)
  async orders() {
    return listOf(await api('/orders')).map(nOrder);
  },
  async order(id) {
    return nOrder(objOf(await api(`/orders/${id}`)));
  },
  orderAction: (id, action, body) => api(`/orders/${id}/${action}`, 'PUT', body), // approve | complete | cancel
  async orderStats() {
    return objOf(await api('/orders/stats'));
  },
  // Bán tại quầy: tạo đơn thủ công -> duyệt -> hoàn thành (hóa đơn tự sinh).
  // Body của POST /orders chưa có trong tài liệu: đây là giả định, cần nhóm xác nhận
  async posSale({ id: customer_id, name, phone, items }) {
    const created = objOf(await api('/orders', 'POST', { customer_id, customer_name: name, customer_phone: phone, shipping_address: '', items }));
    const id = pick(created, ['id', 'order_id']) ?? created.order?.id;
    if (!id) throw new Error('POST /orders không trả về id đơn hàng (xem API_SYNC.md)');
    await api(`/orders/${id}/approve`, 'PUT');
    await api(`/orders/${id}/complete`, 'PUT');
    return { id, order_code: created.order_code };
  },

  async invoices() {
    return listOf(await api('/invoices')).map(nInvoice);
  },
  async customers() {
    return listOf(await api('/customers')).map(nCustomer);
  },

  // Nhân viên (xóa = khóa tài khoản, status INACTIVE)
  async employees() {
    return listOf(await api('/employees')).map(nEmployee);
  },
  employeeSave(id, o) {
    const body = { full_name: o.full_name, username: o.username, phone: o.phone, email: o.email, role_id: o.role_id, status: stOut(o.status) };
    if (o.password) body.password = o.password;
    return id ? api(`/employees/${id}`, 'PUT', body) : api('/employees', 'POST', body);
  },
  employeeDelete: (id) => api(`/employees/${id}`, 'DELETE'),

  // Yêu cầu hỗ trợ: tài liệu nhóm chưa có API này (đường dẫn dưới đây chỉ là đề xuất)
  async tickets() {
    return FEATURES.tickets ? listOf(await api('/tickets')) : [];
  },
  async ticketSend(o) {
    if (!FEATURES.tickets) throw new Error('Chức năng gửi yêu cầu hỗ trợ chưa có API, vui lòng gọi hotline.');
    return api('/tickets', 'POST', o);
  },
  ticketDone: (id) => api(`/tickets/${id}/done`, 'PUT'),
};

/* ---------- 7. Nạp dữ liệu cho trang, theo quyền của người đăng nhập ---------- */
async function loadData() {
  restoreSession();
  const isAdminPage = ses?.t == 'e' && PAGE == 'admin';
  const isAdmin = isAdminPage && roleOf(CUR) == 'ADMIN';
  const productsLoader = isAdmin ? S.adminProducts() : S.products();
  const jobs = [S.brands().then((r) => (db.brands = r)), productsLoader.then((r) => (db.products = r))];
  if (ses?.t == 'c') {
    jobs.push(
      S.cart.get().then((r) => (db.cart_items = r)),
      S.myOrders().then((r) => (db.orders = r)),
      S.profile().then((u) => (CUR = u)).catch(() => {})
    );
  }
  if (ses?.t == 'e' && PAGE == 'admin') {
    const rank = RANK[roleOf(CUR)];
    jobs.push(S.orders().then((r) => (db.orders = r)));
    if (rank >= 2) {
      jobs.push(S.invoices().then((r) => (db.invoices = r)), S.orderStats().then((r) => (db.stats = r)));
      if (FEATURES.tickets) jobs.push(S.tickets().then((r) => (db.tickets = r)));
    }
    if (rank >= 3) {
      jobs.push(S.customers().then((r) => (db.customers = r)), S.employees().then((r) => (db.employees = r)));
    }
  }
  await Promise.all(jobs);

  // Giỏ hàng khách chưa đăng nhập chỉ nằm tạm trong trình duyệt, gộp vào tài khoản khi đăng nhập
  try {
    db.guest = JSON.parse(sessionStorage.getItem(GUEST_KEY) || '[]').filter((i) => pr(i.product_id));
  } catch (e) {
    db.guest = [];
  }
}
