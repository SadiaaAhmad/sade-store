const express = require('express');
const router = express.Router();
const pool = require('../db');
const { sendOrderConfirmation, sendAdminNotification } = require('../utils/email');

// ── Admin password check ──────────────────────────────────────────────────────
function adminAuth(req, res, next) {
  const pw = req.headers['x-admin-password'];
  if (pw !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

// POST /api/orders/validate-discount
router.post('/validate-discount', async (req, res) => {
  const { code, subtotal } = req.body;
  if (!code || subtotal == null) return res.status(400).json({ error: 'code and subtotal are required' });
  try {
    const { rows } = await pool.query(
      `SELECT * FROM discount_codes
       WHERE UPPER(code) = UPPER($1)
         AND is_active = TRUE
         AND (expires_at IS NULL OR expires_at > NOW())
         AND (max_uses IS NULL OR used_count < max_uses)`,
      [code.trim()]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Invalid or expired discount code' });
    const dc = rows[0];
    if (Number(subtotal) < Number(dc.min_order_amount)) {
      return res.status(400).json({ error: `Minimum order for this code is Rs ${Number(dc.min_order_amount).toLocaleString()}` });
    }
    let discountAmount = dc.discount_type === 'percentage'
      ? (Number(subtotal) * Number(dc.discount_value)) / 100
      : Number(dc.discount_value);
    return res.json({ valid: true, code: dc.code, discount_type: dc.discount_type, discount_value: Number(dc.discount_value), discount_amount: Math.round(discountAmount) });
  } catch (err) {
    console.error('validate-discount error:', err);
    return res.status(500).json({ error: 'Server error validating discount code' });
  }
});

// POST /api/orders — place an order
router.post('/', async (req, res) => {
  const { customer_name, customer_email, customer_phone, shipping_address, items, subtotal, shipping_fee = 250, discount_amount = 0, discount_code, total, payment_method, notes } = req.body;
  if (!customer_name || !customer_email || !shipping_address || !items?.length || !total || !payment_method) {
    return res.status(400).json({ error: 'Missing required order fields' });
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `INSERT INTO orders (customer_name, customer_email, customer_phone, shipping_address, items, subtotal, shipping_fee, discount_amount, discount_code, total, payment_method, payment_status, order_status, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'pending','processing',$12) RETURNING *`,
      [customer_name, customer_email, customer_phone || null, JSON.stringify(shipping_address), JSON.stringify(items), subtotal, shipping_fee, discount_amount, discount_code || null, total, payment_method, notes || null]
    );
    const order = rows[0];
    if (discount_code) {
      await client.query(`UPDATE discount_codes SET used_count = used_count + 1 WHERE UPPER(code) = UPPER($1)`, [discount_code]);
    }
    await client.query('COMMIT');
    try {
      await Promise.all([sendOrderConfirmation(order), sendAdminNotification(order)]);
    } catch (emailErr) {
      console.error('Email failed (order still placed):', emailErr.message);
    }
    return res.status(201).json({ success: true, order_number: order.order_number, order_id: order.id });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Place order error:', err);
    return res.status(500).json({ error: 'Failed to place order. Please try again.' });
  } finally {
    client.release();
  }
});

// GET /api/orders/:orderNumber — customer order lookup
router.get('/:orderNumber', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, order_number, customer_name, customer_email, shipping_address, items, subtotal, shipping_fee, discount_amount, total, payment_method, payment_status, order_status, created_at
       FROM orders WHERE order_number = $1`,
      [req.params.orderNumber.toUpperCase()]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/orders/admin/all — all orders for admin dashboard
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM orders ORDER BY created_at DESC`);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// PATCH /api/orders/admin/:id — update order status
router.patch('/admin/:id', adminAuth, async (req, res) => {
  const { order_status } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE orders SET order_status=$1, updated_at=NOW() WHERE id=$2 RETURNING *`,
      [order_status, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update order' });
  }
});

module.exports = router;