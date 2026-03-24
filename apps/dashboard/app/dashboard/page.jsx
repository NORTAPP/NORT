// Dashboard main page (was /, now /dashboard)
'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSignals } from '@/lib/api';
import { useTelegram } from '@/hooks/useTelegram';
import { useAuth } from '@/hooks/useAuth';
import AuthGate from '@/components/AuthGate';
import FeedCard from '@/components/FeedCard';
import Navbar from '@/components/Navbar';
import TradeModal from '@/components/TradeModal';
import SkeletonCard from '@/components/SkeletonCard';

const FILTERS   = ['all', 'hot', 'warm', 'cool'];
const CATEGORIES = [
  { id: 'crypto', label: '📈 Crypto' },
  { id: 'sports', label: '🏆 Sports' },
];

export default function FeedPage() {
  const { user } = useTelegram();
  const { ready, isAuthed } = useAuth();
  const router = useRouter();
  const [signals, setSignals]         = useState([]);
  const [loading, setLoading]         = useState(true);

  // Safety net: if someone lands here without a cookie (e.g. cookie expired mid-session)
  // redirect them back to "/" so proxy sends them to the landing page
  useEffect(() => {
    if (ready && !isAuthed) {
      document.cookie = 'nort_auth=; path=/; max-age=0';
      router.replace('/');
    }
  }, [ready, isAuthed, router]);
  const [category, setCategory]       = useState('crypto');
  const [filter, setFilter]           = useState('all');
  const [tradeSignal, setTradeSignal] = useState(null);
  const [tradeSide, setTradeSide]     = useState('yes');
  const [toast, setToast]             = useState(null);

  useEffect(() => {
    setLoading(true);
    getSignals(filter, category).then(setSignals).finally(() => setLoading(false));
  }, [filter, category]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };
  const handleTrade = (signal, side) => { setTradeSignal(signal); setTradeSide(side); };
  const initials = user?.firstName ? user.firstName.slice(0, 2).toUpperCase() : 'NJ';

  return (
    <AuthGate>
      <div className="app">
        {/* ...existing dashboard content... */}
      </div>
    </AuthGate>
  );
}
