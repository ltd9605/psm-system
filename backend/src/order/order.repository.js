import pool from "../config/database.js";
import { AppError } from "../utils/AppError.js";

export async function findOrders(filters = {}) {
  const { search, status, customerId, employeeId, limit, offset } = filters;

  let sql = `
        SELECT
            o.id,
            o.order_code,
            o.customer_id,
            o.employee_id,
            o.customer_name,
            o.customer_phone,
            o.shipping_address,
            o.status,
            o.total_amount,
            o.created_at,
            o.confirmed_at,
            o.completed_at,
            o.cancelled_at,
            o.cancel_reason,
            c.full_name AS customer_account_name,
            e.full_name AS employee_name
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.id
        LEFT JOIN employees e ON o.employee_id = e.id
        WHERE 1=1
    `;

  const params = [];

  if (search) {
    sql += ` AND (o.order_code LIKE ? OR o.customer_name LIKE ? OR o.customer_phone LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (status) {
    sql += ` AND o.status = ?`;
    params.push(status);
  }

  if (customerId) {
    sql += ` AND o.customer_id = ?`;
    params.push(Number(customerId));
  }

  if (employeeId) {
    sql += ` AND o.employee_id = ?`;
    params.push(Number(employeeId));
  }

  sql += ` ORDER BY o.created_at DESC`;

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

export async function findOrderById(id) {
  const [rows] = await pool.query(
    `
        SELECT
            o.id,
            o.order_code,
            o.customer_id,
            o.employee_id,
            o.customer_name,
            o.customer_phone,
            o.shipping_address,
            o.status,
            o.total_amount,
            o.created_at,
            o.confirmed_at,
            o.completed_at,
            o.cancelled_at,
            o.cancel_reason,
            c.full_name AS customer_account_name,
            e.full_name AS employee_name
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.id
        LEFT JOIN employees e ON o.employee_id = e.id
        WHERE o.id = ?
        LIMIT 1
        `,
    [id],
  );

  if (rows.length === 0) return null;

  const order = rows[0];
  const [items] = await pool.query(
    `SELECT product_id, product_name, quantity, unit_price, subtotal
     FROM order_items WHERE order_id = ?`,
    [id],
  );
  order.items = items;
  return order;
}

export async function createOrder(order) {
  const {
    order_code,
    customer_id,
    employee_id,
    customer_name,
    customer_phone,
    shipping_address,
    status = "PENDING",
    total_amount,
  } = order;

  const [result] = await pool.query(
    `
        INSERT INTO orders (
            order_code,
            customer_id,
            employee_id,
            customer_name,
            customer_phone,
            shipping_address,
            status,
            total_amount
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
    [
      order_code,
      customer_id,
      employee_id || null,
      customer_name,
      customer_phone,
      shipping_address,
      status,
      total_amount,
    ],
  );

  return result.insertId;
}

export async function createOrderWithItems(order) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    let customerId = order.customer_id;
    if (!customerId) {
      const [walkInRows] = await connection.query(
        `SELECT id FROM customers WHERE username = 'walkin-pos' LIMIT 1`,
      );
      if (walkInRows.length > 0) {
        customerId = walkInRows[0].id;
      } else {
        const [walkInResult] = await connection.query(
          `INSERT INTO customers (full_name, username, phone) VALUES (?, 'walkin-pos', ?)`,
          [order.customer_name || "Khách lẻ", order.customer_phone || null],
        );
        customerId = walkInResult.insertId;
      }
    }

    const quantities = new Map();
    for (const item of order.items) {
      const productId = Number(item.product_id);
      quantities.set(productId, (quantities.get(productId) || 0) + Number(item.quantity));
    }

    const lines = [];
    let totalAmount = 0;
    for (const [productId, quantity] of quantities) {
      const [rows] = await connection.query(
        `SELECT id, name, price, quantity, status FROM products WHERE id = ? FOR UPDATE`,
        [productId],
      );
      const product = rows[0];
      if (!product) throw new AppError(`Product ${productId} not found`, 404);
      if (product.status !== "ACTIVE") throw new AppError(`Product ${product.name} is not available`, 400);
      if (product.quantity < quantity) throw new AppError(`Not enough stock for product ${product.name}`, 400);

      const unitPrice = Number(product.price);
      const subtotal = unitPrice * quantity;
      totalAmount += subtotal;
      lines.push({ productId, productName: product.name, quantity, unitPrice, subtotal });
    }

    const [orderResult] = await connection.query(
      `INSERT INTO orders
       (order_code, customer_id, employee_id, customer_name, customer_phone,
        shipping_address, status, total_amount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        order.order_code,
        customerId,
        order.employee_id || null,
        order.customer_name || "Khách lẻ",
        order.customer_phone || null,
        order.shipping_address || "",
        order.status || "PENDING",
        totalAmount,
      ],
    );

    for (const line of lines) {
      await connection.query(
        `INSERT INTO order_items
         (order_id, product_id, product_name, quantity, unit_price, subtotal)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderResult.insertId, line.productId, line.productName, line.quantity, line.unitPrice, line.subtotal],
      );
      await connection.query(`UPDATE products SET quantity = quantity - ? WHERE id = ?`, [line.quantity, line.productId]);
    }

    await connection.commit();
    return orderResult.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function updateOrder(id, order) {
  const fields = [];
  const params = [];

  const allowedFields = [
    "customer_id",
    "employee_id",
    "customer_name",
    "customer_phone",
    "shipping_address",
    "status",
    "total_amount",
    "confirmed_at",
    "completed_at",
    "cancelled_at",
    "cancel_reason",
  ];

  for (const key of allowedFields) {
    if (order[key] !== undefined) {
      fields.push(`${key} = ?`);
      params.push(order[key]);
    }
  }

  if (fields.length === 0) {
    return 0; // No fields to update
  }

  const sql = `UPDATE orders SET ${fields.join(", ")} WHERE id = ?`;
  params.push(id);

  const [result] = await pool.query(sql, params);
  return result.affectedRows;
}

export async function deleteOrder(id) {
  const [result] = await pool.query(`DELETE FROM orders WHERE id = ?`, [id]);

  return result.affectedRows;
}

export async function getOrderStats(filters = {}) {
  const { startDate, endDate } = filters;
  let sql = `
        SELECT 
            COUNT(id) as total_orders,
            SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed_orders,
            SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending_orders,
            SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelled_orders,
            SUM(CASE WHEN status = 'COMPLETED' THEN total_amount ELSE 0 END) as total_revenue
        FROM orders
        WHERE 1=1
    `;
  const params = [];

  if (startDate) {
    sql += ` AND created_at >= ?`;
    params.push(startDate);
  }

  if (endDate) {
    sql += ` AND created_at <= ?`;
    params.push(endDate);
  }

  const [rows] = await pool.query(sql, params);
  return rows[0];
}
