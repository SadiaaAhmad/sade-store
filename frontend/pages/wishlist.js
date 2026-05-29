import Head from 'next/head';
import Link from 'next/link';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { toast } from 'react-hot-toast';

export default function WishlistPage() {
  const { items, toggleItem } = useWishlist();
  const { addItem, openCart } = useCart();

  const handleAdd = (product) => {
    const available = (product.sizes || []).find(s => s.stock > 0);
    if (!available) { toast.error('Out of stock'); return; }
    addItem(product, available.size);
    openCart();
    toast.success(`Added — ${available.size}`);
  };

  return (
    <>
      <Head><title>Wishlist — SADÉ</title></Head>

      <div style={{ paddingTop: '160px', paddingBottom: '120px', minHeight: '100vh' }}>
        <div style={{ padding: '0 clamp(24px, 5vw, 80px)', marginBottom: '60px', borderBottom: '1px solid #111', paddingBottom: '48px' }}>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', letterSpacing: '0.3em', color: '#444', textTransform: 'uppercase', marginBottom: '16px' }}>Saved Pieces</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 300, color: '#f0ede8', letterSpacing: '0.04em' }}>
            Wishlist
          </h1>
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '40px', fontWeight: 300, color: '#1a1a1a', marginBottom: '16px' }}>
              Nothing saved yet.
            </p>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#333', letterSpacing: '0.1em', marginBottom: '40px' }}>
              Find something that speaks to you.
            </p>
            <Link href="/collection" style={{ display: 'inline-block', padding: '16px 48px', background: '#f0ede8', color: '#060606', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'Jost, sans-serif' }}>
              Explore Collection
            </Link>
          </div>
        ) : (
          <div style={{ padding: '0 clamp(24px, 5vw, 80px)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2px' }}>
              {items.map(product => (
                <div key={product.id} style={{ background: '#0d0d0d', position: 'relative' }}>
                  <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <button
                      onClick={() => { toggleItem(product); toast('Removed from wishlist'); }}
                      style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(6,6,6,0.8)', border: '1px solid #222', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#d4c5a9" stroke="#d4c5a9" strokeWidth="1.5">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>
                  </div>
                  <div style={{ padding: '16px 4px 24px' }}>
                    <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 400, color: '#f0ede8', marginBottom: '8px' }}>{product.name}</h3>
                    <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '14px', color: '#f0ede8', marginBottom: '16px' }}>
                      Rs {Number(product.discounted_price || product.price).toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleAdd(product)}
                      style={{ width: '100%', background: '#f0ede8', color: '#060606', border: 'none', padding: '14px', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Jost, sans-serif', cursor: 'pointer' }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}