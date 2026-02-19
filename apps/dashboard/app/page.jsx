'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { getSignals } from '@/lib/api';
import { useTelegram } from '@/hooks/useTelegram';
import AuthGate from '@/components/AuthGate';
import FeedCard from '@/components/FeedCard';
import Navbar from '@/components/Navbar';
import TradeModal from '@/components/TradeModal';
import ChatSheet from '@/components/ChatSheet';
import SkeletonCard from '@/components/SkeletonCard';

const FILTERS = ['all', 'hot', 'warm', 'cool'];

export default function FeedPage() {
  const { user, openDashboard } = useTelegram();
  const [signals, setSignals]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');
  const [tradeSignal, setTradeSignal] = useState(null);
  const [tradeSide, setTradeSide]     = useState('yes');
  const [chatSignal, setChatSignal]   = useState(null);
  const [toast, setToast]             = useState(null);

  useEffect(() => {
    setLoading(true);
    getSignals(filter)
      .then(setSignals)
      .finally(() => setLoading(false));
  }, [filter]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const handleTrade = (signal, side) => {
    setTradeSignal(signal);
    setTradeSide(side);
  };

  const initials = user?.firstName
    ? user.firstName.slice(0, 2).toUpperCase()
    : 'NJ';

  return (
    <AuthGate>
      <div className="app">
        {/* Header */}
        <div className="header">
          <div className="header-logo">NORT</div>
          <div className="header-right">
            <div className="live-pill">
              <span className="live-dot" />
              Live
            </div>
            {/* Open dashboard button */}
            <button className="dash-btn" onClick={openDashboard}>
              <svg viewBox="0 0 24 24">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Dashboard
            </button>
            <div className="user-av">{initials}</div>
          </div>
        </div>

        {/* Scroll area */}
        <div className="scroll">
          <div className="sec-lbl fu d1">
            <span className="sec-t">Trending Signals · {signals.length}</span>
            <span className="sec-t">Updated just now</span>
          </div>

          {/* Filter tabs */}
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

          {/* Cards */}
          <div className="feed-list">
            {loading
              ? [1, 2, 3].map(i => <SkeletonCard key={i} />)
              : signals.map((sig, i) => (
                  <FeedCard
                    key={sig.id}
                    data={sig}
                    index={i}
                    onTrade={handleTrade}
                    onChat={setChatSignal}
                  />
                ))
            }
          </div>

          {!loading && signals.length === 0 && (
            <div className="empty">
              <div className="empty-icon">◇</div>
              <div className="empty-text">No signals in this category</div>
            </div>
          )}
        </div>

        {/* Nav */}
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
        {chatSignal && (
          <ChatSheet
            signal={chatSignal}
            onClose={() => setChatSignal(null)}
          />
        )}

        {/* Toast */}
        {toast && <div className="toast">{toast}</div>}
      </div>
    </AuthGate>
  );
}
