"use client";

import { useMemo, useRef, useState, type FormEvent } from "react";
import Modal from "../offers/Modal";
import Field from "../offers/Field";
import { formatPrice } from "@/lib/format";
import { isBackendConfigured } from "@/services/config";
import { submitPayHereCheckout } from "@/services/payhere";
import { createOrder } from "@/services/orders.service";
import { whatsappUrl } from "@/lib/restaurant-config";
import { orderWhatsAppMessage } from "@/lib/restaurant-order";
import { validateOrder } from "@/lib/validators";
import { recordRestaurantOrder } from "@/services/admin/store";
import {
  buildLocalOrder,
  getCheckoutKey,
  orderRequest,
  rememberOrderRef,
  summarizeCheckoutLines,
  type CheckoutCustomer,
  type CheckoutLineSpec,
} from "@/lib/checkout";

interface OrderCheckoutProps {
  lines: CheckoutLineSpec[];
  offerIds?: string[];
  kicker?: string;
  title?: string;
  subtitle?: string;
  /** When provided the summary shows editable quantity controls per line. */
  onUpdateLine?: (id: string, qty: number) => void;
  onClose: () => void;
  onPlaced: (orderNumber: string) => void;
}

type Step = "summary" | "details" | "method";
type Outcome = "whatsapp" | "online" | "backend-needed" | "error";

