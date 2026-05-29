import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useWishlist } from '../hooks/useWishlist';
import { toast } from 'react-hot-toast';

const API = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
const FILTERS = ['All', 'Shirts', 'Pants', 'Hoodies', 'Jackets', 'Sets'];

export default function CollectionPage() {
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/products`)
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setProducts(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => {
    if (active === 'All') return true;
    const map = { Shirts: 'shirt', Pants: 'pants', Hoodies: 'hoodie', Jackets: 'jacket', Sets: 'set' };
    return p.category === map[active];
  });

  return (
    <>
      <Head><title>Collection — SADÉ Volume I</title></Head>

      <div style={{ paddingTop: '140px', paddingBottom: '52px', paddingLeft: 'clamp(24px,5vw,80px)', paddingRight: 'clamp(24px,5vw,80px)', borderBottom: '1px solid #111' }}>
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', letterSpacing: '0.3em', color: '#444', textTransform: 'uppercase', marginBottom: '14px' }}>SADÉ · Custom 1 of 1</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(52px,8vw,100px)', fontWeight: 400, color: '#f0ede8', letterSpacing: '0.03em', lineHeight: 1 }}>Volume I</h1>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '17px', fontStyle: 'italic', color: '#555', maxWidth: '300px', lineHeight: 1.6 }}>"Not made to blend in"</p>
        </div>
      </div>

      <div style={{ padding: '0 clamp(24px,5vw,80px)', borderBottom: '1px solid #111', display: 'flex', gap: '0', overflowX: 'auto' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setActive(f)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Jost, sans-serif', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: active === f ? '#f0ede8' : '#444', padding: '18px 20px 16px', borderBottom: active === f ? '2px solid #d4c5a9' : '2px solid transparent', transition: 'color 0.3s', whiteSpace: 'nowrap', flexShrink: 0 }}>{f}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', paddingRight: '4px' }}>
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: '#333', letterSpacing: '0.1em' }}>
            {loading ? '—' : `${filtered.length} piece${filtered.length !== 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      <div style={{ padding: 'clamp(32px,4vw,60px) clamp(24px,5vw,80px) clamp(60px,8vw,120px)' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '3px' }}>
            {[1,2,3,4].map(i => <div key={i} style={{ background: '#0d0d0d', aspectRatio: '3/4', animation: 'sh 1.6s ease infinite' }} />)}
            <style>{`@keyframes sh{0%,100%{opacity:.35}50%{opacity:.65}}`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '100px 0', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 300, color: '#2a2a2a' }}>Nothing here yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '3px' }}>
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </>
  );
}

function ProductCard({ product }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const { toggleItem, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const images = Array.isArray(product.images) ? product.images : [product.image_url].filter(Boolean);

  const onTouchStart = e => { touchStartX.current = e.targetTouches[0].clientX; };
  const onTouchMove = e => { touchEndX.current = e.targetTouches[0].clientX; };
  const onTouchEnd = e => {
    e.stopPropagation();
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) < 50) return;
    if (diff > 0 && imgIndex < images.length - 1) setImgIndex(i => i + 1);
    if (diff < 0 && imgIndex > 0) setImgIndex(i => i - 1);
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: '#0c0c0c', cursor: 'pointer', position: 'relative' }}>
        <div
          style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <img src={images[imgIndex]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.9s cubic-bezier(0.19,1,0.22,1)', transform: hovered ? 'scale(1.07)' : 'scale(1)', pointerEvents: 'none' }} />

          {/* Hover overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,6,6,0.35)', opacity: hovered ? 1 : 0, transition: 'opacity 0.4s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', letterSpacing: '0.2em', color: '#f0ede8', textTransform: 'uppercase', border: '1px solid rgba(240,237,232,0.4)', padding: '12px 28px' }}>View Piece</span>
          </div>

          {/* 1/1 badge */}
          <div style={{ position: 'absolute', top: '14px', left: '14px', border: '1px solid rgba(212,197,169,0.3)', padding: '4px 10px', background: 'rgba(6,6,6,0.65)' }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', letterSpacing: '0.15em', color: '#d4c5a9' }}>1 / 1</span>
          </div>

          {/* Sold out tag */}
          {product.is_sold_out && (
            <div style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(6,6,6,0.85)', border: '1px solid #2a2a2a', padding: '4px 10px' }}>
              <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '8px', letterSpacing: '0.18em', color: '#555', textTransform: 'uppercase' }}>Sold Out</span>
            </div>
          )}

          {/* Sale tag */}
          {!product.is_sold_out && product.discounted_price && (
            <div style={{ position: 'absolute', top: '14px', right: '14px', background: '#d4c5a9', padding: '4px 10px' }}>
              <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '8px', letterSpacing: '0.1em', color: '#060606', textTransform: 'uppercase' }}>Sale</span>
            </div>
          )}

          {/* Wishlist heart */}
          <button onClick={e => { e.preventDefault(); e.stopPropagation(); toggleItem(product); toast(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist'); }}
            style={{ position: 'absolute', bottom: '14px', right: '14px', background: 'rgba(6,6,6,0.75)', border: `1px solid ${wishlisted ? '#d4c5a9' : '#222'}`, width: '38px', height: '38px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.3s', zIndex: 3 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill={wishlisted ? '#d4c5a9' : 'none'} stroke={wishlisted ? '#d4c5a9' : '#888'} strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* Swipe dots */}
          {images.length > 1 && (
            <div style={{ position: 'absolute', bottom: '14px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '5px' }}>
              {images.map((_, i) => (
                <div key={i} style={{ width: imgIndex === i ? '16px' : '5px', height: '5px', background: imgIndex === i ? '#d4c5a9' : 'rgba(255,255,255,0.2)', borderRadius: '3px', transition: 'all 0.3s' }} />
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '18px 4px 26px' }}>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', letterSpacing: '0.18em', color: '#2a2a2a', marginBottom: '7px', textTransform: 'uppercase' }}>{product.collection} · Custom</p>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 400, color: '#f0ede8', marginBottom: '10px', letterSpacing: '0.02em' }}>{product.name}</h3>
          {/* Always show price — strikethrough + dimmed if sold out */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '14px', color: product.is_sold_out ? '#3a3a3a' : '#c8bfb2', fontWeight: 300, textDecoration: product.is_sold_out ? 'line-through' : 'none' }}>
              Rs {Number(product.discounted_price || product.price).toLocaleString()}
            </span>
            {product.is_sold_out && (
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', letterSpacing: '0.15em', color: '#444', textTransform: 'uppercase' }}>Sold Out</span>
            )}
            {!product.is_sold_out && product.discounted_price && (
              <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#2e2e2e', textDecoration: 'line-through' }}>Rs {Number(product.price).toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}