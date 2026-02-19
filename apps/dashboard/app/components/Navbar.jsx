'use client';
import Link from 'next/link';
import { useTelegram } from '@/hooks/useTelegram';

export default function Navbar({ active }) {
  const { openDashboard } = useTelegram();

  return (
    <nav className="nav">
      {/* Feed */}
      <Link href="/" className={`nb ${active === 'feed' ? 'on' : ''}`}>
        <svg viewBox="0 0 24 24">
          <line x1="3" y1="6"  x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        Feed
      </Link>

      {/* Dashboard — opens external URL via Telegram browser */}
      <button className="nb" onClick={openDashboard} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
        <svg viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        Dash
      </button>

      {/* My Bets */}
      <Link href="/trade" className={`nb ${active === 'bets' ? 'on' : ''}`}>
        <svg viewBox="0 0 24 24">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        Bets
      </Link>
    </nav>
  );
}