export default function OrderCheckout({
  lines,
  offerIds,
  kicker = "Order",
  title = "Complete Your Order",
  subtitle,
  onUpdateLine,
  onClose,
  onPlaced,
}: OrderCheckoutProps) {
  const [step, setStep] = useState<Step>("summary");
  const [form, setForm] = useState({ customerName: "", email: "", phone: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [isPayingOnline, setIsPayingOnline] = useState(false);
  const [payStage, setPayStage] = useState("Preparing payment…");
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [doneOrderNumber, setDoneOrderNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const busy = useRef(false);

  const totals = useMemo(() => summarizeCheckoutLines(lines), [lines]);
  const currency = totals.currency;

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const goMethod = (e: FormEvent) => {
    e.preventDefault();
    const errs = validateOrder(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setStep("method");
  };

  const customer: CheckoutCustomer = {
    customerName: form.customerName,
    email: form.email,
    phone: form.phone,
    specialInstructions: form.notes,
  };

  const orderSummary = useMemo(
    () => ({
      items: lines.map((line) => ({
        menuItemId: line.id,
        name: line.name,
        quantity: line.qty,
        unitPrice: line.unitPrice,
        ...(line.notes?.trim() ? { notes: line.notes.trim() } : {}),
      })),
      subtotal: totals.subtotal,
      discount: totals.discount,
      total: totals.total,
      currency,
    }),
    [lines, totals, currency],
  );

  const orderViaWhatsApp = () => {
    if (busy.current) return;
    busy.current = true;
    setProcessing(true);
    setIsPayingOnline(false);
    setErrorMsg("");
    try {
      const message = orderWhatsAppMessage({ ...orderSummary, ...customer });
      const url = whatsappUrl(message);
      // Open inside the same user gesture so popup blockers don't block it.
      window.open(url, "_blank", "noopener,noreferrer");
      // Recording an order is informational only — opening WhatsApp is never a
      // payment or a confirmation on its own.
      void (async () => {
        let ref = "";
        if (isBackendConfigured()) {
          try {
            const prepared = await createOrder(orderRequest(lines, customer, "WHATSAPP", offerIds), getCheckoutKey());
            rememberOrderRef(prepared.order.id, prepared.accessToken);
            ref = prepared.order.orderNumber;
            onPlaced(ref);
          } catch {
            // Backend unreachable — the WhatsApp message has still been sent.
          }
        } else {
          const local = buildLocalOrder(lines, customer, "WHATSAPP", "WHATSAPP", totals);
          await recordRestaurantOrder(local);
          ref = local.orderNumber;
          onPlaced(ref);
        }
        setDoneOrderNumber(ref);
        setOutcome("whatsapp");
        setProcessing(false);
        busy.current = false;
      })();
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "WhatsApp ordering is not available right now.");
      setOutcome("error");
      setProcessing(false);
      busy.current = false;
    }
  };

  const payOnline = async () => {
    if (busy.current) return;
    busy.current = true;
    setProcessing(true);
    setIsPayingOnline(true);
    setPayStage("Preparing payment…");
    setErrorMsg("");
    try {
      const key = getCheckoutKey();
      const prepared = await createOrder(orderRequest(lines, customer, "ONLINE", offerIds), key);
      rememberOrderRef(prepared.order.id, prepared.accessToken);
      if (!prepared.payment) {
        throw new Error("The payment service did not return secure payment details. No charge was made.");
      }
      setPayStage("Redirecting to secure payment…");
      onPlaced(prepared.order.orderNumber);
      setDoneOrderNumber(prepared.order.orderNumber);
      setOutcome("online");
      setProcessing(false);
      busy.current = false;
      // Give the browser a frame to paint the "redirecting" state, then leave.
      requestAnimationFrame(() => submitPayHereCheckout(prepared.payment as NonNullable<typeof prepared.payment>));
    } catch (e) {
      setProcessing(false);
      setIsPayingOnline(false);
      busy.current = false;
      if (!isBackendConfigured()) {
        // Demo mode: record an honest PENDING order, show clearly that the
        // secure backend is required, never fake a payment.
        try {
          const local = buildLocalOrder(lines, customer, "ONLINE", "PAYHERE", totals);
          await recordRestaurantOrder(local);
          setDoneOrderNumber(local.orderNumber);
          setOutcome("backend-needed");
          onPlaced(local.orderNumber);
          return;
        } catch {
          // fall through to generic error
        }
      }
      setErrorMsg(e instanceof Error ? e.message : "We could not start secure payment. Please try again.");
      setOutcome("error");
    }
  };

  return (
    <Modal onClose={onClose} kicker={kicker} title={title} subtitle={subtitle} wide>
      {outcome === "whatsapp" || outcome === "backend-needed" ? (
        <div className="ck-result">
          <span className="ck-check" aria-hidden="true">
            ✓
          </span>
          <h3 className="ck-result-title">
            {outcome === "whatsapp" ? "Order Requested" : "Online Payment Not Started"}
          </h3>
          {doneOrderNumber ? <span className="ck-ref">Order {doneOrderNumber}</span> : null}
          {outcome === "whatsapp" ? (
            <p>
              Your order has been opened in WhatsApp — you can review and send it there.
              Your order is <b>not</b> confirmed until the restaurant confirms it.
            </p>
          ) : (
            <>
              <p className="ck-warn">
                No payment was taken and your card was <b>not</b> charged.
              </p>
              <p>
                PayHere card payments require the FESTHER payment service (backend) to be
                connected. Your order {doneOrderNumber || ""} is recorded as pending. You can
                complete it now via WhatsApp, or retry card payment once the payment service
                is online.
              </p>
            </>
          )}
          {outcome === "backend-needed" ? (
            <div className="ck-actions">
              <button type="button" className="ck-btn ck-btn--wa" onClick={orderViaWhatsApp}>
                Order via WhatsApp
              </button>
              <button type="button" className="ck-btn ck-btn--ghost" onClick={onClose}>
                Close
              </button>
            </div>
          ) : (
            <div className="ck-actions">
              <button type="button" className="ck-btn ck-btn--ghost" onClick={onClose}>
                Continue
              </button>
            </div>
          )}
        </div>
      ) : outcome === "online" ? (
        <div className="ck-result">
          <span className="ck-spinner" aria-hidden="true" />
          <h3 className="ck-result-title">Pay Securely</h3>
          <p className="ck-processing-text">{payStage}</p>
          <p className="ck-hint">
            You are being taken to PayHere&apos;s secure payment page for {doneOrderNumber}.
          </p>
        </div>
      ) : outcome === "error" ? (
        <div className="ck-result">
          <span className="ck-fail" aria-hidden="true">
            !
          </span>
          <h3 className="ck-result-title">Payment Not Completed</h3>
          <p className="ck-warn">{errorMsg}</p>
          <div className="ck-actions">
            <button type="button" className="ck-btn ck-btn--wa" onClick={orderViaWhatsApp}>
              Order via WhatsApp
            </button>
            <button
              type="button"
              className="ck-btn"
              disabled={processing}
              onClick={() => {
                if (isBackendConfigured()) void payOnline();
                else {
                  setOutcome(null);
                  setStep("method");
                }
              }}
            >
              Try Again
            </button>
            <button type="button" className="ck-btn ck-btn--ghost" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      ) : step === "summary" ? (
        <div className="ck-step">
          <h4 className="ck-section">Your Order</h4>
          <div className="ck-summary">
            {lines.map((line) => (
              <div className="ck-row" key={line.id}>
                <div className="ck-row-main">
                  <span className="ck-row-name">{line.name}</span>
                  {line.notes ? <span className="ck-row-note">{line.notes}</span> : null}
                  {onUpdateLine ? (
                    <span className="ck-row-qty">
                      <button
                        type="button"
                        onClick={() => onUpdateLine(line.id, Math.max(1, line.qty - 1))}
                        aria-label={`Decrease ${line.name} quantity`}
                      >
                        −
                      </button>
                      <b>{line.qty}</b>
                      <button
                        type="button"
                        onClick={() => onUpdateLine(line.id, line.qty + 1)}
                        aria-label={`Increase ${line.name} quantity`}
                      >
                        +
                      </button>
                    </span>
                  ) : (
                    <span className="ck-row-qty">Qty {line.qty}</span>
                  )}
                </div>
                <div className="ck-row-price">
                  <span className="ck-row-unit">
                    {line.qty} × {formatPrice(line.unitPrice, currency)}
                  </span>
                  <strong>{formatPrice(line.unitPrice * line.qty, currency)}</strong>
                </div>
              </div>
            ))}
            <div className="ck-totals">
              <div className="ck-totals-row">
                <span>Subtotal</span>
                <span>{formatPrice(totals.subtotal, currency)}</span>
              </div>
              {totals.discount > 0 ? (
                <div className="ck-totals-row ck-totals-row--discount">
                  <span>Discount</span>
                  <span>{formatPrice(-totals.discount, currency)}</span>
                </div>
              ) : null}
              <div className="ck-totals-row ck-totals-row--total">
                <span>Total</span>
                <span>{formatPrice(totals.total, currency)}</span>
              </div>
            </div>
          </div>
          <div className="ck-form-actions">
            <button type="button" className="ck-btn" onClick={() => setStep("details")}>
              Continue
            </button>
          </div>
        </div>
      ) : step === "details" ? (
        <form className="ck-form" onSubmit={goMethod} noValidate>
          <h4 className="ck-section">Your Details</h4>
          <Field id="ck-name" label="Full Name *" error={errors.customerName} span>
            <input
              id="ck-name"
              className="of-input"
              type="text"
              autoComplete="name"
              value={form.customerName}
              onChange={(e) => set("customerName", e.target.value)}
              placeholder="Your full name"
            />
          </Field>
          <Field id="ck-email" label="Email *" error={errors.email}>
            <input
              id="ck-email"
              className="of-input"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@email.com"
            />
          </Field>
          <Field id="ck-phone" label="Phone Number *" error={errors.phone}>
            <input
              id="ck-phone"
              className="of-input"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+94 7X XXX XXXX"
            />
          </Field>
          <Field id="ck-notes" label="Special Instructions" span>
            <textarea
              id="ck-notes"
              className="of-textarea"
              rows={3}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Allergies, preferences, less spicy…"
            />
          </Field>
          <div className="ck-form-actions ck-form-actions--split">
            <button type="button" className="ck-btn ck-btn--ghost" onClick={() => setStep("summary")}>
              Back
            </button>
            <button type="submit" className="ck-btn">
              Choose Order Method
            </button>
          </div>
        </form>
      ) : (
        <form className="ck-form" noValidate>
          <h4 className="ck-section">How Would You Like To Order?</h4>
          {processing ? (
            <div className="ck-processing">
              <span className="ck-spinner" aria-hidden="true" />
              <p className="ck-processing-text">{isPayingOnline ? payStage : "Opening WhatsApp…"}</p>
            </div>
          ) : (
            <>
              <div className="ck-methods">
                <button
                  type="button"
                  className="ck-method"
                  onClick={orderViaWhatsApp}
                  disabled={processing}
                >
                  <span className="ck-method-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
                    </svg>
                  </span>
                  <span className="ck-method-copy">
                    <strong>Order Via WhatsApp</strong>
                    <em>Send your order request directly to our team</em>
                  </span>
                  <span className="ck-method-go" aria-hidden="true">
                    →
                  </span>
                </button>

                <div className="ck-or">
                  <span>OR</span>
                </div>

                <button
                  type="button"
                  className="ck-method ck-method--pay"
                  onClick={() => void payOnline()}
                  disabled={processing}
                >
                  <span className="ck-method-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="6" width="20" height="13" rx="1" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                      <line x1="6" y1="14.5" x2="10" y2="14.5" />
                    </svg>
                  </span>
                  <span className="ck-method-copy">
                    <strong>Pay Online — Card</strong>
                    <em>Secure card payment powered by PayHere</em>
                  </span>
                  <span className="ck-method-go" aria-hidden="true">
                    →
                  </span>
                </button>
              </div>
              <p className="ck-methods-note">
                You will be redirected to PayHere&apos;s secure payment page. Your card is charged
                only after you confirm the payment.
              </p>
              <div className="ck-form-actions ck-form-actions--split">
                <button type="button" className="ck-btn ck-btn--ghost" onClick={() => setStep("details")}>
                  Back
                </button>
              </div>
            </>
          )}
        </form>
      )}
    </Modal>
  );
}