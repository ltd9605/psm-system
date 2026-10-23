function vPos() {
  const L = db.products.filter(p => p.status == 'active' && p.quantity > 0 && (p.name + brand(p.brand_id)).toLowerCase().includes(posQ.toLowerCase())),
    total = pos.reduce((s, i) => s + pr(i.id).price * i.q, 0);
  return `<h2>Bán hàng tại quầy</h2>
    <div class="two">
    <div>
    <div class="bar">
    <input class="big" id="pq" placeholder="Tìm sản phẩm…" value="${ esc(posQ) }" oninput="posQ=this.value;posList()">
    </div>
    <div id="pg" class="grid">${ posGrid(L) }</div>
    </div>
<div class="card">
    <h3>Hóa đơn</h3>${ pos.map(i => {
    const p = pr(i.id);
    return `<div class="line">
    <div class="g">
    <b>${ esc(p.name) }</b>
    <br>
    <small style="color:var(--mute)">${ money(p.price) }</small>
    </div>
    <span class="qty">
    <button onclick="posQty(${ i.id },-1)">−</button>${ i.q }<button onclick="posQty(${ i.id },1)">+</button>
    </span>
    </div>`;
  }).join('') || '<div class="empty">Chọn sản phẩm để thêm vào hóa đơn.</div>' }
<div class="fg" style="margin-top:12px">
    <label>Tên khách<input id="s1" placeholder="Khách lẻ" value="${ esc(posCus.name) }" oninput="posCus.name=this.value">
    </label>
    <label>Số điện thoại<input id="s2" value="${ esc(posCus.phone) }" oninput="posCus.phone=this.value">
    </label>
    </div>
    <div class="tot">
    <span>Thanh toán</span>
    <span>${ money(total) }</span>
    </div>
    <button class="pri" style="width:100%" ${ pos.length ? '' : 'disabled' } onclick="posPay()">Thanh toán và xuất hóa đơn</button>
    </div>
    </div>`;
}

const posGrid = L => L.map(p => `<div class="card pc" style="cursor:pointer" onclick="posAdd(${ p.id })">${ ph(p) }<div class="nm">${ esc(p.name) }</div>
    <div class="meta">${ p.storage } · ${ esc(p.p_color) } · Kho ${ p.quantity }</div>
    <div class="pr">${ money(p.price) }</div>
    </div>`).join('') || '<div class="empty">Không có sản phẩm</div>';

const posList = () => {
  $('#pg').innerHTML = posGrid(db.products.filter(p => p.status == 'active' && p.quantity > 0 && (p.name + brand(p.brand_id)).toLowerCase().includes(posQ.toLowerCase())));
};

function posAdd(id) {
  const r = pos.find(i => i.id == id);
  if ((r ? r.q : 0) >= pr(id).quantity)
    return toast('Không đủ hàng trong kho');
  r ? r.q++ : pos.push({
    id,
    q: 1
  });
  render();
}

function posQty(id, d) {
  const r = pos.find(i => i.id == id);
  r.q += d;
  if (r.q > pr(id).quantity)
    r.q--;
  if (r.q <= 0)
    pos = pos.filter(i => i !== r);
  render();
}

boot(vPos);

async function posPay() {
  const o = await act(() => S.posSale({
    id: posCus.id || null,
    name: posCus.name || 'Khách lẻ',
    phone: posCus.phone || '—',
    items: pos.map((i) => ({ product_id: i.id, quantity: i.q })),
  }));
  if (!o) return;
  pos = [];
  posCus = { name: '', phone: '' };
  await loadData();
  render();
  toast('Đã bán và xuất hóa đơn' + (o.order_code ? ' cho đơn ' + o.order_code : ''));
}
