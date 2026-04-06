'use client';
/**
 * PremiumGate.jsx
 *
 * Shown when a free user hits their 10/day advice limit OR tries a
 * premium-only feature. Explains free vs premium and gives a clear upgrade path.
 *
 * Props:
 *   open    — boolean
 *   onClose — callback
 *   reason  — 'limit' | 'feature'
 *   used    — how many calls used today (shown in limit mode)
 */

import { useEffect } from 'react';

const FEATURES = [
  { free: '10 AI advice calls / day',   premium: 'Unlimited AI advice calls'   },
  { free: 'Basic advice only',          premium: 'Full deep-dive analysis'      },
  { free: 'English only',               premium: 'Swahili + English'            },
  { free: 'No conversation memory',     premium: 'AI remembers your context'    },
  { free: 'Standard confidence scores', premium: 'Calibrated to your history'   },
];

export default function PremiumGate({ open, onClose, reason = 'limit', used = 10, limit = 10 }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const isLimit = reason === 'limit';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.72)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px', backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 16, padding: '28px 24px 24px',
          maxWidth: 420, width: '100%',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 36, marginBottom: 8, lineHeight: 1 }}>
            {isLimit ? '🔒' : '⚡'}
          </div>
          <h2 style={{
            fontSize: 18, fontWeight: 700, color: 'var(--white)',
            margin: '0 0 6px', fontFamily: 'DM Mono, monospace',
          }}>
            {isLimit ? `Daily limit reached (${used}/${limit})` : 'Premium feature'}
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
            {isLimit
              ? `You've used all ${limit} free advice calls for today. Upgrade to keep going.`
              : 'This feature is available to premium users only.'}
          </p>
        </div>

        {/* Free vs Premium comparison table */}
        <div style={{
          background: 'var(--bg)', borderRadius: 10,
          overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 20,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--border)' }}>
            <div style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700, color: 'var(--muted)', fontFamily: 'DM Mono, monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}>FREE</div>
            <div style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700, color: '#F59E0B', fontFamily: 'DM Mono, monospace', letterSpacing: '0.06em', textTransform: 'uppercase', borderLeft: '1px solid var(--border)' }}>⚡ PREMIUM</div>
          </div>
          {FEATURES.map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: i < FEATURES.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ padding: '9px 12px', fontSize: 12, color: 'var(--muted)' }}>{row.free}</div>
              <div style={{ padding: '9px 12px', fontSize: 12, color: 'var(--white)', borderLeft: '1px solid var(--border)', fontWeight: 500 }}>{row.premium}</div>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <button
          onClick={() => alert('Payment flow coming soon. Contact us to manually upgrade your account.')}
          style={{
            width: '100%', padding: '13px 0', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
            color: '#000', fontSize: 14, fontWeight: 700,
            fontFamily: 'DM Mono, monospace', cursor: 'pointer',
            letterSpacing: '0.04em', marginBottom: 10,
          }}
        >
          ⚡ UPGRADE TO PREMIUM
        </button>

        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '10px 0', borderRadius: 10,
            border: '1px solid var(--border)', background: 'transparent',
            color: 'var(--muted)', fontSize: 13, cursor: 'pointer',
            fontFamily: 'DM Mono, monospace',
          }}
        >
          {isLimit ? 'Come back tomorrow' : 'Maybe later'}
        </button>
      </div>
    </div>
  );
}
