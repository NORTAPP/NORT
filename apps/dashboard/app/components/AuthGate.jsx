'use client';
import { useAuth } from '@/hooks/useAuth';

export default function AuthGate({ children }) {
  const { ready, isAuthed, login } = useAuth();

  if (!ready) {
    return (
      <div className="auth-screen">
        <div className="auth-logo">NORT</div>
        <div className="auth-sub">Loading...</div>
      </div>
    );
  }

  if (!isAuthed) {
    return (
      <div className="auth-screen">
        <div className="auth-logo">NORT</div>
        <div className="auth-sub">
          AI-powered prediction market signals.<br />
          Connect your wallet to start trading.
        </div>
        <button className="auth-btn" onClick={login}>
          Connect with Telegram
        </button>
        <div className="auth-divider">or</div>
        <button className="auth-btn outline" onClick={login}>
          Connect Wallet
        </button>
        <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: 'var(--g3)', textAlign: 'center', lineHeight: 1.6 }}>
          Paper trades only · No real funds at risk
        </div>
      </div>
    );
  }

  return children;
}