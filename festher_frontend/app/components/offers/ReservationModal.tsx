"use client";

import { useState, type FormEvent } from "react";
import Modal from "./Modal";
import Field from "./Field";
import { useSubmit } from "./useSubmit";
import { createReservation } from "@/services/reservations.service";
import { validateReservation } from "@/lib/validators";
import type { Offer, RestaurantReservationRequest } from "@/lib/types";

const SLOTS = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];

interface ReservationModalProps {
  offer: Offer;
  onClose: () => void;
}

export default function ReservationModal({ offer, onClose }: ReservationModalProps) {
  const { status, error, run } = useSubmit();
  const loading = status === "loading";
  const failed = status === "error";
  const [form, setForm] = useState({ guestName: "", phone: "", email: "", date: "", time: "", guests: 2 });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validateReservation(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const payload: RestaurantReservationRequest = {
      offerId: offer.id,
      guestName: form.guestName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      date: form.date,
      time: form.time,
      guests: Number(form.guests),
    };
    await run(() => createReservation(payload));
  };

  return (
    <Modal
      onClose={onClose}
      kicker="Table Reservation"
      title={offer.title}
      subtitle="Reserve your table — we will confirm your reservation by email."
    >
      {status === "success" ? (
        <div className="of-success">
          <span className="of-check" aria-hidden="true">
            ✓
          </span>
          <h3>Reservation Requested</h3>
          <p>
            Thank you, {form.guestName.split(" ")[0] || "friend"}. We have received your reservation request for{" "}
            {offer.title} on {form.date} at {form.time}.
          </p>
          <p>Our team will confirm your table by email.</p>
          <div className="of-success-actions">
            <button type="button" className="of-btn of-btn--ghost" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      ) : (
        <form className="of-form" onSubmit={submit} noValidate>
          <Field id="of-rg-name" label="Full name" error={errors.guestName} span>
            <input
              id="of-rg-name"
              className="of-input"
              type="text"
              autoComplete="name"
              value={form.guestName}
              onChange={(e) => set("guestName", e.target.value)}
              placeholder="Your full name"
            />
          </Field>
          <Field id="of-rg-phone" label="Phone" error={errors.phone}>
            <input
              id="of-rg-phone"
              className="of-input"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+94 7X XXX XXXX"
            />
          </Field>
          <Field id="of-rg-email" label="Email" error={errors.email}>
            <input
              id="of-rg-email"
              className="of-input"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@email.com"
            />
          </Field>
          <Field id="of-rg-date" label="Date" error={errors.date}>
            <input
              id="of-rg-date"
              className="of-input"
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </Field>
          <Field id="of-rg-time" label="Time" error={errors.time}>
            <select
              id="of-rg-time"
              className="of-select"
              value={form.time}
              onChange={(e) => set("time", e.target.value)}
            >
              <option value="">Select a time</option>
              {SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </Field>
          <Field id="of-rg-guests" label="Guests" error={errors.guests}>
            <input
              id="of-rg-guests"
              className="of-input"
              type="number"
              min={1}
              value={form.guests}
              onChange={(e) => set("guests", Number(e.target.value))}
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
                Reserve Table
              </button>
            )}
            <p className="of-form-note">Reservations are subject to availability and confirmed by our team.</p>
          </div>
        </form>
      )}
    </Modal>
  );
}