import pool from "../config/database.js";

export async function findEmployees(filters = {}) {
    const { search, status, roleId, limit, offset } = filters;

    let sql = `
        SELECT
            e.id,
            e.full_name,
            e.username,
            e.phone,
            e.status,
            e.role_id,
            e.created_at,
            e.updated_at,
            r.name as role_name
        FROM employees e
        LEFT JOIN roles r ON e.role_id = r.id
        WHERE 1=1
    `;

    const params = [];

    if (search) {
        sql += ` AND (e.full_name LIKE ? OR e.username LIKE ? OR e.phone LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status) {
        sql += ` AND e.status = ?`;
        params.push(status);
    }

    if (roleId) {
        sql += ` AND e.role_id = ?`;
        params.push(Number(roleId));
    }

    sql += ` ORDER BY e.created_at DESC`;

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

export async function findEmployeeById(id) {
    const [rows] = await pool.query(
        `
        SELECT
            e.id,
            e.full_name,
            e.username,
            e.phone,
            e.status,
            e.role_id,
            e.created_at,
            e.updated_at,
            r.name as role_name
        FROM employees e
        LEFT JOIN roles r ON e.role_id = r.id
        WHERE e.id = ?
        LIMIT 1
        `,
        [id]
    );

    return rows[0] ?? null;
}

export async function createEmployee(employee) {
    const {
        full_name,
        username,
        password,
        phone,
        status = 'ACTIVE',
        role_id
    } = employee;

    const [result] = await pool.query(
        `
        INSERT INTO employees (
            full_name,
            username,
            password,
            phone,
            status,
            role_id
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            full_name,
            username,
            password,
            phone,
            status,
            role_id
        ]
    );

    return result.insertId;
}

export async function updateEmployee(id, employee) {
    const {
        full_name,
        username,
        password,
        phone,
        status,
        role_id
    } = employee;

    let sql = `
        UPDATE employees
        SET
            full_name = ?,
            username = ?,
            phone = ?,
            status = ?,
            role_id = ?
    `;
    const params = [full_name, username, phone, status, role_id];

    if (password) {
        sql += `, password = ?`;
        params.push(password);
    }

    sql += ` WHERE id = ?`;
    params.push(id);

    const [result] = await pool.query(sql, params);

    return result.affectedRows;
}

export async function softDeleteEmployee(id) {
    const [result] = await pool.query(
        `UPDATE employees SET status = 'INACTIVE' WHERE id = ?`,
        [id]
    );

    return result.affectedRows;
}
