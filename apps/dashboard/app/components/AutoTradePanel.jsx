'use client';
import { useState, useEffect } from 'react';
import { getPermissions, setPermissions } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

export default function AutoTradePanel() {
  const { isAuthed } = useAuth();
  const [perms, setPerms]       = useState(null);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!isAuthed) { setLoading(false); return; }
    getPermissions()
      .then(p => setPerms(p || {
        auto_trade_enabled: false,
        trade_mode:         'paper',
        max_bet_size:       10,
        min_confidence:     0.75,
        preferred_language: 'en',
      }))
      .catch(() => setError('Could not load settings.'))
      .finally(() => setLoading(false));
  }, [isAuthed]);

  const update = (field, value) => {
    setSaved(false);
    setPerms(prev => ({ ...prev, [field]: value }));
  };

  const save = async () => {
    setSaving(true); setError(null);
    try {
      await setPermissions(perms);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthed) return (
    <div className="atp-card">
      <p className="atp-hint">Connect your wallet to manage auto-trade settings.</p>
    </div>
  );

  if (loading) return <div className="atp-card"><p className="atp-hint">Loading…</p></div>;

  return (
    <div className="atp-card">
      <div className="atp-header">
        <span className="atp-title">⚡ Auto-Trade</span>
        <label className="atp-toggle">
          <input
            type="checkbox"
            checked={perms?.auto_trade_enabled || false}
            onChange={e => update('auto_trade_enabled', e.target.checked)}
          />
          <span className="atp-slider" />
        </label>
      </div>

      {perms?.auto_trade_enabled && (
        <div className="atp-body">
          {/* Trade Mode */}
          <div className="atp-row">
            <label className="atp-label">Mode</label>
            <select className="atp-select" value={perms.trade_mode}
              onChange={e => update('trade_mode', e.target.value)}>
              <option value="paper">Paper (safe)</option>
              <option value="confirm">Confirm each trade</option>
              <option value="real">Real (live)</option>
            </select>
          </div>

          {/* Max Bet Size */}
          <div className="atp-row">
            <label className="atp-label">Max bet <span className="atp-unit">USDC</span></label>
            <input className="atp-input" type="number" min="1" max="1000" step="1"
              value={perms.max_bet_size}
              onChange={e => update('max_bet_size', parseFloat(e.target.value))} />
          </div>

          {/* Min Confidence */}
          <div className="atp-row">
            <label className="atp-label">
              Min confidence <span className="atp-unit">{Math.round((perms.min_confidence || 0.75) * 100)}%</span>
            </label>
            <input className="atp-range" type="range" min="0.5" max="1" step="0.05"
              value={perms.min_confidence}
              onChange={e => update('min_confidence', parseFloat(e.target.value))} />
          </div>

          {/* Language */}
          <div className="atp-row">
            <label className="atp-label">Language</label>
            <select className="atp-select" value={perms.preferred_language}
              onChange={e => update('preferred_language', e.target.value)}>
              <option value="en">English</option>
              <option value="sw">Kiswahili</option>
            </select>
          </div>
        </div>
      )}

      {error && <p className="atp-error">{error}</p>}

      <button className="atp-save" onClick={save} disabled={saving}>
        {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Settings'}
      </button>

      <p className="atp-disclaimer">
        Auto-trade fires only when confidence ≥ threshold. Paper mode only — no real funds at risk.
      </p>
    </div>
  );
}
