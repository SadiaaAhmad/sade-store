import Link from 'next/link';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { toast } from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addItem, openCart } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    const available = (product.sizes || []).find(s => s.stock > 0);
    if (!available) { toast.error('Out of stock'); return; }
    addItem(product, available.size);
    openCart();
    toast.success(`Added — ${available.size}`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleItem(product);
    toast(wishlisted ? 'Removed from wishlist' : 'Saved ♥');
  };

  const displayPrice = product.discounted_price || product.price;
  const hasDiscount = product.discounted_price && product.discounted_price < product.price;

  return (
    <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{ background: '#0d0d0d', cursor: 'pointer', position: 'relative' }}
        onMouseEnter={e => e.currentTarget.querySelector('.card-actions').style.transform = 'translateY(0)'}
        onMouseLeave={e => e.currentTarget.querySelector('.card-actions').style.transform = 'translateY(100%)'}>

        {/* Image */}
        <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
          <img
            src={product.images?.[0]}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s cubic-bezier(0.19,1,0.22,1)' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />

          {/* Hover second image */}
          {product.images?.[1] && (
            <img
              src={product.images[1]}
              alt=""
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0, transition: 'opacity 0.5s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0'}
            />
          )}

          {/* 1/1 badge */}
          <div style={{ position: 'absolute', top: '16px', left: '16px', border: '1px solid rgba(212,197,169,0.3)', padding: '4px 10px', background: 'rgba(6,6,6,0.7)' }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', letterSpacing: '0.15em', color: '#d4c5a9' }}>1 / 1</span>
          </div>

          {product.is_sold_out && <span className="sold-out-badge">Sold Out</span>}
          {hasDiscount && !product.is_sold_out && (
            <span style={{ position: 'absolute', top: '16px', right: '16px', background: '#d4c5a9', color: '#060606', fontSize: '9px', padding: '4px 10px', letterSpacing: '0.1em', fontFamily: 'Jost, sans-serif' }}>SALE</span>
          )}

          {/* Gradient */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)', opacity: 0, transition: 'opacity 0.4s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0'}
          />

          {/* Action buttons */}
          <div className="card-actions" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px', display: 'flex', gap: '8px', transform: 'translateY(100%)', transition: 'transform 0.4s cubic-bezier(0.19,1,0.22,1)' }}>
            {!product.is_sold_out && (
              <button onClick={handleQuickAdd} style={{ flex: 1, background: 'rgba(240,237,232,0.95)', color: '#060606', border: 'none', padding: '12px', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Jost, sans-serif', cursor: 'pointer' }}>
                Quick Add
              </button>
            )}
            <button onClick={handleWishlist} style={{ width: '44px', height: '44px', background: 'rgba(14,14,14,0.9)', border: '1px solid #222', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill={wishlisted ? '#d4c5a9' : 'none'} stroke={wishlisted ? '#d4c5a9' : '#888'} strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '16px 4px 24px' }}>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', letterSpacing: '0.2em', color: '#333', marginBottom: '6px', textTransform: 'uppercase' }}>
            {product.collection} · Custom 1/1
          </p>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 400, color: '#f0ede8', marginBottom: '10px' }}>
            {product.name}
          </h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '14px', color: '#f0ede8', fontWeight: 300 }}>
              Rs {Number(displayPrice).toLocaleString()}
            </span>
            {hasDiscount && (
              <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#333', textDecoration: 'line-through' }}>
                Rs {Number(product.price).toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}