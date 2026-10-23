function vCare() {
  const m = ses?.t == 'c' ? me() : {};
  return `<div class="two">
    <div>
    <h2>Câu hỏi thường gặp</h2>
    <div class="card">
    <details>
    <summary>Chính sách bảo hành thế nào?</summary>
    <p>Bảo hành chính hãng 12 tháng. Mang máy kèm hóa đơn đến cửa hàng để được kiểm tra và xử lý.</p>
    </details>
    <details>
    <summary>Có được đổi trả không?</summary>
    <p>Đổi mới trong 30 ngày nếu máy lỗi do nhà sản xuất, còn đủ hộp và phụ kiện.</p>
    </details>
    <details>
    <summary>Bao lâu nhận được hàng?</summary>
    <p>Nội thành giao trong ngày, các tỉnh khác 2–4 ngày làm việc.</p>
    </details>
    <details>
    <summary>Cửa hàng có hỗ trợ trả góp không?</summary>
    <p>Có, trả góp 0% qua thẻ tín dụng hoặc công ty tài chính. Nhân viên sẽ tư vấn khi bạn đặt hàng.</p>
    </details>
    </div>
    <p style="color:var(--mute)">Hotline: 1900 1234 (8:00 – 21:00 hằng ngày)</p>
    </div>
<div class="card">
    <h3>Gửi yêu cầu hỗ trợ</h3>
    <div class="fg">
    <label>Họ tên<input id="t1" value="${ esc(m.full_name) }">
    </label>
    <label>Số điện thoại<input id="t2" value="${ esc(m.phone) }">
    </label>
    <label>Chủ đề<select id="t3">
    <option>Bảo hành</option>
    <option>Đổi trả</option>
    <option>Tư vấn mua máy</option>
    <option>Khiếu nại</option>
    </select>
    </label>
    <label>Nội dung<textarea id="t4"></textarea>
    </label>
    </div>
    <button class="pri" onclick="sendTicket()">Gửi yêu cầu</button>
    </div>
    </div>`;
}

boot(vCare);

async function sendTicket() {
  const name = $('#t1').value.trim();
  const phone = $('#t2').value.trim();
  const message = $('#t4').value.trim();
  if (!name || !phone || !message) return toast('Vui lòng nhập đủ họ tên, số điện thoại và nội dung');
  const r = await act(() => S.ticketSend({ name, phone, topic: $('#t3').value, message }));
  if (!r) return;
  $('#t4').value = '';
  toast('Đã gửi. Chúng tôi sẽ liên hệ bạn sớm');
}
