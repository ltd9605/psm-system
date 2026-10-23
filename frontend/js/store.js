function flt() {
  let L = db.products.filter(p => p.status == 'active' && (!F.brand || p.brand_id == F.brand) && (p.name + brand(p.brand_id)).toLowerCase().includes(F.q.toLowerCase()));
  if (F.price) {
    const [a, b] = F.price.split('-').map(Number);
    L = L.filter(p => p.price >= a && p.price < b);
  }
  if (F.sort)
    L.sort((a, b) => F.sort == 'asc' ? a.price - b.price : b.price - a.price);
  return L;
}

function plist() {
  const L = flt();
  return L.length ? `<div class="grid">${ L.map(pcard).join('') }</div>` : '<div class="empty">Không tìm thấy sản phẩm phù hợp. Thử bỏ bớt bộ lọc.</div>';
}

const list2 = () => {
  $('#pl').innerHTML = plist();
};

function vStore() {
  const act = db.products.filter(p => p.status == 'active'),
    fs = act.slice().sort((a, b) => disc(b) - disc(a)).slice(0, 6),
    S = [
      ['linear-gradient(120deg,#0a3cff,#7a5cff)', 'iPhone &amp; Galaxy mới về', 'Giảm đến 20% – trả góp 0%', 1],
      ['linear-gradient(120deg,#e5322d,#ff9a3d)', 'Giá sốc cuối tuần', 'Đặt hôm nay, nhận máy trong ngày', 4],
      ['linear-gradient(120deg,#0e7a5f,#1fc08a)', 'Thu cũ đổi mới', 'Trợ giá đến 3 triệu cho máy cũ', 7]
    ];
  return `<div class="ban">
    <div class="bt" id="bt">${ S.map(s => `<div class="bs" style="background:${ s[0] }">
    <div>
    <h2>${ s[1] }</h2>
    <p>${ s[2] }</p>
    <a class="cta" href="index.html" onclick="goBrand(0);return false">Mua ngay</a>
    </div>${ ph(pr(s[3]) || {}) }</div>`).join('') }</div>
    <button class="ar l" onclick="bn(-1)" aria-label="Trước">‹</button>
    <button class="ar r" onclick="bn(1)" aria-label="Sau">›</button>
    <div class="dots">${ S.map((_, i) => `<b class="${ i ? '' : 'on' }" onclick="bn(${ i }-bi)">
    </b>`).join('') }</div>
    </div>
<div class="sv">
    <div>
    <b>Giao nhanh 2 giờ</b>
    <span>Nội thành TP.HCM</span>
    </div>
    <div>
    <b>Bảo hành 12 tháng</b>
    <span>Chính hãng</span>
    </div>
    <div>
    <b>Trả góp 0%</b>
    <span>Duyệt trong 15 phút</span>
    </div>
    <div>
    <b>Đổi mới 30 ngày</b>
    <span>Nếu lỗi nhà sản xuất</span>
    </div>
    </div>
<div class="fs">
    <div class="bar">
    <h2>⚡ Giá sốc hôm nay</h2>
    <span class="cd" id="cd">
    </span>
    </div>
    <div class="fr">${ fs.map(pcard).join('') }</div>
    </div>
<h2>Danh mục</h2>
    <div class="tiles">${ db.brands.filter(b => b.status == 'active').map(b => `<button class="tile ${ F.brand == b.id ? 'on' : '' }" onclick="goBrand(${ b.id })">
    <b>${ esc(b.name) }</b>
    <span>${ act.filter(p => p.brand_id == b.id).length } sản phẩm</span>
    </button>`).join('') }</div>
<div class="bar" style="margin-top:22px">
    <h2 style="margin:0;flex:1">${ F.brand ? esc(brand(F.brand)) : 'Tất cả điện thoại' }</h2>${ F.brand ? `<button class="ghost sm" onclick="goBrand(0)">Bỏ lọc</button>` : '' }<select onchange="F.price=this.value;list2()">
    <option value="">Mọi mức giá</option>
    <option value="0-8000000" ${ F.price == '0-8000000' ? 'selected' : '' }>Dưới 8 triệu</option>
    <option value="8000000-20000000" ${ F.price == '8000000-20000000' ? 'selected' : '' }>8 – 20 triệu</option>
    <option value="20000000-999999999" ${ F.price == '20000000-999999999' ? 'selected' : '' }>Trên 20 triệu</option>
    </select>
    <select onchange="F.sort=this.value;list2()">
    <option value="">Sắp xếp</option>
    <option value="asc" ${ F.sort == 'asc' ? 'selected' : '' }>Giá tăng dần</option>
    <option value="desc" ${ F.sort == 'desc' ? 'selected' : '' }>Giá giảm dần</option>
    </select>
    </div>
    <div id="pl">${ plist() }</div>`;
}

function bn(d) {
  const t = $('#bt');
  if (!t)
    return;
  bi = (bi + d + 3) % 3;
  t.style.transform = `translateX(-${ bi * 100 }%)`;
  document.querySelectorAll('.dots b').forEach((b, i) => b.classList.toggle('on', i == bi));
}

function tick() {
  const e = $('#cd');
  if (!e)
    return;
  const d = new Date(),
    t = new Date(d);
  t.setHours(23, 59, 59, 999);
  const s = Math.max(0, Math.floor((t - d) / 1000)),
    f = n => String(n).padStart(2, '0');
  e.innerHTML = 'Kết thúc sau <b>' + f(s / 3600 | 0) + '</b>:<b>' + f(s / 60 % 60 | 0) + '</b>:<b>' + f(s % 60) + '</b>';
}

boot(vStore, () => {
  clearInterval(tm);
  clearInterval(bt);
  bi = 0;
  if ($('#cd')) {
    tick();
    tm = setInterval(tick, 1000);
  }
  if ($('#bt'))
    bt = setInterval(() => bn(1), 5000);
});
