const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'sadiia.ahmadd@gmail.com';
const FROM_EMAIL = 'orders@wearsade.fit'; // must be verified in Resend

// ─────────────────────────────────────────────────────────────────────────────
// Helper — format items into HTML table rows
// ─────────────────────────────────────────────────────────────────────────────
function itemsHtml(items) {
  return items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #222;">
          ${item.name} <span style="color:#888;">× ${item.quantity}</span>
          <br/><small style="color:#888;">Size: ${item.size}</small>
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #222;text-align:right;">
          Rs ${(Number(item.price) * item.quantity).toLocaleString()}
        </td>
      </tr>`
    )
    .join('');
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared email wrapper
// ─────────────────────────────────────────────────────────────────────────────
function baseTemplate(content) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="background:#0a0a0a;color:#e8e0d5;font-family:'Georgia',serif;margin:0;padding:40px 20px;">
  <div style="max-width:560px;margin:0 auto;">
    <h1 style="letter-spacing:0.3em;font-size:22px;font-weight:400;margin-bottom:4px;">SADÉ</h1>
    <p style="color:#888;font-size:11px;letter-spacing:0.15em;margin-top:0;">NOT MADE TO BLEND IN</p>
    <hr style="border:none;border-top:1px solid #222;margin:24px 0;"/>
    ${content}
    <hr style="border:none;border-top:1px solid #222;margin:24px 0;"/>
    <p style="color:#666;font-size:11px;">www.wearsade.fit</p>
  </div>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDER CONFIRMATION — sent to customer
// ─────────────────────────────────────────────────────────────────────────────
async function sendOrderConfirmation(order) {
  const addr = order.shipping_address;
  const addressStr = [addr.line1, addr.line2, addr.city, addr.province, addr.postal_code]
    .filter(Boolean)
    .join(', ');

  const html = baseTemplate(`
    <h2 style="font-weight:400;font-size:18px;letter-spacing:0.1em;">Order Confirmed</h2>
    <p>Thank you, ${order.customer_name}. Your order has been placed.</p>

    <p style="font-size:13px;color:#888;letter-spacing:0.1em;">ORDER NUMBER</p>
    <p style="font-size:20px;letter-spacing:0.2em;">${order.order_number}</p>

    <table style="width:100%;border-collapse:collapse;margin:20px 0;">
      ${itemsHtml(order.items)}
    </table>

    <table style="width:100%;font-size:13px;">
      <tr><td style="color:#888;">Subtotal</td><td style="text-align:right;">Rs ${Number(order.subtotal).toLocaleString()}</td></tr>
      ${order.discount_amount > 0 ? `<tr><td style="color:#888;">Discount (${order.discount_code})</td><td style="text-align:right;color:#a8c5a0;">− Rs ${Number(order.discount_amount).toLocaleString()}</td></tr>` : ''}
      <tr><td style="color:#888;">Shipping</td><td style="text-align:right;">Rs ${Number(order.shipping_fee).toLocaleString()}</td></tr>
      <tr><td style="font-weight:bold;padding-top:8px;">Total</td><td style="text-align:right;font-weight:bold;padding-top:8px;">Rs ${Number(order.total).toLocaleString()}</td></tr>
    </table>

    <p style="margin-top:24px;font-size:13px;color:#888;">SHIP TO</p>
    <p style="margin-top:4px;">${addressStr}</p>

    <p style="font-size:13px;color:#888;margin-top:24px;">PAYMENT</p>
    <p style="margin-top:4px;">${order.payment_method === 'cod' ? 'Cash on Delivery' : 'Card'}</p>

    <p style="margin-top:32px;font-size:13px;color:#888;">
      Questions? Reply to this email or reach us at ${ADMIN_EMAIL}
    </p>
  `);

  await resend.emails.send({
    from: FROM_EMAIL,
    to: order.customer_email,
    subject: `Your SADÉ Order — ${order.order_number}`,
    html,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN NOTIFICATION — sent to store owner
// ─────────────────────────────────────────────────────────────────────────────
async function sendAdminNotification(order) {
  const addr = order.shipping_address;
  const addressStr = [addr.line1, addr.line2, addr.city, addr.province, addr.postal_code]
    .filter(Boolean)
    .join(', ');

  const html = baseTemplate(`
    <h2 style="font-weight:400;font-size:18px;letter-spacing:0.1em;">New Order Received 🖤</h2>

    <p style="font-size:13px;color:#888;">ORDER</p>
    <p>${order.order_number} — Rs ${Number(order.total).toLocaleString()}</p>

    <p style="font-size:13px;color:#888;margin-top:16px;">CUSTOMER</p>
    <p>${order.customer_name}<br/>${order.customer_email}<br/>${order.customer_phone || ''}</p>

    <p style="font-size:13px;color:#888;margin-top:16px;">SHIP TO</p>
    <p>${addressStr}</p>

    <p style="font-size:13px;color:#888;margin-top:16px;">PAYMENT</p>
    <p>${order.payment_method === 'cod' ? 'Cash on Delivery' : 'Card'}</p>

    <table style="width:100%;border-collapse:collapse;margin:20px 0;">
      ${itemsHtml(order.items)}
    </table>

    <table style="width:100%;font-size:13px;">
      <tr><td style="color:#888;">Subtotal</td><td style="text-align:right;">Rs ${Number(order.subtotal).toLocaleString()}</td></tr>
      ${order.discount_amount > 0 ? `<tr><td style="color:#888;">Discount (${order.discount_code})</td><td style="text-align:right;">− Rs ${Number(order.discount_amount).toLocaleString()}</td></tr>` : ''}
      <tr><td style="color:#888;">Shipping</td><td style="text-align:right;">Rs ${Number(order.shipping_fee).toLocaleString()}</td></tr>
      <tr><td style="font-weight:bold;padding-top:8px;">Total</td><td style="text-align:right;font-weight:bold;padding-top:8px;">Rs ${Number(order.total).toLocaleString()}</td></tr>
    </table>

    ${order.notes ? `<p style="font-size:13px;color:#888;margin-top:16px;">NOTES</p><p>${order.notes}</p>` : ''}
  `);

  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `[SADÉ] New Order — ${order.order_number} — Rs ${Number(order.total).toLocaleString()}`,
    html,
  });
}

module.exports = { sendOrderConfirmation, sendAdminNotification };