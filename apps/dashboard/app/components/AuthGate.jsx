'use client';
import { useAuth } from '@/hooks/useAuth';
import { useTelegram } from '@/hooks/useTelegram';

export default function AuthGate({ children }) {
  const { ready, isAuthed, login } = useAuth();
  const { user: tgUser, ready: tgReady } = useTelegram();

  const isReady = ready && tgReady;

  if (!isReady) {
    return (
      <div className="auth-screen">
        <div className="auth-logo">NORT</div>
        <div className="auth-sub">Loading...</div>
      </div>
    );
  }

  if (!isAuthed && !tgUser) {
    return (
      <div className="auth-screen">
        <div className="auth-logo">NORT</div>
        <div className="auth-sub">
          AI-powered prediction market signals.<br />
          Connect your wallet to start trading.
        </div>
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
