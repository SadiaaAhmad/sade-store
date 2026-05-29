export default function SizeGuide({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
          <div>
            <p style={{ color: '#444', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'Jost, sans-serif' }}>SADÉ</p>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', fontWeight: 300, color: '#f0ede8' }}>Size Guide</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <p style={{ color: '#444', fontSize: '12px', lineHeight: 1.8, marginBottom: '32px', fontFamily: 'Jost, sans-serif' }}>
          All measurements in inches. ±0.5 inch production margin.
        </p>

        <p style={{ color: '#666', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'Jost, sans-serif' }}>Shirts</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Jost, sans-serif', marginBottom: '40px' }}>
          <thead>
            <tr>
              {['Size', 'Chest', 'Length', 'Shoulder', 'Sleeve'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: '#333', fontSize: '10px', letterSpacing: '0.1em', fontWeight: 400, borderBottom: '1px solid #1a1a1a' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[['S','22','27.5','24','7'],['M','23','28.5','25','8'],['L','24','29.5','26','8.5'],['XL','25','30.5','27','9']].map(([size, ...vals]) => (
              <tr key={size}>
                <td style={{ padding: '12px', color: '#f0ede8', fontSize: '13px', borderBottom: '1px solid #111' }}>{size}</td>
                {vals.map((v, i) => (
                  <td key={i} style={{ padding: '12px', color: '#666', fontSize: '13px', borderBottom: '1px solid #111' }}>{v}"</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <p style={{ color: '#333', fontSize: '11px', fontFamily: 'Jost, sans-serif' }}>
          Questions? DM us on Instagram or email support@sade.pk
        </p>
      </div>
    </div>
  );
}