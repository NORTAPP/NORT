// Main app/feed page, only for authenticated users
import React, { useState, useEffect } from 'react';
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

export default function AppFeedPage() {
  const { user } = useTelegram();
  const { ready, isAuthed } = useAuth();
  const router = useRouter();
  const [signals, setSignals]         = useState([]);
  const [loading, setLoading]         = useState(true);

  // Redirect unauthenticated users to landing page
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

  return (
    <AuthGate>
      <div className="app">
        <div className="filter-row">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'on' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Crypto / Sports category toggle */}
        <div className="cat-toggle-row fu d1">
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              className={`cat-toggle-btn ${category === c.id ? 'active' : ''}`}
              onClick={() => { setCategory(c.id); setFilter('all'); }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Card grid */}
        <div className="feed-list">
          {loading
            ? [1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)
            : signals.map((sig, i) => (
                <FeedCard
                  key={sig.id}
                  data={sig}
                  index={i}
                  onTrade={handleTrade}
                />
              ))
          }
          {!loading && signals.length === 0 && (
            <div className="empty">
              <div className="empty-icon">◇</div>
              <div className="empty-text">No signals in this category</div>
            </div>
          )}
        </div>

        {/* Nav (bottom mobile / top desktop) */}
        <Navbar active="feed" />

        {/* Modals */}
        {tradeSignal && (
          <TradeModal
            signal={tradeSignal}
            initialSide={tradeSide}
            onClose={() => setTradeSignal(null)}
            onSuccess={() => showToast('Paper trade placed ✓')}
          />
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>
    </AuthGate>
  );
}
