import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL;
const FILTERS = ['All', 'Shirts', 'Pants', 'Hoodies', 'Jackets', 'Sets'];

export default function CollectionPage() {
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState('All');
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(null);

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

      {/* Header */}
      <div style={{ paddingTop: '140px', paddingBottom: '52px', paddingLeft: 'clamp(24px,5vw,80px)', paddingRight: 'clamp(24px,5vw,80px)', borderBottom: '1px solid #111' }}>
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', letterSpacing: '0.3em', color: '#444', textTransform: 'uppercase', marginBottom: '14px' }}>SADÉ · Custom 1 of 1</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(52px,8vw,100px)', fontWeight: 400, color: '#f0ede8', letterSpacing: '0.03em', lineHeight: 1 }}>Volume I</h1>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '17px', fontStyle: 'italic', color: '#555', maxWidth: '300px', lineHeight: 1.6 }}>"Not made to blend in"</p>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ padding: '0 clamp(24px,5vw,80px)', borderBottom: '1px solid #111', display: 'flex', gap: '0', overflowX: 'auto' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setActive(f)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'Jost, sans-serif', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase',
            color: active === f ? '#f0ede8' : '#444',
            padding: '18px 20px 16px',
            borderBottom: active === f ? '2px solid #d4c5a9' : '2px solid transparent',
            transition: 'color 0.3s', whiteSpace: 'nowrap', flexShrink: 0,
          }}>{f}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', paddingRight: '4px' }}>
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: '#333', letterSpacing: '0.1em' }}>
            {loading ? '—' : `${filtered.length} piece${filtered.length !== 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div style={{ padding: 'clamp(32px,4vw,60px) clamp(24px,5vw,80px) clamp(60px,8vw,120px)' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '3px' }}>
            {[1,2,3,4].map(i => <div key={i} style={{ background: '#0d0d0d', aspectRatio: '3/4', animation: 'shimmer 1.6s ease infinite' }} />)}
            <style>{`@keyframes shimmer{0%,100%{opacity:.35}50%{opacity:.65}}`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '100px 0', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 300, color: '#2a2a2a' }}>Nothing here yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '3px' }}>
            {filtered.map(p => {
              const img = Array.isArray(p.images) ? p.images[0] : p.image_url;
              return (
                <Link key={p.id} href={`/product/${p.slug}`} style={{ textDecoration: 'none' }}>
                  <div onMouseEnter={() => setHovered(p.id)} onMouseLeave={() => setHovered(null)} style={{ background: '#0c0c0c', cursor: 'pointer' }}>
                    <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
                      <img src={img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.9s cubic-bezier(0.19,1,0.22,1)', transform: hovered === p.id ? 'scale(1.07)' : 'scale(1)' }} />
                      {/* Hover overlay */}
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,6,6,0.35)', opacity: hovered === p.id ? 1 : 0, transition: 'opacity 0.4s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', letterSpacing: '0.2em', color: '#f0ede8', textTransform: 'uppercase', border: '1px solid rgba(240,237,232,0.4)', padding: '12px 28px' }}>View Piece</span>
                      </div>
                      <div style={{ position: 'absolute', top: '14px', left: '14px', border: '1px solid rgba(212,197,169,0.3)', padding: '4px 10px', background: 'rgba(6,6,6,0.6)' }}>
                        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', letterSpacing: '0.15em', color: '#d4c5a9' }}>1 / 1</span>
                      </div>
                      {p.is_sold_out && (
                        <div style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(6,6,6,0.85)', border: '1px solid #2a2a2a', padding: '4px 10px' }}>
                          <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '8px', letterSpacing: '0.18em', color: '#555', textTransform: 'uppercase' }}>Sold Out</span>
                        </div>
                      )}
                      {!p.is_sold_out && p.discounted_price && (
                        <div style={{ position: 'absolute', top: '14px', right: '14px', background: '#d4c5a9', padding: '4px 10px' }}>
                          <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '8px', letterSpacing: '0.1em', color: '#060606', textTransform: 'uppercase' }}>Sale</span>
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '18px 4px 26px' }}>
                      <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', letterSpacing: '0.18em', color: '#2a2a2a', marginBottom: '7px', textTransform: 'uppercase' }}>{p.collection} · Custom</p>
                      <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 400, color: '#f0ede8', marginBottom: '10px', letterSpacing: '0.02em' }}>{p.name}</h3>
                      {p.is_sold_out
                        ? <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#333' }}>—</span>
                        : <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '14px', color: '#c8bfb2', fontWeight: 300 }}>Rs {Number(p.discounted_price || p.price).toLocaleString()}</span>
                            {p.discounted_price && <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#2e2e2e', textDecoration: 'line-through' }}>Rs {Number(p.price).toLocaleString()}</span>}
                          </div>
                      }
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}