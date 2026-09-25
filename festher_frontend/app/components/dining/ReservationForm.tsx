"use client";

import { useState, type FormEvent } from "react";
import Field from "../offers/Field";
import { useSubmit } from "../offers/useSubmit";
import { createReservation } from "@/services/reservations.service";
import { validateReservation } from "@/lib/validators";
import type { RestaurantReservationRequest } from "@/lib/types";

const SLOTS = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];

const EMPTY = { guestName: "", email: "", phone: "", date: "", time: "", guests: 2, specialRequests: "" };

export default function ReservationForm() {
  const { status, error, run, reset } = useSubmit();
  const loading = status === "loading";
  const failed = status === "error";
  const [form, setForm] = useState(EMPTY);
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
      guestName: form.guestName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      date: form.date,
      time: form.time,
      guests: Number(form.guests),
      specialRequests: form.specialRequests.trim() || undefined,
    };
    await run(() => createReservation(payload));
  };

  const again = () => {
    setForm(EMPTY);
    setErrors({});
    reset();
  };

  if (status === "success") {
    return (
      <div className="of-success">
        <span className="of-check" aria-hidden="true">
          ✓
        </span>
        <h3>Reservation Requested</h3>
        <p>
          Thank you, {form.guestName.split(" ")[0] || "friend"}. We have received your table request for {form.date} at{" "}
          {form.time} for {form.guests} {form.guests === 1 ? "guest" : "guests"}.
        </p>
        <p>Our team will confirm your table by email.</p>
        <div className="of-success-actions">
          <button type="button" className="of-btn of-btn--ghost" onClick={again}>
            Make Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="of-form" onSubmit={submit} noValidate>
      <Field id="dine-rs-name" label="Full name" error={errors.guestName} span>
        <input
          id="dine-rs-name"
          className="of-input"
          type="text"
          autoComplete="name"
          value={form.guestName}
          onChange={(e) => set("guestName", e.target.value)}
          placeholder="Your full name"
        />
      </Field>
      <Field id="dine-rs-email" label="Email" error={errors.email}>
        <input
          id="dine-rs-email"
          className="of-input"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="you@email.com"
        />
      </Field>
      <Field id="dine-rs-phone" label="Phone" error={errors.phone}>
        <input
          id="dine-rs-phone"
          className="of-input"
          type="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
          placeholder="+94 7X XXX XXXX"
        />
      </Field>
      <Field id="dine-rs-date" label="Date" error={errors.date}>
        <input
          id="dine-rs-date"
          className="of-input"
          type="date"
          value={form.date}
          onChange={(e) => set("date", e.target.value)}
        />
      </Field>
      <Field id="dine-rs-time" label="Time" error={errors.time}>
        <select id="dine-rs-time" className="of-select" value={form.time} onChange={(e) => set("time", e.target.value)}>
          <option value="">Select a time</option>
          {SLOTS.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </Field>
      <Field id="dine-rs-guests" label="Number of guests" error={errors.guests}>
        <input
          id="dine-rs-guests"
          className="of-input"
          type="number"
          min={1}
          value={form.guests}
          onChange={(e) => set("guests", Number(e.target.value))}
        />
      </Field>
      <Field id="dine-rs-requests" label="Special requests (optional)" span>
        <textarea
          id="dine-rs-requests"
          className="of-textarea"
          rows={2}
          value={form.specialRequests}
          onChange={(e) => set("specialRequests", e.target.value)}
          placeholder="Occasion, seating, dietary notes…"
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
            Reserve a Table
          </button>
        )}
        <p className="of-form-note">Reservations are subject to availability and confirmed by our team.</p>
      </div>
    </form>
  );
}
