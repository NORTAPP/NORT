"use client";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { BASE } from "@/lib/api";

export default function AuthSync() {
  const { isAuthed, walletAddress, user } = useAuth();
  const didSync    = useRef(false);
  const [showUsername, setShowUsername] = useState(false);
  const [username, setUsername]         = useState("");
  const [saving, setSaving]             = useState(false);

  useEffect(() => {
    // Only run once per session when wallet is available
    if (!isAuthed || !walletAddress || didSync.current) return;
    didSync.current = true;

    // Persist wallet to localStorage for api.js to read
    try { window.localStorage.setItem("walletAddress", walletAddress); } catch {}

    const displayName = user?.firstName || user?.name || null;

    // Register this user in the backend — creates WalletConfig with $1000 if new
    fetch(`${BASE}/api/wallet/connect`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wallet_address: walletAddress,
        // Use wallet as the telegram_user_id for dashboard users
        telegram_id: walletAddress.toLowerCase(),
        username: displayName,
      }),
    })
      .then(r => r.json())
      .then(data => {
        console.log("[AuthSync] registered:", data.wallet_address, "| $1000 paper balance ready");

        // If the user has no username yet, prompt them to set one
        if (!displayName) setShowUsername(true);
      })
      .catch(e => console.warn("[AuthSync] register failed:", e));
  }, [isAuthed, walletAddress, user]);

  const saveUsername = async () => {
    if (!username.trim() || !walletAddress) return;
    setSaving(true);
    try {
      await fetch(`${BASE}/api/wallet/connect`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet_address: walletAddress,
          telegram_id:   walletAddress.toLowerCase(),
          username:      username.trim(),
        }),
      });
      setShowUsername(false);
    } catch (e) {
      console.warn("[AuthSync] username save failed:", e);
    } finally {
      setSaving(false);
    }
  };

  if (!showUsername) return null;

  // Username prompt modal — shows once after first login if no name is set
  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-title">Choose a Username</div>
        <div className="modal-sub">This shows on the leaderboard</div>
        <div className="modal-input-wrap" style={{ marginTop: 16 }}>
          <input
            className="modal-input"
            type="text"
            placeholder="e.g. whale_hunter"
            value={username}
            onChange={e => setUsername(e.target.value)}
            maxLength={24}
            onKeyDown={e => e.key === "Enter" && saveUsername()}
            autoFocus
          />
        </div>
        <button
          className="modal-cta"
          onClick={saveUsername}
          disabled={!username.trim() || saving}
          style={{ marginTop: 12 }}
        >
          {saving ? "Saving..." : "Save Username"}
        </button>
        <button
          className="chip-btn"
          onClick={() => setShowUsername(false)}
          style={{ width: "100%", marginTop: 8, opacity: 0.6 }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
