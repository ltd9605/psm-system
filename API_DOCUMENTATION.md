# PSM System - API Documentation

Tài liệu này mô tả chi tiết các API thực tế đang hoạt động trong dự án, dựa 100% vào mã nguồn hiện tại (Controllers, Services, Repositories). Đa số các API yêu cầu xác thực bằng Token (`Authorization: Bearer <token>`).

---

## 1. Authentication (Xác thực)
| Endpoint | Phương thức | Quyền | Mô tả |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | Đăng ký tài khoản Khách hàng. Body: `full_name`, `username`, `password`, `phone`, `email`, `address`. |
| `/api/auth/login` | `POST` | Public | Khách hàng đăng nhập. Body: `username`, `password`. |
| `/api/auth/employee-login` | `POST` | Public | Nhân viên/Quản lý/Admin đăng nhập. Body: `username`, `password`. |

---

## 2. Brands (Hãng Sản Xuất)
| Endpoint | Phương thức | Quyền | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| `/api/brands` | `GET` | Public | Lấy danh sách hãng.<br>**Query Params:**<br>- `search`: Tìm theo tên hãng (`LIKE`).<br>- `status`: Lọc theo trạng thái (vd: `ACTIVE`, `INACTIVE`). |
| `/api/brands/:id` | `GET` | Public | Lấy chi tiết 1 hãng. |
| `/api/brands` | `POST` | Manager, Admin | Thêm hãng mới. |
| `/api/brands/:id` | `PUT` | Manager, Admin | Cập nhật hãng. |
| `/api/brands/:id` | `DELETE` | Manager, Admin | Xóa hãng. |

---

## 3. Products (Sản Phẩm)
| Endpoint | Phương thức | Quyền | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| `/api/products` | `GET` | Public | Lấy danh sách sản phẩm. Trả về kèm `pagination`.<br>**Query Params:**<br>- `search`: Tìm theo `name` hoặc `description`.<br>- `minPrice`: Giá tối thiểu.<br>- `maxPrice`: Giá tối đa.<br>- `brandId`: Lọc theo ID hãng.<br>- `status`: Lọc theo trạng thái.<br>- `limit`: Số dòng mỗi trang (mặc định không giới hạn nếu không truyền).<br>- `offset`: Bắt đầu lấy từ dòng nào (mặc định 0). |
| `/api/products/:id` | `GET` | Public | Lấy chi tiết 1 sản phẩm. |
| `/api/products` | `POST` | Manager, Admin | Thêm sản phẩm mới. |
| `/api/products/:id` | `PUT` | Manager, Admin | Cập nhật thông tin sản phẩm. |
| `/api/products/:id` | `DELETE` | Manager, Admin | Xóa sản phẩm. |

---

## 4. Customers & Cart (Khách Hàng & Giỏ Hàng)
| Endpoint | Phương thức | Quyền | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| `/api/customers` | `GET` | Admin | Lấy danh sách khách hàng.<br>**Query Params:**<br>- `search`: Tìm theo `full_name`, `username`, `phone`, `email`.<br>- `limit`: Giới hạn số dòng.<br>- `offset`: Bỏ qua số dòng. |
| `/api/customers/:id` | `GET` | Customer(Self), Admin | Lấy chi tiết khách hàng. |
| `/api/customers` | `POST` | Public | Đăng ký khách hàng mới (tương tự auth). |
| `/api/customers/:id` | `PUT` | Customer(Self), Admin | Cập nhật thông tin (Tự động mã hóa Hash nếu có đổi `password`). |
| `/api/customers/:id` | `DELETE`| Admin | Xóa khách hàng. |
| `/api/customers/:id/cart` | `GET` | Customer(Self) | Xem giỏ hàng kèm tính tổng tiền (`total_amount`). |
| `/api/customers/:id/cart` | `POST` | Customer(Self) | Thêm sản phẩm. Body: `productId`, `quantity`. |
| `/api/customers/:id/cart/:productId` | `PUT` | Customer(Self) | Sửa số lượng sản phẩm. Body: `quantity`. |
| `/api/customers/:id/cart/:productId` | `DELETE` | Customer(Self) | Xóa 1 sản phẩm khỏi giỏ. |
| `/api/customers/:id/checkout` | `POST` | Customer(Self) | Đặt hàng từ giỏ (Transaction trừ tồn kho tự động). Body: `shipping_address`. |
| `/api/customers/:id/orders` | `GET` | Customer(Self) | Xem đơn hàng của mình.<br>**Query Params:**<br>- `status`: Lọc đơn theo trạng thái (PENDING, CONFIRMED...). |
| `/api/customers/:id/orders/:orderId` | `GET` | Customer(Self) | Xem chi tiết đơn hàng kèm danh sách sản phẩm đã mua. |
| `/api/customers/:id/orders/:orderId/cancel` | `PUT` | Customer(Self) | Hủy đơn (chỉ được hủy nếu đang `PENDING`, tự động hoàn tồn kho). |

