import Link from 'next/link';
import { useCart } from '../../hooks/useCart';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCart();
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={closeCart} />
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>

        {/* Header */}
        <div style={{ padding: '28px 32px', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888' }}>Cart</span>
            {count > 0 && <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: '#444' }}>({count})</span>}
          </div>
          <button onClick={closeCart} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', padding: '4px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '80px' }}>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 300, color: '#222', marginBottom: '16px' }}>Empty.</p>
              <p style={{ color: '#333', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Jost, sans-serif', marginBottom: '32px' }}>Nothing here yet</p>
              <Link href="/collection" onClick={closeCart} style={{ display: 'inline-block', padding: '14px 32px', border: '1px solid #1e1e1e', color: '#666', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'Jost, sans-serif' }}>
                Shop Now
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {items.map(item => (
                <div key={item.key} style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '80px', height: '100px', flexShrink: 0, background: '#141414', overflow: 'hidden' }}>
                    {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '17px', fontWeight: 400, color: '#f0ede8', marginBottom: '4px' }}>{item.name}</p>
                    <p style={{ color: '#444', fontSize: '10px', letterSpacing: '0.12em', marginBottom: '16px', fontFamily: 'Jost, sans-serif' }}>SIZE {item.size}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', border: '1px solid #1a1a1a', padding: '8px 14px' }}>
                        <button onClick={() => updateQuantity(item.key, item.quantity - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: '16px', lineHeight: 1, padding: 0 }}>−</button>
                        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: '#f0ede8', minWidth: '16px', textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.key, item.quantity + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: '16px', lineHeight: 1, padding: 0 }}>+</button>
                      </div>
                      <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '14px', color: '#f0ede8', fontWeight: 300 }}>Rs {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                    <button onClick={() => removeItem(item.key)} style={{ marginTop: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#333', fontSize: '10px', letterSpacing: '0.1em', padding: 0, fontFamily: 'Jost, sans-serif', textDecoration: 'underline' }}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '24px 32px', borderTop: '1px solid #1a1a1a' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: '#666', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Jost, sans-serif' }}>Subtotal</span>
              <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '16px', color: '#f0ede8' }}>Rs {total.toLocaleString()}</span>
            </div>
            <p style={{ color: '#333', fontSize: '11px', marginBottom: '20px', fontFamily: 'Jost, sans-serif' }}>Shipping calculated at checkout</p>
            <Link href="/checkout" onClick={closeCart} style={{ display: 'block', width: '100%', background: '#f0ede8', color: '#060606', textAlign: 'center', padding: '16px', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}