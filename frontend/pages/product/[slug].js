import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCart } from '../../hooks/useCart';
import { toast } from 'react-hot-toast';

const API = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

const SIZE_GUIDES = {
  'pure-essence-dragon-tee': {
    size: 'Small',
    measurements: [
      { label: 'Body Length', cm: 67, inch: 27 },
      { label: 'Chest Width', cm: 52, inch: 21 },
      { label: 'Across Shoulder', cm: 48, inch: 19 },
      { label: 'Sleeve Length', cm: 21, inch: 9 },
    ],
  },
  'phantom-skull-wash-tee': {
    size: 'Small',
    measurements: [
      { label: 'Body Length', cm: 66, inch: 26 },
      { label: 'Chest Width', cm: 56, inch: 22 },
    ],
  },
  'crimson-dragon-tee': {
    size: 'Small',
    measurements: [
      { label: 'Body Length', cm: 66, inch: 26 },
      { label: 'Chest Width', cm: 56, inch: 22 },
    ],
  },
};

const COMPOSITION = {
  'pure-essence-dragon-tee': {
    details: [
      'Heavyweight 200+ GSM (breathable)',
      'Composition: 100% cotton terry',
      'Relaxed boxy fit',
      'Uni-sex: Yes',
    ],
    care: [
      'Hand wash with similar shades',
      'DO NOT BLEACH',
      'Dry in a dryer',
      'Iron inside out on medium heat',
      'Do not iron directly on paints',
    ],
  },
  'phantom-skull-wash-tee': {
    details: [
      'Heavyweight 200+ GSM (breathable)',
      'Composition: 100% cotton terry',
      'Relaxed boxy fit',
      'Uni-sex: Yes',
    ],
    care: [
      'Hand wash with similar shades',
      'DO NOT BLEACH',
      'Dry in a dryer',
      'Iron inside out on medium heat',
      'Do not iron directly on paints',
    ],
  },
  'crimson-dragon-tee': {
    details: [
      'Heavyweight 200+ GSM (breathable)',
      'Composition: 100% cotton terry',
      'Relaxed boxy fit',
      'Uni-sex: Yes',
    ],
    care: [
      'Hand wash with similar shades',
      'DO NOT BLEACH',
      'Dry in a dryer',
      'Iron inside out on medium heat',
      'Do not iron directly on paints',
    ],
  },
};

