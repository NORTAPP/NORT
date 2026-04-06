'use client';
/**
 * useTier.js
 * Tracks whether the current user is FREE or PREMIUM,
 * and how many free advice calls they've used today.
 *
 * FREE:    wallet connected, no payment on record
 * PREMIUM: wallet connected + valid x402 payment verified
 *
 * Usage count is read from AuditLog via a new backend endpoint.
 * Falls back to localStorage for instant UI (no loading flash).
 */
import { useState, useEffect, useCallback } from 'react';
import { BASE } from '@/lib/api';

const FREE_DAILY_LIMIT = 10;

function getTodayKey() {
  return new Date().toISOString().slice(0, 10); // "2026-03-29"
}

export function useTier() {
  const [tier, setTier]         = useState('free');   // 'free' | 'premium'
  const [usedToday, setUsed]    = useState(0);
  const [loading, setLoading]   = useState(true);

  const wallet =
    typeof window !== 'undefined'
      ? window.localStorage?.getItem('walletAddress')
      : null;

  const refresh = useCallback(async () => {
    if (!wallet) { setLoading(false); return; }
    try {
      const res = await fetch(
        // NOTE: the advice router is mounted at /agent (no /api prefix) in main.py
        `${BASE}/agent/usage?wallet_address=${encodeURIComponent(wallet)}&t=${Date.now()}`
      );
      if (res.ok) {
        const data = await res.json();
        setUsed(data.used_today ?? 0);
        setTier(data.is_premium ? 'premium' : 'free');
        // cache locally for instant display on next load
        try {
          localStorage.setItem('nort_tier', data.is_premium ? 'premium' : 'free');
          localStorage.setItem(`nort_used_${getTodayKey()}`, String(data.used_today ?? 0));
        } catch {}
      }
    } catch {
      // fallback: read from localStorage
      try {
        const cachedTier  = localStorage.getItem('nort_tier') || 'free';
        const cachedUsed  = parseInt(localStorage.getItem(`nort_used_${getTodayKey()}`) || '0', 10);
        setTier(cachedTier);
        setUsed(cachedUsed);
      } catch {}
    } finally {
      setLoading(false);
    }
  }, [wallet]);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const onRefresh = () => { refresh(); };
    window.addEventListener('nort-tier-refresh', onRefresh);
    return () => window.removeEventListener('nort-tier-refresh', onRefresh);
  }, [refresh]);

  const atLimit     = tier === 'free' && usedToday >= FREE_DAILY_LIMIT;
  const remaining   = tier === 'premium' ? null : Math.max(0, FREE_DAILY_LIMIT - usedToday);

  return { tier, usedToday, remaining, atLimit, loading, refresh, FREE_DAILY_LIMIT };
}
