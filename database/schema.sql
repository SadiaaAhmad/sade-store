-- ============================================
-- SADÉ E-Commerce Database Schema
-- PostgreSQL / Supabase
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  discounted_price NUMERIC(10, 2),
  collection TEXT DEFAULT 'Volume I',
  category TEXT, -- shirt, hoodie, pants, etc.
  images JSONB DEFAULT '[]', -- array of image URLs
  sizes JSONB DEFAULT '[]', -- [{size: "S", stock: 10}, ...]
  tags TEXT[],
  is_sold_out BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB NOT NULL,
  -- {line1, line2, city, province, postal_code, country}
  items JSONB NOT NULL,
  -- [{product_id, name, price, quantity, size, image}]
  subtotal NUMERIC(10, 2) NOT NULL,
  shipping_fee NUMERIC(10, 2) DEFAULT 250.00,
  tip NUMERIC(10, 2) DEFAULT 0,
  discount_amount NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  payment_method TEXT NOT NULL, -- 'cod' or 'card'
  payment_status TEXT DEFAULT 'pending', -- pending, paid, failed
  order_status TEXT DEFAULT 'processing',
  -- processing, confirmed, shipped, delivered, cancelled
  stripe_payment_intent_id TEXT,
  discount_code TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DISCOUNT CODES TABLE
-- ============================================
CREATE TABLE discount_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL, -- 'percentage' or 'fixed'
  discount_value NUMERIC(10, 2) NOT NULL,
  min_order_amount NUMERIC(10, 2) DEFAULT 0,
  max_uses INT DEFAULT NULL, -- NULL = unlimited
  used_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WISHLIST TABLE (for guest/persistent)
-- ============================================
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, product_id)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_collection ON products(collection);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_wishlists_session ON wishlists(session_id);

-- ============================================
-- AUTO-UPDATE updated_at trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ORDER NUMBER GENERATOR
-- ============================================
CREATE SEQUENCE order_number_seq START 1000;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'SADE-' || LPAD(nextval('order_number_seq')::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;

-- Auto-set order_number on insert
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number = generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION set_order_number();

-- ============================================
-- SEED DATA — Sample Products
-- ============================================
INSERT INTO products (slug, name, description, price, discounted_price, collection, category, images, sizes, is_featured, sort_order) VALUES
(
  'beige-resort-button-polo-shirt',
  'Beige Resort Button Polo Shirt',
  'A relaxed, gender-neutral resort shirt crafted in premium cotton terry. Features contrast brown collar, button-down front, chest pocket with embroidered branding, and tipped cuffs. Designed for the effortlessly elevated.',
  3050.00,
  NULL,
  'Volume I',
  'shirt',
  '["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800", "https://images.unsplash.com/photo-1594938298603-c8148c4b4b25?w=800"]',
  '[{"size": "XS", "stock": 5}, {"size": "S", "stock": 12}, {"size": "M", "stock": 8}, {"size": "L", "stock": 6}, {"size": "XL", "stock": 3}]',
  true,
  1
),
(
  'obsidian-relaxed-trouser',
  'Obsidian Relaxed Trouser',
  'Wide-leg silhouette in heavy-weight cotton twill. Elastic waist with drawstring. Cut for ease and flow — the kind of bottom that looks intentional paired with anything.',
  4200.00,
  3500.00,
  'Volume I',
  'pants',
  '["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800"]',
  '[{"size": "S", "stock": 0}, {"size": "M", "stock": 4}, {"size": "L", "stock": 7}, {"size": "XL", "stock": 2}]',
  true,
  2
),
(
  'ivory-boxy-jersey',
  'Ivory Boxy Jersey',
  'A clean, structured oversized jersey. Raw hem detail, dropped shoulders, minimal branding. The foundational piece.',
  2200.00,
  NULL,
  'Volume I',
  'shirt',
  '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"]',
  '[{"size": "S", "stock": 20}, {"size": "M", "stock": 15}, {"size": "L", "stock": 10}, {"size": "XL", "stock": 5}]',
  false,
  3
);

-- Sample discount code
INSERT INTO discount_codes (code, discount_type, discount_value, min_order_amount) VALUES
('SADE10', 'percentage', 10, 2000),
('WELCOME500', 'fixed', 500, 3000);

-- ============================================
-- Row Level Security (Supabase)
-- ============================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Products: public read
CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT USING (true);

-- Orders: only accessible via service role (backend)
CREATE POLICY "Orders accessible by service role only"
  ON orders USING (false); -- backend uses service role key, bypasses RLS

-- Wishlists: session-based access
CREATE POLICY "Wishlist by session"
  ON wishlists FOR ALL USING (true);