export default function ProductPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIndex, setImgIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { addItem, openCart } = useCart();
  const router = useRouter();
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

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

  const handleBuyNow = () => {
    if (!product || product.is_sold_out) return;
    addItem(product, product.size || 'One Size', 1);
    router.push('/checkout');
  };

  const onTouchStart = e => { touchStartX.current = e.targetTouches[0].clientX; };
  const onTouchMove = e => { touchEndX.current = e.targetTouches[0].clientX; };
  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) < 50) return;
    if (diff > 0 && imgIndex < images.length - 1) setImgIndex(i => i + 1);
    if (diff < 0 && imgIndex > 0) setImgIndex(i => i - 1);
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const images = product?.images || [];
  const price = product?.discounted_price || product?.price;
  const slug = product?.slug;
  const sizeGuide = SIZE_GUIDES[slug];
  const comp = COMPOSITION[slug];

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
            {/* Swipeable main image */}
            <div
              style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#0c0c0c', marginBottom: '8px', userSelect: 'none' }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {images.length > 0
                ? <img src={images[imgIndex]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.35s ease', pointerEvents: 'none' }} />
                : <div style={{ width: '100%', height: '100%', background: '#111' }} />
              }
              {/* 1/1 badge */}
              <div style={{ position: 'absolute', top: '20px', left: '20px', border: '1px solid rgba(212,197,169,0.35)', padding: '6px 14px', background: 'rgba(6,6,6,0.7)' }}>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', letterSpacing: '0.18em', color: '#d4c5a9' }}>1 / 1</span>
              </div>
              {/* Dot indicators for swipe */}
              {images.length > 1 && (
                <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
                  {images.map((_, i) => (
                    <div key={i} onClick={() => setImgIndex(i)}
                      style={{ width: imgIndex === i ? '20px' : '6px', height: '6px', background: imgIndex === i ? '#d4c5a9' : 'rgba(255,255,255,0.25)', borderRadius: '3px', cursor: 'pointer', transition: 'all 0.3s' }}
                    />
                  ))}
                </div>
              )}
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
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 300, color: product.is_sold_out ? '#3a3a3a' : '#f0ede8', textDecoration: product.is_sold_out ? 'line-through' : 'none' }}>
                Rs {Number(price).toLocaleString()}
              </span>
              {product.is_sold_out && (
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: '#555', textTransform: 'uppercase' }}>Sold Out</span>
              )}
              {!product.is_sold_out && product.discounted_price && (
                <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '16px', color: '#333', textDecoration: 'line-through' }}>
                  Rs {Number(product.price).toLocaleString()}
                </span>
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

            {/* Details strip */}
            <div style={{ marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
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

            {/* ── SIZE GUIDE accordion ── */}
            <div style={{ borderTop: '1px solid #111' }}>
              <button onClick={() => setSizeOpen(o => !o)} style={{ width: '100%', background: 'none', border: 'none', padding: '18px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', letterSpacing: '0.22em', color: '#888', textTransform: 'uppercase' }}>Size Guide</span>
                <span style={{ color: '#555', fontSize: '18px', lineHeight: 1, transform: sizeOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s', fontWeight: 300 }}>+</span>
              </button>
              <div style={{ overflow: 'hidden', maxHeight: sizeOpen ? '500px' : '0', transition: 'max-height 0.4s cubic-bezier(0.19,1,0.22,1)', paddingBottom: sizeOpen ? '24px' : '0' }}>
                {sizeGuide ? (
                  <div>
                    <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#888', marginBottom: '20px' }}>
                      Size: <strong style={{ color: '#f0ede8' }}>{sizeGuide.size}</strong>
                    </p>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', letterSpacing: '0.2em', color: '#444', textAlign: 'left', paddingBottom: '12px', textTransform: 'uppercase' }}>Measurements</th>
                          <th style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', letterSpacing: '0.2em', color: '#444', textAlign: 'center', paddingBottom: '12px', textTransform: 'uppercase' }}>CM</th>
                          <th style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', letterSpacing: '0.2em', color: '#444', textAlign: 'center', paddingBottom: '12px', textTransform: 'uppercase' }}>INCH</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sizeGuide.measurements.map(({ label, cm, inch }) => (
                          <tr key={label} style={{ borderTop: '1px solid #111' }}>
                            <td style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#888', padding: '12px 0' }}>{label}</td>
                            <td style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#f0ede8', textAlign: 'center', padding: '12px 0' }}>{cm}</td>
                            <td style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#f0ede8', textAlign: 'center', padding: '12px 0' }}>{inch}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#888' }}>{product.size || 'Size info not available.'}</p>
                )}
              </div>
            </div>

            {/* ── PRODUCT DETAILS & COMPOSITION accordion ── */}
            <div style={{ borderTop: '1px solid #111' }}>
              <button onClick={() => setDetailsOpen(o => !o)} style={{ width: '100%', background: 'none', border: 'none', padding: '18px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', letterSpacing: '0.22em', color: '#888', textTransform: 'uppercase' }}>Product Details & Composition</span>
                <span style={{ color: '#555', fontSize: '18px', lineHeight: 1, transform: detailsOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s', fontWeight: 300 }}>+</span>
              </button>
              <div style={{ overflow: 'hidden', maxHeight: detailsOpen ? '600px' : '0', transition: 'max-height 0.4s cubic-bezier(0.19,1,0.22,1)', paddingBottom: detailsOpen ? '24px' : '0' }}>
                {comp ? (
                  <div>
                    <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', letterSpacing: '0.2em', color: '#555', textTransform: 'uppercase', marginBottom: '12px' }}>Details</p>
                    <ul style={{ paddingLeft: '0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                      {comp.details.map((item, i) => (
                        <li key={i} style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#888', display: 'flex', gap: '10px' }}>
                          <span style={{ color: '#444', flexShrink: 0 }}>·</span> {item}
                        </li>
                      ))}
                    </ul>
                    <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', letterSpacing: '0.2em', color: '#555', textTransform: 'uppercase', marginBottom: '12px' }}>Wash Care</p>
                    <ul style={{ paddingLeft: '0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {comp.care.map((item, i) => (
                        <li key={i} style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#888', display: 'flex', gap: '10px' }}>
                          <span style={{ color: '#444', flexShrink: 0 }}>·</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#888' }}>Details not available.</p>
                )}
              </div>
            </div>

            {/* CTA buttons */}
            <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={handleAdd} disabled={product.is_sold_out}
                style={{ width: '100%', background: product.is_sold_out ? '#0d0d0d' : (added ? '#1a2a1a' : '#f0ede8'), color: product.is_sold_out ? '#333' : (added ? '#4a8b5c' : '#060606'), border: product.is_sold_out ? '1px solid #1a1a1a' : 'none', padding: '18px', fontFamily: 'Jost, sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', cursor: product.is_sold_out ? 'not-allowed' : 'pointer', transition: 'all 0.4s cubic-bezier(0.19,1,0.22,1)' }}>
                {product.is_sold_out ? 'Sold Out' : added ? 'Added ✓' : 'Add to Cart'}
              </button>

              {!product.is_sold_out && (
                <button onClick={handleBuyNow}
                  style={{ width: '100%', background: 'transparent', border: '1px solid #1a1a1a', color: '#888', padding: '17px', fontFamily: 'Jost, sans-serif', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#d4c5a9'; e.currentTarget.style.color = '#f0ede8'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.color = '#888'; }}
                >
                  Buy Now
                </button>
              )}
            </div>

            <p style={{ textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', letterSpacing: '0.18em', color: '#2a2a2a', marginTop: '20px', textTransform: 'uppercase' }}>
              Free shipping · Cash on delivery · 1 of 1
            </p>
          </div>
        </div>

        <div style={{ height: 'clamp(80px,10vw,140px)' }} />
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: 1fr !important; padding-left: 20px !important; padding-right: 20px !important; }
          .product-grid > div:first-child { padding-right: 0 !important; margin-bottom: 36px; }
          .product-grid > div:last-child { padding-left: 0 !important; }
        }
      `}</style>
    </>
  );
}