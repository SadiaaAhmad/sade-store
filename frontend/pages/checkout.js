import { useState } from 'react';
import Head from 'next/head';
import { useCart } from '../hooks/useCart';
import { toast } from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL;

const inputStyle = {
  width: '100%',
  background: 'transparent',
  border: '1px solid #1a1a1a',
  borderBottom: '1px solid #222',
  padding: '14px 0',
  color: '#f0ede8',
  fontFamily: 'Jost, sans-serif',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box',
};

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    address: '', address2: '', city: '', province: '', postal: '',
    payment: 'cod',
  });
  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState(null); // { code, discount_amount }
  const [discountLoading, setDiscountLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);

  const SHIPPING = 250;
  const subtotal = total;
  const discountAmount = discount?.discount_amount || 0;
  const orderTotal = subtotal + SHIPPING - discountAmount;

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ── Apply discount code ───────────────────────────────────────────────────
  const applyDiscount = async () => {
    if (!discountCode.trim()) return;
    setDiscountLoading(true);
    try {
      const res = await fetch(`${API}/api/orders/validate-discount`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: discountCode.trim(), subtotal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid code');
      setDiscount(data);
      toast.success(`Code applied — Rs ${data.discount_amount.toLocaleString()} off`);
    } catch (err) {
      toast.error(err.message);
      setDiscount(null);
    } finally {
      setDiscountLoading(false);
    }
  };

  // ── Place order ───────────────────────────────────────────────────────────
  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.address || !form.city) {
      toast.error('Please fill all required fields');
      return;
    }
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          shipping_address: {
            line1: form.address,
            line2: form.address2,
            city: form.city,
            province: form.province,
            postal_code: form.postal,
            country: 'Pakistan',
          },
          items: items.map((i) => ({
            product_id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            size: i.size,
            image: i.image,
          })),
          subtotal,
          shipping_fee: SHIPPING,
          discount_amount: discountAmount,
          discount_code: discount?.code || null,
          total: orderTotal,
          payment_method: form.payment,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to place order');
      setOrderNumber(data.order_number);
      clearCart();
    } catch (err) {
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Order confirmed screen ────────────────────────────────────────────────
  if (orderNumber) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
        <div>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', letterSpacing: '0.3em', color: '#d4c5a9', marginBottom: '24px' }}>ORDER CONFIRMED</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(48px, 7vw, 80px)', fontWeight: 300, color: '#f0ede8', marginBottom: '16px', lineHeight: 1 }}>
            Thank you,<br />{form.name.split(' ')[0]}.
          </h1>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', letterSpacing: '0.2em', color: '#d4c5a9', marginBottom: '8px' }}>
            {orderNumber}
          </p>
          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#555', marginBottom: '48px' }}>
            Confirmation sent to {form.email}
          </p>
          <a href="/" style={{ display: 'inline-block', padding: '16px 48px', background: '#f0ede8', color: '#060606', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'Jost, sans-serif' }}>
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  // ── Checkout form ─────────────────────────────────────────────────────────
  return (
    <>
      <Head><title>Checkout — SADÉ</title></Head>

      <div style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        maxWidth: '1200px',
        margin: '0 auto',
        gap: '80px',
        padding: '120px clamp(24px, 5vw, 80px) 80px',
      }}>

        {/* ── Left: Form ── */}
        <div>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', letterSpacing: '0.3em', color: '#444', marginBottom: '12px' }}>SADÉ</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '40px', fontWeight: 300, color: '#f0ede8', marginBottom: '48px' }}>Checkout</h1>

          <form onSubmit={submit}>

            {/* Contact */}
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '9px', letterSpacing: '0.2em', color: '#444', textTransform: 'uppercase', marginBottom: '16px' }}>Contact</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
              <input name="name" placeholder="Full name *" value={form.name} onChange={handle} style={inputStyle} required />
              <input name="email" type="email" placeholder="Email address *" value={form.email} onChange={handle} style={inputStyle} required />
              <input name="phone" placeholder="Phone number" value={form.phone} onChange={handle} style={inputStyle} />
            </div>

            {/* Delivery */}
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '9px', letterSpacing: '0.2em', color: '#444', textTransform: 'uppercase', marginBottom: '16px' }}>Delivery</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
              <input name="address" placeholder="Street address *" value={form.address} onChange={handle} style={inputStyle} required />
              <input name="address2" placeholder="Apartment, suite, etc. (optional)" value={form.address2} onChange={handle} style={inputStyle} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input name="city" placeholder="City *" value={form.city} onChange={handle} style={inputStyle} required />
                <input name="province" placeholder="Province" value={form.province} onChange={handle} style={inputStyle} />
              </div>
              <input name="postal" placeholder="Postal code" value={form.postal} onChange={handle} style={inputStyle} />
            </div>

            {/* Discount code */}
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '9px', letterSpacing: '0.2em', color: '#444', textTransform: 'uppercase', marginBottom: '16px' }}>Discount Code</p>
            <div style={{ display: 'flex', gap: '0', marginBottom: '40px' }}>
              <input
                placeholder="Enter code (e.g. SADE10)"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                style={{ ...inputStyle, flex: 1 }}
                disabled={!!discount}
              />
              <button
                type="button"
                onClick={applyDiscount}
                disabled={discountLoading || !!discount}
                style={{
                  padding: '14px 24px',
                  background: discount ? '#1a1a1a' : '#f0ede8',
                  color: discount ? '#555' : '#060606',
                  border: 'none',
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '10px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: discount ? 'default' : 'pointer',
                  flexShrink: 0,
                }}
              >
                {discountLoading ? '...' : discount ? 'Applied ✓' : 'Apply'}
              </button>
            </div>

            {/* Payment */}
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '9px', letterSpacing: '0.2em', color: '#444', textTransform: 'uppercase', marginBottom: '16px' }}>Payment</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '48px' }}>
              {[['cod', 'Cash on Delivery'], ['card', 'Credit / Debit Card (Coming Soon)']].map(([val, label]) => (
                <label key={val} style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '16px',
                  border: `1px solid ${form.payment === val ? '#d4c5a9' : '#111'}`,
                  cursor: val === 'card' ? 'not-allowed' : 'pointer',
                  opacity: val === 'card' ? 0.4 : 1,
                  transition: 'border-color 0.3s',
                }}>
                  <input
                    type="radio"
                    name="payment"
                    value={val}
                    checked={form.payment === val}
                    onChange={handle}
                    disabled={val === 'card'}
                    style={{ accentColor: '#d4c5a9' }}
                  />
                  <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: form.payment === val ? '#f0ede8' : '#555' }}>{label}</span>
                </label>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#1a1a1a' : '#f0ede8',
                color: loading ? '#444' : '#060606',
                border: 'none',
                padding: '18px',
                fontSize: '11px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontFamily: 'Jost, sans-serif',
                cursor: loading ? 'wait' : 'pointer',
                transition: 'all 0.3s',
              }}
            >
              {loading ? 'Placing Order...' : `Place Order — Rs ${orderTotal.toLocaleString()}`}
            </button>
          </form>
        </div>

        {/* ── Right: Order summary ── */}
        <div>
          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '9px', letterSpacing: '0.2em', color: '#444', textTransform: 'uppercase', marginBottom: '32px' }}>Order Summary</p>

          {items.length === 0 ? (
            <p style={{ color: '#333', fontFamily: 'Jost, sans-serif', fontSize: '13px' }}>Your cart is empty.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
              {items.map((item) => (
                <div key={item.key} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '64px', height: '80px', background: '#111', flexShrink: 0, overflow: 'hidden' }}>
                    {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', color: '#f0ede8', marginBottom: '4px' }}>{item.name}</p>
                    <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', color: '#444' }}>Size {item.size} · Qty {item.quantity}</p>
                  </div>
                  <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '14px', color: '#f0ede8' }}>
                    Rs {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div style={{ borderTop: '1px solid #111', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#444' }}>Subtotal</span>
              <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '14px', color: '#f0ede8' }}>Rs {subtotal.toLocaleString()}</span>
            </div>
            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#a8c5a0' }}>Discount ({discount.code})</span>
                <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '14px', color: '#a8c5a0' }}>− Rs {discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#444' }}>Shipping</span>
              <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '14px', color: '#f0ede8' }}>Rs {SHIPPING.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #111', paddingTop: '16px', marginTop: '4px' }}>
              <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#f0ede8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Total</span>
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', color: '#f0ede8', fontWeight: 300 }}>Rs {orderTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </>
  );
}