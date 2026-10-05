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
        [id]
    );

    return rows[0] ?? null;
}

export async function createCustomer(customer) {
    const {
        full_name,
        username,
        phone,
        password,
        email,
        address
    } = customer;

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
        [
            full_name,
            username,
            phone,
            password,
            email,
            address
        ]
    );

    return result.insertId;
}

export async function updateCustomer(id, customer) {
    const {
        full_name,
        username,
        phone,
        password,
        email,
        address
    } = customer;

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
    const [result] = await pool.query(
        `DELETE FROM customers WHERE id = ?`,
        [id]
    );

    return result.affectedRows;
}