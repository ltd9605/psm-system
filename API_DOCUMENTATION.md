# PSM System - API Documentation

Tài liệu này mô tả các endpoint đang được khai báo trong backend hiện tại.

## Quy ước chung

- Base URL: `http://localhost:3000/api`
- Header xác thực:

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

- Trạng thái sản phẩm:
  - `ACTIVE`: khách hàng và nhân viên có thể xem.
  - `INACTIVE`: chỉ dùng để ẩn/hiện trong quản trị; không hiển thị ở catalog public.
  - `DELETED`: xóa mềm; không được trả về cho catalog public hoặc endpoint quản trị sản phẩm.
- Trạng thái đơn hàng: `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`.
- Các lỗi nghiệp vụ thường trả JSON dạng:

```json
{
  "message": "Nội dung lỗi"
}
```

---

## 1. Authentication

| Endpoint | Method | Quyền | Mô tả |
| :--- | :--- | :--- | :--- |
| `/api/auth/customer/register` | `POST` | Public | Đăng ký khách hàng. Body: `fullName`, `username`, `password`, `phone`, `email`, `address`. |
| `/api/auth/customer/login` | `POST` | Public | Khách hàng đăng nhập. Body: `username`, `password`. |
| `/api/auth/employee/login` | `POST` | Public | Nhân viên/quản lý/admin đăng nhập. Body: `username`, `password`. |

Response đăng nhập có `token` và `user`.

---

## 2. Brands

| Endpoint | Method | Quyền | Mô tả |
| :--- | :--- | :--- | :--- |
| `/api/brands` | `GET` | Public | Danh sách hãng. Query: `search`, `status`. |
| `/api/brands/:id` | `GET` | Public | Chi tiết hãng. |
| `/api/brands` | `POST` | Manager/Admin | Tạo hãng. |
| `/api/brands/:id` | `PUT` | Manager/Admin | Cập nhật hãng. |
| `/api/brands/:id` | `DELETE` | Manager/Admin | Xóa hãng. |

---

## 3. Products

### Catalog public

| Endpoint | Method | Quyền | Mô tả |
| :--- | :--- | :--- | :--- |
| `/api/products` | `GET` | Public | Danh sách sản phẩm `ACTIVE`. Query: `search`, `minPrice`, `maxPrice`, `brandId`, `limit` (1-100, mặc định 10), `offset` (mặc định 0). |
| `/api/products/:id/quantity` | `GET` | Public | Kiểm tra tồn kho. Query tùy chọn: `quantity`. |

`GET /api/products` không trả về sản phẩm `INACTIVE` hoặc `DELETED`.

### Quản trị sản phẩm

| Endpoint | Method | Quyền | Mô tả |
| :--- | :--- | :--- | :--- |
| `/api/products/admin` | `GET` | Admin | Danh sách sản phẩm `ACTIVE` và `INACTIVE`; không trả về `DELETED`. Query giống catalog public. |
| `/api/products` | `POST` | Manager/Admin | Tạo sản phẩm mới, mặc định `ACTIVE`. |
| `/api/products/:id` | `PATCH` | Manager/Admin | Cập nhật sản phẩm hoặc đổi trạng thái `ACTIVE`/`INACTIVE`. Không sửa được sản phẩm `DELETED`. |
| `/api/products/:id` | `DELETE` | Manager/Admin | Xóa mềm bằng cách chuyển trạng thái sang `DELETED`. Sản phẩm không còn xuất hiện trên frontend. |

Body tạo/cập nhật sản phẩm:

```json
{
  "brandId": 1,
  "name": "iPhone 14 Pro Max",
  "storage": "256GB",
  "color": "Tím",
  "description": "Mô tả sản phẩm",
  "price": 25000000,
  "quantity": 10,
  "imageUrl": "https://example.com/phone.jpg",
  "status": "ACTIVE"
}
```

---

## 4. Customers, Cart và Checkout

| Endpoint | Method | Quyền | Mô tả |
| :--- | :--- | :--- | :--- |
| `/api/customers` | `GET` | Admin | Danh sách khách hàng. Query: `search`, `limit`, `offset`. |
| `/api/customers/:id` | `GET` | Đã đăng nhập | Chi tiết khách hàng. |
| `/api/customers` | `POST` | Public | Tạo khách hàng. |
| `/api/customers/:id` | `PUT` | Đã đăng nhập | Cập nhật thông tin khách hàng. |
| `/api/customers/:id` | `DELETE` | Admin | Xóa khách hàng. |
| `/api/customers/:id/cart` | `GET` | Đã đăng nhập | Xem giỏ hàng và `total_amount`. |
| `/api/customers/:id/cart` | `POST` | Đã đăng nhập | Thêm sản phẩm. Body: `productId`, `quantity`. |
| `/api/customers/:id/cart/:productId` | `PUT` | Đã đăng nhập | Cập nhật số lượng. Body: `quantity`. |
| `/api/customers/:id/cart/:productId` | `DELETE` | Đã đăng nhập | Xóa sản phẩm khỏi giỏ. |
| `/api/customers/:id/checkout` | `POST` | Đã đăng nhập | Tạo đơn từ giỏ và trừ tồn kho. Body: `shipping_address`. |
| `/api/customers/:id/orders` | `GET` | Đã đăng nhập | Danh sách đơn hàng. Query tùy chọn: `status`. |
| `/api/customers/:id/orders/:orderId` | `GET` | Đã đăng nhập | Chi tiết đơn và danh sách `items`. |
| `/api/customers/:id/orders/:orderId/cancel` | `PUT` | Đã đăng nhập | Khách chỉ hủy được đơn `PENDING`; tự động hoàn tồn kho. Bắt buộc body `cancel_reason`. |

