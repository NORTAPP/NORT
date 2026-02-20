'use client';
import { useState, useEffect } from 'react';
import { paperTrade } from '@/lib/api';
import { useTelegram } from '@/hooks/useTelegram';
import { useAuth } from '@/hooks/useAuth';
import LoginPrompt from './LoginPrompt';

export default function TradeModal({ signal, initialSide = 'yes', onClose, onSuccess }) {
  const { haptic } = useTelegram();
  const { ready, isAuthed, walletAddress, login } = useAuth();
  const [side, setSide]       = useState(initialSide);
  const [amount, setAmount]   = useState('');
  const [loading, setLoading] = useState(false);

  if (!signal) return null;

  if (!ready) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-handle" />
          <div className="modal-title">Loading...</div>
          <div className="modal-sub">Please wait</div>
        </div>
      </div>
    );
  }

  const needsWallet = !walletAddress;

  if (!isAuthed || needsWallet) {
    return <LoginPrompt onLogin={login} onClose={onClose} message={needsWallet ? "Connect your wallet to place trades" : "Connect your wallet to continue"} />;
  }

  const price   = side === 'yes' ? signal.yes / 100 : (100 - signal.yes) / 100;
  const shares  = amount ? (parseFloat(amount) / price).toFixed(1) : '—';
  const payout  = amount ? (parseFloat(amount) / price).toFixed(2) : '—';

  const submit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    haptic.medium();
    setLoading(true);
    try {
      const trade = await paperTrade({
        marketId: signal.id,
        side,
        amount: parseFloat(amount),
        price,
      });
      haptic.success();
      onSuccess?.(trade);
      onClose();
    } catch (err) {
      haptic.error();
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />

        <div className="modal-title">Paper Trade</div>
        <div className="modal-sub">SIMULATION ONLY · NO REAL FUNDS</div>

        <div className="modal-q">{signal.q}</div>

        {/* YES / NO toggle */}
        <div className="modal-sides">
          <button
            className={`side-btn ${side === 'yes' ? 'active-yes' : ''}`}
            onClick={() => { setSide('yes'); haptic.light(); }}
          >
            <span className="side-label">▲ YES</span>
            <span className="side-price">{signal.yes}¢</span>
          </button>
          <button
            className={`side-btn ${side === 'no' ? 'active-no' : ''}`}
            onClick={() => { setSide('no'); haptic.light(); }}
          >
            <span className="side-label">▼ NO</span>
            <span className="side-price">{100 - signal.yes}¢</span>
          </button>
        </div>

        {/* Amount */}
        <div className="modal-input-label">Amount</div>
        <div className="modal-input-wrap">
          <span className="modal-input-prefix">USDC</span>
          <input
            className="modal-input"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
          />
        </div>

        {/* Payout */}
        <div className="modal-payout">
          <div>
            <div className="payout-label">Shares</div>
            <div className="payout-val">{shares}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="payout-label">Max Payout</div>
            <div className="payout-val">{payout !== '—' ? `$${payout}` : '—'}</div>
          </div>
        </div>

        <button
          className="modal-cta"
          onClick={submit}
          disabled={!amount || loading}
        >
          {loading ? 'Placing...' : `Place ${side.toUpperCase()} Trade`}
        </button>
      </div>
    </div>
  );
}
