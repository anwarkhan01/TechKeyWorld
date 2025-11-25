// utils/orderEmailService.js
import nodemailer from "nodemailer";

console.log(process.env.SMTP_HOST, process.env.SMTP_USER, process.env.SMTP_PASS);
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "anwarkhan84088@gmail.com",
    pass: process.env.SMTP_PASS || "afibfdqvntqvntqvntqvnt",
  },
});


export const sendUserOrderConfirmationEmail = async (userEmail, order) => {
  const itemsHtml = order.productData.products
    .map(
      (p) => `
      <tr>
        <td style="padding:8px;border:1px solid #eee;">${p.product_name}</td>
        <td style="padding:8px;text-align:center;border:1px solid #eee;">${p.quantity}</td>
        <td style="padding:8px;text-align:right;border:1px solid #eee;">₹${p.product_price}</td>
        <td style="padding:8px;text-align:right;border:1px solid #eee;">₹${p.product_price * p.quantity}</td>
      </tr>
    `
    )
    .join("");

  const html = `
    <div style="font-family:Arial, sans-serif;line-height:1.6;">
      <h2>Your Order ${order.orderId} is Confirmed 🎉</h2>
      <p>Thank you for your purchase!</p>

      <p><strong>Your product keys will be delivered in 24 hours.</strong></p>
      <p>Please check your inbox, and if not found, check your <strong>Spam/Junk</strong> folder.</p>
      <p>If still not received, contact us.</p>

      <hr style="margin:20px 0"/>

      <h3>Order Details</h3>
      <p><strong>Order ID:</strong> ${order.orderId}</p>
      <p><strong>Email:</strong> ${order.useremail}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
      <p><strong>Transaction ID:</strong> ${order.txnId}</p>

      <h4 style="margin-top:12px;">Items</h4>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr>
            <th style="padding:8px;border:1px solid #eee;text-align:left;">Product</th>
            <th style="padding:8px;border:1px solid #eee;text-align:center;">Qty</th>
            <th style="padding:8px;border:1px solid #eee;text-align:right;">Price</th>
            <th style="padding:8px;border:1px solid #eee;text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <p style="margin-top:12px;font-size:16px;">
        <strong>Grand Total:</strong> ₹${order.productData.totalPrice.toLocaleString("en-IN")}
      </p>

      <br/>
      <p>We will send your product keys soon.</p>
      <p>Regards,<br/>Support Team</p>
    </div>
  `;

  console.log("user email", process.env.SMTP_USER)
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: userEmail,
    subject: `Your Order ${order.orderId} — Confirmation`,
    html,
  });
};

export const sendAdminOrderNotificationEmail = async (order) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  if (!adminEmail) {
    console.error("ADMIN_EMAIL not configured");
    return;
  }

  const itemsHtml = order.productData.products
    .map(
      (p) => `
        <tr>
          <td style="padding:6px;border:1px solid #eee;">${p.product_name}</td>
          <td style="padding:6px;border:1px solid #eee;">${p.product_id}</td>
          <td style="padding:6px;text-align:center;border:1px solid #eee;">${p.quantity}</td>
          <td style="padding:6px;text-align:right;border:1px solid #eee;">₹${p.product_price}</td>
          <td style="padding:6px;text-align:right;border:1px solid #eee;">₹${p.product_price * p.quantity
        }</td>
        </tr>
      `
    )
    .join("");

  const html = `
    <div style="font-family:Arial, sans-serif;line-height:1.6;">
      <h2>📦 New Order Received</h2>
      <h3>Order ID: ${order.orderId}</h3>

      <p><strong>User Email:</strong> ${order.useremail}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
      <p><strong>PayU Payment ID:</strong> ${order.paymentId}</p>
      <p><strong>PayU Txn ID:</strong> ${order.txnId}</p>
      <p><strong>Payment Status:</strong> Paid (SUCCESS)</p>

      <p><strong>Order Date:</strong> ${new Date(order.meta?.createdAt).toLocaleString("en-IN") || "N/A"
    }</p>

      <hr style="margin:20px 0"/>

      <h3>🛒 Products</h3>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr>
            <th style="padding:6px;border:1px solid #eee;">Name</th>
            <th style="padding:6px;border:1px solid #eee;">Product ID</th>
            <th style="padding:6px;border:1px solid #eee;">Qty</th>
            <th style="padding:6px;border:1px solid #eee;text-align:right;">Price</th>
            <th style="padding:6px;border:1px solid #eee;text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <p style="margin-top:12px;font-size:16px;">
        <strong>Total Amount:</strong>
        ₹${order.productData.totalPrice.toLocaleString("en-IN")}
      </p>

      <hr style="margin:20px 0"/>

      <p><strong>ACTION REQUIRED:</strong></p>
      <p>✔ Verify PayU payment in merchant dashboard.</p>
      <p>✔ Generate & send product keys to <strong>${order.useremail}</strong>.</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: adminEmail,
    subject: `New Order — ${order.orderId} (Payment Successful)`,
    html,
  });
};

