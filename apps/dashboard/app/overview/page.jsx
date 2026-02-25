'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import AuthGate from '@/components/AuthGate';
import { BASE, getSignals, listMarkets } from '@/lib/api';

export default function OverviewPage() {
  const [status, setStatus]         = useState(null);
  const [signalCount, setSignalCount] = useState(null);
  const [marketCount, setMarketCount] = useState(null);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${BASE}/`).then(r => r.json()).catch(() => ({ status: 'offline' })),
      getSignals('all').then(s => s.length).catch(() => 0),
      listMarkets().then(m => m.length).catch(() => 0),
    ]).then(([s, sc, mc]) => {
      setStatus(s);
      setSignalCount(sc);
      setMarketCount(mc);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <AuthGate>
      <div className="app">
        <div className="header">
          <div className="header-logo">Overview</div>
          <div className="header-right">
            <div className="live-pill">
              <span className="live-dot" />
              {status?.status === 'online' ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>

        <div className="scroll">
          {loading ? (
            <div className="empty">
              <div className="empty-icon">⟳</div>
              <div className="empty-text">Checking status...</div>
            </div>
          ) : status?.status === 'online' ? (
            <>
              <div className="sec-lbl fu d1">
                <span className="sec-t">System Status</span>
              </div>

              <div className="bets-stats fu d2">
                <div className="stat-card">
                  <span className="stat-label">Backend</span>
                  <span className="stat-val" style={{ color: 'var(--green)' }}>Online</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Markets</span>
                  <span className="stat-val">{marketCount ?? '—'}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Signals</span>
                  <span className="stat-val">{signalCount ?? '—'}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Mode</span>
                  <span className="stat-val">Paper</span>
                </div>
              </div>

              <div className="sec-lbl fu d3">
                <span className="sec-t">Backend</span>
              </div>
              <div className="advice-wrap fu d4">
                <div className="advice-glass">
                  <div className="advice-text">{status.message}</div>
                </div>
              </div>
            </>
          ) : (
            <div className="empty fu d2">
              <div className="empty-icon" style={{ borderColor: 'var(--red)' }}>!</div>
              <div className="empty-text">Backend is offline</div>
            </div>
          )}
        </div>
        <Navbar active="overview" />
      </div>
    </AuthGate>
  );
}
