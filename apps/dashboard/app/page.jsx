// Landing page always at /
import LandingPage from './landing/landing';

export default function Home() {
  return <LandingPage />;
}

          {!loading && signals.length === 0 && (
            <div className="empty">
              <div className="empty-icon">◇</div>
              <div className="empty-text">No signals in this category</div>
            </div>
          )}
        </div>

        {/* Nav (bottom mobile / top desktop) */}
        <Navbar active="feed" />

        {/* Modals */}
        {tradeSignal && (
          <TradeModal
            signal={tradeSignal}
            initialSide={tradeSide}
            onClose={() => setTradeSignal(null)}
            onSuccess={() => showToast('Paper trade placed ✓')}
          />
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>
    </AuthGate>
  );
}
