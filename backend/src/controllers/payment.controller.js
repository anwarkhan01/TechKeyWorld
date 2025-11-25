import { payuClient, CreateTransaction } from "../config/payu.js";
import { randomBytes } from "crypto";
import crypto from "crypto";
import Order from "../models/order.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  sendUserOrderConfirmationEmail,
  sendAdminOrderNotificationEmail,
} from "../utils/orderEmailService.js";

const cache = new Map();

const startPayU = asyncHandler(async (req, res) => {
  const { productData, contact } = req.body;
  const { email, uid } = req.user;

  if (!productData) {
    return res.status(400).json({ error: "productData is required" });
  }

  const txnid = "PAYU_" + Math.floor(Math.random() * 45825666);
  const ref = crypto.randomBytes(8).toString("hex");

  cache.set(ref, { productData, uid, contact });

  setTimeout(() => cache.delete(ref), 20 * 60 * 1000);

  const paymentData = await CreateTransaction({
    txnid,
    amount: productData.totalPrice,
    productInfo: `Order for ${productData.products.length} items`,
    firstName: contact.name,
    email,
    phone: contact.phone,
    udf1: ref,
    udf2: contact.phone,
    udf3: contact.name,
  });

  const nonce = randomBytes(16).toString("base64");

  res.setHeader(
    "Content-Security-Policy",
    `script-src 'self' 'nonce-${nonce}' https://test.payu.in https://secure.payu.in;`
  );

  const patchedHtml = paymentData.replace(
    /<script[^>]*>/i,
    `<script nonce="${nonce}">`
  );

  res.send(patchedHtml);
});

const payuSuccess = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const txnid = req.body.txnid;

  const verify = await payuClient.verifyPayment(txnid);
  const info = verify.transaction_details[txnid];

  if (!info || info.status !== "success") {
    return res.redirect(`${process.env.FRONTEND_URL}/payment/payment-failed`);
  }

  const ref = info.udf1;
  const cached = cache.get(ref);

  if (!cached) {
    return res.redirect(`${process.env.FRONTEND_URL}/payment/payment-failed`);
  }

  // Prevent duplicate order creation
  const existing = await Order.findOne({ txnId: info.txnid });
  if (existing) {
    // User pressed back or PayU retried callback
    return res.redirect(`${process.env.FRONTEND_URL}/cart?alreadyPaid=true`);
  }

  const { productData, uid, contact } = cached;
  const orderId = crypto
    .randomBytes(12)
    .toString("hex")
    .substring(0, 20)
    .toUpperCase();

  const order = await Order.create({
    firebaseUid: uid,
    useremail: email,
    username: info.udf3,
    productData,
    billingAddress: contact,
    paymentMethod: info.mode?.toLowerCase() || "upi",
    orderId,
    phone: info.udf2,
    paymentId: info.mihpayid,
    txnId: info.txnid,
    status: "processing",
    meta: { createdAt: new Date(), fromBuyNow: false },
  });

  cache.delete(ref);
  try {
    await sendUserOrderConfirmationEmail(email, order);
  } catch (err) {
    console.error("User email failed:", err);
  }

  try {
    await sendAdminOrderNotificationEmail(order);
  } catch (err) {
    console.error("Admin email failed:", err);
  }

  return res.redirect(
    `${process.env.FRONTEND_URL}/orders/${order.orderId}?paymentSuccess=true`
  );
});

const payuFailure = asyncHandler(async (req, res) => {
  return res.redirect(`${process.env.FRONTEND_URL}/payment/payment-failed`);
});

export { startPayU, payuSuccess, payuFailure };
