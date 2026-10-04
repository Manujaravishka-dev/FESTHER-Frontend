"use client";

import { useState, type FormEvent } from "react";
import Modal from "./Modal";
import Field from "./Field";
import { useSubmit } from "./useSubmit";
import { createBooking } from "@/services/bookings.service";
import { validateBooking } from "@/lib/validators";
import type { Accommodation, BookingRequest, Offer } from "@/lib/types";

interface BookingModalProps {
  accommodation: Accommodation;
  offer: Offer | null;
  onClose: () => void;
}

export default function BookingModal({ accommodation, offer, onClose }: BookingModalProps) {
  const { status, error, reference, run } = useSubmit();
  const loading = status === "loading";
  const failed = status === "error";
  const [form, setForm] = useState({
    guestName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    adults: 2,
    children: 0,
    specialRequests: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validateBooking(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const payload: BookingRequest = {
      accommodationId: accommodation.id,
      offerId: offer?.id,
      guestName: form.guestName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      adults: Number(form.adults),
      children: Number(form.children),
      specialRequests: form.specialRequests.trim() || undefined,
    };
    await run(() => createBooking(payload));
  };

  return (
    <Modal
      onClose={onClose}
      kicker="Stay Request"
      title={offer ? offer.title : "Book Your Stay"}
      subtitle={`${accommodation.name} — ${accommodation.roomSize}`}
    >
      {status === "success" ? (
        <div className="of-success">
          <span className="of-check" aria-hidden="true">
            ✓
          </span>
          <h3>Request Received</h3>
          <p>
            Thank you, {form.guestName.split(" ")[0] || "friend"}. Your stay request for {accommodation.name}
            {offer ? " with " + offer.title : ""} has been received.
          </p>
          {reference ? <span className="of-ref">Reference {reference}</span> : null}
          <p>
            {reference
              ? "Keep this reference for your records."
              : "Our team will confirm availability by email — no payment is taken at this stage."}
          </p>
          <div className="of-success-actions">
            <button type="button" className="of-btn of-btn--ghost" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      ) : (
        <form className="of-form" onSubmit={submit} noValidate>
          <Field id="of-guest" label="Full name" error={errors.guestName} span>
            <input
              id="of-guest"
              className="of-input"
              type="text"
              autoComplete="name"
              value={form.guestName}
              onChange={(e) => set("guestName", e.target.value)}
              placeholder="Your full name"
            />
          </Field>
          <Field id="of-email" label="Email" error={errors.email}>
            <input
              id="of-email"
              className="of-input"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@email.com"
            />
          </Field>
          <Field id="of-phone" label="Phone" error={errors.phone}>
            <input
              id="of-phone"
              className="of-input"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+94 7X XXX XXXX"
            />
          </Field>
          <Field id="of-checkin" label="Check-in" error={errors.checkIn}>
            <input
              id="of-checkin"
              className="of-input"
              type="date"
              value={form.checkIn}
              onChange={(e) => set("checkIn", e.target.value)}
            />
          </Field>
          <Field id="of-checkout" label="Check-out" error={errors.checkOut}>
            <input
              id="of-checkout"
              className="of-input"
              type="date"
              value={form.checkOut}
              onChange={(e) => set("checkOut", e.target.value)}
            />
          </Field>
          <Field id="of-adults" label="Adults" error={errors.adults}>
            <input
              id="of-adults"
              className="of-input"
              type="number"
              min={1}
              value={form.adults}
              onChange={(e) => set("adults", Number(e.target.value))}
            />
          </Field>
          <Field id="of-children" label="Children" error={errors.children}>
            <input
              id="of-children"
              className="of-input"
              type="number"
              min={0}
              value={form.children}
              onChange={(e) => set("children", Number(e.target.value))}
            />
          </Field>
          <Field id="of-requests" label="Special requests" span>
            <textarea
              id="of-requests"
              className="of-textarea"
              rows={3}
              value={form.specialRequests}
              onChange={(e) => set("specialRequests", e.target.value)}
              placeholder="Anything we should know? (optional)"
            />
          </Field>

          {failed && error ? <p className="of-error-banner of-span-2">{error}</p> : null}

          <div className="of-form-actions of-span-2">
            {loading ? (
              <span className="of-processing">
                <span className="of-spinner" aria-hidden="true" />
                Processing…
              </span>
            ) : (
              <button type="submit" className="of-btn" disabled={loading}>
                Request Booking
              </button>
            )}
            <p className="of-form-note">
              This is a request — availability is confirmed by our team by email. No payment is taken here.
            </p>
          </div>
        </form>
      )}
    </Modal>
  );
}