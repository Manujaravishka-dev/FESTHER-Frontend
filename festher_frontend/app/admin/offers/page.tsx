"use client";

import { useCallback, useMemo, useState } from "react";
import {
  createOffer,
  deleteOffer,
  getOffers,
  updateOffer,
} from "@/services/admin/offers.service";
import type {
  AdminOffer,
  AdminOfferCta,
  AdminOfferStatus,
  AdminOfferType,
  OfferInput,
} from "@/services/admin/offers.service";
import { useAdminData } from "../components/useAdminData";
import { useToast } from "../components/Toast";
import { AdminModal } from "../components/Modal";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Field } from "../components/Field";
import { EmptyState } from "../components/EmptyState";
import { SkeletonRow } from "../components/Skeleton";

type ModalState = { mode: "add" } | { mode: "edit"; item: AdminOffer } | null;

const offerTypes: AdminOfferType[] = ["ACCOMMODATION", "DINING", "PACKAGES", "SEASONAL"];
const offerStatuses: AdminOfferStatus[] = ["active", "inactive"];
const offerCtas: AdminOfferCta[] = ["BOOK_NOW", "ORDER_NOW"];

const typeLabels: Record<AdminOfferType, string> = {
  ACCOMMODATION: "Accommodation",
  DINING: "Dining",
  PACKAGES: "Packages",
  SEASONAL: "Seasonal",
};

const statusLabels: Record<AdminOfferStatus, string> = {
  active: "Active",
  inactive: "Inactive",
};

const ctaLabels: Record<AdminOfferCta, string> = {
  BOOK_NOW: "Book Now",
  ORDER_NOW: "Order Now",
};

interface OfferForm {
  title: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  originalPrice: string;
  offerPrice: string;
  discount: string;
  startDate: string;
  endDate: string;
  type: AdminOfferType;
  status: AdminOfferStatus;
  cta: AdminOfferCta;
}

const emptyForm: OfferForm = {
  title: "",
  shortDescription: "",
  fullDescription: "",
  image: "",
  originalPrice: "",
  offerPrice: "",
  discount: "",
  startDate: "",
  endDate: "",
  type: "ACCOMMODATION",
  status: "active",
  cta: "BOOK_NOW",
};

function toForm(item: AdminOffer): OfferForm {
  return {
    title: item.title,
    shortDescription: item.shortDescription,
    fullDescription: item.fullDescription,
    image: item.image,
    originalPrice: item.originalPrice?.toString() ?? "",
    offerPrice: item.offerPrice?.toString() ?? "",
    discount: item.discount?.toString() ?? "",
    startDate: item.startDate,
    endDate: item.endDate,
    type: item.type,
    status: item.status,
    cta: item.cta,
  };
}