---

## 5. Employees (Nhân Viên)
| Endpoint | Phương thức | Quyền | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| `/api/employees` | `GET` | Admin | Lấy danh sách nhân viên.<br>**Query Params:**<br>- `search`: Tìm theo tên, username, sđt, email.<br>- `roleId`: Lọc theo cấp bậc.<br>- `status`: Lọc theo trạng thái.<br>- `limit`: Giới hạn kết quả.<br>- `offset`: Phân trang. |
| `/api/employees/:id` | `GET` | Admin | Lấy chi tiết nhân viên. |
| `/api/employees` | `POST` | Admin | Tạo nhân viên mới. (Mật khẩu tự động băm). |
| `/api/employees/:id` | `PUT` | Admin | Cập nhật thông tin / mật khẩu. |
| `/api/employees/:id` | `DELETE`| Admin | Xóa nhân viên (Soft Delete - cập nhật `status = INACTIVE`). |

---

## 6. Orders (Đơn Hàng - NV Xử Lý)
| Endpoint | Phương thức | Quyền | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| `/api/orders` | `GET` | Employee+ | Xem danh sách đơn hàng.<br>**Query Params:**<br>- `search`: Tìm theo `order_code` hoặc `customer_name`.<br>- `status`: Lọc trạng thái.<br>- `customerId`: Lọc theo ID khách.<br>- `employeeId`: Lọc theo NV xử lý.<br>- `startDate`: Lọc từ ngày (so sánh `>= created_at`).<br>- `endDate`: Lọc đến ngày (so sánh `<= created_at`).<br>- `limit` & `offset`: Phân trang. |
| `/api/orders/stats` | `GET` | Manager, Admin | Xem thống kê tổng doanh thu, số đơn hàng, số khách hàng, tổng sản phẩm. <br>**Query Params:**<br>- `startDate`, `endDate`, `status`. |
| `/api/orders/:id` | `GET` | Employee+ | Xem chi tiết 1 đơn hàng (kèm danh sách `items`). |
| `/api/orders` | `POST` | Employee+ | Tạo đơn thủ công. |
| `/api/orders/:id` | `PUT` | Employee+ | Cập nhật tự do (Tự động cập nhật `confirmed_at`, `completed_at`, `cancelled_at`). |
| `/api/orders/:id/approve` | `PUT` | Employee+ | Duyệt đơn (Gắn `employee_id` và đổi sang `CONFIRMED`). |
| `/api/orders/:id/complete`| `PUT` | Employee+ | Hoàn thành đơn (Đổi sang `COMPLETED`, **Tự động sinh Hóa đơn**). |
| `/api/orders/:id/cancel` | `PUT` | Employee+ | Hủy đơn (Hoàn tồn kho, đổi sang `CANCELLED`). |
| `/api/orders/:id` | `DELETE` | Admin | Xóa vĩnh viễn đơn hàng. |

---

## 7. Invoices (Hóa Đơn)
| Endpoint | Phương thức | Quyền | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| `/api/invoices` | `GET` | Manager, Admin | Xem danh sách hóa đơn (hiển thị kèm tên NV tạo).<br>**Query Params:**<br>- `search`: Tìm theo `invoice_code`.<br>- `orderId`: Lọc theo ID đơn hàng.<br>- `employeeId`: Lọc theo NV tạo hóa đơn.<br>- `startDate`: Lọc từ ngày (`>=`).<br>- `endDate`: Lọc đến ngày (`<=`).<br>- `limit` & `offset`: Phân trang. |
| `/api/invoices/:id` | `GET` | Manager, Admin | Xem chi tiết 1 hóa đơn. |
| `/api/invoices` | `POST` | Manager, Admin | Tạo hóa đơn (dù thường được Auto-Generate). |
| `/api/invoices/:id` | `PUT` | Manager, Admin | Cập nhật hóa đơn. |
| `/api/invoices/:id` | `DELETE`| Manager, Admin | Xóa hóa đơn. |
