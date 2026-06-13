import Razorpay from "razorpay";
import { randomUUID, createHmac } from "crypto";

export function getRazorpay(): Razorpay | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export type CreateOrderResult = {
  orderId: string;
  amount: number;
  currency: string;
  mock: boolean;
};

export async function createOrder(
  amountPaise: number,
  receipt: string,
  notes?: Record<string, string>
): Promise<CreateOrderResult> {
  const razorpay = getRazorpay();

  if (!razorpay) {
    return {
      orderId: `mock_order_${randomUUID().slice(0, 8)}`,
      amount: amountPaise,
      currency: "INR",
      mock: true,
    };
  }

  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt,
    notes,
  });

  return {
    orderId: order.id,
    amount: amountPaise,
    currency: "INR",
    mock: false,
  };
}

export function verifyWebhookSignature(
  body: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return process.env.NODE_ENV === "development";
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  return expected === signature;
}
