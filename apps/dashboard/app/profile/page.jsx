'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTelegram } from '@/hooks/useTelegram';
import AuthGate from '@/components/AuthGate';
import Navbar from '@/components/Navbar';

export default function ProfilePage() {
  const { user, walletAddress, logout } = useAuth();
  const { haptic } = useTelegram();

  const handleLogout = () => {
    console.log("[Profile] Logout clicked, calling logout");
    logout();
  };

  const formatAddress = (addr) => {
    if (!addr) return 'Not connected';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

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
              {user?.firstName?.slice(0, 2).toUpperCase() || 'NJ'}
            </div>
            <div className="profile-name">
              {user?.firstName || 'User'}
            </div>
            <div className="profile-email">
              {user?.email || 'Paper Trading'}
            </div>
          </div>

          {/* Wallet section */}
          <div className="sec-lbl fu d2">
            <span className="sec-t">Wallet</span>
          </div>

          <div className="settings-group fu d3">
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

          {/* Account section */}
          <div className="sec-lbl fu d4">
            <span className="sec-t">Account</span>
          </div>

          <div className="settings-group fu d5">
            <button className="settings-btn danger" onClick={handleLogout}>
              <svg viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Log Out
            </button>
          </div>

          {/* Disclaimer */}
          <div className="profile-disclaimer fu d6">
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
