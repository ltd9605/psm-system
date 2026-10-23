function vAccount() {
  if (ses.t == 'e') {
    const m = me();
    const roleName = m.role_name || m.role || db.roles.find(r => r.id == m.role_id)?.name || roleOf(m);
    return `<h2>Tài khoản nhân viên</h2>
    <div class="card">
    <b>${ esc(m.full_name) }</b>
    <br><span style="color:var(--mute)">${ esc(m.username) }</span>
    <br>${ esc(roleName) } · ${ esc(m.phone) }</div>`;
  }
  const m = me(),
    os = db.orders.filter(o => o.customer_id == m.id).reverse();
  return `<div class="two">
    <div>
    <h2>Đơn hàng của tôi</h2>${ os.length ? `<div class="card">${ os.map(o => `<div class="line">
    <div class="g">
    <b>${ o.order_code }</b> ${ stag(o.status) }<br>
    <small style="color:var(--mute)">${ o.created_at }</small>${ o.status == 'cancelled' && o.cancel_reason ? `<br><small>Lý do hủy: ${ esc(o.cancel_reason) }</small>` : '' }
    </div>
    <b>${ money(o.total_amount) }</b>
    <button class="ghost sm" onclick="detail(${ o.id })">Chi tiết</button>${ o.status == 'pending' ? `<button class="dng sm" onclick="cancelOrderPopup(${ o.id })">Hủy</button>` : '' }</div>`).join('') }</div>` : '<div class="empty">Bạn chưa có đơn hàng nào.</div>' }
<h2 style="margin-top:22px">Yêu cầu hỗ trợ</h2>
    <div class="card">${ db.tickets.filter(t => t.customer_id == m.id).map(t => `<div class="line">
    <div class="g">
    <b>${ esc(t.topic) }</b>
    <br>
    <small style="color:var(--mute)">${ esc(t.message) }</small>
    </div>
    <span class="tag ${ t.done ? 'ok' : 'warn' }">${ t.done ? 'Đã xử lý' : 'Đang chờ' }</span>
    </div>`).join('') || '<div class="empty">Chưa có yêu cầu nào.</div>' }</div>
    </div>
<div class="card">
    <h3>Thông tin cá nhân</h3>
    <div class="fg">
    <label>Họ tên<input id="p1" value="${ esc(m.full_name) }">
    </label>
    <label>Số điện thoại<input id="p2" value="${ esc(m.phone) }">
    </label>
    <label>Email<input id="p3" value="${ esc(m.email) }">
    </label>
    <label>Địa chỉ<textarea id="p4">${ esc(m.address) }</textarea>
    </label>
    </div>
    <button class="pri" onclick="saveProfile()">Lưu thay đổi</button>
    </div>
    </div>`;
}

boot(vAccount);

async function saveProfile() {
  const u = await act(() => S.profileSave({
    full_name: $('#p1').value,
    phone: $('#p2').value,
    email: $('#p3').value,
    address: $('#p4').value,
  }));
  if (!u) return;
  CUR = u;
  header();
  toast('Đã lưu thông tin');
}
