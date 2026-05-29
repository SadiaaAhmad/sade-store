import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { toast } from 'react-hot-toast';

const API = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

const HERO_IMG = 'https://cdn.corenexis.com/files/c/7984659720.png';
const STORY_IMG = 'https://cdn.corenexis.com/files/c/5617759720.png';

export default function HomePage() {
  const bgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    const onScroll = () => {
      if (bgRef.current) bgRef.current.style.transform = `translateY(${window.scrollY * 0.28}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    fetch(`${API}/api/products`)
      .then(r => r.json())
      .then(d => Array.isArray(d) && setProducts(d.slice(0, 3)))
      .catch(() => {});
    return () => { clearTimeout(t); window.removeEventListener('scroll', onScroll); };
  }, []);

  return (
    <>
      <Head>
        <title>SADÉ — Not Made To Blend In</title>
        <meta name="description" content="Custom 1 of 1 clothing. Not made to blend in." />
      </Head>

      {/* ── HERO ── */}
      <section style={{ height: '100vh', position: 'relative', overflow: 'hidden', background: '#060606' }}>
        <div ref={bgRef} style={{ position: 'absolute', inset: '-10%', width: '120%', height: '120%' }}>
          <img src={HERO_IMG} alt="SADÉ" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', filter: 'brightness(0.42) contrast(1.08)' }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(6,6,6,0.85) 0%, rgba(6,6,6,0.2) 60%, rgba(6,6,6,0.5) 100%)', zIndex: 1 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,6,6,0.9) 0%, transparent 50%)', zIndex: 1 }} />

        {/* Hero nav */}
        <HeroNav />

        {/* Copy */}
        <div style={{
          position: 'absolute', bottom: 'clamp(60px,10vh,120px)', left: 'clamp(28px,6vw,80px)', zIndex: 2,
          opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(28px)',
          transition: 'opacity 1.4s cubic-bezier(0.19,1,0.22,1) 0.3s, transform 1.4s cubic-bezier(0.19,1,0.22,1) 0.3s',
        }}>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', letterSpacing: '0.35em', color: 'rgba(212,197,169,0.75)', textTransform: 'uppercase', marginBottom: '20px' }}>Custom · 1 of 1 · Pakistan</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(52px,8vw,110px)', fontWeight: 400, color: '#ffffff', lineHeight: 0.95, letterSpacing: '-0.01em', marginBottom: '20px', textShadow: '0 4px 80px rgba(0,0,0,0.5)' }}>
            ONE OF ONE,<br />JUST LIKE YOU.
          </h1>
          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: 'clamp(11px,1.2vw,13px)', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', marginBottom: '36px' }}>Not made to blend in.</p>
          <Link href="/collection" style={{ display: 'inline-block', padding: '16px 44px', background: '#ffffff', color: '#060606', fontFamily: 'Jost, sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', textDecoration: 'none', transition: 'background 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#d4c5a9'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; }}
          >Shop Now</Link>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '36px', right: '44px', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '1px', height: '52px', background: 'linear-gradient(to bottom, rgba(212,197,169,0.5), transparent)', animation: 'sl 2s ease infinite' }} />
          <style>{`@keyframes sl{0%,100%{opacity:.3;transform:scaleY(1)}50%{opacity:1;transform:scaleY(0.6)}}`}</style>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ borderTop: '1px solid #141414', borderBottom: '1px solid #141414', padding: '15px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'inline-flex', animation: 'mq 26s linear infinite' }}>
          {Array(12).fill(null).map((_, i) => (
            <span key={i} style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '12px', letterSpacing: '0.32em', color: '#1c1c1c', paddingRight: '52px', fontStyle: 'italic' }}>
              NOT MADE TO BLEND IN · CUSTOM 1 OF 1 · SADÉ · PAKISTAN ·
            </span>
          ))}
        </div>
        <style>{`@keyframes mq{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
      </div>

      {/* ── STORY ── */}
      <section id="story" style={{ padding: 'clamp(80px,12vw,160px) clamp(24px,7vw,120px)', maxWidth: '1400px', margin: '0 auto' }}>
        <div className="story-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <img src={STORY_IMG} alt="SADÉ" style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', objectPosition: 'center', display: 'block', filter: 'brightness(0.88) contrast(1.06) saturate(0.85)' }} />
            <div style={{ position: 'absolute', bottom: '-16px', right: '-16px', background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '18px 22px' }}>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 300, color: '#f0ede8', lineHeight: 1, marginBottom: '4px' }}>1/1</p>
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', letterSpacing: '0.25em', color: '#3a3a3a' }}>ALWAYS</p>
            </div>
          </div>
          <div>
            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', letterSpacing: '0.3em', color: '#444', textTransform: 'uppercase', marginBottom: '28px' }}>The Philosophy</p>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(40px,5vw,72px)', fontWeight: 400, color: '#f0ede8', lineHeight: 1.06, letterSpacing: '0.01em', marginBottom: '28px' }}>
              Every piece is<br /><em style={{ color: '#d4c5a9' }}>one of one.</em><br />Just like you.
            </h2>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '15px', fontWeight: 300, color: '#777', lineHeight: 2, maxWidth: '400px', marginBottom: '36px' }}>
              SADÉ doesn't do mass production. We don't do trends. We do custom — built around your body, your energy, your statement. When you wear SADÉ, there is no one else wearing it.
            </p>
            <Link href="/collection" style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', letterSpacing: '0.2em', color: '#d4c5a9', textDecoration: 'none', textTransform: 'uppercase', borderBottom: '1px solid #d4c5a9', paddingBottom: '3px' }}>
              View Collection →
            </Link>
          </div>
        </div>
        <style jsx>{`.story-grid{@media(max-width:768px){grid-template-columns:1fr!important;gap:48px!important}}`}</style>
      </section>

      {/* ── COLLECTION PREVIEW ── */}
      <section style={{ padding: 'clamp(60px,8vw,100px) clamp(24px,5vw,80px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '44px' }}>
          <div>
            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', letterSpacing: '0.25em', color: '#444', textTransform: 'uppercase', marginBottom: '10px' }}>Now Available</p>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(32px,4vw,56px)', fontWeight: 300, color: '#f0ede8', letterSpacing: '0.03em' }}>Volume I</h2>
          </div>
          <Link href="/collection" style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', letterSpacing: '0.15em', color: '#555', textDecoration: 'none', textTransform: 'uppercase', borderBottom: '1px solid #1e1e1e', paddingBottom: '4px' }}>View All</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '3px' }}>
          {products.length > 0
            ? products.map(p => <ProductCard key={p.id} product={p} />)
            : [1,2,3].map(i => <div key={i} style={{ background: '#0c0c0c', aspectRatio: '3/4', animation: 'sh 1.6s ease infinite' }} />)
          }
        </div>
        <style>{`@keyframes sh{0%,100%{opacity:.35}50%{opacity:.65}}`}</style>
      </section>

      {/* ── PROCESS ── */}
      <section style={{ background: '#080808', borderTop: '1px solid #0e0e0e', borderBottom: '1px solid #0e0e0e', padding: 'clamp(80px,10vw,130px) clamp(24px,6vw,100px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', letterSpacing: '0.3em', color: '#333', textTransform: 'uppercase', marginBottom: '16px', textAlign: 'center' }}>Process</p>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 300, color: '#f0ede8', textAlign: 'center', marginBottom: '72px' }}>Built around <em style={{ color: '#d4c5a9' }}>you.</em></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '2px' }}>
            {[
              { n: '01', t: 'Browse', b: 'Explore our 1 of 1 pieces — each is singular, never repeated.' },
              { n: '02', t: 'Add to Cart', b: 'Pick your piece. Fit and size info is listed for each item.' },
              { n: '03', t: 'We Confirm', b: 'We reach out personally to confirm your order before dispatching.' },
              { n: '04', t: 'Yours Alone', b: 'Ships to you and only you. That piece will never exist again.' },
            ].map(({ n, t, b }) => (
              <div key={n} style={{ padding: '44px 28px', border: '1px solid #0e0e0e', background: '#0a0a0a' }}>
                <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: '#d4c5a9', letterSpacing: '0.1em', marginBottom: '20px' }}>{n}</p>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 400, color: '#f0ede8', marginBottom: '14px' }}>{t}</h3>
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', fontWeight: 300, color: '#555', lineHeight: 1.9 }}>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: 'clamp(100px,14vw,200px) 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', letterSpacing: '0.35em', color: '#333', textTransform: 'uppercase', marginBottom: '32px' }}>Volume I · Limited</p>
        <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(52px,9vw,130px)', fontWeight: 400, color: '#f0ede8', lineHeight: 0.95, marginBottom: '12px' }}>Not made</h2>
        <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(52px,9vw,130px)', fontWeight: 400, color: 'transparent', lineHeight: 0.95, WebkitTextStroke: '1px #282828', marginBottom: '64px' }}>to blend in.</h2>
        <Link href="/collection" style={{ display: 'inline-block', padding: '18px 68px', background: '#f0ede8', color: '#060606', fontFamily: 'Jost, sans-serif', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 500 }}
          onMouseEnter={e => { e.currentTarget.style.background = '#d4c5a9'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#f0ede8'; }}
        >Claim Your Piece</Link>
      </section>
    </>
  );
}

