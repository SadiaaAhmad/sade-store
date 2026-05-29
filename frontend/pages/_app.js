import '../styles/globals.css';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { SoundProvider } from '../hooks/useSound';
import CartDrawer from '../components/cart/CartDrawer';
import { useCart } from '../hooks/useCart';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <SoundProvider>
      {/* ── Splash loader ── */}
      <div style={{
        position: 'fixed', inset: 0, background: '#060606', zIndex: 9999,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        opacity: loading ? 1 : 0, visibility: loading ? 'visible' : 'hidden',
        transition: 'opacity 0.9s ease 0.1s, visibility 0.9s ease 0.1s',
        pointerEvents: 'none',
      }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '52px', fontWeight: 300, letterSpacing: '0.5em', color: '#f0ede8', marginBottom: '52px' }}>SADÉ</h1>
        <div style={{ width: '100px', height: '1px', background: '#161616', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, height: '1px', background: '#d4c5a9', animation: 'load 2s cubic-bezier(0.76,0,0.24,1) forwards' }} />
        </div>
        <style>{`@keyframes load{0%{width:0}100%{width:100%}}`}</style>
      </div>

      {/* ── Grain overlay ── */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`, pointerEvents: 'none', zIndex: 9000, opacity: 0.5 }} />

      <Navbar />
      <CartDrawer />
      <main><Component {...pageProps} /></main>
      <Footer />

      <Toaster position="bottom-center" toastOptions={{ style: { background: '#141414', color: '#f0ede8', border: '1px solid #1e1e1e', fontFamily: 'Jost, sans-serif', fontSize: '12px', letterSpacing: '0.05em', borderRadius: 0 } }} />
    </SoundProvider>
  );
}

/* ── NAVBAR ─────────────────────────────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { openCart, count } = useCart();
  const router = useRouter();
  const isHome = router.pathname === '/';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // On homepage, the hero has its own inline nav — this sticky nav only appears after scrolling past hero
  const show = !isHome || scrolled;

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
        padding: `${scrolled ? '14px' : '22px'} clamp(24px,5vw,60px)`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.4s cubic-bezier(0.76,0,0.24,1)',
        background: show ? 'rgba(6,6,6,0.97)' : 'transparent',
        backdropFilter: show ? 'blur(20px)' : 'none',
        borderBottom: show ? '1px solid #111' : '1px solid transparent',
        opacity: show ? 1 : 0,
        pointerEvents: show ? 'all' : 'none',
        WebkitBackdropFilter: show ? 'blur(20px)' : 'none',
      }}>
        {/* Left links */}
        <div className="nav-desktop" style={{ display: 'flex', gap: '28px', flex: 1 }}>
          {[['Collection', '/collection'], ['Story', '/#story']].map(([l, h]) => (
            <Link key={l} href={h} style={{ color: '#555', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'Jost, sans-serif', transition: 'color 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f0ede8'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#555'; }}
            >{l}</Link>
          ))}
        </div>

        {/* Center logo */}
        <Link href="/" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '22px', fontWeight: 300, letterSpacing: '0.42em', color: '#f0ede8', textDecoration: 'none', position: 'absolute', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
          SADÉ
        </Link>

        {/* Right */}
        <div style={{ display: 'flex', gap: '18px', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
          <Link href="/wishlist" style={{ color: '#555', textDecoration: 'none', display: 'flex', transition: 'color 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#f0ede8'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#555'; }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" /></svg>
          </Link>
          <button onClick={openCart} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', display: 'flex', alignItems: 'center', padding: 0, position: 'relative', transition: 'color 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#f0ede8'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#555'; }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
            {count > 0 && <span style={{ position: 'absolute', top: '-7px', right: '-9px', background: '#d4c5a9', color: '#060606', borderRadius: '50%', width: '15px', height: '15px', fontSize: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{count}</span>}
          </button>
          <button onClick={() => setMenuOpen(true)} className="hamburger" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', padding: 0, display: 'none' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
        </div>
      </nav>

      {/* ── Mobile fullscreen menu ── */}
      <div style={{
        position: 'fixed', inset: 0, background: '#060606', zIndex: 950,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        transition: 'opacity 0.4s ease, visibility 0.4s',
        opacity: menuOpen ? 1 : 0, visibility: menuOpen ? 'visible' : 'hidden',
      }}>
        <button onClick={() => setMenuOpen(false)} style={{ position: 'absolute', top: '28px', right: '32px', background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>

        {/* Tagline shown here on mobile instead of under logo */}
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', letterSpacing: '0.3em', color: '#333', textTransform: 'uppercase', marginBottom: '48px' }}>Not Made To Blend In</p>

        {[['Home', '/'], ['Collection', '/collection'], ['Story', '/#story'], ['Wishlist', '/wishlist']].map(([label, href]) => (
          <Link key={label} href={href} onClick={() => setMenuOpen(false)} style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(40px,11vw,60px)', fontWeight: 300, letterSpacing: '0.06em', color: '#f0ede8', textDecoration: 'none', marginBottom: '16px', transition: 'color 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#d4c5a9'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#f0ede8'; }}
          >{label}</Link>
        ))}
        <button onClick={() => { openCart(); setMenuOpen(false); }} style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(40px,11vw,60px)', fontWeight: 300, letterSpacing: '0.06em', color: '#f0ede8', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '16px', marginTop: '0' }}>
          Cart{count > 0 ? ` (${count})` : ''}
        </button>
      </div>

      <style>{`@media(max-width:768px){.hamburger{display:flex!important}.nav-desktop{display:none!important}}`}</style>
    </>
  );
}

/* ── FOOTER ─────────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background: '#060606', borderTop: '1px solid #111', padding: '72px clamp(24px,5vw,80px) 40px' }}>
      <div style={{ borderBottom: '1px solid #111', paddingBottom: '60px', marginBottom: '60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '48px' }}>
        <div>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '26px', fontWeight: 300, letterSpacing: '0.32em', color: '#f0ede8', marginBottom: '14px' }}>SADÉ</h3>
          <p style={{ color: '#444', fontSize: '12px', lineHeight: 2, fontFamily: 'Jost, sans-serif' }}>Custom 1 of 1 clothing.<br />Not made to blend in.<br />Pakistan.</p>
        </div>
        {[
          { title: 'Shop', links: [['Collection', '/collection'], ['Custom Order', '#'], ['Wishlist', '/wishlist']] },
          { title: 'Info', links: [['Shipping', '#'], ['Returns', '#'], ['Contact', '#']] },
          { title: 'Follow', links: [['Instagram', '#'], ['TikTok', '#'], ['Pinterest', '#']] },
        ].map(({ title, links }) => (
          <div key={title}>
            <p style={{ color: '#333', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '20px', fontFamily: 'IBM Plex Mono, monospace' }}>{title}</p>
            {links.map(([l, h]) => (
              <div key={l} style={{ marginBottom: '12px' }}>
                <Link href={h} style={{ color: '#444', fontSize: '13px', textDecoration: 'none', fontFamily: 'Jost, sans-serif', transition: 'color 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#f0ede8'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#444'; }}
                >{l}</Link>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <p style={{ color: '#282828', fontSize: '10px', letterSpacing: '0.1em', fontFamily: 'Jost, sans-serif' }}>© {new Date().getFullYear()} SADÉ. ALL RIGHTS RESERVED.</p>
        <p style={{ color: '#282828', fontSize: '10px', letterSpacing: '0.1em', fontFamily: 'Jost, sans-serif' }}>PKR · PAKISTAN</p>
      </div>
    </footer>
  );
}