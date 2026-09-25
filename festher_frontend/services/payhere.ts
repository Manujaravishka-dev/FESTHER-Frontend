import type { PayHerePayment } from "@/lib/types";

// PayHere Checkout API — redirect integration.
// The signed payment object (including the hash) is created by the backend;
// the browser only relays it. Live vs sandbox is decided by the backend and
// carried on the payment object, never hard-coded here.

export function payhereCheckoutUrl(payment: PayHerePayment): string {
  return payment.sandbox
    ? "https://sandbox.payhere.lk/pay/checkout"
    : "https://www.payhere.lk/pay/checkout";
}

const FIELD_KEYS = [
  "merchant_id",
  "return_url",
  "cancel_url",
  "notify_url",
  "order_id",
  "items",
  "currency",
  "amount",
  "first_name",
  "last_name",
  "email",
  "phone",
  "address",
  "city",
  "country",
  "hash",
] as const;

/**
 * Redirects the customer to the secure PayHere checkout page using the
 * backend-issued payment object. PayHere then redirects the customer back to
 * `return_url` / `cancel_url` (the FESTHER payment pages) while the real
 * payment status is delivered to the backend via `notify_url`.
 */
export function submitPayHereCheckout(payment: PayHerePayment): void {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = payhereCheckoutUrl(payment);
  form.style.display = "none";
  form.setAttribute("accept-charset", "UTF-8");
  for (const key of FIELD_KEYS) {
    const value = payment[key];
    if (value == null) continue;
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = String(value);
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}