import pool from "../config/database.js";

export async function findInvoices(filters = {}) {
  const { search, orderId, employeeId, limit, offset } = filters;

  let sql = `
        SELECT
            i.id,
            i.invoice_code,
            i.order_id,
            i.employee_id,
            i.total_amount,
            i.created_at,
            e.full_name AS employee_name
        FROM invoices i
        LEFT JOIN employees e ON i.employee_id = e.id
        WHERE 1=1
    `;

  const params = [];

  if (search) {
    sql += ` AND i.invoice_code LIKE ?`;
    params.push(`%${search}%`);
  }

  if (orderId) {
    sql += ` AND i.order_id = ?`;
    params.push(Number(orderId));
  }

  if (employeeId) {
    sql += ` AND i.employee_id = ?`;
    params.push(Number(employeeId));
  }

  if (filters.startDate) {
    sql += ` AND i.created_at >= ?`;
    params.push(filters.startDate);
  }

  if (filters.endDate) {
    sql += ` AND i.created_at <= ?`;
    params.push(filters.endDate);
  }

  sql += ` ORDER BY i.created_at DESC`;

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

export async function findInvoiceById(id) {
  const [rows] = await pool.query(
    `
        SELECT
            i.id,
            i.invoice_code,
            i.order_id,
            i.employee_id,
            i.total_amount,
            i.created_at,
            e.full_name AS employee_name
        FROM invoices i
        LEFT JOIN employees e ON i.employee_id = e.id
        WHERE i.id = ?
        LIMIT 1
        `,
    [id],
  );

  return rows[0] ?? null;
}

export async function createInvoice(invoice) {
  const { invoice_code, order_id, employee_id, total_amount } = invoice;

  const [result] = await pool.query(
    `
        INSERT INTO invoices (
            invoice_code,
            order_id,
            employee_id,
            total_amount
        )
        VALUES (?, ?, ?, ?)
        `,
    [invoice_code, order_id, employee_id, total_amount],
  );

  return result.insertId;
}

export async function updateInvoice(id, invoice) {
  const { invoice_code, order_id, employee_id, total_amount } = invoice;

  const [result] = await pool.query(
    `
        UPDATE invoices
        SET
            invoice_code = ?,
            order_id = ?,
            employee_id = ?,
            total_amount = ?
        WHERE id = ?
        `,
    [invoice_code, order_id, employee_id, total_amount, id],
  );

  return result.affectedRows;
}

export async function deleteInvoice(id) {
  const [result] = await pool.query(`DELETE FROM invoices WHERE id = ?`, [id]);

  return result.affectedRows;
}
