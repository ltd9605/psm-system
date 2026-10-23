function vProduct(id) {
  const p = pr(id);
  if (!p || p.status != 'active' && !isManager())
    return `<div class="empty">Không tìm thấy sản phẩm.<br>
    <br>
    <a class="pri" style="display:inline-block" href="index.html">Về cửa hàng</a>
    </div>`;
  const im = imgs(p),
    sp = [
      [
        'Hãng',
        brand(p.brand_id)
      ],
      ['Dung lượng', p.storage],
      ['Màu sắc', p.p_color],
      ...specsOf(p)
    ],
    rel = db.products.filter(x => x.brand_id == p.brand_id && x.id != id && x.status == 'active').slice(0, 4),
    o = p.quantity <= 0 ? 'disabled' : '';
  return `<div class="crumb">
    <a href="index.html">Trang chủ</a> › <a href="index.html" onclick="goBrand(${ p.brand_id });return false">${ esc(brand(p.brand_id)) }</a> › ${ esc(p.name) }</div>
<div class="pg2">
    <div>
    <div class="mi">
    <img id="mi" src="${ im[0] }" alt="${ esc(p.name) }">
    </div>
    <div class="th">${ im.map((s, i) => `<button class="${ i ? '' : 'on' }" onclick="setGi(${ i })" aria-label="Ảnh ${ i + 1 }">
    <img src="${ s }" alt="">
    </button>`).join('') }</div>
    </div>
<div>
    <h1 style="font-size:26px">${ esc(p.name) } ${ p.storage }</h1>
    <div style="color:var(--mute)">★ ${ rate(p) } · ${ p.id * 37 + 120 } đánh giá · ${ esc(brand(p.brand_id)) }</div>
    <div class="pr" style="font-size:30px;font-weight:800;color:var(--bad);margin:10px 0">${ money(p.price) } <span class="old" style="font-size:16px">${ money(oldP(p)) }</span> <span class="tag bad">-${ disc(p) }%</span>
    </div>
    <div>${ stock(p) || '<span class="tag ok">Còn hàng</span>' }</div>
    <p>${ esc(p.description) }</p>
<div class="bar">
    <span class="qty">
    <button onclick="pqc(-1)" aria-label="Giảm">−</button>
    <b id="pqv">1</b>
    <button onclick="pqc(1)" aria-label="Tăng">+</button>
    </span>
    </div>
    <div class="row" style="justify-content:flex-start">
    <button class="pri" ${ o } onclick="addN(${ id },1)">Mua ngay</button>
    <button class="ghost" ${ o } onclick="addN(${ id })">Thêm vào giỏ</button>
    </div>
<ul class="bn">
    <li>Bảo hành chính hãng 12 tháng</li>
    <li>Trả góp 0% duyệt nhanh trong 15 phút</li>
    <li>Đổi mới trong 30 ngày nếu lỗi nhà sản xuất</li>
    <li>Giao nhanh 2 giờ nội thành TP.HCM</li>
    </ul>
    </div>
    </div>
<div class="card" style="margin-top:22px">
    <h3>Thông số kỹ thuật</h3>
    <div class="scroll sp">
    <table>${ sp.map(r => `<tr>
    <td>${ esc(r[0]) }</td>
    <td>${ esc(r[1]) }</td>
    </tr>`).join('') }</table>
    </div>
    </div>
${ rel.length ? `<h2 style="margin-top:24px">Sản phẩm cùng hãng</h2>
    <div class="grid">${ rel.map(pcard).join('') }</div>` : '' }`;
}

function setGi(i) {
  const p = pr(+cur().slice(10));
  $('#mi').src = imgs(p)[i];
  document.querySelectorAll('.th button').forEach((b, j) => b.classList.toggle('on', j == i));
}

function pqc(d) {
  const p = pr(+cur().slice(10));
  pq = Math.max(1, Math.min(Math.max(1, p.quantity), pq + d));
  $('#pqv').textContent = pq;
}

boot(() => vProduct(+new URLSearchParams(location.search).get('id')));

async function addN(id, go) {
  const q = cartQty(id) + pq;
  if (q > pr(id).quantity) return toast('Chỉ còn ' + pr(id).quantity + ' sản phẩm trong kho');
  if (!(await cartSet(id, q))) return;
  header();
  go ? nav('#/cart') : drawer(1);
}
