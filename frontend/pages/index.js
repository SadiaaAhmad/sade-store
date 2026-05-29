import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function HomePage() {
  const bgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    const onScroll = () => {
      if (bgRef.current) bgRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
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
        <meta name="description" content="Custom 1 of 1 clothing from Pakistan. Not made to blend in." />
      </Head>

      {/* ── HERO ── */}
      <section style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
        <div ref={bgRef} style={{ position: 'absolute', inset: '-10%', width: '120%', height: '120%' }}>
          <img
            src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1800&q=90"
            alt="SADÉ"
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.45) contrast(1.1)' }}
          />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(6,6,6,0.6) 0%, rgba(6,6,6,0.1) 60%, rgba(6,6,6,0.7) 100%)', zIndex: 1 }} />

        {/* Nav inside hero */}
        <HeroNav />

        {/* Copy — bottom left */}
        <div style={{
          position: 'absolute', bottom: 'clamp(52px,9vh,110px)', left: 'clamp(28px,6vw,80px)',
          zIndex: 2,
          opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(32px)',
          transition: 'opacity 1.3s cubic-bezier(0.19,1,0.22,1) 0.4s, transform 1.3s cubic-bezier(0.19,1,0.22,1) 0.4s',
        }}>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', letterSpacing: '0.35em', color: 'rgba(212,197,169,0.8)', textTransform: 'uppercase', marginBottom: '20px' }}>
            Custom · 1 of 1
          </p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(48px,7.5vw,104px)', fontWeight: 400, color: '#ffffff', lineHeight: 1.0, letterSpacing: '-0.01em', marginBottom: '20px', textShadow: '0 4px 60px rgba(0,0,0,0.4)' }}>
            ONE OF ONE,<br />JUST LIKE YOU.
          </h1>
          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: 'clamp(11px,1.3vw,13px)', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '36px' }}>
            Wear what defines you.
          </p>
          <Link href="/collection" style={{
            display: 'inline-block', padding: '16px 44px',
            background: '#ffffff', color: '#060606',
            fontFamily: 'Jost, sans-serif', fontSize: '11px', fontWeight: 500,
            letterSpacing: '0.22em', textTransform: 'uppercase', textDecoration: 'none',
            transition: 'background 0.3s, color 0.3s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#d4c5a9'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; }}
          >
            Shop Now
          </Link>
        </div>

        {/* Scroll line */}
        <div style={{ position: 'absolute', bottom: '40px', right: '48px', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '1px', height: '56px', background: 'linear-gradient(to bottom, rgba(212,197,169,0.6), transparent)', animation: 'scrollLine 2s ease infinite' }} />
          <style>{`@keyframes scrollLine { 0%,100%{opacity:0.3;transform:scaleY(1)} 50%{opacity:1;transform:scaleY(0.6)} }`}</style>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ borderTop: '1px solid #161616', borderBottom: '1px solid #161616', padding: '16px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'inline-flex', animation: 'marquee 24s linear infinite' }}>
          {Array(10).fill(null).map((_, i) => (
            <span key={i} style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '12px', letterSpacing: '0.32em', color: '#1e1e1e', paddingRight: '56px', fontStyle: 'italic' }}>
              NOT MADE TO BLEND IN · CUSTOM 1 OF 1 · SADÉ · PAKISTAN ·
            </span>
          ))}
        </div>
        <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
      </div>

      {/* ── STORY SECTION ── */}
      <section id="story" style={{ padding: 'clamp(80px,12vw,160px) clamp(24px,7vw,120px)', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          {/* Left: photo */}
          <div style={{ position: 'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=85"
              alt="SADÉ craftsmanship"
              style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block', filter: 'brightness(0.85) contrast(1.08) saturate(0.9)' }}
            />
            {/* Floating badge */}
            <div style={{ position: 'absolute', bottom: '-16px', right: '-16px', background: '#0d0d0d', border: '1px solid #1e1e1e', padding: '18px 24px' }}>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '30px', fontWeight: 300, color: '#f0ede8', lineHeight: 1, marginBottom: '4px' }}>1/1</p>
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', letterSpacing: '0.25em', color: '#444' }}>ALWAYS</p>
            </div>
          </div>

          {/* Right: text */}
          <div>
            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', letterSpacing: '0.3em', color: '#555', textTransform: 'uppercase', marginBottom: '28px' }}>The Philosophy</p>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(38px,5vw,70px)', fontWeight: 400, color: '#f0ede8', lineHeight: 1.08, letterSpacing: '0.01em', marginBottom: '28px' }}>
              Every piece is<br />
              <em style={{ color: '#d4c5a9', fontStyle: 'italic' }}>one of one.</em><br />
              Just like you.
            </h2>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '15px', fontWeight: 300, color: '#888', lineHeight: 2, maxWidth: '420px', marginBottom: '36px' }}>
              SADÉ doesn't do mass production. We don't do trends. We do custom — built around your body, your energy, your statement. When you wear SADÉ, there is no one else wearing it.
            </p>
            <Link href="/collection" style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', letterSpacing: '0.2em', color: '#d4c5a9', textDecoration: 'none', textTransform: 'uppercase', borderBottom: '1px solid #d4c5a9', paddingBottom: '3px' }}>
              View Collection →
            </Link>
          </div>
        </div>
        <style jsx>{`@media(max-width:768px){div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important;gap:48px!important}}`}</style>
      </section>

      {/* ── COLLECTION PREVIEW ── */}
      <section style={{ padding: 'clamp(60px,8vw,100px) clamp(24px,5vw,80px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '44px' }}>
          <div>
            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', letterSpacing: '0.25em', color: '#555', textTransform: 'uppercase', marginBottom: '10px' }}>Now Available</p>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(32px,4vw,56px)', fontWeight: 300, color: '#f0ede8', letterSpacing: '0.03em' }}>Volume I</h2>
          </div>
          <Link href="/collection" style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', letterSpacing: '0.15em', color: '#555', textDecoration: 'none', textTransform: 'uppercase', borderBottom: '1px solid #222', paddingBottom: '4px' }}>
            View All
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '3px' }}>
          {products.length > 0
            ? products.map(p => <ProductCard key={p.id} product={p} />)
            : [1, 2, 3].map(i => <div key={i} style={{ background: '#0d0d0d', aspectRatio: '3/4', animation: 'pulse 1.6s ease infinite' }} />)
          }
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:.7}}`}</style>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: '#080808', borderTop: '1px solid #111', borderBottom: '1px solid #111', padding: 'clamp(80px,10vw,130px) clamp(24px,6vw,100px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', letterSpacing: '0.3em', color: '#444', textTransform: 'uppercase', marginBottom: '16px', textAlign: 'center' }}>Process</p>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 300, color: '#f0ede8', textAlign: 'center', marginBottom: '72px', letterSpacing: '0.03em' }}>
            Built around <em style={{ color: '#d4c5a9' }}>you.</em>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '2px' }}>
            {[
              { n: '01', t: 'Browse', b: 'Explore our 1 of 1 pieces from Volume I — each is singular.' },
              { n: '02', t: 'Add to Cart', b: 'Pick your piece. The size and fit details are listed for each.' },
              { n: '03', t: 'We Confirm', b: 'We reach out to confirm your order before dispatching.' },
              { n: '04', t: 'Yours Alone', b: 'It ships to you and only you. That piece will never exist again.' },
            ].map(({ n, t, b }) => (
              <div key={n} style={{ padding: '44px 28px', border: '1px solid #111', background: '#0c0c0c' }}>
                <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: '#d4c5a9', letterSpacing: '0.1em', marginBottom: '20px' }}>{n}</p>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 400, color: '#f0ede8', marginBottom: '14px' }}>{t}</h3>
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', fontWeight: 300, color: '#666', lineHeight: 1.9 }}>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: 'clamp(100px,14vw,200px) 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(212,197,169,0.035) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', letterSpacing: '0.35em', color: '#444', textTransform: 'uppercase', marginBottom: '32px' }}>Volume I · Limited</p>
        <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(52px,9vw,130px)', fontWeight: 400, color: '#f0ede8', lineHeight: 0.95, letterSpacing: '0.02em', marginBottom: '12px' }}>Not made</h2>
        <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(52px,9vw,130px)', fontWeight: 400, color: 'transparent', lineHeight: 0.95, letterSpacing: '0.02em', WebkitTextStroke: '1px #2a2a2a', marginBottom: '64px' }}>to blend in.</h2>
        <Link href="/collection" style={{ display: 'inline-block', padding: '18px 68px', background: '#f0ede8', color: '#060606', fontFamily: 'Jost, sans-serif', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 500, transition: 'background 0.3s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#d4c5a9'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#f0ede8'; }}
        >
          Claim Your Piece
        </Link>
      </section>
    </>
  );
}

function HeroNav() {
  const { openCart, count } = useCart();
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, padding: '28px clamp(24px,5vw,64px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div className="hero-nav-links" style={{ display: 'flex', gap: '36px' }}>
        {[['HOME', '/'], ['SHOP', '/collection'], ['STORY', '/#story']].map(([l, h]) => (
          <Link key={l} href={h} style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', fontWeight: 400, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'color 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
          >{l}</Link>
        ))}
      </div>
      <button onClick={openCart} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Jost, sans-serif', fontSize: '11px', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.65)', transition: 'color 0.3s' }}
        onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
      >
        CART ({count})
      </button>
      <style>{`@media(max-width:640px){.hero-nav-links{display:none!important}}`}</style>
    </div>
  );
}

function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const img = Array.isArray(product.images) ? product.images[0] : product.image_url;
  return (
    <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: '#0c0c0c', cursor: 'pointer' }}>
        <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
          <img src={img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.9s cubic-bezier(0.19,1,0.22,1)', transform: hovered ? 'scale(1.07)' : 'scale(1)' }} />
          <div style={{ position: 'absolute', top: '16px', left: '16px', border: '1px solid rgba(212,197,169,0.35)', padding: '4px 10px', background: 'rgba(6,6,6,0.65)' }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', letterSpacing: '0.15em', color: '#d4c5a9' }}>1 / 1</span>
          </div>
          {product.is_sold_out && (
            <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(6,6,6,0.8)', border: '1px solid #2a2a2a', padding: '4px 10px' }}>
              <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '8px', letterSpacing: '0.2em', color: '#555', textTransform: 'uppercase' }}>Sold Out</span>
            </div>
          )}
          {!product.is_sold_out && product.discounted_price && (
            <div style={{ position: 'absolute', top: '16px', right: '16px', background: '#d4c5a9', padding: '4px 10px' }}>
              <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '8px', letterSpacing: '0.1em', color: '#060606', textTransform: 'uppercase' }}>Sale</span>
            </div>
          )}
        </div>
        <div style={{ padding: '18px 4px 26px' }}>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', letterSpacing: '0.18em', color: '#2e2e2e', marginBottom: '7px', textTransform: 'uppercase' }}>{product.collection} · Custom</p>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 400, color: '#f0ede8', marginBottom: '10px', letterSpacing: '0.02em' }}>{product.name}</h3>
          {product.is_sold_out
            ? <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', color: '#3a3a3a' }}>—</span>
            : <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '14px', color: '#c8bfb2', fontWeight: 300 }}>Rs {Number(product.discounted_price || product.price).toLocaleString()}</span>
                {product.discounted_price && <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#2e2e2e', textDecoration: 'line-through' }}>Rs {Number(product.price).toLocaleString()}</span>}
              </div>
          }
        </div>
      </div>
    </Link>
  );
}

function useCart() {
  const [count, setCount] = useState(0);
  const openCart = () => {};
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem('sade-cart') || '{}');
      const items = s?.state?.items || [];
      setCount(items.reduce((n, i) => n + i.quantity, 0));
    } catch {}
  }, []);
  return { count, openCart };
}