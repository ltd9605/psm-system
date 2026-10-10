import pool from "../config/database.js";

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

  return rows[0] ?? null;
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
