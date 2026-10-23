function vAuth(reg) {
  if (ses)
    return `<div class="empty">Bạn đang đăng nhập.<br>
    <br>
    <a class="pri" style="display:inline-block" href="index.html">Về cửa hàng</a>
    </div>`;
  const k = reg ? '' : `onkeydown="if(event.key=='Enter')doLogin()"`;
  return `<div class="au">
    <div class="side">
    <h2 style="font-size:28px">${ reg ? 'Tạo tài khoản PhoneHub' : 'Chào mừng trở lại' }</h2>
    <p>Theo dõi đơn hàng, lưu địa chỉ nhận hàng và nhận hỗ trợ bảo hành nhanh hơn.</p>
    </div>
    <div class="form">
    <h2>${ reg ? 'Đăng ký' : 'Đăng nhập' }</h2>
    <div class="fg" ${ k }>${ reg ? `<label>Họ tên<input id="a1" autocomplete="name">
    </label>
    <label>Tên đăng nhập<input id="a2" autocomplete="username">
    </label>
    <label>Số điện thoại<input id="a3" type="tel">
    </label>
    <label>Mật khẩu<input id="a4" type="password" autocomplete="new-password">
    </label>
    <label>Nhập lại mật khẩu<input id="a5" type="password" autocomplete="new-password">
    </label>` : `<label>Tên đăng nhập<input id="a1" autocomplete="username">
    </label>
    <label>Mật khẩu<input id="a2" type="password" autocomplete="current-password">
    </label>` }</div>
    <button class="pri" style="width:100%" onclick="${ reg ? 'doReg()' : 'doLogin()' }">${ reg ? 'Tạo tài khoản' : 'Đăng nhập' }</button>
    <p style="color:var(--mute);margin-top:14px">${ reg ? 'Đã có tài khoản? <a href="login.html" style="color:var(--acc)">Đăng nhập</a>' : 'Chưa có tài khoản? <a href="register.html" style="color:var(--acc)">Đăng ký</a><br><small>Dùng thử: khach/123 · admin/123 · nv1/123</small>' }</p>
    </div>
    </div>`;
}

boot(() => vAuth(PAGE == 'register'));

async function doReg() {
  const n = $('#a1').value.trim();
  const u = $('#a2').value.trim();
  const tel = $('#a3').value.trim();
  const p = $('#a4').value;
  if (!n || !u || !p) return toast('Vui lòng điền đủ thông tin');
  if (p != $('#a5').value) return toast('Mật khẩu nhập lại chưa khớp');
  const r = await act(async () => {
    await S.register({ full_name: n, username: u, password: p, phone: tel, email: '', address: '' });
    return true;
  });
  if (!r) return;
  await startSession();
  nav('#/');
}
