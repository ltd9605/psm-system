import pool from "../config/database.js";

export async function findCustomerByUsername(username) {
    const [rows] = await pool.query(
        `
        SELECT *
        FROM customers
        WHERE username = ?
        LIMIT 1
        `,
        [username]
    );

    return rows[0] ?? null;
}

export async function createCustomer(customer) {
    const {
        fullName,
        username,
        password,
        phone,
        email,
        address
    } = customer;

    const [result] = await pool.query(
        `
        INSERT INTO customers (
            full_name,
            username,
            password,
            phone,
            email,
            address
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            fullName,
            username,
            password,
            phone,
            email,
            address
        ]
    );

    return result.insertId;
}

export async function findEmployeeByUsername(username) {
    const [rows] = await pool.query(
        `
        SELECT
            e.id,
            e.full_name,
            e.username,
            e.password,
            e.status,
            e.role_id,
            r.name AS role_name
        FROM employees e
        LEFT JOIN roles r
            ON e.role_id = r.id
        WHERE e.username = ?
        LIMIT 1
        `,
        [username]
    );

    return rows[0] ?? null;
}