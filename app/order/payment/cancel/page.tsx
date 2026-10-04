"use client";

import { Suspense } from "react";
import PaymentStatusView from "../PaymentStatusView";
import "../payments.css";

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={null}>
      <PaymentStatusView mode="cancel" />
    </Suspense>
  );
}