"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type AdminDataStatus = "loading" | "ready" | "error";

interface AdminDataResult<T> {
  data: T | null;
  status: AdminDataStatus;
  error: string;
  reload: () => void;
}

export function useAdminData<T>(loader: () => Promise<T>): AdminDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<AdminDataStatus>("loading");
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);
  const loaderRef = useRef(loader);

  useEffect(() => {
    loaderRef.current = loader;
  });

  useEffect(() => {
    let cancelled = false;
    loaderRef
      .current()
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setError("");
        setStatus("ready");
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [tick]);

  const reload = useCallback(() => {
    setStatus("loading");
    setError("");
    setTick((t) => t + 1);
  }, []);

  return { data, status, error, reload };
}