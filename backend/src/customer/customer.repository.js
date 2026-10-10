import pool from "../config/database.js";

export async function findCustomers(filters = {}) {
  const { search, limit, offset } = filters;

  let sql = `
        SELECT
            id,
            full_name,
            username,
            phone,
            email,
            address,
            created_at,
            updated_at
        FROM customers
        WHERE 1=1
    `;

  const params = [];

  if (search) {
    sql += ` AND (full_name LIKE ? OR username LIKE ? OR phone LIKE ? OR email LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }

  sql += ` ORDER BY created_at DESC`;

  if (limit) {
    sql += ` LIMIT ?`;
    params.push(Number(limit));
  }

  if (offset) {
    sql += ` OFFSET ?`;
    params.push(Number(offset));
  }

  const [rows] = await pool.query(sql, params);
  return rows;
}

export async function findCustomerById(id) {
  const [rows] = await pool.query(
    `
        SELECT
            id,
            full_name,
            username,
            phone,
            email,
            address,
            created_at,
            updated_at
        FROM customers
        WHERE id = ?
        LIMIT 1
        `,
    [id],
  );

  return rows[0] ?? null;
}

export async function createCustomer(customer) {
  const { full_name, username, phone, password, email, address } = customer;

  const [result] = await pool.query(
    `
        INSERT INTO customers (
            full_name,
            username,
            phone,
            password,
            email,
            address
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
    [full_name, username, phone, password, email, address],
  );

  return result.insertId;
}

export async function updateCustomer(id, customer) {
  const { full_name, username, phone, password, email, address } = customer;

  let sql = `
        UPDATE customers
        SET
            full_name = ?,
            username = ?,
            phone = ?,
            email = ?,
            address = ?
    `;
  const params = [full_name, username, phone, email, address];

  if (password) {
    sql += `, password = ?`;
    params.push(password);
  }

  sql += ` WHERE id = ?`;
  params.push(id);

  const [result] = await pool.query(sql, params);

  return result.affectedRows;
}

export async function deleteCustomer(id) {
  const [result] = await pool.query(`DELETE FROM customers WHERE id = ?`, [id]);

  return result.affectedRows;
}

export async function getCartByCustomerId(customerId) {
  const [rows] = await pool.query(
    `SELECT id, customer_id FROM carts WHERE customer_id = ? LIMIT 1`,
    [customerId],
  );
  return rows[0] ?? null;
}

export async function createCart(customerId) {
  const [result] = await pool.query(
    `INSERT INTO carts (customer_id) VALUES (?)`,
    [customerId],
  );
  return result.insertId;
}

export async function getCartItem(cartId, productId) {
  const [rows] = await pool.query(
    `SELECT id, cart_id, product_id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ? LIMIT 1`,
    [cartId, productId],
  );
  return rows[0] ?? null;
}

export async function addCartItem(cartId, productId, quantity) {
  const [result] = await pool.query(
    `INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)`,
    [cartId, productId, quantity],
  );
  return result.insertId;
}

export async function updateCartItemQuantity(cartItemId, newQuantity) {
  const [result] = await pool.query(
    `UPDATE cart_items SET quantity = ? WHERE id = ?`,
    [newQuantity, cartItemId],
  );
  return result.affectedRows;
}

export async function removeCartItem(cartItemId) {
  const [result] = await pool.query(`DELETE FROM cart_items WHERE id = ?`, [
    cartItemId,
  ]);
  return result.affectedRows;
}

export async function getCartWithItems(customerId) {
  const [cartRows] = await pool.query(
    `SELECT id, customer_id, created_at, updated_at FROM carts WHERE customer_id = ? LIMIT 1`,
    [customerId],
  );

  if (cartRows.length === 0) return null;
  const cart = cartRows[0];

  const [itemRows] = await pool.query(
    `
        SELECT 
            ci.id AS cart_item_id,
            ci.product_id,
            ci.quantity,
            p.name AS product_name,
            p.price,
            p.image_url,
            p.status,
            p.quantity AS stock_quantity
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.cart_id = ?
        `,
    [cart.id],
  );

  cart.items = itemRows;
  return cart;
}

export async function createOrderFromCart(customer, cart, shippingAddress) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    let totalAmount = 0;
    for (const item of cart.items) {
      const [rows] = await connection.query(
        `SELECT quantity, price, name FROM products WHERE id = ? FOR UPDATE`,
        [item.product_id],
      );
      if (rows.length === 0)
        throw new Error(`Product ${item.product_id} not found`);
      const product = rows[0];

      if (product.quantity < item.quantity) {
        throw new Error(`Not enough stock for product ${product.name}`);
      }

      totalAmount += Number(product.price) * item.quantity;
    }

    const orderCode = `ORD-${Date.now()}`;
    const [orderResult] = await connection.query(
      `INSERT INTO orders (order_code, customer_id, customer_name, customer_phone, shipping_address, status, total_amount)
             VALUES (?, ?, ?, ?, ?, 'PENDING', ?)`,
      [
        orderCode,
        customer.id,
        customer.full_name,
        customer.phone,
        shippingAddress || customer.address,
        totalAmount,
      ],
    );
    const orderId = orderResult.insertId;

    for (const item of cart.items) {
      const [rows] = await connection.query(
        `SELECT price, name FROM products WHERE id = ?`,
        [item.product_id],
      );
      const product = rows[0];
      const subtotal = Number(product.price) * item.quantity;

      await connection.query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, subtotal)
                 VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.product_id,
          product.name,
          item.quantity,
          product.price,
          subtotal,
        ],
      );

      await connection.query(
        `UPDATE products SET quantity = quantity - ? WHERE id = ?`,
        [item.quantity, item.product_id],
      );
    }

    await connection.query(`DELETE FROM cart_items WHERE cart_id = ?`, [
      cart.id,
    ]);

    await connection.commit();
    return orderId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function cancelCustomerOrder(customerId, orderId) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [orderRows] = await connection.query(
      `SELECT id, status FROM orders WHERE id = ? AND customer_id = ? FOR UPDATE`,
      [orderId, customerId],
    );

    if (orderRows.length === 0) {
      throw new Error("Order not found or does not belong to you");
    }

    const order = orderRows[0];
    if (order.status !== "PENDING") {
      throw new Error("Only pending orders can be cancelled");
    }

    const [items] = await connection.query(
      `SELECT product_id, quantity FROM order_items WHERE order_id = ?`,
      [orderId],
    );

    for (const item of items) {
      await connection.query(
        `UPDATE products SET quantity = quantity + ? WHERE id = ?`,
        [item.quantity, item.product_id],
      );
    }

    await connection.query(
      `UPDATE orders SET status = 'CANCELLED', cancelled_at = NOW() WHERE id = ?`,
      [orderId],
    );

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function getCustomerOrders(customerId, status) {
  let sql = `
        SELECT 
            id, order_code, status, total_amount, 
            created_at, confirmed_at, completed_at, cancelled_at, 
            shipping_address
        FROM orders 
        WHERE customer_id = ?
    `;
  const params = [customerId];

  if (status) {
    sql += ` AND status = ?`;
    params.push(status);
  }
  sql += ` ORDER BY created_at DESC`;

  const [rows] = await pool.query(sql, params);
  return rows;
}

export async function getCustomerOrderById(customerId, orderId) {
  const [orderRows] = await pool.query(
    `
        SELECT 
            id, order_code, status, total_amount, 
            created_at, confirmed_at, completed_at, cancelled_at, 
            shipping_address, employee_id
        FROM orders 
        WHERE id = ? AND customer_id = ?
        LIMIT 1
        `,
    [orderId, customerId],
  );

  if (orderRows.length === 0) return null;
  const order = orderRows[0];

  const [itemRows] = await pool.query(
    `
        SELECT 
            product_id, product_name, quantity, unit_price, subtotal
        FROM order_items 
        WHERE order_id = ?
        `,
    [orderId],
  );

  order.items = itemRows;
  return order;
}
