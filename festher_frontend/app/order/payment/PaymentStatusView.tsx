"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import { getOrder, retryOrderPayment } from "@/services/orders.service";
import { paymentView } from "@/lib/restaurant-order";
import { getCheckoutKey, rememberOrderRef } from "@/lib/checkout";
import { submitPayHereCheckout } from "@/services/payhere";
import { whatsappUrl } from "@/lib/restaurant-config";
import { orderWhatsAppMessage } from "@/lib/restaurant-order";
import type { RestaurantOrder } from "@/lib/types";

interface PaymentStatusViewProps {
  mode: "return" | "cancel";
}

type View = "verifying" | "paid" | "pending" | "failed" | "cancel" | "missing" | "error";

export default function PaymentStatusView({ mode }: PaymentStatusViewProps) {
  const params = useSearchParams();
  const orderId = params.get("order");
  const token = params.get("token");

  const [view, setView] = useState<View>(() =>
    orderId && token ? "verifying" : "missing",
  );
  const [order, setOrder] = useState<RestaurantOrder | null>(null);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  const applyResult = useCallback(
    (latest: RestaurantOrder) => {
      setOrder(latest);
      const state = paymentView(latest);
      setView(
        state === "paid" ? "paid" : state === "pending" ? "pending" : mode === "cancel" ? "cancel" : "failed",
      );
    },
    [mode],
  );

  const verify = useCallback(
    (signal?: AbortSignal) => {
      if (!orderId || !token) return undefined;
      // Never trust the return URL — the real status comes from the backend,
      // which only marks a payment PAID after server-side verification.
      return getOrder(orderId, token, signal)
        .then((latest) => {
          if (signal?.aborted) return undefined;
          return applyResult(latest);
        })
        .catch((e) => {
          if (signal?.aborted) return undefined;
          setMessage(e instanceof Error ? e.message : "We could not verify your payment status right now.");
          setView("error");
        });
    },
    [orderId, token, applyResult],
  );

  useEffect(() => {
    if (!orderId || !token) return;
    const controller = new AbortController();
    void verify(controller.signal);
    return () => controller.abort();
  }, [orderId, token, verify]);

  const retry = async () => {
    if (!order || !token || pending) return;
    setPending(true);
    setMessage("");
    try {
      const prepared = await retryOrderPayment(order.id, token, getCheckoutKey());
      if (prepared.payment) {
        rememberOrderRef(prepared.order.id, prepared.accessToken);
        submitPayHereCheckout(prepared.payment);
      } else {
        setMessage(
          "Secure card payment needs the FESTHER payment service to be connected. Your order has not been charged — you can complete it via WhatsApp.",
        );
      }
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "We could not start your payment again. Please try once more.");
    } finally {
      setPending(false);
    }
  };

  const viaWhatsApp = () => {
    if (!order) return;
    try {
      const url = whatsappUrl(orderWhatsAppMessage(order));
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "WhatsApp ordering is not available right now.");
    }
  };

  return (
    <main className="ph-page">
      <Navbar />
      <section className="ph-wrap">
        {view === "verifying" ? (
          <div className="ph-panel">
            <span className="ph-spinner" aria-hidden="true" />
            <h1 className="ph-title">Verifying Your Payment…</h1>
            <p className="ph-sub">Please wait while we confirm your payment with PayHere.</p>
          </div>
        ) : view === "paid" ? (
          <div className="ph-panel">
            <span className="ph-mark ph-mark--ok" aria-hidden="true">
              ✓
            </span>
            <h1 className="ph-title">Payment Successful</h1>
            {order ? <span className="ph-ref">Order {order.orderNumber}</span> : null}
            <p className="ph-sub">
              Thank you, {order?.customerName.split(" ")[0] ?? "friend"}. Your restaurant order has been
              received and confirmed. We will be in touch shortly.
            </p>
            <div className="ph-actions">
              <Link className="ph-btn" href="/dining">
                Back to Dining
              </Link>
            </div>
          </div>
        ) : view === "pending" ? (
          <div className="ph-panel">
            <span className="ph-spinner" aria-hidden="true" />
            <h1 className="ph-title">Payment Processing</h1>
            <p className="ph-sub">
              We are confirming your payment with PayHere. Please do not submit another payment —
              your order {order?.orderNumber ?? ""} is safely recorded.
            </p>
            <div className="ph-actions">
              <button type="button" className="ph-btn ph-btn--ghost" onClick={() => void verify()}>
                Check Again
              </button>
              <button type="button" className="ph-btn ph-btn--ghost" onClick={viaWhatsApp}>
                Order via WhatsApp
              </button>
            </div>
            {message ? <p className="ph-error">{message}</p> : null}
          </div>
        ) : view === "failed" ? (
          <div className="ph-panel">
            <span className="ph-mark ph-mark--no" aria-hidden="true">
              !
            </span>
            <h1 className="ph-title">Payment Not Completed</h1>
            <p className="ph-sub">
              Your payment did not go through — no money has been taken. You can try again or complete
              your order via WhatsApp.
            </p>
            {order ? <span className="ph-ref">Order {order.orderNumber}</span> : null}
            <div className="ph-actions">
              <button type="button" className="ph-btn" onClick={retry} disabled={pending}>
                {pending ? "Working…" : "Try Again"}
              </button>
              <button type="button" className="ph-btn ph-btn--ghost" onClick={viaWhatsApp}>
                Order via WhatsApp
              </button>
            </div>
            {message ? <p className="ph-error">{message}</p> : null}
          </div>
        ) : view === "cancel" ? (
          <div className="ph-panel">
            <span className="ph-mark ph-mark--no" aria-hidden="true">
              ✕
            </span>
            <h1 className="ph-title">Payment Cancelled</h1>
            <p className="ph-sub">
              You cancelled the payment — no money has been taken. Your order stays open; you can try
              again or complete it via WhatsApp.
            </p>
            {order ? <span className="ph-ref">Order {order.orderNumber}</span> : null}
            <div className="ph-actions">
              <button type="button" className="ph-btn" onClick={retry} disabled={pending}>
                {pending ? "Working…" : "Try Again"}
              </button>
              <button type="button" className="ph-btn ph-btn--ghost" onClick={viaWhatsApp}>
                Order via WhatsApp
              </button>
            </div>
            {message ? <p className="ph-error">{message}</p> : null}
          </div>
        ) : view === "missing" ? (
          <div className="ph-panel">
            <h1 className="ph-title">
              {mode === "cancel" ? "Payment Cancelled" : "Payment Status"}
            </h1>
            <p className="ph-sub">
              We could not find an order reference in this link. Your payment is always verified against
              the FESTHER service before we can confirm it.
            </p>
            <div className="ph-actions">
              <Link className="ph-btn" href="/dining">
                Back to Dining
              </Link>
              <Link className="ph-btn ph-btn--ghost" href="/about">
                Contact FESTHER
              </Link>
            </div>
          </div>
        ) : (
          <div className="ph-panel">
            <span className="ph-mark ph-mark--no" aria-hidden="true">
              !
            </span>
            <h1 className="ph-title">Unable to Verify</h1>
            <p className="ph-sub">{message || "We could not verify your payment status."}</p>
            <div className="ph-actions">
              <button type="button" className="ph-btn" onClick={() => void verify()}>
                Check Again
              </button>
              <Link className="ph-btn ph-btn--ghost" href="/dining">
                Back to Dining
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}