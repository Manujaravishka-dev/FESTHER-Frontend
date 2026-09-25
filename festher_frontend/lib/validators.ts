const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9\s\-().]{7,20}$/;

export function isEmail(v: string): boolean {
  return EMAIL_RE.test(v.trim());
}

export function isPhone(v: string): boolean {
  return PHONE_RE.test(v.trim());
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function validateBooking(form: {
  guestName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
}): Record<string, string> {
  const errs: Record<string, string> = {};
  if (!form.guestName.trim()) errs.guestName = "Please enter your full name.";
  if (!form.email.trim()) errs.email = "Please enter your email address.";
  else if (!isEmail(form.email)) errs.email = "Enter a valid email address.";
  if (!form.phone.trim()) errs.phone = "Please enter a contact number.";
  else if (!isPhone(form.phone)) errs.phone = "Enter a valid phone number.";
  if (!form.checkIn) errs.checkIn = "Select your check-in date.";
  if (!form.checkOut) errs.checkOut = "Select your check-out date.";
  else if (form.checkIn && form.checkOut <= form.checkIn) errs.checkOut = "Check-out must be after check-in.";
  if (!Number.isFinite(form.adults) || form.adults < 1) errs.adults = "At least one guest is required.";
  if (!Number.isFinite(form.children) || form.children < 0) errs.children = "Children cannot be negative.";
  return errs;
}

export function validateReservation(form: {
  guestName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
}): Record<string, string> {
  const errs: Record<string, string> = {};
  if (!form.guestName.trim()) errs.guestName = "Please enter your full name.";
  if (!form.phone.trim()) errs.phone = "Please enter a contact number.";
  else if (!isPhone(form.phone)) errs.phone = "Enter a valid phone number.";
  if (!form.email.trim()) errs.email = "Please enter your email address.";
  else if (!isEmail(form.email)) errs.email = "Enter a valid email address.";
  if (!form.date) errs.date = "Select a date.";
  else if (form.date < todayISO()) errs.date = "Date cannot be in the past.";
  if (!form.time) errs.time = "Select a time.";
  if (!Number.isFinite(form.guests) || form.guests < 1) errs.guests = "At least one guest is required.";
  return errs;
}

export function validateOrder(form: {
  customerName: string;
  phone: string;
  email: string;
}): Record<string, string> {
  const errs: Record<string, string> = {};
  if (!form.customerName.trim()) errs.customerName = "Please enter your full name.";
  if (!form.phone.trim()) errs.phone = "Please enter a contact number.";
  else if (!isPhone(form.phone)) errs.phone = "Enter a valid phone number.";
  if (!form.email.trim()) errs.email = "Please enter your email address.";
  else if (!isEmail(form.email)) errs.email = "Enter a valid email address.";
  return errs;
}
