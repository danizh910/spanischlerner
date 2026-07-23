"use client";

import { useEffect, useRef } from "react";
import { flushQueue, QUEUE_CHANGED_EVENT } from "@/lib/sync";

const DEBOUNCE_MS = 10_000;

/**
 * Owns the sync queue's flush timing: debounced 10s after each write,
 * plus immediately on 'online' and on visibilitychange -> hidden (about
 * to background/close). Session-end flushes are triggered directly by
 * /learn and /build via flushQueue().
 */
export function SyncManager() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function scheduleFlush() {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        void flushQueue();
      }, DEBOUNCE_MS);
    }

    function flushNow() {
      if (timerRef.current) clearTimeout(timerRef.current);
      void flushQueue();
    }

    function onVisibilityChange() {
      if (document.visibilityState === "hidden") flushNow();
    }

    window.addEventListener(QUEUE_CHANGED_EVENT, scheduleFlush);
    window.addEventListener("online", flushNow);
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Pick up anything left over from a previous offline session.
    flushNow();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener(QUEUE_CHANGED_EVENT, scheduleFlush);
      window.removeEventListener("online", flushNow);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return null;
}
