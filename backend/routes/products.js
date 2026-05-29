const express = require('express');
const router = express.Router();
const pool = require('../db');

// ── Admin password check ──────────────────────────────────────────────────────
function adminAuth(req, res, next) {
  const pw = req.headers['x-admin-password'];
  if (pw !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

// GET /api/products — all products
router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM products ORDER BY sort_order ASC, created_at DESC`);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/featured
router.get('/featured', async (_req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM products WHERE is_featured = TRUE ORDER BY sort_order ASC`);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch featured products' });
  }
});

// GET /api/products/:slug — single product
router.get('/:slug', async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM products WHERE slug = $1`, [req.params.slug]);
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /api/products — create new product (admin only)
router.post('/', adminAuth, async (req, res) => {
  const { name, slug, price, discounted_price, collection, category, images, size, description, is_sold_out } = req.body;
  if (!name || !slug || !price) return res.status(400).json({ error: 'name, slug and price are required' });
  try {
    const { rows } = await pool.query(
      `INSERT INTO products (name, slug, price, discounted_price, collection, category, images, size, description, is_sold_out, sort_order, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,0,NOW()) RETURNING *`,
      [name, slug, price, discounted_price || null, collection || 'Volume I', category || 'shirt',
       JSON.stringify(images || []), size || null, description || null, is_sold_out || false]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'That slug already exists — choose a different one' });
    console.error('Create product error:', err);
    return res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/products/:id — update product (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  const { name, slug, price, discounted_price, collection, category, images, size, description, is_sold_out } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE products
       SET name=$1, slug=$2, price=$3, discounted_price=$4, collection=$5,
           category=$6, images=$7, size=$8, description=$9, is_sold_out=$10, updated_at=NOW()
       WHERE id=$11 RETURNING *`,
      [name, slug, price, discounted_price || null, collection, category,
       JSON.stringify(images || []), size || null, description || null, is_sold_out || false, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    return res.json(rows[0]);
  } catch (err) {
    console.error('Update product error:', err);
    return res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/products/:id — delete product (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id=$1', [req.params.id]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;