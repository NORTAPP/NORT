"use client";
import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function AuthSync() {
  const { isAuthed, walletAddress } = useAuth();
  const didSync = useRef(false);

  useEffect(() => {
    if (!isAuthed || !walletAddress || didSync.current) return;
    didSync.current = true;

    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("walletAddress", walletAddress);
      }
    } catch {}

    const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    // Register wallet and initialize paper balance if needed.
    fetch(`${BASE}/api/wallet/connect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wallet_address: walletAddress,
        telegram_id: walletAddress,
      }),
    }).catch(() => {
      // Silent — UI can still operate with cached state
    });
  }, [isAuthed, walletAddress]);

  return null;
}
