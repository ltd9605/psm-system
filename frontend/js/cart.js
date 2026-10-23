

boot(vCart);

function vCart() {
  const L = cart().list.filter((i) => pr(i.product_id));
  const total = L.reduce((s, i) => s + pr(i.product_id).price * i.quantity, 0);
  const m = ses?.t == 'c' ? me() : {};
  if (!L.length) {
    return '<div class="empty">Giỏ hàng đang trống.<br><br><a class="pri" style="display:inline-block" href="index.html">Chọn điện thoại</a></div>';
  }
  return `<h2>Giỏ hàng</h2>
    <div class="two">
      <div class="card">${L.map((i) => {
        const p = pr(i.product_id);
        return `<div class="line">${ph(p, 's')}<div class="g"><b>${esc(p.name)}</b><br><small style="color:var(--mute)">${p.storage} · ${esc(p.p_color)} · ${money(p.price)}</small></div><span class="qty"><button onclick="qtyCart(${p.id},-1)">−</button>${i.quantity}<button onclick="qtyCart(${p.id},1)">+</button></span><b style="width:120px;text-align:right">${money(p.price * i.quantity)}</b><button class="ghost sm" onclick="delCart(${p.id})">Xóa</button></div>`;
      }).join('')}</div>
      <div class="card">
        <h3>Thông tin nhận hàng</h3>
        ${ses?.t == 'c'
          ? `<p style="color:var(--mute)">${esc(m.full_name)} · ${esc(m.phone)}</p><div class="fg"><label>Địa chỉ giao hàng<textarea id="c3">${esc(m.address)}</textarea></label></div>`
          : '<p style="color:var(--mute)">Bạn cần đăng nhập để đặt hàng. Giỏ hàng sẽ được giữ lại.</p>'}
        <div class="tot"><span>Tổng cộng</span><span>${money(total)}</span></div>
        <button class="pri" style="width:100%" onclick="checkout()">${ses?.t == 'c' ? 'Đặt hàng' : 'Đăng nhập để đặt hàng'}</button>
      </div>
    </div>`;
}

// API checkout chỉ nhận shipping_address; tên và số điện thoại lấy từ hồ sơ khách hàng
async function checkout() {
  if (ses?.t != 'c') return nav('#/login');
  const address = $('#c3').value.trim();
  if (!address) return toast('Vui lòng nhập địa chỉ nhận hàng');
  const res = await act(() => S.cart.checkout(address));
  if (!res) return;
  await loadData();
  const code = objOf(res).order_code || objOf(res).order?.order_code;
  modal(`<h3>Đặt hàng thành công</h3><p>${code ? `Mã đơn <b>${esc(code)}</b>. ` : ''}Cửa hàng sẽ liên hệ xác nhận qua số điện thoại trong hồ sơ của bạn.</p><div class="row"><button class="pri" onclick="closeM();nav('#/account')">Xong</button></div>`);
  render();
}
