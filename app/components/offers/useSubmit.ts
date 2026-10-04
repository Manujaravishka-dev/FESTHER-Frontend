"use client";

import { useRef, useState } from "react";
import type { ApiResult, ApiStatus } from "@/lib/types";

export function useSubmit() {
  const [status, setStatus] = useState<ApiStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | undefined>(undefined);
  const busy = useRef(false);

  const run = async <R>(task: () => Promise<ApiResult<R>>): Promise<boolean> => {
    if (busy.current) return false;
    busy.current = true;
    setStatus("loading");
    setError(null);
    setReference(undefined);
    try {
      const result = await task();
      if (result.success) {
        setStatus("success");
        if (result.reference) setReference(result.reference);
        return true;
      }
      setError(result.message ?? "We could not complete your request. Please try again.");
      setStatus("error");
      return false;
    } catch (e) {
      setError(e instanceof Error ? e.message : "We could not complete your request. Please try again.");
      setStatus("error");
      return false;
    } finally {
      busy.current = false;
    }
  };

  const reset = () => {
    setStatus("idle");
    setError(null);
    setReference(undefined);
  };

  return { status, error, reference, run, reset };
}