Body hủy đơn:

```json
{
  "cancel_reason": "Đặt nhầm sản phẩm"
}
```

Lý do hủy được lưu tại `orders.cancel_reason` và trả về trong danh sách/chi tiết đơn hàng.

---

## 5. Employees

| Endpoint | Method | Quyền | Mô tả |
| :--- | :--- | :--- | :--- |
| `/api/employees` | `GET` | Admin | Danh sách nhân viên. Query: `search`, `status`, `roleId`, `limit`, `offset`. |
| `/api/employees/:id` | `GET` | Admin | Chi tiết nhân viên. |
| `/api/employees` | `POST` | Admin | Tạo nhân viên, mật khẩu được băm. |
| `/api/employees/:id` | `PUT` | Admin | Cập nhật nhân viên. |
| `/api/employees/:id` | `DELETE` | Admin | Khóa mềm bằng `status = INACTIVE`. |

---

## 6. Orders và POS

| Endpoint | Method | Quyền | Mô tả |
| :--- | :--- | :--- | :--- |
| `/api/orders` | `GET` | Employee+ | Danh sách đơn. Query: `search`, `status`, `customerId`, `employeeId`, `limit`, `offset`. |
| `/api/orders/stats` | `GET` | Manager/Admin | Thống kê đơn hàng/doanh thu. Query tùy chọn: `startDate`, `endDate`. |
| `/api/orders/:id` | `GET` | Đã đăng nhập | Chi tiết đơn và `items`. |
| `/api/orders` | `POST` | Employee+ | Tạo đơn POS. Backend kiểm tra tồn kho và tự tính `total_amount` từ giá trong database. |
| `/api/orders/:id` | `PUT` | Employee+ | Cập nhật đơn. Khi chuyển `CANCELLED` bắt buộc có `cancel_reason`. |
| `/api/orders/:id/approve` | `PUT` | Employee+ | Duyệt đơn sang `CONFIRMED`. |
| `/api/orders/:id/complete` | `PUT` | Employee+ | Hoàn thành đơn và tự tạo hóa đơn. |
| `/api/orders/:id/cancel` | `PUT` | Employee+ | Hủy đơn, bắt buộc có `cancel_reason`. |
| `/api/orders/:id` | `DELETE` | Admin | Xóa vĩnh viễn đơn hàng. |

Body tạo đơn POS:

```json
{
  "customer_id": 1,
  "customer_name": "Nguyễn Văn A",
  "customer_phone": "0900000000",
  "shipping_address": "Mua tại quầy",
  "items": [
    { "product_id": 12, "quantity": 2 },
    { "product_id": 18, "quantity": 1 }
  ]
}
```

`items` bắt buộc có ít nhất một phần tử. Giá, thành tiền từng dòng và tổng tiền được lấy/tính từ dữ liệu sản phẩm trong database; không tin giá do frontend gửi lên.

Body nhân viên hủy đơn:

```json
{
  "cancel_reason": "Khách yêu cầu hủy đơn"
}
```

---

## 7. Invoices

| Endpoint | Method | Quyền | Mô tả |
| :--- | :--- | :--- | :--- |
| `/api/invoices` | `GET` | Employee+ | Danh sách hóa đơn. Query: `search`, `orderId`, `employeeId`, `startDate`, `endDate`, `limit`, `offset`. |
| `/api/invoices/:id` | `GET` | Employee+ | Chi tiết hóa đơn. |
| `/api/invoices` | `POST` | Employee+ | Tạo hóa đơn. |
| `/api/invoices/:id` | `PUT` | Manager/Admin | Cập nhật hóa đơn. |
| `/api/invoices/:id` | `DELETE` | Manager/Admin | Xóa hóa đơn. |

---

## 8. Cập nhật database hiện có

Nếu database đã được tạo trước khi bổ sung lý do hủy, chạy một lần:

```sql
ALTER TABLE orders
ADD COLUMN cancel_reason VARCHAR(255);
```
