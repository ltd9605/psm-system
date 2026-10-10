import pool from "../config/database.js";

export async function findProducts(filters) {
  const { search, minPrice, maxPrice, brandId, limit, offset } = filters;

  let sql = `
        SELECT
            p.id,
            p.name,
            p.storage,
            p.p_color,
            p.description,
            p.price,
            p.quantity,
            p.image_url,
            p.status,

            b.id AS brand_id,
            b.name AS brand_name

        FROM products p

        JOIN brands b
            ON p.brand_id = b.id

        WHERE p.status = 'ACTIVE'
    `;

  const params = [];

  // Search by product name
  if (search) {
    sql += `
            AND (p.name LIKE ? OR b.name LIKE ?)
        `;

    params.push(`%${search}%`, `%${search}%`);
  }

  // Minimum price
  if (minPrice) {
    sql += `
            AND p.price >= ?
        `;

    params.push(Number(minPrice));
  }

  // Maximum price
  if (maxPrice) {
    sql += `
            AND p.price <= ?
        `;

    params.push(Number(maxPrice));
  }

  // Brand filter
  if (brandId) {
    sql += `
            AND p.brand_id = ?
        `;

    params.push(Number(brandId));
  }

  sql += `
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
    `;
  params.push(limit, offset);

  const [rows] = await pool.query(sql, params);

  return rows;
}
export async function findProductById(id) {
  const [rows] = await pool.query(
    `
        SELECT
            id,
            brand_id,
            name,
            storage,
            p_color,
            description,
            price,
            quantity,
            image_url,
            status
        FROM products
        WHERE id = ?
        LIMIT 1
        `,
    [id],
  );

  return rows[0] ?? null;
}
export async function findBrandById(id) {
  const [rows] = await pool.query(
    `
        SELECT id, name
        FROM brands
        WHERE id = ?
        LIMIT 1
        `,
    [id],
  );

  return rows[0] ?? null;
}
export async function createProduct(product) {
  const {
    brandId,
    name,
    storage,
    color,
    description,
    price,
    quantity,
    imageUrl,
    status,
  } = product;

  const [result] = await pool.query(
    `
        INSERT INTO products (
            brand_id,
            name,
            storage,
            p_color,
            description,
            price,
            quantity,
            image_url,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
    [
      brandId,
      name,
      storage || null,
      color || null,
      description || null,
      price,
      quantity,
      imageUrl || null,
      status,
    ],
  );

  return result.insertId;
}
export async function updateProduct(id, product) {
  const {
    brandId,
    name,
    storage,
    color,
    description,
    price,
    quantity,
    imageUrl,
    status,
  } = product;

  const [result] = await pool.query(
    `
        UPDATE products
        SET
            brand_id = ?,
            name = ?,
            storage = ?,
            p_color = ?,
            description = ?,
            price = ?,
            quantity = ?,
            image_url = ?,
            status = ?
        WHERE id = ?
        `,
    [
      brandId,
      name,
      storage,
      color,
      description,
      price,
      quantity,
      imageUrl,
      status,
      id,
    ],
  );

  return result.affectedRows;
}

export async function getProductQuantity(id) {
  const [rows] = await pool.query(
    `SELECT quantity FROM products WHERE id = ? LIMIT 1`,
    [id],
  );
  return rows[0] ?? null;
}
export async function softDeleteProduct(id) {
  const [result] = await pool.query(
    `
        UPDATE products
        SET status = 'INACTIVE'
        WHERE id = ?
        `,
    [id],
  );

  return result.affectedRows;
}
