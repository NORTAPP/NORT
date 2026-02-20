'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getMarket } from '@/lib/api';
import Navbar from '@/components/Navbar';
import AuthGate from '@/components/AuthGate';
import TradeModal from '@/components/TradeModal';

export default function MarketDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [m, setM] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tradeOpen, setTradeOpen] = useState(false);
  const [tradeSide, setTradeSide] = useState('yes');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getMarket(id).then(setM).finally(() => setLoading(false));
  }, [id]);

  const openTrade = (side) => {
    setTradeSide(side);
    setTradeOpen(true);
  };

  return (
    <AuthGate>
      <div className="app">
        <div className="header">
          <div className="header-logo">Market</div>
          <div className="header-right" />
        </div>
        <div className="scroll">
          {loading ? (
            <div className="empty">
              <div className="empty-icon">⟳</div>
              <div className="empty-text">Loading market...</div>
            </div>
          ) : !m ? (
            <div className="empty">
              <div className="empty-icon">!</div>
              <div className="empty-text">Market not found.</div>
            </div>
          ) : (
            <div className="feed-card fu d2" style={{ marginTop: 12 }}>
              <div className="feed-hdr">
                <div className="feed-cat">{m.cat || 'General'}</div>
                <div className="feed-heat">{m.vol}</div>
              </div>
              <div className="feed-q">{m.q}</div>
              <div className="feed-cta">
                <button className="yes" onClick={() => openTrade('yes')}>
                  YES {m.yes}%
                </button>
                <button className="no" onClick={() => openTrade('no')}>
                  NO {100 - m.yes}%
                </button>
              </div>
            </div>
          )}
        </div>
        <Navbar active="markets" />
      </div>
      {m ? (
        <TradeModal
          open={tradeOpen}
          onClose={() => setTradeOpen(false)}
          signal={{ id: m.id, q: m.q, yes: m.yes }}
          side={tradeSide}
        />
      ) : null}
    </AuthGate>
  );
}
