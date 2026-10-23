-- ==========================================
-- RESET DATABASE CHỈ DÀNH CHO DEV/TEST - MẤT DỮ LIỆU CŨ
-- ==========================================
USE psm_system;
ALTER DATABASE psm_system CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `cart_items`;
TRUNCATE TABLE `carts`;
TRUNCATE TABLE `invoices`;
TRUNCATE TABLE `order_items`;
TRUNCATE TABLE `orders`;
TRUNCATE TABLE `products`;
TRUNCATE TABLE `brands`;
TRUNCATE TABLE `customers`;
TRUNCATE TABLE `employees`;
TRUNCATE TABLE `roles`;
ALTER TABLE `psm_system`.`products` MODIFY `description` TEXT;
SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================
-- DỮ LIỆU DEMO ĐIỆN THOẠI - CẬP NHẬT 23/10/2026
-- 60 biến thể sản phẩm, 5 thương hiệu, các mẫu ra mắt 2025-2026.
-- Giá, số lượng tồn kho và giao dịch là DỮ LIỆU GIẢ LẬP cho mục đích test; không phải báo giá thực tế.
-- image_url là URL ảnh trực tiếp (HTTPS), lấy từ trang hãng/nhà bán/CDN công khai.
-- URL bên thứ ba có thể thay đổi hoặc chặn hotlink trong tương lai; kiểm tra định kỳ trước khi deploy.
-- CẢNH BÁO: Script sẽ TRUNCATE dữ liệu hiện có. Chỉ chạy trong môi trường development/test.
-- ==========================================

INSERT INTO `roles` (`name`) VALUES
('ADMIN'),
('EMPLOYEE'),
('CUSTOMER'),
('MANAGER');

INSERT INTO `brands` (`name`, `description`, `status`) VALUES
('Apple', 'iPhone chạy iOS, nổi bật ở chip Apple silicon, hệ sinh thái và tính năng quyền riêng tư.', 'ACTIVE'),
('Samsung', 'Galaxy S, Galaxy Z và Galaxy A với màn hình AMOLED, camera, Galaxy AI và điện thoại gập.', 'ACTIVE'),
('Xiaomi', 'Xiaomi và Redmi với camera Leica trên dòng flagship, HyperOS và nhiều phân khúc giá.', 'ACTIVE'),
('Oppo', 'OPPO Find và Reno, tập trung nhiếp ảnh Hasselblad, SUPERVOOC và ColorOS.', 'ACTIVE'),
('Vivo', 'vivo X và V với hệ thống camera ZEISS, chụp chân dung, pin lớn và OriginOS.', 'ACTIVE');

