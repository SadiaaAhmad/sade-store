import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useCart } from '../../hooks/useCart';
import { toast } from 'react-hot-toast';

const API = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

export default function ProductPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIndex, setImgIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem, openCart } = useCart();

  // Get slug from URL
  useEffect(() => {
    const slug = window.location.pathname.split('/product/')[1];
    if (!slug) return;
    fetch(`${API}/api/products/${slug}`)
      .then(r => r.json())
      .then(d => { if (d && !d.error) setProduct(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = () => {
    if (!product || product.is_sold_out) return;
    addItem(product, product.size || 'One Size', 1);
    setAdded(true);
    toast.success('Added to cart');
    setTimeout(() => setAdded(false), 2000);
    openCart();
  };

  const images = product?.images || [];
  const price = product?.discounted_price || product?.price;

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '1px', height: '60px', background: 'linear-gradient(to bottom,#d4c5a9,transparent)', animation: 'pulse 1.4s ease infinite' }} />
      <style>{`@keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}`}</style>
    </div>
  );

  if (!product) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
      <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', fontWeight: 300, color: '#333' }}>Product not found.</p>
      <Link href="/collection" style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', letterSpacing: '0.2em', color: '#555', textDecoration: 'none', textTransform: 'uppercase' }}>← Back to Collection</Link>
    </div>
  );

  return (
    <>
      <Head>
        <title>{product.name} — SADÉ</title>
        <meta name="description" content={product.description || `${product.name} — Custom 1 of 1 by SADÉ`} />
      </Head>

      <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
        {/* Breadcrumb */}
        <div style={{ padding: '0 clamp(24px,5vw,80px)', marginBottom: '40px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/collection" style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', letterSpacing: '0.2em', color: '#444', textDecoration: 'none', textTransform: 'uppercase', transition: 'color 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#f0ede8'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#444'; }}
          >Collection</Link>
          <span style={{ color: '#2a2a2a', fontSize: '10px' }}>›</span>
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', letterSpacing: '0.2em', color: '#666', textTransform: 'uppercase' }}>{product.name}</span>
        </div>

        {/* Main layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', padding: '0 clamp(24px,5vw,80px)', maxWidth: '1300px', margin: '0 auto' }} className="product-grid">

          {/* ── LEFT: Images ── */}
          <div style={{ paddingRight: 'clamp(20px,4vw,60px)' }}>
            {/* Main image */}
            <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#0c0c0c', marginBottom: '8px' }}>
              {images.length > 0
                ? <img src={images[imgIndex]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.4s ease' }} />
                : <div style={{ width: '100%', height: '100%', background: '#111' }} />
              }
              {/* 1/1 badge */}
              <div style={{ position: 'absolute', top: '20px', left: '20px', border: '1px solid rgba(212,197,169,0.35)', padding: '6px 14px', background: 'rgba(6,6,6,0.7)' }}>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', letterSpacing: '0.18em', color: '#d4c5a9' }}>1 / 1</span>
              </div>
              
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIndex(i)} style={{ width: '68px', height: '84px', padding: 0, border: `1px solid ${imgIndex === i ? '#d4c5a9' : '#111'}`, background: 'none', cursor: 'pointer', overflow: 'hidden', transition: 'border-color 0.3s' }}>
                    <img src={img} alt={`View ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Details ── */}
          <div style={{ paddingLeft: 'clamp(20px,4vw,60px)', paddingTop: '8px' }}>
            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', letterSpacing: '0.25em', color: '#444', textTransform: 'uppercase', marginBottom: '16px' }}>
              {product.collection} · Custom
            </p>
            <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(36px,4.5vw,60px)', fontWeight: 400, color: '#f0ede8', letterSpacing: '0.02em', lineHeight: 1.05, marginBottom: '24px' }}>
              {product.name}
            </h1>

            {/* Price */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '36px' }}>
              {product.is_sold_out ? (
                <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '22px', color: '#444' }}>Sold Out</span>
              ) : (
                <>
                  <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 300, color: '#f0ede8' }}>
                    Rs {Number(price).toLocaleString()}
                  </span>
                  {product.discounted_price && (
                    <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '16px', color: '#333', textDecoration: 'line-through' }}>
                      Rs {Number(product.price).toLocaleString()}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div style={{ marginBottom: '36px' }}>
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '14px', fontWeight: 300, color: '#888', lineHeight: 2 }}>
                  {product.description}
                </p>
              </div>
            )}

            {/* Size / Fit info — custom per product, set by you in admin */}
            {product.size && (
              <div style={{ marginBottom: '36px', padding: '20px 24px', border: '1px solid #141414', background: '#0a0a0a' }}>
                <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', letterSpacing: '0.22em', color: '#555', textTransform: 'uppercase', marginBottom: '12px' }}>Size & Fit</p>
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '14px', color: '#888', lineHeight: 1.9, whiteSpace: 'pre-line' }}>
                  {product.size}
                </p>
              </div>
            )}

            {/* Details strip */}
            <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                ['Made in', 'Pakistan'],
                ['Quantity', '1 of 1 — never repeated'],
                ['Dispatch', '3–5 business days'],
                ['Payment', 'Cash on Delivery'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #0e0e0e', paddingBottom: '10px' }}>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', letterSpacing: '0.18em', color: '#3a3a3a', textTransform: 'uppercase' }}>{k}</span>
                  <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#777' }}>{v}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={handleAdd}
              disabled={product.is_sold_out}
              style={{
                width: '100%',
                background: product.is_sold_out ? '#0d0d0d' : (added ? '#1a2a1a' : '#f0ede8'),
                color: product.is_sold_out ? '#333' : (added ? '#4a8b5c' : '#060606'),
                border: product.is_sold_out ? '1px solid #1a1a1a' : 'none',
                padding: '18px',
                fontFamily: 'Jost, sans-serif', fontSize: '11px', fontWeight: 500,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                cursor: product.is_sold_out ? 'not-allowed' : 'pointer',
                transition: 'all 0.4s cubic-bezier(0.19,1,0.22,1)',
                marginBottom: '12px',
              }}
            >
              {product.is_sold_out ? 'Sold Out' : added ? 'Added ✓' : 'Add to Cart'}
            </button>

            <Link href="/checkout" style={{ display: 'block', textAlign: 'center', padding: '17px', border: '1px solid #1a1a1a', background: 'transparent', color: '#888', fontFamily: 'Jost, sans-serif', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#d4c5a9'; e.currentTarget.style.color = '#f0ede8'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.color = '#888'; }}
            >
              Buy Now
            </Link>

            {/* Trust line */}
            <p style={{ textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', letterSpacing: '0.18em', color: '#2a2a2a', marginTop: '20px', textTransform: 'uppercase' }}>
              Free shipping · Cash on delivery · 1 of 1
            </p>
          </div>
        </div>

        {/* ── Bottom padding ── */}
        <div style={{ height: 'clamp(80px,10vw,140px)' }} />
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .product-grid {
            grid-template-columns: 1fr !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
          .product-grid > div:first-child { padding-right: 0 !important; margin-bottom: 36px; }
          .product-grid > div:last-child { padding-left: 0 !important; }
        }
      `}</style>
    </>
  );
}