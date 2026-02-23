'use client';
import { useTelegram } from '@/hooks/useTelegram';

export default function LoginPrompt({ onLogin, onClose, message = "Connect your wallet to continue" }) {
  const { haptic } = useTelegram();

  const handleLogin = () => {
    haptic.medium();
    onLogin();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />
        
        <div className="modal-title">Login Required</div>
        <div className="modal-sub">Wallet connection needed</div>

        <div className="modal-q" style={{ marginBottom: 20, textAlign: 'center' }}>
          {message}
        </div>

        <button
          className="modal-cta"
          onClick={handleLogin}
        >
          Connect Wallet
        </button>

        <div style={{ 
          marginTop: 16, 
          fontSize: 10, 
          fontFamily: "'DM Mono', monospace", 
          color: 'var(--g3)', 
          textAlign: 'center' 
        }}>
          Paper trades only · No real funds at risk
        </div>
      </div>
    </div>
  );
}
