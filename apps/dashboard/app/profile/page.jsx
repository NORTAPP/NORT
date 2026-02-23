'use client';
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTelegram } from '@/hooks/useTelegram';
import AuthGate from '@/components/AuthGate';
import Navbar from '@/components/Navbar';

export default function ProfilePage() {
  const { user: authUser, walletAddress, logout } = useAuth();
  const { user: tgUser, haptic } = useTelegram();

  // Debug: log user data
  console.log('[Profile] Auth user:', authUser);
  console.log('[Profile] Telegram user:', tgUser);

  // Combine user info from Privy and Telegram - prioritize Telegram
  const displayName = tgUser?.first_name || authUser?.firstName || authUser?.name || authUser?.displayName || 'User';
  const displayUsername = tgUser?.username || authUser?.email?.split('@')[0] || '';
  
  const handleLogout = () => {
    console.log("[Profile] Logout clicked");
    haptic?.medium?.();
    logout();
  };

  const formatAddress = (addr) => {
    if (!addr) return 'Not connected';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ').filter(p => p.length > 0);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(displayName);

  return (
    <AuthGate>
      <div className="app">
        <div className="header">
          <div className="header-logo">Profile</div>
          <div className="header-right">
            <div className="live-pill">
              <span className="live-dot" />
              Live
            </div>
          </div>
        </div>

        <div className="scroll">
          {/* Profile header */}
          <div className="profile-header fu d1">
            <div className="profile-avatar">
              {initials}
            </div>
            <div className="profile-name">
              {displayName}
            </div>
            {displayUsername && (
              <div className="profile-email">
                @{displayUsername}
              </div>
            )}
            {!displayUsername && (
              <div className="profile-email">
                {authUser?.email || 'Paper Trading'}
              </div>
            )}
          </div>

          {/* Account section */}
          <div className="sec-lbl fu d2">
            <span className="sec-t">Account</span>
          </div>

          <div className="settings-group fu d3">
            {tgUser && (
              <>
                <div className="settings-item">
                  <div className="settings-label">Telegram</div>
                  <div className="settings-value">@{tgUser.username || tgUser.first_name}</div>
                </div>
                <div className="settings-item">
                  <div className="settings-label">Telegram ID</div>
                  <div className="settings-value mono">{tgUser.id}</div>
                </div>
              </>
            )}
            {authUser?.email && (
              <div className="settings-item">
                <div className="settings-label">Email</div>
                <div className="settings-value">{authUser.email}</div>
              </div>
            )}
            {authUser?.id && (
              <div className="settings-item">
                <div className="settings-label">User ID</div>
                <div className="settings-value mono">{authUser.id.slice(0, 12)}...</div>
              </div>
            )}
          </div>

          {/* Wallet section */}
          <div className="sec-lbl fu d4">
            <span className="sec-t">Wallet</span>
          </div>

          <div className="settings-group fu d5">
            <div className="settings-item">
              <div className="settings-label">Address</div>
              <div className="settings-value mono">{formatAddress(walletAddress)}</div>
            </div>
            <div className="settings-item">
              <div className="settings-label">Mode</div>
              <div className="settings-value">
                <span className="chip chip-green">Paper Trading</span>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="sec-lbl fu d6">
            <span className="sec-t">Session</span>
          </div>

          <div className="settings-group fu d7">
            <button 
              className="settings-btn danger" 
              onClick={handleLogout}
              style={{ width: '100%', padding: '16px', fontSize: '14px' }}
            >
              <svg viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Log Out
            </button>
          </div>

          {/* Disclaimer */}
          <div className="profile-disclaimer fu d8">
            <div className="disclaimer-icon">⚠</div>
            <div className="disclaimer-text">
              This is a paper trading demo. No real funds are involved. 
              All trades are simulated.
            </div>
          </div>
        </div>

        <Navbar active="profile" />
      </div>
    </AuthGate>
  );
}