function HeroNav() {
  const { openCart, count } = useCart();
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, padding: '28px clamp(24px,5vw,64px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div className="hnav" style={{ display: 'flex', gap: '36px' }}>
        {[['HOME', '/'], ['SHOP', '/collection'], ['STORY', '/#story']].map(([l, h]) => (
          <Link key={l} href={h} style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
          >{l}</Link>
        ))}
      </div>
      <button onClick={openCart} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Jost, sans-serif', fontSize: '11px', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.6)', transition: 'color 0.3s' }}
        onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
      >CART ({count})</button>
      <style>{`@media(max-width:640px){.hnav{display:none!important}}`}</style>
    </div>
  );
}

function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const { toggleItem, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const img = Array.isArray(product.images) ? product.images[0] : product.image_url;

  return (
    <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: '#0a0a0a', cursor: 'pointer', position: 'relative' }}>
        <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
          <img src={img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.9s cubic-bezier(0.19,1,0.22,1)', transform: hovered ? 'scale(1.07)' : 'scale(1)' }} />
          {/* Wishlist heart */}
          <button onClick={e => { e.preventDefault(); e.stopPropagation(); toggleItem(product); toast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist'); }}
            style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'rgba(6,6,6,0.75)', border: `1px solid ${wishlisted ? '#d4c5a9' : '#222'}`, width: '38px', height: '38px', borderRadius: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.3s', zIndex: 3 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill={wishlisted ? '#d4c5a9' : 'none'} stroke={wishlisted ? '#d4c5a9' : '#888'} strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          {/* 1/1 badge */}
          <div style={{ position: 'absolute', top: '14px', left: '14px', border: '1px solid rgba(212,197,169,0.3)', padding: '4px 10px', background: 'rgba(6,6,6,0.65)' }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', letterSpacing: '0.15em', color: '#d4c5a9' }}>1 / 1</span>
          </div>
          {product.is_sold_out && (
            <div style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(6,6,6,0.85)', border: '1px solid #1e1e1e', padding: '4px 10px' }}>
              <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '8px', letterSpacing: '0.18em', color: '#444', textTransform: 'uppercase' }}>Sold Out</span>
            </div>
          )}
        </div>
        <div style={{ padding: '16px 4px 24px' }}>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', letterSpacing: '0.18em', color: '#282828', marginBottom: '7px', textTransform: 'uppercase' }}>{product.collection || 'Volume I'} · Custom</p>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 400, color: '#f0ede8', marginBottom: '10px' }}>{product.name}</h3>
          {product.is_sold_out
            ? <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#2e2e2e' }}>—</span>
            : <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '14px', color: '#c8bfb2', fontWeight: 300 }}>Rs {Number(product.discounted_price || product.price).toLocaleString()}</span>
          }
        </div>
      </div>
    </Link>
  );
}