'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSignals } from '@/lib/api';
import Navbar from '@/components/Navbar';
import AuthGate from '@/components/AuthGate';
import SkeletonCard from '@/components/SkeletonCard';

const FILTERS = ['all', 'hot', 'warm', 'cool'];

export default function SignalsPage() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [filter, setFilter]   = useState('all');

  useEffect(() => {
    setLoading(true);
    setError(null);
    getSignals(filter)
      .then(setSignals)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <AuthGate>
      <div className="app">
        <div className="header">
          <div className="header-logo">Signals</div>
          <div className="header-right">
            <div className="live-pill">
              <span className="live-dot" />
              AI Ranked
            </div>
          </div>
        </div>

        <div className="scroll">
          <div className="filter-row fu d1">
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

          {loading ? (
            [1, 2, 3].map(i => <SkeletonCard key={i} />)
          ) : error ? (
            <div className="empty fu d2">
              <div className="empty-icon">!</div>
              <div className="empty-text">Failed to load signals: {error}</div>
            </div>
          ) : signals.length === 0 ? (
            <div className="empty fu d2">
              <div className="empty-icon">◇</div>
              <div className="empty-text">No signals in this category</div>
            </div>
          ) : (
            <div style={{ paddingBottom: 8 }}>
              {signals.map((sig, i) => (
                <Link key={sig.id} href={`/market/${sig.id}`}>
                  <div className={`scard fu d${Math.min(i + 2, 6)}`}>
                    <div className={`scard-bar ${sig.status}`} />
                    <div className="scard-inner">
                      <div className="scard-meta">
                        <span className="scard-cat">{sig.cat}</span>
                        <span className={`scard-heat ${sig.status}`}>{sig.heat}</span>
                      </div>
                      <div className="scard-q">{sig.q}</div>
                      <div className="odds-wrap">
                        <div className="odds-bar-track">
                          <div className="odds-bar-fill" style={{ width: `${sig.yes}%` }} />
                        </div>
                        <div className="odds-labels">
                          <span className="odds-yes">YES {sig.yes}%</span>
                          <span className="odds-vol">Vol: {sig.vol}</span>
                        </div>
                      </div>
                      {sig.advice && (
                        <div className="advice-wrap">
                          <div className="advice-glass">
                            <div className="advice-text">{sig.advice}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        <Navbar active="signals" />
      </div>
    </AuthGate>
  );
}