INSERT INTO `employees` (`full_name`, `username`, `password`, `phone`, `status`, `role_id`) VALUES
('Nhân viên 1', 'emp1', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', '0902000001', 'ACTIVE', 1),
('Nhân viên 2', 'emp2', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', '0902000002', 'ACTIVE', 1),
('Nhân viên 3', 'emp3', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', '0902000003', 'ACTIVE', 2),
('Nhân viên 4', 'emp4', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', '0902000004', 'ACTIVE', 2),
('Nhân viên 5', 'emp5', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', '0902000005', 'ACTIVE', 2),
('Nhân viên 6', 'emp6', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', '0902000006', 'ACTIVE', 2),
('Nhân viên 7', 'emp7', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', '0902000007', 'ACTIVE', 2),
('Nhân viên 8', 'emp8', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', '0902000008', 'ACTIVE', 2),
('Nhân viên 9', 'emp9', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', '0902000009', 'ACTIVE', 2),
('Nhân viên 10', 'emp10', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', '0902000010', 'ACTIVE', 2),
('Nhân viên 11', 'emp11', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', '0902000011', 'ACTIVE', 2),
('Nhân viên 12', 'emp12', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', '0902000012', 'ACTIVE', 2),
('Nhân viên 13', 'emp13', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', '0902000013', 'ACTIVE', 2),
('Nhân viên 14', 'emp14', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', '0902000014', 'ACTIVE', 2),
('Nhân viên 15', 'emp15', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', '0902000015', 'ACTIVE', 2),
('Nhân viên 16', 'emp16', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', '0902000016', 'ACTIVE', 2),
('Nhân viên 17', 'emp17', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', '0902000017', 'ACTIVE', 2),
('Nhân viên 18', 'emp18', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', '0902000018', 'ACTIVE', 2),
('Nhân viên 19', 'emp19', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', '0902000019', 'ACTIVE', 2),
('Nhân viên 20', 'emp20', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', '0902000020', 'ACTIVE', 2);

INSERT INTO `customers` (`full_name`, `username`, `phone`, `password`, `email`, `address`) VALUES
('Khách hàng 1', 'cust1', '0912000001', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', 'cust1@gmail.com', 'Số 1 Đường ABC, Quận 6, TP.HCM'),
('Khách hàng 2', 'cust2', '0912000002', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', 'cust2@gmail.com', 'Số 2 Đường ABC, Quận 11, TP.HCM'),
('Khách hàng 3', 'cust3', '0912000003', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', 'cust3@gmail.com', 'Số 3 Đường ABC, Quận 3, TP.HCM'),
('Khách hàng 4', 'cust4', '0912000004', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', 'cust4@gmail.com', 'Số 4 Đường ABC, Quận 10, TP.HCM'),
('Khách hàng 5', 'cust5', '0912000005', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', 'cust5@gmail.com', 'Số 5 Đường ABC, Quận 3, TP.HCM'),
('Khách hàng 6', 'cust6', '0912000006', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', 'cust6@gmail.com', 'Số 6 Đường ABC, Quận 7, TP.HCM'),
('Khách hàng 7', 'cust7', '0912000007', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', 'cust7@gmail.com', 'Số 7 Đường ABC, Quận 8, TP.HCM'),
('Khách hàng 8', 'cust8', '0912000008', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', 'cust8@gmail.com', 'Số 8 Đường ABC, Quận 8, TP.HCM'),
('Khách hàng 9', 'cust9', '0912000009', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', 'cust9@gmail.com', 'Số 9 Đường ABC, Quận 10, TP.HCM'),
('Khách hàng 10', 'cust10', '0912000010', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', 'cust10@gmail.com', 'Số 10 Đường ABC, Quận 3, TP.HCM'),
('Khách hàng 11', 'cust11', '0912000011', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', 'cust11@gmail.com', 'Số 11 Đường ABC, Quận 6, TP.HCM'),
('Khách hàng 12', 'cust12', '0912000012', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', 'cust12@gmail.com', 'Số 12 Đường ABC, Quận 5, TP.HCM'),
('Khách hàng 13', 'cust13', '0912000013', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', 'cust13@gmail.com', 'Số 13 Đường ABC, Quận 8, TP.HCM'),
('Khách hàng 14', 'cust14', '0912000014', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', 'cust14@gmail.com', 'Số 14 Đường ABC, Quận 12, TP.HCM'),
('Khách hàng 15', 'cust15', '0912000015', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', 'cust15@gmail.com', 'Số 15 Đường ABC, Quận 7, TP.HCM'),
('Khách hàng 16', 'cust16', '0912000016', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', 'cust16@gmail.com', 'Số 16 Đường ABC, Quận 10, TP.HCM'),
('Khách hàng 17', 'cust17', '0912000017', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', 'cust17@gmail.com', 'Số 17 Đường ABC, Quận 6, TP.HCM'),
('Khách hàng 18', 'cust18', '0912000018', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', 'cust18@gmail.com', 'Số 18 Đường ABC, Quận 9, TP.HCM'),
('Khách hàng 19', 'cust19', '0912000019', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', 'cust19@gmail.com', 'Số 19 Đường ABC, Quận 1, TP.HCM'),
('Khách hàng 20', 'cust20', '0912000020', '$2b$10$rzSp2Hmc8xdbg0XWqrzQJut1.NOjOyAlD/EO5wU66s0iyBiqKzNUS', 'cust20@gmail.com', 'Số 20 Đường ABC, Quận 10, TP.HCM');

INSERT INTO `products` (`brand_id`, `name`, `storage`, `p_color`, `description`, `price`, `quantity`, `status`, `image_url`) VALUES
(1, 'iPhone 18 Pro Max - Đỏ Burgundy', '256GB', 'Đỏ Burgundy', 'Flagship 2026 của Apple với chip A20 Pro, camera Fusion 48MP có khẩu độ thay đổi, ProMotion 120Hz và Apple Intelligence. Phiên bản 256GB, màu Đỏ Burgundy.', 41999000, 25, 'ACTIVE', 'https://static.iphoned.nl/orca/products/31301/apple-iphone-18-pro-max.png'),
(1, 'iPhone 18 Pro Max - Đỏ Burgundy', '512GB', 'Đỏ Burgundy', 'Flagship 2026 của Apple với chip A20 Pro, camera Fusion 48MP có khẩu độ thay đổi, ProMotion 120Hz và Apple Intelligence. Phiên bản 512GB, màu Đỏ Burgundy.', 48499000, 42, 'ACTIVE', 'https://static.iphoned.nl/orca/products/31301/apple-iphone-18-pro-max.png'),
(1, 'iPhone 18 Pro Max - Đỏ Burgundy', '1TB', 'Đỏ Burgundy', 'Flagship 2026 của Apple với chip A20 Pro, camera Fusion 48MP có khẩu độ thay đổi, ProMotion 120Hz và Apple Intelligence. Phiên bản 1TB, màu Đỏ Burgundy.', 61499000, 59, 'ACTIVE', 'https://static.iphoned.nl/orca/products/31301/apple-iphone-18-pro-max.png'),
(1, 'iPhone 18 Pro Max - Đỏ Burgundy', '2TB', 'Đỏ Burgundy', 'Flagship 2026 của Apple với chip A20 Pro, camera Fusion 48MP có khẩu độ thay đổi, ProMotion 120Hz và Apple Intelligence. Phiên bản 2TB, màu Đỏ Burgundy.', 80999000, 13, 'ACTIVE', 'https://static.iphoned.nl/orca/products/31301/apple-iphone-18-pro-max.png'),
(1, 'iPhone 18 Pro - Băng Thanh', '256GB', 'Băng Thanh', 'iPhone Pro 2026 với chip A20 Pro, camera Fusion 48MP có khẩu độ thay đổi, màn hình ProMotion và kết nối 5G. Phiên bản 256GB, màu Băng Thanh.', 38999000, 30, 'ACTIVE', 'https://www.mobiledokan.com/media/apple-iphone-18-pro-glacier-official-image.webp'),
(1, 'iPhone 18 Pro - Băng Thanh', '512GB', 'Băng Thanh', 'iPhone Pro 2026 với chip A20 Pro, camera Fusion 48MP có khẩu độ thay đổi, màn hình ProMotion và kết nối 5G. Phiên bản 512GB, màu Băng Thanh.', 45499000, 47, 'ACTIVE', 'https://www.mobiledokan.com/media/apple-iphone-18-pro-glacier-official-image.webp'),
(1, 'iPhone 18 Pro - Băng Thanh', '1TB', 'Băng Thanh', 'iPhone Pro 2026 với chip A20 Pro, camera Fusion 48MP có khẩu độ thay đổi, màn hình ProMotion và kết nối 5G. Phiên bản 1TB, màu Băng Thanh.', 58499000, 64, 'ACTIVE', 'https://www.mobiledokan.com/media/apple-iphone-18-pro-glacier-official-image.webp'),
(1, 'iPhone 17 Pro Max - Xanh Đậm', '256GB', 'Xanh Đậm', 'iPhone cao cấp với A19 Pro, camera Fusion 48MP, ProMotion 120Hz và hệ điều hành iOS. Phiên bản 256GB, màu Xanh Đậm.', 34990000, 18, 'ACTIVE', 'https://re.now/cdn/shop/files/OPM-3146_Apple_iPhone17ProMax_blue_image1_df5a3eed-3930-4238-a97d-6751f4318212.png?v=1768291851&width=1000'),
(1, 'iPhone 17 Pro Max - Xanh Đậm', '512GB', 'Xanh Đậm', 'iPhone cao cấp với A19 Pro, camera Fusion 48MP, ProMotion 120Hz và hệ điều hành iOS. Phiên bản 512GB, màu Xanh Đậm.', 40990000, 35, 'ACTIVE', 'https://re.now/cdn/shop/files/OPM-3146_Apple_iPhone17ProMax_blue_image1_df5a3eed-3930-4238-a97d-6751f4318212.png?v=1768291851&width=1000'),
(1, 'iPhone 17 Pro Max - Xanh Đậm', '1TB', 'Xanh Đậm', 'iPhone cao cấp với A19 Pro, camera Fusion 48MP, ProMotion 120Hz và hệ điều hành iOS. Phiên bản 1TB, màu Xanh Đậm.', 52990000, 52, 'ACTIVE', 'https://re.now/cdn/shop/files/OPM-3146_Apple_iPhone17ProMax_blue_image1_df5a3eed-3930-4238-a97d-6751f4318212.png?v=1768291851&width=1000'),
(1, 'iPhone 17 - Tím Lavender', '256GB', 'Tím Lavender', 'iPhone thế hệ 17 với chip A19, màn hình ProMotion 120Hz, camera Fusion 48MP và kết nối 5G. Phiên bản 256GB, màu Tím Lavender.', 22990000, 69, 'ACTIVE', 'https://creativehub.teliacompany.com/m/7563704398a3da5f/original/iPhone_17_Lavender_PDP_Image_Position_1__WWEN.png'),
(1, 'iPhone 17 - Tím Lavender', '512GB', 'Tím Lavender', 'iPhone thế hệ 17 với chip A19, màn hình ProMotion 120Hz, camera Fusion 48MP và kết nối 5G. Phiên bản 512GB, màu Tím Lavender.', 28490000, 23, 'ACTIVE', 'https://creativehub.teliacompany.com/m/7563704398a3da5f/original/iPhone_17_Lavender_PDP_Image_Position_1__WWEN.png'),
(2, 'Samsung Galaxy S26 Ultra - Tím Cobalt', '256GB', 'Tím Cobalt', 'Galaxy S26 Ultra với camera chính 200MP, bút S Pen, Galaxy AI và màn hình chống nhìn trộm. Phiên bản 256GB, màu Tím Cobalt.', 33990000, 40, 'ACTIVE', 'https://pdaplaza.com/cdn/shop/files/buy-samsung-galaxy-s26-ultra-5g-dual-sim-sm-s9480-12gb-256gb-cobalt-972.webp?v=1772134099&width=1000'),
(2, 'Samsung Galaxy S26 Ultra - Tím Cobalt', '512GB', 'Tím Cobalt', 'Galaxy S26 Ultra với camera chính 200MP, bút S Pen, Galaxy AI và màn hình chống nhìn trộm. Phiên bản 512GB, màu Tím Cobalt.', 38990000, 57, 'ACTIVE', 'https://pdaplaza.com/cdn/shop/files/buy-samsung-galaxy-s26-ultra-5g-dual-sim-sm-s9480-12gb-256gb-cobalt-972.webp?v=1772134099&width=1000'),
(2, 'Samsung Galaxy S26 Ultra - Tím Cobalt', '1TB', 'Tím Cobalt', 'Galaxy S26 Ultra với camera chính 200MP, bút S Pen, Galaxy AI và màn hình chống nhìn trộm. Phiên bản 1TB, màu Tím Cobalt.', 46990000, 11, 'ACTIVE', 'https://pdaplaza.com/cdn/shop/files/buy-samsung-galaxy-s26-ultra-5g-dual-sim-sm-s9480-12gb-256gb-cobalt-972.webp?v=1772134099&width=1000'),
(2, 'Samsung Galaxy S26+ - Xanh Dương', '256GB', 'Xanh Dương', 'Galaxy S26+ với màn hình AMOLED 120Hz, hệ sinh thái Galaxy AI, camera nhiều tiêu cự và kết nối 5G. Phiên bản 256GB, màu Xanh Dương.', 26990000, 28, 'ACTIVE', 'https://eurosuper.vtexassets.com/arquivos/ids/213731/image-bd3de113944047b88317adc0db73c799.jpg?v=639154311393170000'),
(2, 'Samsung Galaxy S26+ - Xanh Dương', '512GB', 'Xanh Dương', 'Galaxy S26+ với màn hình AMOLED 120Hz, hệ sinh thái Galaxy AI, camera nhiều tiêu cự và kết nối 5G. Phiên bản 512GB, màu Xanh Dương.', 30990000, 45, 'ACTIVE', 'https://eurosuper.vtexassets.com/arquivos/ids/213731/image-bd3de113944047b88317adc0db73c799.jpg?v=639154311393170000'),
(2, 'Samsung Galaxy Z Fold8 - Tím Lavender', '256GB', 'Tím Lavender', 'Điện thoại gập kiểu sách với màn hình lớn linh hoạt, đa nhiệm Galaxy AI và Snapdragon 8 Elite Gen 5 for Galaxy. Phiên bản 256GB, màu Tím Lavender.', 44990000, 62, 'ACTIVE', 'https://image.coolblue.nl/500x500/products/597576397'),
(2, 'Samsung Galaxy Z Fold8 - Tím Lavender', '512GB', 'Tím Lavender', 'Điện thoại gập kiểu sách với màn hình lớn linh hoạt, đa nhiệm Galaxy AI và Snapdragon 8 Elite Gen 5 for Galaxy. Phiên bản 512GB, màu Tím Lavender.', 48990000, 16, 'ACTIVE', 'https://image.coolblue.nl/500x500/products/597576397'),
(2, 'Samsung Galaxy Z Fold8 - Tím Lavender', '1TB', 'Tím Lavender', 'Điện thoại gập kiểu sách với màn hình lớn linh hoạt, đa nhiệm Galaxy AI và Snapdragon 8 Elite Gen 5 for Galaxy. Phiên bản 1TB, màu Tím Lavender.', 54990000, 33, 'ACTIVE', 'https://image.coolblue.nl/500x500/products/597576397'),
(2, 'Samsung Galaxy A57 5G - Đen', '128GB', 'Đen', 'Galaxy A57 tầm trung với màn hình Super AMOLED, camera chống rung OIS, kết nối 5G và sạc nhanh. Phiên bản 128GB, màu Đen.', 9490000, 50, 'ACTIVE', 'https://nova.sn/42610-large_default/samsung-galaxy-a57-5g-512-go-12-go-ram.jpg'),
(2, 'Samsung Galaxy A57 5G - Đen', '256GB', 'Đen', 'Galaxy A57 tầm trung với màn hình Super AMOLED, camera chống rung OIS, kết nối 5G và sạc nhanh. Phiên bản 256GB, màu Đen.', 11490000, 67, 'ACTIVE', 'https://nova.sn/42610-large_default/samsung-galaxy-a57-5g-512-go-12-go-ram.jpg'),
(2, 'Samsung Galaxy Z Flip8 - Xanh Mint', '256GB', 'Xanh Mint', 'Điện thoại gập vỏ sò Galaxy Z Flip8 với FlexWindow lớn, FlexCam 50MP và hỗ trợ Galaxy AI. Phiên bản 256GB, màu Xanh Mint.', 27990000, 21, 'ACTIVE', 'https://backend.paiinternational.in/media/images/1_zfJkrqc.webp'),
(2, 'Samsung Galaxy Z Flip8 - Xanh Mint', '512GB', 'Xanh Mint', 'Điện thoại gập vỏ sò Galaxy Z Flip8 với FlexWindow lớn, FlexCam 50MP và hỗ trợ Galaxy AI. Phiên bản 512GB, màu Xanh Mint.', 31990000, 38, 'ACTIVE', 'https://backend.paiinternational.in/media/images/1_zfJkrqc.webp'),
(3, 'Xiaomi 18 Pro Max - Đen', '256GB', 'Đen', 'Flagship Xiaomi 2026 với Leica dual 200MP, màn hình phụ phía sau, hiệu năng Snapdragon và HyperOS 4. Phiên bản 256GB, màu Đen.', 26990000, 55, 'ACTIVE', 'https://cdn2.cellphones.com.vn/x/media/catalog/product/d/i/dien-thoai-xiaomi-18-pro-max-2_1_1_1.jpg'),
(3, 'Xiaomi 18 Pro Max - Đen', '512GB', 'Đen', 'Flagship Xiaomi 2026 với Leica dual 200MP, màn hình phụ phía sau, hiệu năng Snapdragon và HyperOS 4. Phiên bản 512GB, màu Đen.', 30990000, 9, 'ACTIVE', 'https://cdn2.cellphones.com.vn/x/media/catalog/product/d/i/dien-thoai-xiaomi-18-pro-max-2_1_1_1.jpg'),
(3, 'Xiaomi 18 Pro Max - Đen', '1TB', 'Đen', 'Flagship Xiaomi 2026 với Leica dual 200MP, màn hình phụ phía sau, hiệu năng Snapdragon và HyperOS 4. Phiên bản 1TB, màu Đen.', 36990000, 26, 'ACTIVE', 'https://cdn2.cellphones.com.vn/x/media/catalog/product/d/i/dien-thoai-xiaomi-18-pro-max-2_1_1_1.jpg'),
(3, 'Xiaomi 18 Pro - Trắng', '256GB', 'Trắng', 'Flagship Xiaomi 18 Pro với Leica dual 200MP, màn hình phụ phía sau và HyperOS 4. Phiên bản 256GB, màu Trắng.', 22990000, 43, 'ACTIVE', 'https://www.superplanshet.ru/images/Xiaomi_18_Pro_94122.jpg'),
(3, 'Xiaomi 18 Pro - Trắng', '512GB', 'Trắng', 'Flagship Xiaomi 18 Pro với Leica dual 200MP, màn hình phụ phía sau và HyperOS 4. Phiên bản 512GB, màu Trắng.', 25990000, 60, 'ACTIVE', 'https://www.superplanshet.ru/images/Xiaomi_18_Pro_94122.jpg'),
(3, 'Xiaomi 18 Pro - Trắng', '1TB', 'Trắng', 'Flagship Xiaomi 18 Pro với Leica dual 200MP, màn hình phụ phía sau và HyperOS 4. Phiên bản 1TB, màu Trắng.', 31990000, 14, 'ACTIVE', 'https://www.superplanshet.ru/images/Xiaomi_18_Pro_94122.jpg'),
(3, 'Xiaomi 17 Ultra - Đen', '512GB', 'Đen', 'Xiaomi 17 Ultra với hệ thống camera hợp tác Leica, màn hình OLED 120Hz và sạc nhanh HyperCharge. Phiên bản 512GB, màu Đen.', 29990000, 31, 'ACTIVE', 'https://www.pbtech.co.nz/imgprod/M/P/MPHMIX03117110__1.jpg'),
(3, 'Xiaomi 17 Ultra - Đen', '1TB', 'Đen', 'Xiaomi 17 Ultra với hệ thống camera hợp tác Leica, màn hình OLED 120Hz và sạc nhanh HyperCharge. Phiên bản 1TB, màu Đen.', 35990000, 48, 'ACTIVE', 'https://www.pbtech.co.nz/imgprod/M/P/MPHMIX03117110__1.jpg'),
(3, 'Redmi Note 15 Pro+ 5G - Nâu Mocha', '256GB', 'Nâu Mocha', 'Dòng Redmi Note cao cấp với kết nối 5G, màn hình AMOLED, camera độ phân giải cao và pin lớn. Phiên bản 256GB, màu Nâu Mocha.', 10990000, 65, 'ACTIVE', 'https://rimage.ripley.com.pe/home.ripley/Attachment/MKP/5258/PMP20001310769/full_image-1.jpeg'),
(3, 'Redmi Note 15 Pro+ 5G - Nâu Mocha', '512GB', 'Nâu Mocha', 'Dòng Redmi Note cao cấp với kết nối 5G, màn hình AMOLED, camera độ phân giải cao và pin lớn. Phiên bản 512GB, màu Nâu Mocha.', 12990000, 19, 'ACTIVE', 'https://rimage.ripley.com.pe/home.ripley/Attachment/MKP/5258/PMP20001310769/full_image-1.jpeg'),
(3, 'Xiaomi 17 - Xanh Dương', '256GB', 'Xanh Dương', 'Xiaomi 17 nhỏ gọn với camera Leica, màn hình LTPO AMOLED và hiệu năng Snapdragon. Phiên bản 256GB, màu Xanh Dương.', 18990000, 36, 'ACTIVE', 'https://www.stephanis.com.cy/media/products/XIA_E179BD1A09024.jpg?dimensions=1000x1000'),
(3, 'Xiaomi 17 - Xanh Dương', '512GB', 'Xanh Dương', 'Xiaomi 17 nhỏ gọn với camera Leica, màn hình LTPO AMOLED và hiệu năng Snapdragon. Phiên bản 512GB, màu Xanh Dương.', 21990000, 53, 'ACTIVE', 'https://www.stephanis.com.cy/media/products/XIA_E179BD1A09024.jpg?dimensions=1000x1000'),
(4, 'OPPO Find X10 Pro Max - Xám Titan', '256GB', 'Xám Titan', 'Flagship OPPO 2026 với ba camera Hasselblad 200MP, Dimensity 9600 Pro, màn hình LTPO và ColorOS 17. Phiên bản 256GB, màu Xám Titan.', 29990000, 70, 'ACTIVE', 'https://cdn.beebom.com/mobile/oppo-find-x10-pro-max-front-and-back3.png'),
(4, 'OPPO Find X10 Pro Max - Xám Titan', '512GB', 'Xám Titan', 'Flagship OPPO 2026 với ba camera Hasselblad 200MP, Dimensity 9600 Pro, màn hình LTPO và ColorOS 17. Phiên bản 512GB, màu Xám Titan.', 33990000, 24, 'ACTIVE', 'https://cdn.beebom.com/mobile/oppo-find-x10-pro-max-front-and-back3.png'),
(4, 'OPPO Find X10 Pro Max - Xám Titan', '1TB', 'Xám Titan', 'Flagship OPPO 2026 với ba camera Hasselblad 200MP, Dimensity 9600 Pro, màn hình LTPO và ColorOS 17. Phiên bản 1TB, màu Xám Titan.', 39990000, 41, 'ACTIVE', 'https://cdn.beebom.com/mobile/oppo-find-x10-pro-max-front-and-back3.png'),
(4, 'OPPO Find X10 - Xanh Băng', '256GB', 'Xanh Băng', 'OPPO Find X10 với hệ thống camera Hasselblad, màn hình LTPO 144Hz và ColorOS 17. Phiên bản 256GB, màu Xanh Băng.', 22990000, 58, 'ACTIVE', 'https://www.mobiledokan.com/media/oppo-find-x10-glacier-blue-official-image.webp'),
(4, 'OPPO Find X10 - Xanh Băng', '512GB', 'Xanh Băng', 'OPPO Find X10 với hệ thống camera Hasselblad, màn hình LTPO 144Hz và ColorOS 17. Phiên bản 512GB, màu Xanh Băng.', 26990000, 12, 'ACTIVE', 'https://www.mobiledokan.com/media/oppo-find-x10-glacier-blue-official-image.webp'),
(4, 'OPPO Find X9 Ultra - Trắng', '256GB', 'Trắng', 'Flagship tập trung nhiếp ảnh với hệ thống camera Hasselblad, màn hình AMOLED và sạc nhanh. Phiên bản 256GB, màu Trắng.', 25990000, 29, 'ACTIVE', 'https://i.ebayimg.com/images/g/awUAAeSwE8Zp6X9z/s-l1200.jpg'),
(4, 'OPPO Find X9 Ultra - Trắng', '512GB', 'Trắng', 'Flagship tập trung nhiếp ảnh với hệ thống camera Hasselblad, màn hình AMOLED và sạc nhanh. Phiên bản 512GB, màu Trắng.', 29990000, 46, 'ACTIVE', 'https://i.ebayimg.com/images/g/awUAAeSwE8Zp6X9z/s-l1200.jpg'),
(4, 'OPPO Find X9 Ultra - Trắng', '1TB', 'Trắng', 'Flagship tập trung nhiếp ảnh với hệ thống camera Hasselblad, màn hình AMOLED và sạc nhanh. Phiên bản 1TB, màu Trắng.', 35990000, 63, 'ACTIVE', 'https://i.ebayimg.com/images/g/awUAAeSwE8Zp6X9z/s-l1200.jpg'),
(4, 'OPPO Reno16 Pro 5G - Trắng Pop', '256GB', 'Trắng Pop', 'OPPO Reno16 Pro 5G với camera chân dung AI, selfie góc siêu rộng và ColorOS 16. Phiên bản 256GB, màu Trắng Pop.', 16990000, 17, 'ACTIVE', 'https://dmau.imgix.net/media/catalog/product/1/-/1-oppo_reno16_pro_5g_pop-white_front-back-logo-hero_4jnstuzgkm105qrn.png'),
(4, 'OPPO Reno16 Pro 5G - Trắng Pop', '512GB', 'Trắng Pop', 'OPPO Reno16 Pro 5G với camera chân dung AI, selfie góc siêu rộng và ColorOS 16. Phiên bản 512GB, màu Trắng Pop.', 19990000, 34, 'ACTIVE', 'https://dmau.imgix.net/media/catalog/product/1/-/1-oppo_reno16_pro_5g_pop-white_front-back-logo-hero_4jnstuzgkm105qrn.png'),
(4, 'OPPO Reno16 5G - Trắng Pop', '256GB', 'Trắng Pop', 'OPPO Reno16 5G với chụp ảnh AI, camera selfie góc siêu rộng và sạc nhanh SUPERVOOC. Phiên bản 256GB, màu Trắng Pop.', 12990000, 51, 'ACTIVE', 'https://images.fyndiq.se/images/f_auto/t_600x600/prod/6fd6ac82bf214875/b1a64cad97cd/smartphone-oppo-reno16-512-gb-6-32-5g'),
(4, 'OPPO Reno16 5G - Trắng Pop', '512GB', 'Trắng Pop', 'OPPO Reno16 5G với chụp ảnh AI, camera selfie góc siêu rộng và sạc nhanh SUPERVOOC. Phiên bản 512GB, màu Trắng Pop.', 15990000, 68, 'ACTIVE', 'https://images.fyndiq.se/images/f_auto/t_600x600/prod/6fd6ac82bf214875/b1a64cad97cd/smartphone-oppo-reno16-512-gb-6-32-5g'),
(5, 'vivo X300 Ultra - Trắng Snow Peak', '256GB', 'Trắng Snow Peak', 'vivo X300 Ultra với camera ZEISS, màn hình AMOLED 144Hz, hiệu năng Snapdragon và sạc nhanh 100W. Phiên bản 256GB, màu Trắng Snow Peak.', 29990000, 22, 'ACTIVE', 'https://asia-exstatic-vivofs.vivo.com/PSee2l50xoirPK7y/1776159225629/ca705be3437f29bdf6b7e5d5d842ed22.png'),
(5, 'vivo X300 Ultra - Trắng Snow Peak', '512GB', 'Trắng Snow Peak', 'vivo X300 Ultra với camera ZEISS, màn hình AMOLED 144Hz, hiệu năng Snapdragon và sạc nhanh 100W. Phiên bản 512GB, màu Trắng Snow Peak.', 33990000, 39, 'ACTIVE', 'https://asia-exstatic-vivofs.vivo.com/PSee2l50xoirPK7y/1776159225629/ca705be3437f29bdf6b7e5d5d842ed22.png'),
(5, 'vivo X300 Ultra - Trắng Snow Peak', '1TB', 'Trắng Snow Peak', 'vivo X300 Ultra với camera ZEISS, màn hình AMOLED 144Hz, hiệu năng Snapdragon và sạc nhanh 100W. Phiên bản 1TB, màu Trắng Snow Peak.', 40990000, 56, 'ACTIVE', 'https://asia-exstatic-vivofs.vivo.com/PSee2l50xoirPK7y/1776159225629/ca705be3437f29bdf6b7e5d5d842ed22.png'),
(5, 'vivo X300 Pro - Đen', '256GB', 'Đen', 'vivo X300 Pro tập trung camera ZEISS tele 200MP, hiệu năng Dimensity và OriginOS 6. Phiên bản 256GB, màu Đen.', 22990000, 10, 'ACTIVE', 'https://img.yec.tw/zp/MerchandiseImages/519754B01A-SP-21309041.jpg'),
(5, 'vivo X300 Pro - Đen', '512GB', 'Đen', 'vivo X300 Pro tập trung camera ZEISS tele 200MP, hiệu năng Dimensity và OriginOS 6. Phiên bản 512GB, màu Đen.', 26990000, 27, 'ACTIVE', 'https://img.yec.tw/zp/MerchandiseImages/519754B01A-SP-21309041.jpg'),
(5, 'vivo X300 Pro - Đen', '1TB', 'Đen', 'vivo X300 Pro tập trung camera ZEISS tele 200MP, hiệu năng Dimensity và OriginOS 6. Phiên bản 1TB, màu Đen.', 31990000, 44, 'ACTIVE', 'https://img.yec.tw/zp/MerchandiseImages/519754B01A-SP-21309041.jpg'),
(5, 'vivo X300 - Xanh Mist', '256GB', 'Xanh Mist', 'vivo X300 với camera ZEISS độ phân giải cao, màn hình AMOLED nhỏ gọn và OriginOS 6. Phiên bản 256GB, màu Xanh Mist.', 16990000, 61, 'ACTIVE', 'https://exstatic-in.vivo.com/Oz84QB3Wo0uns8j1/in/1764592213045/f852bfdeb290306ca89868f82362b63b.png_w860-h860.webp'),
(5, 'vivo X300 - Xanh Mist', '512GB', 'Xanh Mist', 'vivo X300 với camera ZEISS độ phân giải cao, màn hình AMOLED nhỏ gọn và OriginOS 6. Phiên bản 512GB, màu Xanh Mist.', 19990000, 15, 'ACTIVE', 'https://exstatic-in.vivo.com/Oz84QB3Wo0uns8j1/in/1764592213045/f852bfdeb290306ca89868f82362b63b.png_w860-h860.webp'),
(5, 'vivo V70 5G - Xám Ánh Kim', '256GB', 'Xám Ánh Kim', 'vivo V70 5G với camera chân dung ZEISS, màn hình AMOLED 120Hz, pin lớn và sạc nhanh 90W. Phiên bản 256GB, màu Xám Ánh Kim.', 15990000, 32, 'ACTIVE', 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/363464/vivo-v70-gray-1-639100364888365838.jpg'),
(5, 'vivo V70 5G - Xám Ánh Kim', '512GB', 'Xám Ánh Kim', 'vivo V70 5G với camera chân dung ZEISS, màn hình AMOLED 120Hz, pin lớn và sạc nhanh 90W. Phiên bản 512GB, màu Xám Ánh Kim.', 18990000, 49, 'ACTIVE', 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/363464/vivo-v70-gray-1-639100364888365838.jpg'),
(5, 'vivo V70 FE (8GB RAM) - Xanh Đại Dương', '256GB', 'Xanh Đại Dương', 'vivo V70 FE với camera 200MP, màn hình AMOLED, pin 7000mAh, sạc 90W và RAM 8GB. Phiên bản 256GB, màu Xanh Đại Dương.', 13990000, 66, 'ACTIVE', 'https://dwecxxryy5p59.cloudfront.net/catalogs/7/8/e/6/78e6bcb36cb23d36add3d430d8a939b030b89ba3_Screenshot_2026_04_12_143143.png'),
(5, 'vivo V70 FE (12GB RAM) - Xanh Đại Dương', '256GB', 'Xanh Đại Dương', 'vivo V70 FE với camera 200MP, màn hình AMOLED, pin 7000mAh, sạc 90W và RAM 12GB. Phiên bản 256GB, màu Xanh Đại Dương.', 15990000, 20, 'ACTIVE', 'https://dwecxxryy5p59.cloudfront.net/catalogs/7/8/e/6/78e6bcb36cb23d36add3d430d8a939b030b89ba3_Screenshot_2026_04_12_143143.png');

INSERT INTO `orders` (`order_code`, `customer_id`, `employee_id`, `customer_name`, `customer_phone`, `shipping_address`, `status`, `total_amount`) VALUES
('ORD87192', 9, 4, 'Khách hàng 9', '0912000009', 'Số 9 Quận 5, TP.HCM', 'COMPLETED', 59980000),
('ORD48484', 16, 17, 'Khách hàng 16', '0912000016', 'Số 16 Quận 11, TP.HCM', 'COMPLETED', 29990000),
('ORD28893', 1, 14, 'Khách hàng 1', '0912000001', 'Số 1 Quận 2, TP.HCM', 'COMPLETED', 53980000),
('ORD70618', 20, 19, 'Khách hàng 20', '0912000020', 'Số 20 Quận 3, TP.HCM', 'COMPLETED', 22990000),
('ORD45551', 10, 7, 'Khách hàng 10', '0912000010', 'Số 10 Quận 3, TP.HCM', 'COMPLETED', 61499000),
('ORD85003', 14, 13, 'Khách hàng 14', '0912000014', 'Số 14 Quận 11, TP.HCM', 'COMPLETED', 97970000),
('ORD12995', 13, 8, 'Khách hàng 13', '0912000013', 'Số 13 Quận 6, TP.HCM', 'COMPLETED', 15990000),
('ORD83149', 3, 2, 'Khách hàng 3', '0912000003', 'Số 3 Quận 2, TP.HCM', 'COMPLETED', 109980000),
('ORD17168', 5, 4, 'Khách hàng 5', '0912000005', 'Số 5 Quận 10, TP.HCM', 'COMPLETED', 75980000),
('ORD43307', 7, 7, 'Khách hàng 7', '0912000007', 'Số 7 Quận 9, TP.HCM', 'COMPLETED', 119998000),
('ORD52949', 10, 2, 'Khách hàng 10', '0912000010', 'Số 10 Quận 4, TP.HCM', 'COMPLETED', 79980000),
('ORD71429', 10, 6, 'Khách hàng 10', '0912000010', 'Số 10 Quận 3, TP.HCM', 'COMPLETED', 94970000),
('ORD12986', 9, 18, 'Khách hàng 9', '0912000009', 'Số 9 Quận 9, TP.HCM', 'COMPLETED', 231968000),
('ORD73895', 5, 15, 'Khách hàng 5', '0912000005', 'Số 5 Quận 12, TP.HCM', 'COMPLETED', 105960000),
('ORD99846', 5, 7, 'Khách hàng 5', '0912000005', 'Số 5 Quận 5, TP.HCM', 'COMPLETED', 101950000),
('ORD58565', 8, 16, 'Khách hàng 8', '0912000008', 'Số 8 Quận 10, TP.HCM', 'COMPLETED', 80999000),
('ORD31722', 6, 8, 'Khách hàng 6', '0912000006', 'Số 6 Quận 5, TP.HCM', 'COMPLETED', 53980000),
('ORD62030', 11, 9, 'Khách hàng 11', '0912000011', 'Số 11 Quận 10, TP.HCM', 'COMPLETED', 27990000),
('ORD49232', 15, 9, 'Khách hàng 15', '0912000015', 'Số 15 Quận 2, TP.HCM', 'COMPLETED', 29990000),
('ORD21126', 6, 16, 'Khách hàng 6', '0912000006', 'Số 6 Quận 10, TP.HCM', 'COMPLETED', 305457000),
('ORD86235', 4, 17, 'Khách hàng 4', '0912000004', 'Số 4 Quận 11, TP.HCM', 'COMPLETED', 161998000),
('ORD25568', 20, 12, 'Khách hàng 20', '0912000020', 'Số 20 Quận 5, TP.HCM', 'COMPLETED', 295900000),
('ORD82654', 7, 18, 'Khách hàng 7', '0912000007', 'Số 7 Quận 9, TP.HCM', 'COMPLETED', 33990000),
('ORD35286', 8, 1, 'Khách hàng 8', '0912000008', 'Số 8 Quận 7, TP.HCM', 'COMPLETED', 18990000),
('ORD43111', 20, 5, 'Khách hàng 20', '0912000020', 'Số 20 Quận 11, TP.HCM', 'COMPLETED', 76980000);

INSERT INTO `order_items` (`order_id`, `product_id`, `product_name`, `quantity`, `unit_price`, `subtotal`) VALUES
(1, 31, 'Xiaomi 17 Ultra - Đen', 1, 29990000, 29990000),
(1, 43, 'OPPO Find X9 Ultra - Trắng', 1, 29990000, 29990000),
(2, 43, 'OPPO Find X9 Ultra - Trắng', 1, 29990000, 29990000),
(3, 16, 'Samsung Galaxy S26+ - Xanh Dương', 2, 26990000, 53980000),
(4, 52, 'vivo X300 Pro - Đen', 1, 22990000, 22990000),
(5, 3, 'iPhone 18 Pro Max - Đỏ Burgundy', 1, 61499000, 61499000),
(6, 12, 'iPhone 17 - Tím Lavender', 2, 28490000, 56980000),
(6, 51, 'vivo X300 Ultra - Trắng Snow Peak', 1, 40990000, 40990000),
(7, 60, 'vivo V70 FE (12GB RAM) - Xanh Đại Dương', 1, 15990000, 15990000),
(8, 20, 'Samsung Galaxy Z Fold8 - Tím Lavender', 2, 54990000, 109980000),
(9, 39, 'OPPO Find X10 Pro Max - Xám Titan', 1, 39990000, 39990000),
(9, 44, 'OPPO Find X9 Ultra - Trắng', 1, 35990000, 35990000),
(10, 4, 'iPhone 18 Pro Max - Đỏ Burgundy', 1, 80999000, 80999000),
(10, 5, 'iPhone 18 Pro - Băng Thanh', 1, 38999000, 38999000),
(11, 39, 'OPPO Find X10 Pro Max - Xám Titan', 2, 39990000, 79980000),
(12, 18, 'Samsung Galaxy Z Fold8 - Tím Lavender', 1, 44990000, 44990000),
(12, 27, 'Xiaomi 18 Pro Max - Đen', 1, 36990000, 36990000),
(12, 47, 'OPPO Reno16 5G - Trắng Pop', 1, 12990000, 12990000),
(13, 3, 'iPhone 18 Pro Max - Đỏ Burgundy', 2, 61499000, 122998000),
(13, 9, 'iPhone 17 Pro Max - Xanh Đậm', 2, 40990000, 81980000),
(13, 53, 'vivo X300 Pro - Đen', 1, 26990000, 26990000),
(14, 44, 'OPPO Find X9 Ultra - Trắng', 2, 35990000, 71980000),
(14, 55, 'vivo X300 - Xanh Mist', 2, 16990000, 33980000),
(15, 31, 'Xiaomi 17 Ultra - Đen', 1, 29990000, 29990000),
(15, 35, 'Xiaomi 17 - Xanh Dương', 2, 18990000, 37980000),
(15, 55, 'vivo X300 - Xanh Mist', 2, 16990000, 33980000),
(16, 4, 'iPhone 18 Pro Max - Đỏ Burgundy', 1, 80999000, 80999000),
(17, 16, 'Samsung Galaxy S26+ - Xanh Dương', 2, 26990000, 53980000),
(18, 23, 'Samsung Galaxy Z Flip8 - Xanh Mint', 1, 27990000, 27990000),
(19, 37, 'OPPO Find X10 Pro Max - Xám Titan', 1, 29990000, 29990000),
(20, 2, 'iPhone 18 Pro Max - Đỏ Burgundy', 2, 48499000, 96998000),
(20, 7, 'iPhone 18 Pro - Băng Thanh', 1, 58499000, 58499000),
(20, 18, 'Samsung Galaxy Z Fold8 - Tím Lavender', 2, 44990000, 89980000),
(20, 31, 'Xiaomi 17 Ultra - Đen', 2, 29990000, 59980000),
(21, 4, 'iPhone 18 Pro Max - Đỏ Burgundy', 2, 80999000, 161998000),
(22, 8, 'iPhone 17 Pro Max - Xanh Đậm', 2, 34990000, 69980000),
(22, 37, 'OPPO Find X10 Pro Max - Xám Titan', 2, 29990000, 59980000),
(22, 42, 'OPPO Find X9 Ultra - Trắng', 2, 25990000, 51980000),
(22, 51, 'vivo X300 Ultra - Trắng Snow Peak', 2, 40990000, 81980000),
(22, 60, 'vivo V70 FE (12GB RAM) - Xanh Đại Dương', 2, 15990000, 31980000),
(23, 50, 'vivo X300 Ultra - Trắng Snow Peak', 1, 33990000, 33990000),
(24, 35, 'Xiaomi 17 - Xanh Dương', 1, 18990000, 18990000),
(25, 44, 'OPPO Find X9 Ultra - Trắng', 1, 35990000, 35990000),
(25, 51, 'vivo X300 Ultra - Trắng Snow Peak', 1, 40990000, 40990000);

INSERT INTO `invoices` (`invoice_code`, `order_id`, `employee_id`, `total_amount`) VALUES
('INV80240', 1, 7, 59980000),
('INV57279', 2, 15, 29990000),
('INV39143', 3, 15, 53980000),
('INV94861', 4, 18, 22990000),
('INV75485', 5, 15, 61499000),
('INV69550', 6, 19, 97970000),
('INV39124', 7, 17, 15990000),
('INV21589', 8, 19, 109980000),
('INV77736', 9, 9, 75980000),
('INV44277', 10, 16, 119998000),
('INV83248', 11, 16, 79980000),
('INV17143', 12, 18, 94970000),
('INV29878', 13, 9, 231968000),
('INV57026', 14, 12, 105960000),
('INV17519', 15, 16, 101950000),
('INV15923', 16, 5, 80999000),
('INV56105', 17, 19, 53980000),
('INV67762', 18, 4, 27990000),
('INV13496', 19, 6, 29990000),
('INV48856', 20, 4, 305457000),
('INV18622', 21, 3, 161998000),
('INV38168', 22, 20, 295900000),
('INV44039', 23, 17, 33990000),
('INV86478', 24, 2, 18990000),
('INV56513', 25, 18, 76980000);

INSERT INTO `carts` (`customer_id`) VALUES
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9),
(10),
(11),
(12),
(13),
(14),
(15),
(16),
(17),
(18),
(19),
(20);

INSERT INTO `cart_items` (`cart_id`, `product_id`, `quantity`) VALUES
(1, 25, 3),
(13, 26, 3),
(9, 57, 1),
(10, 21, 2),
(3, 58, 2),
(6, 28, 3),
(11, 13, 1),
(4, 3, 3),
(10, 56, 3),
(5, 44, 1),
(6, 15, 2),
(11, 7, 1),
(10, 7, 2),
(10, 30, 1),
(14, 7, 3),
(6, 54, 2),
(6, 9, 3),
(11, 42, 2),
(13, 10, 2),
(7, 19, 2),
(18, 42, 1),
(11, 57, 2),
(5, 16, 2),
(5, 40, 3),
(8, 53, 3),
(18, 52, 2),
(6, 30, 2),
(8, 38, 2),
(11, 55, 1),
(7, 38, 3),
(11, 26, 1),
(6, 60, 2),
(17, 15, 1),
(3, 41, 2),
(7, 7, 1),
(17, 54, 3),
(10, 18, 3),
(10, 57, 2),
(16, 37, 3),
(18, 50, 2),
(17, 43, 3),
(8, 11, 3),
(10, 5, 3),
(7, 52, 3),
(8, 12, 1);


-- ==========================================
-- KIỂM TRA DỮ LIỆU SAU KHI IMPORT (READ-ONLY)
-- ==========================================
-- SELECT b.name AS brand, COUNT(*) AS products_count FROM products p JOIN brands b ON b.id = p.brand_id GROUP BY b.id, b.name;
-- SELECT o.id, o.order_code, o.total_amount, SUM(oi.subtotal) AS items_total
-- FROM orders o LEFT JOIN order_items oi ON oi.order_id = o.id
-- GROUP BY o.id, o.order_code, o.total_amount
-- HAVING o.total_amount <> COALESCE(SUM(oi.subtotal),0);
