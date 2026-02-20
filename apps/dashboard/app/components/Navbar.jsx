'use client';
import Link from 'next/link';

export default function Navbar({ active }) {
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

      {/* Markets */}
      <Link href="/markets" className={`nb ${active === 'markets' ? 'on' : ''}`}>
        <svg viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        Markets
      </Link>

      {/* Signals */}
      <Link href="/signals" className={`nb ${active === 'signals' ? 'on' : ''}`}>
        <svg viewBox="0 0 24 24">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        Signals
      </Link>

      {/* My Bets */}
      <Link href="/trade" className={`nb ${active === 'bets' ? 'on' : ''}`}>
        <svg viewBox="0 0 24 24">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
        Bets
      </Link>

      {/* Profile */}
      <Link href="/profile" className={`nb ${active === 'profile' ? 'on' : ''}`}>
        <svg viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        Profile
      </Link>
    </nav>
  );
}
