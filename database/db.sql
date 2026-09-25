CREATE TABLE `employees` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `full_name` varchar(100),
  `username` varchar(50) UNIQUE,
  `password` varchar(255),
  `phone` varchar(20),
  `status` varchar(20) DEFAULT 'ACTIVE',
  `role_id` integer,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP ,
  `updated_at` datetime  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `roles` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255)
);

CREATE TABLE `customers` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `full_name` varchar(100),
  `username` varchar(50) UNIQUE,
  `phone` varchar(20),
  `password` varchar(255),
  `email` varchar(255),
  `address` varchar(255),
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `brands` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `description` varchar(255),
  `status` varchar(20),
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `products` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `brand_id` integer NOT NULL,
  `name` varchar(150) NOT NULL,
  `storage` varchar(50),
  `p_color` varchar(50),
  `description` varchar(255),
  `price` decimal(15,2) NOT NULL,
  `quantity` integer DEFAULT 0 NOT NULL,
  `image_url` varchar(500),
  `status` varchar(20) DEFAULT 'ACTIVE' NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `orders` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `order_code` varchar(255) NOT NULL UNIQUE,
  `customer_id` integer NOT NULL,
  `employee_id` integer,
  `customer_name` varchar(100),
  `customer_phone` varchar(20),
  `shipping_address` varchar(255),
  `status` varchar(20) DEFAULT 'PENDING',
  `total_amount` decimal(15,2) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `confirmed_at` datetime ,
  `completed_at` datetime,
  `cancelled_at` datetime
);

CREATE TABLE `order_items` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `order_id` integer NOT NULL,
  `product_id` integer NOT NULL,
  `product_name` varchar(255),
  `quantity` integer NOT NULL,
  `unit_price` decimal(15,2) NOT NULL,
  `subtotal` decimal(15,2) NOT NULL
);

CREATE TABLE `invoices` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `invoice_code` varchar(20) UNIQUE,
  `order_id` integer UNIQUE,
  `employee_id` integer NOT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `carts` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `customer_id` integer UNIQUE,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `cart_items` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `cart_id` integer NOT NULL,
  `product_id` integer NOT NULL,
  `quantity` integer NOT NULL,
  UNIQUE (cart_id, product_id)
);

ALTER TABLE `products` ADD FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`);

ALTER TABLE `carts` ADD FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`);

ALTER TABLE `order_items` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

ALTER TABLE `order_items` ADD FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

ALTER TABLE `orders` ADD FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);

ALTER TABLE `orders` ADD FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);

ALTER TABLE `invoices` ADD FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`);

ALTER TABLE `employees` ADD FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

ALTER TABLE `invoices` ADD FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);

ALTER TABLE `cart_items` ADD FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`);

ALTER TABLE `cart_items` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
