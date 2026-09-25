"use client";

import { useCallback, useMemo, useState } from "react";
import {
  getRestaurantOrders,
  updateRestaurantOrder,
} from "@/services/admin/orders.service";
import type { OrderStatus, RestaurantOrder } from "@/lib/types";
import { useAdminData } from "../components/useAdminData";
import { useToast } from "../components/Toast";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { EmptyState } from "../components/EmptyState";
import { SkeletonRow } from "../components/Skeleton";

const orderStatuses: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "COMPLETED",
  "CANCELLED",
];

const methodLabels: Record<string, string> = {
  WHATSAPP: "WhatsApp",
  ONLINE: "Online",
  PAYHERE: "PayHere",
  UNPAID: "Unpaid",
  PENDING: "Pending",
  PAID: "Paid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

const paidPill = (status: string): string => {
  if (status === "PAID") return "adm-pill--paid";
  if (status === "PENDING") return "adm-pill--pending";
  if (status === "UNPAID") return "adm-pill--hidden";
  return "adm-pill--failed";
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })} · ${d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
}

export default function AdminOrders() {
  const { data, status, reload } = useAdminData(useCallback(() => getRestaurantOrders(), []));
  const { toast } = useToast();

  const [query, setQuery] = useState("");
  const [filterMethod, setFilterMethod] = useState<"ALL" | "WHATSAPP" | "ONLINE">("ALL");
  const [savingId, setSavingId] = useState("");
  const [cancelTarget, setCancelTarget] = useState<{ order: RestaurantOrder; next: OrderStatus } | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data ?? []).filter((o) => {
      const matchesMethod = filterMethod === "ALL" || o.orderMethod === filterMethod;
      const matchesQuery =
        q.length === 0 ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(q);
      return matchesMethod && matchesQuery;
    });
  }, [data, query, filterMethod]);

  const changeStatus = async (order: RestaurantOrder, next: OrderStatus) => {
    if (next === order.orderStatus) return;
    if (next === "CANCELLED") {
      setCancelTarget({ order, next });
      return;
    }
    setSavingId(order.id);
    try {
      await updateRestaurantOrder(order, next);
      toast(`${order.orderNumber} → ${next}.`);
      reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not update the order status.", "error");
    } finally {
      setSavingId("");
    }
  };

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    const { order, next } = cancelTarget;
    setSavingId(order.id);
    try {
      await updateRestaurantOrder(order, next);
      toast(`${order.orderNumber} cancelled.`);
      reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not cancel the order.", "error");
    } finally {
      setSavingId("");
      setCancelTarget(null);
    }
  };

  return (
    <div>
      <div className="adm-page-head">
        <div>
          <p className="adm-page-kicker">Restaurant operations</p>
          <h1>Restaurant Orders</h1>
          <p>
            Track and manage every restaurant order. Payment status is set by verified payment
            processing only — it cannot be edited here.
          </p>
        </div>
      </div>

      <div className="adm-toolbar">
        <span className="adm-count">
          {status === "ready" ? `${filtered.length} of ${data?.length ?? 0}` : "Loading…"}
        </span>
        <div className="adm-search">
          <svg
            className="adm-search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            className="adm-search-input"
            type="search"
            placeholder="Search order, customer or phone…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search orders"
          />
        </div>
        <div className="adm-toolbar-actions">
          <select
            className="adm-select"
            aria-label="Filter by order method"
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value as "ALL" | "WHATSAPP" | "ONLINE")}
          >
            <option value="ALL">All methods</option>
            <option value="WHATSAPP">WhatsApp</option>
            <option value="ONLINE">Online</option>
          </select>
        </div>
      </div>

      {status === "loading" ? (
        <div className="adm-list">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="adm-card" style={{ background: "transparent" }}>
          <EmptyState
            title={data && data.length === 0 ? "No orders yet" : "No matches found"}
            hint={
              data && data.length === 0
                ? "Orders placed by guests appear here once they complete checkout."
                : "Try a different search term or filter."
            }
          />
        </div>
      ) : (
        <div className="adm-list">
          <div className="adm-list-head adm-cols-orders">
            <span>Order</span>
            <span>Customer</span>
            <span>Items</span>
            <span>Total</span>
            <span>Method</span>
            <span>Payment</span>
            <span>Order Status</span>
            <span>Created</span>
          </div>
          {filtered.map((o) => (
            <div className="adm-list-row adm-cols-orders" key={o.id}>
              <div>
                <span className="adm-row-label">Order</span>
                <span className="adm-offer-name">{o.orderNumber}</span>
                <span className="adm-offer-type">
                  {o.orderMethod === "WHATSAPP" ? "WhatsApp" : "PayHere"}
                </span>
              </div>
              <div>
                <span className="adm-row-label">Customer</span>
                <span className="adm-comment-name">{o.customerName}</span>
                <span className="adm-mono" style={{ display: "block" }}>
                  {o.phone}
                </span>
              </div>
              <div>
                <span className="adm-row-label">Items</span>
                <span className="adm-mono">{o.items.length} item{o.items.length === 1 ? "" : "s"}</span>
                <span className="adm-offer-type">{o.items[0]?.name}</span>
              </div>
              <div>
                <span className="adm-row-label">Total</span>
                <span className="adm-offer-price">
                  {`LKR ${o.total.toLocaleString("en-US")}`}
                  {o.discount > 0 && (
                    <span className="adm-offer-discount">-{o.discount.toLocaleString("en-US")}</span>
                  )}
                </span>
              </div>
              <div>
                <span className="adm-row-label">Method</span>
                <span className="adm-mono">{methodLabels[o.orderMethod]}</span>
              </div>
              <div>
                <span className="adm-row-label">Payment</span>
                <span className={`adm-pill ${paidPill(o.paymentStatus)}`}>
                  {methodLabels[o.paymentStatus]}
                </span>
                <span className="adm-mono" style={{ display: "block", marginTop: 6 }}>
                  {methodLabels[o.paymentMethod]}
                </span>
              </div>
              <div>
                <span className="adm-row-label">Order Status</span>
                <select
                  className="adm-select adm-select--sm"
                  aria-label={`Order status for ${o.orderNumber}`}
                  value={o.orderStatus}
                  disabled={savingId === o.id}
                  onChange={(e) => void changeStatus(o, e.target.value as OrderStatus)}
                >
                  {orderStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="adm-mono">
                <span className="adm-row-label">Created</span>
                {formatDate(o.createdAt)}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={cancelTarget !== null}
        title="Cancel order"
        confirmLabel="Cancel order"
        busy={savingId.length > 0}
        message={
          cancelTarget
            ? `${cancelTarget.order.orderNumber} from ${cancelTarget.order.customerName} will be marked as CANCELLED. A refund for PayHere orders is handled separately by the payment gateway.`
            : ""
        }
        onCancel={() => !savingId && setCancelTarget(null)}
        onConfirm={confirmCancel}
      />
    </div>
  );
}