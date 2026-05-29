const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const pool = require('../db');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/stripe/create-payment-intent
// Body: { amount, currency, order_id }
// ─────────────────────────────────────────────────────────────────────────────
router.post('/create-payment-intent', async (req, res) => {
  const { amount, currency = 'pkr', order_id } = req.body;

  if (!amount) return res.status(400).json({ error: 'amount is required' });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses smallest currency unit
      currency,
      metadata: { order_id: order_id || '' },
      automatic_payment_methods: { enabled: true },
    });

    return res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Stripe create-payment-intent error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/stripe/webhook
// Stripe sends events here — verify signature, then update order
// ─────────────────────────────────────────────────────────────────────────────
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Stripe webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    const orderId = pi.metadata?.order_id;

    if (orderId) {
      try {
        await pool.query(
          `UPDATE orders
           SET payment_status = 'paid',
               order_status = 'confirmed',
               stripe_payment_intent_id = $1,
               updated_at = NOW()
           WHERE id = $2`,
          [pi.id, orderId]
        );
      } catch (dbErr) {
        console.error('DB update after payment_intent.succeeded:', dbErr);
      }
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const pi = event.data.object;
    const orderId = pi.metadata?.order_id;
    if (orderId) {
      await pool.query(
        `UPDATE orders SET payment_status = 'failed', updated_at = NOW() WHERE id = $1`,
        [orderId]
      ).catch(console.error);
    }
  }

  return res.json({ received: true });
});

module.exports = router;