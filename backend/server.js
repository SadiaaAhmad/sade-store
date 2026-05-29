require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const ordersRouter = require('./routes/orders');
const productsRouter = require('./routes/products');
const stripeRouter = require('./routes/stripe');

const app = express();

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS — allow your Vercel frontend + localhost ─────────────────────────────
const allowedOrigins = [
  'https://www.wearsade.fit',
  'https://wearsade.fit',
  'https://sade-store-git-main-sadia-ahmads-projects.vercel.app',
  'https://sade-store-4abzpz86r-sadia-ahmads-projects.vercel.app',
  process.env.FRONTEND_URL || 'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server / curl (no origin) and whitelisted origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
  })
);

// ── Rate limiting ─────────────────────────────────────────────────────────────
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// ── Body parsing ──────────────────────────────────────────────────────────────
// Raw body needed for Stripe webhook signature verification
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/', (_req, res) => res.json({ status: 'SADÉ API is running ✓' }));
app.get('/health', (_req, res) => res.json({ ok: true }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/orders', ordersRouter);
app.use('/api/products', productsRouter);
app.use('/api/stripe', stripeRouter);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🖤 SADÉ backend running on port ${PORT}`));