function toPrice(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

function autoDiscount(form: OfferForm): string {
  const original = toPrice(form.originalPrice);
  const offer = toPrice(form.offerPrice);
  if (original && original > 0 && offer != null) {
    return String(Math.max(0, Math.min(100, Math.round((1 - offer / original) * 100))));
  }
  return "";
}

const isValidUrl = (v: string) =>
  /^(https?:\/\/|\/)/.test(v.trim()) && v.trim().length > 4;

export default function AdminOffers() {
  const { data, status, reload } = useAdminData(useCallback(() => getOffers(), []));
  const { toast } = useToast();

  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | AdminOfferStatus>("ALL");
  const [filterType, setFilterType] = useState<"ALL" | AdminOfferType>("ALL");

  const [modal, setModal] = useState<ModalState>(null);
  const [form, setForm] = useState<OfferForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof OfferForm, string>>>({});
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AdminOffer | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data ?? []).filter((o) => {
      const matchesStatus = filterStatus === "ALL" || o.status === filterStatus;
      const matchesType = filterType === "ALL" || o.type === filterType;
      const matchesQuery =
        q.length === 0 ||
        o.title.toLowerCase().includes(q) ||
        o.shortDescription.toLowerCase().includes(q) ||
        typeLabels[o.type].toLowerCase().includes(q);
      return matchesStatus && matchesType && matchesQuery;
    });
  }, [data, query, filterStatus, filterType]);

  const openAdd = () => {
    setForm(emptyForm);
    setErrors({});
    setModal({ mode: "add" });
  };

  const openEdit = (item: AdminOffer) => {
    setForm(toForm(item));
    setErrors({});
    setModal({ mode: "edit", item });
  };

  const validate = () => {
    const next: Partial<Record<keyof OfferForm, string>> = {};
    if (!form.title.trim()) next.title = "Offer title is required.";
    if (!form.shortDescription.trim()) next.shortDescription = "Short description is required.";
    if (!form.fullDescription.trim()) next.fullDescription = "Full description is required.";
    if (!form.image.trim()) next.image = "Offer image is required.";
    else if (!isValidUrl(form.image)) next.image = "Enter a valid URL or path.";
    if (!form.startDate) next.startDate = "Start date is required.";
    if (!form.endDate) next.endDate = "End date is required.";
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      next.endDate = "End date must be after the start date.";
    const original = toPrice(form.originalPrice);
    const offer = toPrice(form.offerPrice);
    const discount = form.discount.trim() === "" ? null : Number(form.discount.trim());
    if (form.originalPrice.trim() !== "" && original == null)
      next.originalPrice = "Enter a valid number.";
    if (form.offerPrice.trim() !== "" && offer == null)
      next.offerPrice = "Enter a valid number.";
    if (form.discount.trim() !== "") {
      if (discount == null) next.discount = "Enter a valid number.";
      else if (discount < 0 || discount > 100) next.discount = "Discount must be 0–100%.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildInput = (): OfferInput => ({
    title: form.title.trim(),
    shortDescription: form.shortDescription.trim(),
    fullDescription: form.fullDescription.trim(),
    image: form.image.trim(),
    originalPrice: toPrice(form.originalPrice),
    offerPrice: toPrice(form.offerPrice),
    discount:
      form.discount.trim() === "" ? null : Math.min(100, Math.max(0, Number(form.discount.trim()))),
    startDate: form.startDate,
    endDate: form.endDate,
    type: form.type,
    status: form.status,
    cta: form.cta,
  });

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const input = buildInput();
      if (modal?.mode === "edit") {
        await updateOffer(modal.item.id, input);
        toast(`“${form.title}” saved.`);
      } else {
        await createOffer(input);
        toast(`“${form.title}” created.`);
      }
      setModal(null);
      reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not save the offer.", "error");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (item: AdminOffer) => {
    const nextStatus: AdminOfferStatus = item.status === "active" ? "inactive" : "active";
    try {
      await updateOffer(item.id, {
        title: item.title,
        shortDescription: item.shortDescription,
        fullDescription: item.fullDescription,
        image: item.image,
        originalPrice: item.originalPrice,
        offerPrice: item.offerPrice,
        discount: item.discount,
        startDate: item.startDate,
        endDate: item.endDate,
        type: item.type,
        status: nextStatus,
        cta: item.cta,
      });
      toast(`“${item.title}” is now ${nextStatus === "active" ? "active" : "inactive"}.`);
      reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not update the offer.", "error");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteOffer(deleteTarget.id);
      toast(`“${deleteTarget.title}” deleted.`);
      setDeleteTarget(null);
      reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not delete the offer.", "error");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const showPreview = isValidUrl(form.image) || form.image.trim().length > 4;
  const discountHint = autoDiscount(form);

  return (
    <div>
      <div className="adm-page-head">
        <div>
          <p className="adm-page-kicker">Packages & promotions</p>
          <h1>Offers</h1>
          <p>
            Create and schedule accommodation, dining, package and seasonal offers shown to
            guests.
          </p>
        </div>
        <button type="button" className="adm-btn" onClick={openAdd}>
          + Add Offer
        </button>
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
            placeholder="Search offers…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search offers"
          />
        </div>
        <div className="adm-toolbar-actions">
          <select
            className="adm-select"
            aria-label="Filter by status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as "ALL" | AdminOfferStatus)}
          >
            <option value="ALL">All statuses</option>
            {offerStatuses.map((s) => (
              <option key={s} value={s}>
                {statusLabels[s]}
              </option>
            ))}
          </select>
          <select
            className="adm-select"
            aria-label="Filter by type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as "ALL" | AdminOfferType)}
          >
            <option value="ALL">All types</option>
            {offerTypes.map((t) => (
              <option key={t} value={t}>
                {typeLabels[t]}
              </option>
            ))}
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
            title={data && data.length === 0 ? "No offers yet" : "No matches found"}
            hint={
              data && data.length === 0
                ? "Create your first offer to start publishing packages to guests."
                : "Try a different search term or filter."
            }
          >
            {data && data.length === 0 && (
              <button type="button" className="adm-btn" onClick={openAdd}>
                + Add Offer
              </button>
            )}
          </EmptyState>
        </div>
      ) : (
        <div className="adm-list">
          <div className="adm-list-head adm-cols-offers">
            <span>Image</span>
            <span>Offer</span>
            <span>Price</span>
            <span>Period</span>
            <span>Status</span>
            <span style={{ textAlign: "right" }}>Actions</span>
          </div>
          {filtered.map((o) => (
            <div className="adm-list-row adm-cols-offers" key={o.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="adm-offer-thumb"
                src={o.image}
                alt={o.title}
                loading="lazy"
              />
              <div>
                <span className="adm-row-label">Offer</span>
                <span className="adm-offer-name">{o.title}</span>
                <span className="adm-offer-type">
                  {typeLabels[o.type]} · {ctaLabels[o.cta]}
                </span>
              </div>
              <div>
                <span className="adm-row-label">Price</span>
                <span className="adm-offer-price">
                  {o.offerPrice != null ? `LKR ${o.offerPrice.toLocaleString("en-US")}` : "—"}
                  {o.originalPrice != null && o.offerPrice != null && o.offerPrice < o.originalPrice && (
                    <>
                      {" "}
                      <span className="adm-offer-was">
                        {o.originalPrice.toLocaleString("en-US")}
                      </span>
                    </>
                  )}
                  {o.discount != null && o.discount > 0 && (
                    <span className="adm-offer-discount">-{o.discount}%</span>
                  )}
                </span>
              </div>
              <div className="adm-mono">
                <span className="adm-row-label">Period</span>
                {o.startDate.replaceAll("-", ".")}
                <br />
                → {o.endDate.replaceAll("-", ".")}
              </div>
              <div className="adm-status-cell">
                <span className="adm-row-label">Status</span>
                <span className={`adm-pill adm-pill--${o.status}`}>{statusLabels[o.status]}</span>
              </div>
              <div className="adm-row-actions" style={{ justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className={`adm-btn--link ${o.status === "active" ? "adm-toggle-off" : "adm-toggle-on"}`}
                  onClick={() => toggleStatus(o)}
                >
                  {o.status === "active" ? "Deactivate" : "Activate"}
                </button>
                <button type="button" className="adm-btn--link" onClick={() => openEdit(o)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="adm-btn--link adm-btn--danger"
                  onClick={() => setDeleteTarget(o)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal
        open={modal !== null}
        onClose={() => !saving && setModal(null)}
        title={modal?.mode === "edit" ? "Edit offer" : "Add offer"}
        kicker="Offer details"
        subtitle="Discount may be entered by hand, or left blank to auto-calculate from the prices."
        wide
        footer={
          <div className="adm-form-actions adm-form-actions--right">
            <span className="adm-form-note">
              {discountHint && discountHint !== form.discount.trim()
                ? `Auto discount from prices: ${discountHint}%`
                : "Backend accepts these as-is."}
            </span>
            <button
              type="button"
              className="adm-btn adm-btn--ghost"
              onClick={() => setModal(null)}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="button" className="adm-btn" onClick={save} disabled={saving}>
              {saving ? "Saving…" : modal?.mode === "edit" ? "Save changes" : "Create offer"}
            </button>
          </div>
        }
      >
        <form
          className="adm-form"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <Field label="Offer title" htmlFor="o-title" error={errors.title} required full>
            <input
              id="o-title"
              className={`adm-input${errors.title ? " adm-input-error" : ""}`}
              type="text"
              value={form.title}
              placeholder="e.g. Romantic Getaway"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              disabled={saving}
            />
          </Field>

          <Field
            label="Short description"
            htmlFor="o-short"
            error={errors.shortDescription}
            required
            full
          >
            <textarea
              id="o-short"
              className={`adm-textarea${errors.shortDescription ? " adm-input-error" : ""}`}
              value={form.shortDescription}
              placeholder="One or two lines shown on the offer card…"
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              disabled={saving}
            />
          </Field>

          <Field
            label="Full description"
            htmlFor="o-full"
            error={errors.fullDescription}
            required
            full
          >
            <textarea
              id="o-full"
              className={`adm-textarea adm-textarea--tall${errors.fullDescription ? " adm-input-error" : ""}`}
              value={form.fullDescription}
              placeholder="The complete offer details…"
              onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
              disabled={saving}
            />
          </Field>

          <Field
            label="Offer image"
            htmlFor="o-image"
            error={errors.image}
            required
            full
          >
            <input
              id="o-image"
              className={`adm-input${errors.image ? " adm-input-error" : ""}`}
              type="text"
              value={form.image}
              placeholder="https://… or /images/…"
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              disabled={saving}
            />
            {showPreview && (
              <span className={`adm-img-preview${showPreview ? " adm-img-preview--show" : ""}`}>
                <span className="adm-img-preview-frame">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.image} alt="Preview" />
                </span>
              </span>
            )}
          </Field>

          <Field
            label="Original price (LKR)"
            htmlFor="o-original"
            error={errors.originalPrice}
          >
            <input
              id="o-original"
              className={`adm-input${errors.originalPrice ? " adm-input-error" : ""}`}
              type="number"
              min="0"
              value={form.originalPrice}
              placeholder="48000"
              onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
              disabled={saving}
            />
          </Field>

          <Field label="Offer price (LKR)" htmlFor="o-offer" error={errors.offerPrice}>
            <input
              id="o-offer"
              className={`adm-input${errors.offerPrice ? " adm-input-error" : ""}`}
              type="number"
              min="0"
              value={form.offerPrice}
              placeholder="40800"
              onChange={(e) => setForm({ ...form, offerPrice: e.target.value })}
              disabled={saving}
            />
          </Field>

          <Field
            label="Discount (%)"
            htmlFor="o-discount"
            error={errors.discount}
            full
          >
            <input
              id="o-discount"
              className={`adm-input${errors.discount ? " adm-input-error" : ""}`}
              type="number"
              min="0"
              max="100"
              value={form.discount}
              placeholder={discountHint || "auto"}
              onChange={(e) => setForm({ ...form, discount: e.target.value })}
              disabled={saving}
            />
          </Field>

          <Field label="Start date" htmlFor="o-start" error={errors.startDate} required>
            <input
              id="o-start"
              className={`adm-input${errors.startDate ? " adm-input-error" : ""}`}
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              disabled={saving}
            />
          </Field>

          <Field label="End date" htmlFor="o-end" error={errors.endDate} required>
            <input
              id="o-end"
              className={`adm-input${errors.endDate ? " adm-input-error" : ""}`}
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              disabled={saving}
            />
          </Field>

          <Field label="Offer type" htmlFor="o-type" required>
            <select
              id="o-type"
              className="adm-select"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as AdminOfferType })}
              disabled={saving}
            >
              {offerTypes.map((t) => (
                <option key={t} value={t}>
                  {typeLabels[t]}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Status" htmlFor="o-status" required>
            <select
              id="o-status"
              className="adm-select"
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as AdminOfferStatus })
              }
              disabled={saving}
            >
              {offerStatuses.map((s) => (
                <option key={s} value={s}>
                  {statusLabels[s]}
                </option>
              ))}
            </select>
          </Field>

          <Field label="CTA type" htmlFor="o-cta" required full>
            <select
              id="o-cta"
              className="adm-select"
              value={form.cta}
              onChange={(e) => setForm({ ...form, cta: e.target.value as AdminOfferCta })}
              disabled={saving}
            >
              {offerCtas.map((c) => (
                <option key={c} value={c}>
                  {ctaLabels[c]}
                </option>
              ))}
            </select>
          </Field>
        </form>
      </AdminModal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete offer"
        confirmLabel="Delete"
        busy={deleting}
        message={
          deleteTarget
            ? `“${deleteTarget.title}” will be permanently removed and hidden from guests. This cannot be undone.`
            : ""
        }
        onCancel={() => !deleting && setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}