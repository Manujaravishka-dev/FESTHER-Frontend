"use client";

import { Suspense } from "react";
import PaymentStatusView from "../PaymentStatusView";
import "../payments.css";

export default function PaymentReturnPage() {
  return (
    <Suspense fallback={null}>
      <PaymentStatusView mode="return" />
    </Suspense>
  );
}