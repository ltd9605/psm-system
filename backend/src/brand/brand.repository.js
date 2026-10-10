import pool from "../config/database.js";

export async function findBrands(filters = {}) {
    let sql = `SELECT id, name, description, status, created_at FROM brands WHERE 1=1`;
    const params = [];

    if (filters.search) {
        sql += ` AND name LIKE ?`;
        params.push(`%${filters.search}%`);
    }

    if (filters.status) {
        sql += ` AND status = ?`;
        params.push(filters.status);
    }

    sql += ` ORDER BY created_at DESC`;
    const [rows] = await pool.query(sql, params);
    return rows;
}

export async function findBrandById(id) {
    const [rows] = await pool.query(
        `SELECT id, name, description, status, created_at FROM brands WHERE id = ? LIMIT 1`,
        [id]
    );
    return rows[0] ?? null;
}

export async function createBrand(brand) {
    const { name, description, status = 'ACTIVE' } = brand;
    const [result] = await pool.query(
        `INSERT INTO brands (name, description, status) VALUES (?, ?, ?)`,
        [name, description, status]
    );
    return result.insertId;
}

export async function updateBrand(id, brand) {
    const { name, description, status } = brand;
    let sql = `UPDATE brands SET `;
    const params = [];
    const fields = [];

    if (name !== undefined) {
        fields.push(`name = ?`);
        params.push(name);
    }
    if (description !== undefined) {
        fields.push(`description = ?`);
        params.push(description);
    }
    if (status !== undefined) {
        fields.push(`status = ?`);
        params.push(status);
    }

    if (fields.length === 0) return 0;

    sql += fields.join(", ") + ` WHERE id = ?`;
    params.push(id);

    const [result] = await pool.query(sql, params);
    return result.affectedRows;
}

export async function deleteBrand(id) {
    // Note: Before deleting a brand, we might want to check if any products are using this brand.
    // Assuming the database handles foreign key constraints or we do it here.
    const [result] = await pool.query(`DELETE FROM brands WHERE id = ?`, [id]);
    return result.affectedRows;
}
