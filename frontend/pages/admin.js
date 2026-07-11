import { useState, useEffect } from 'react';
import Head from 'next/head';
import { toast } from 'react-hot-toast';

const API = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'sade2025';

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('products');
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); fetchAll(); }
    else toast.error('Wrong password');
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pRes, oRes] = await Promise.all([
        fetch(`${API}/api/products`),
        fetch(`${API}/api/admin/orders`, { headers: { 'x-admin-password': ADMIN_PASSWORD } }),
      ]);
      if (pRes.ok) setProducts(await pRes.json());
      if (oRes.ok) setOrders(await oRes.json());
    } catch { toast.error('Failed to load data'); }
    setLoading(false);
  };

  const saveProduct = async () => {
    if (!editing.name || !editing.slug || !editing.price) { toast.error('Name, slug and price are required'); return; }
    setSaving(true);
    try {
      const method = editing.id ? 'PUT' : 'POST';
      const url = editing.id ? `${API}/api/products/${editing.id}` : `${API}/api/products`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-admin-password': ADMIN_PASSWORD },
        body: JSON.stringify(editing),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      toast.success(editing.id ? 'Updated!' : 'Created!');
      setEditing(null);
      fetchAll();
    } catch (e) { toast.error(e.message); }
    setSaving(false);
  };

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    try {
      const res = await fetch(`${API}/api/products/${id}`, { method: 'DELETE', headers: { 'x-admin-password': ADMIN_PASSWORD } });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Deleted');
      setProducts(p => p.filter(x => x.id !== id));
    } catch (e) { toast.error(e.message); }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await fetch(`${API}/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': ADMIN_PASSWORD },
        body: JSON.stringify({ order_status: status }),
      });
      if (!res.ok) throw new Error('Update failed');
      setOrders(o => o.map(x => x.id === orderId ? { ...x, order_status: status } : x));
      toast.success('Status updated');
    } catch (e) { toast.error(e.message); }
  };

  // ── Auth ──────────────────────────────────────────────────────────────────
  if (!authed) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#060606', padding: '24px' }}>
      <Head><title>Admin — SADÉ</title></Head>
      <div style={{ width: '100%', maxWidth: '340px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '44px', fontWeight: 300, letterSpacing: '0.45em', color: '#f0ede8', marginBottom: '6px' }}>SADÉ</h1>
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', letterSpacing: '0.3em', color: '#333', marginBottom: '52px' }}>ADMIN DASHBOARD</p>
        <input type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()}
          style={{ width: '100%', background: 'transparent', border: '1px solid #1a1a1a', padding: '14px 16px', color: '#f0ede8', fontFamily: 'Jost, sans-serif', fontSize: '14px', outline: 'none', marginBottom: '10px', boxSizing: 'border-box', borderRadius: 0 }} autoFocus
        />
        <button onClick={login} style={{ width: '100%', background: '#f0ede8', color: '#060606', border: 'none', padding: '15px', fontFamily: 'Jost, sans-serif', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', cursor: 'pointer' }}>
          Enter
        </button>
      </div>
    </div>
  );

  const S = styles;

  return (
    <div style={{ minHeight: '100vh', background: '#060606', color: '#f0ede8' }}>
      <Head><title>Admin — SADÉ</title></Head>

      {/* Top bar */}
      <div style={{ borderBottom: '1px solid #111', padding: '18px clamp(24px,4vw,56px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 300, letterSpacing: '0.35em', color: '#f0ede8' }}>SADÉ</span>
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', letterSpacing: '0.22em', color: '#2a2a2a', textTransform: 'uppercase' }}>Admin</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <a href="/" target="_blank" rel="noreferrer" style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', letterSpacing: '0.15em', color: '#444', textDecoration: 'none', textTransform: 'uppercase', transition: 'color 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#f0ede8'; }} onMouseLeave={e => { e.currentTarget.style.color = '#444'; }}>
            View Site ↗
          </a>
          <button onClick={() => setAuthed(false)} style={S.ghostBtn}>Sign Out</button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ padding: '24px clamp(24px,4vw,56px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '2px', marginBottom: '0' }}>
        {[
          { label: 'Total Products', value: products.length },
          { label: 'Active', value: products.filter(p => !p.is_sold_out).length },
          { label: 'Sold Out', value: products.filter(p => p.is_sold_out).length },
          { label: 'Orders', value: orders.length },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: '#0c0c0c', border: '1px solid #111', padding: '20px 24px' }}>
            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', letterSpacing: '0.2em', color: '#333', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</p>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', fontWeight: 300, color: '#f0ede8', lineHeight: 1 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid #111', padding: '0 clamp(24px,4vw,56px)', display: 'flex', marginTop: '24px' }}>
        {['products', 'orders'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Jost, sans-serif', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: tab === t ? '#f0ede8' : '#444', padding: '16px 20px 14px', borderBottom: tab === t ? '2px solid #d4c5a9' : '2px solid transparent', transition: 'color 0.3s' }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ padding: 'clamp(24px,4vw,56px)' }}>

        {/* ── PRODUCTS ── */}
        {tab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 300, color: '#f0ede8' }}>Products</h2>
              <button onClick={() => setEditing({ name: '', slug: '', price: '', discounted_price: '', collection: 'Volume I', category: 'shirt', images: [''], size: '', description: '', is_sold_out: false })} style={S.primaryBtn}>
                + New Product
              </button>
            </div>

            {loading ? <div style={{ textAlign: 'center', padding: '80px', color: '#333', fontFamily: 'Jost, sans-serif' }}>Loading...</div> : (
              <div>
                {/* Table header */}
                <div style={{ display: 'grid', gridTemplateColumns: '72px 1fr 110px 110px 90px 100px', gap: '16px', padding: '10px 16px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', letterSpacing: '0.18em', color: '#2e2e2e', borderBottom: '1px solid #0e0e0e', textTransform: 'uppercase' }}>
                  <span>Photo</span><span>Name / Slug</span><span>Price</span><span>Sale</span><span>Status</span><span>Actions</span>
                </div>
                {products.length === 0 && (
                  <div style={{ padding: '60px', textAlign: 'center', color: '#2a2a2a', fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 300 }}>No products yet.</div>
                )}
                {products.map(p => (
                  <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '72px 1fr 110px 110px 90px 100px', gap: '16px', padding: '16px', alignItems: 'center', background: '#0a0a0a', borderBottom: '1px solid #0e0e0e', transition: 'background 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#0d0d0d'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#0a0a0a'; }}
                  >
                    <div style={{ width: '60px', height: '76px', background: '#111', overflow: 'hidden', flexShrink: 0 }}>
                      {p.images?.[0] && <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '17px', color: '#f0ede8', marginBottom: '4px' }}>{p.name}</p>
                      <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', color: '#2e2e2e', letterSpacing: '0.1em' }}>{p.slug}</p>
                    </div>
                    <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '14px', color: '#c8bfb2' }}>Rs {Number(p.price).toLocaleString()}</span>
                    <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '14px', color: p.discounted_price ? '#a8c5a0' : '#2a2a2a' }}>
                      {p.discounted_price ? `Rs ${Number(p.discounted_price).toLocaleString()}` : '—'}
                    </span>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', letterSpacing: '0.1em', color: p.is_sold_out ? '#7a3a3a' : '#3a6b4a', background: p.is_sold_out ? 'rgba(122,58,58,0.12)' : 'rgba(58,107,74,0.12)', padding: '4px 8px', display: 'inline-block', textTransform: 'uppercase' }}>
                      {p.is_sold_out ? 'Sold Out' : 'Active'}
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => setEditing({ ...p, images: p.images || [''] })} style={S.editBtn}>Edit</button>
                      <button onClick={() => deleteProduct(p.id)} style={S.deleteBtn}>Del</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab === 'orders' && (
          <div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 300, color: '#f0ede8', marginBottom: '28px' }}>Orders</h2>
            {loading ? <div style={{ textAlign: 'center', padding: '80px', color: '#333', fontFamily: 'Jost, sans-serif' }}>Loading...</div>
              : orders.length === 0 ? <div style={{ padding: '60px', textAlign: 'center', color: '#2a2a2a', fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 300 }}>No orders yet.</div>
              : orders.map(o => {
                const addr = o.shipping_address || {};
                const items = Array.isArray(o.items) ? o.items : [];
                return (
                  <div key={o.id} style={{ background: '#0a0a0a', border: '1px solid #0e0e0e', padding: '24px 28px', marginBottom: '2px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', letterSpacing: '0.14em', color: '#d4c5a9', marginBottom: '4px' }}>{o.order_number}</p>
                        <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '16px', color: '#f0ede8', marginBottom: '2px' }}>{o.customer_name}</p>
                        <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#555' }}>{o.customer_email} {o.customer_phone ? `· ${o.customer_phone}` : ''}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', color: '#f0ede8', marginBottom: '4px' }}>Rs {Number(o.total).toLocaleString()}</p>
                        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', color: '#333', letterSpacing: '0.1em' }}>{new Date(o.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div style={{ borderTop: '1px solid #0e0e0e', paddingTop: '14px', marginBottom: '14px' }}>
                      {items.map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                          <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#777' }}>{item.name} <span style={{ color: '#333' }}>× {item.quantity}{item.size ? ` · ${item.size}` : ''}</span></span>
                          <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#777' }}>Rs {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#3a3a3a' }}>
                        📍 {[addr.line1, addr.city, addr.province].filter(Boolean).join(', ')}
                      </p>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', letterSpacing: '0.1em', color: '#333' }}>STATUS</span>
                        <select value={o.order_status} onChange={e => updateOrderStatus(o.id, e.target.value)}
                          style={{ background: '#111', border: '1px solid #1e1e1e', color: '#f0ede8', fontFamily: 'Jost, sans-serif', fontSize: '11px', padding: '7px 12px', cursor: 'pointer', outline: 'none' }}>
                          {['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })
            }
          </div>
        )}
      </div>

      {/* ── EDIT MODAL ── */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 2000, overflowY: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 20px' }}>
          <div style={{ background: '#0c0c0c', border: '1px solid #1a1a1a', width: '100%', maxWidth: '640px', padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '26px', fontWeight: 300, color: '#f0ede8' }}>
                {editing.id ? 'Edit Product' : 'New Product'}
              </h3>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Field label="Product Name *">
                <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="e.g. The Dragon Tee" style={S.input} />
              </Field>

              <Field label="URL Slug * (no spaces, use hyphens)">
                <input value={editing.slug} onChange={e => setEditing({ ...editing, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder="e.g. dragon-tee-maroon" style={S.input} />
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <Field label="Price (Rs) *">
                  <input type="number" value={editing.price} onChange={e => setEditing({ ...editing, price: e.target.value })} placeholder="3500" style={S.input} />
                </Field>
                <Field label="Sale Price (Rs) — optional">
                  <input type="number" value={editing.discounted_price || ''} onChange={e => setEditing({ ...editing, discounted_price: e.target.value || null })} placeholder="Leave blank = no sale" style={S.input} />
                </Field>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <Field label="Category">
                  <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} style={S.select}>
                    {['shirt', 'pants', 'hoodie', 'jacket', 'set', 'other'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </Field>
                <Field label="Collection">
                  <input value={editing.collection} onChange={e => setEditing({ ...editing, collection: e.target.value })} placeholder="Volume I" style={S.input} />
                </Field>
              </div>

              <Field label="Product Images — one URL per line">
                <textarea
                  value={(editing.images || ['']).join('\n')}
                  onChange={e => setEditing({ ...editing, images: e.target.value.split('\n') })}
                  placeholder={"https://your-image.jpg\nhttps://your-image-2.jpg"}
                  rows={3}
                  style={{ ...S.input, resize: 'vertical', lineHeight: 1.8 }}
                />
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', color: '#333', marginTop: '6px' }}>
                  Upload to Supabase Storage or Cloudinary → paste URLs here
                </p>
              </Field>

              <Field label="Size & Fit Info (write exactly what you want shown)">
                <textarea
                  value={editing.size || ''}
                  onChange={e => setEditing({ ...editing, size: e.target.value })}
                  placeholder={"e.g.:\nChest: 42 inches\nLength: 28 inches\nFit: Oversized — model is 5'9\""}
                  rows={4}
                  style={{ ...S.input, resize: 'vertical', lineHeight: 1.9, fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px' }}
                />
              </Field>

              <Field label="Product Description">
                <textarea
                  value={editing.description || ''}
                  onChange={e => setEditing({ ...editing, description: e.target.value })}
                  placeholder="Describe the piece — fabric, the vibe, what makes it special..."
                  rows={4}
                  style={{ ...S.input, resize: 'vertical', lineHeight: 1.9 }}
                />
              </Field>

              <Field label="Status">
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[false, true].map(val => (
                    <button key={String(val)} type="button" onClick={() => setEditing({ ...editing, is_sold_out: val })}
                      style={{ padding: '10px 24px', background: editing.is_sold_out === val ? (val ? 'rgba(122,58,58,0.2)' : 'rgba(58,107,74,0.2)') : 'transparent', border: `1px solid ${editing.is_sold_out === val ? (val ? '#7a3a3a' : '#3a6b4a') : '#1a1a1a'}`, color: editing.is_sold_out === val ? (val ? '#c87a7a' : '#7ac87a') : '#555', fontFamily: 'Jost, sans-serif', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}>
                      {val ? 'Sold Out' : 'Active'}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '32px' }}>
              <button onClick={saveProduct} disabled={saving} style={{ flex: 1, background: saving ? '#1a1a1a' : '#f0ede8', color: saving ? '#444' : '#060606', border: 'none', padding: '16px', fontFamily: 'Jost, sans-serif', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', cursor: saving ? 'wait' : 'pointer', transition: 'all 0.3s' }}>
                {saving ? 'Saving...' : editing.id ? 'Save Changes' : 'Create Product'}
              </button>
              <button onClick={() => setEditing(null)} style={S.ghostBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', letterSpacing: '0.2em', color: '#444', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</label>
      {children}
    </div>
  );
}

const styles = {
  input: { width: '100%', background: 'transparent', border: '1px solid #1a1a1a', color: '#f0ede8', fontFamily: 'Jost, sans-serif', fontSize: '14px', padding: '12px 14px', outline: 'none', boxSizing: 'border-box', borderRadius: 0 },
  select: { width: '100%', background: '#0c0c0c', border: '1px solid #1a1a1a', color: '#f0ede8', fontFamily: 'Jost, sans-serif', fontSize: '14px', padding: '12px 14px', outline: 'none', boxSizing: 'border-box', cursor: 'pointer', borderRadius: 0 },
  primaryBtn: { background: '#f0ede8', color: '#060606', border: 'none', padding: '12px 28px', fontFamily: 'Jost, sans-serif', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' },
  ghostBtn: { background: 'transparent', border: '1px solid #1a1a1a', color: '#555', padding: '12px 24px', fontFamily: 'Jost, sans-serif', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' },
  editBtn: { background: 'transparent', border: '1px solid #1a1a1a', color: '#777', padding: '6px 12px', fontFamily: 'Jost, sans-serif', fontSize: '10px', letterSpacing: '0.1em', cursor: 'pointer' },
  deleteBtn: { background: 'transparent', border: '1px solid #2a1010', color: '#5a2a2a', padding: '6px 12px', fontFamily: 'Jost, sans-serif', fontSize: '10px', letterSpacing: '0.1em', cursor: 'pointer' },
};