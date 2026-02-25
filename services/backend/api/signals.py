from datetime import datetime
from fastapi import APIRouter
from sqlmodel import Session, select
from services.backend.data.database import engine
from services.backend.data.models import Market, AISignal
from services.backend.core.signals_engine import rank_markets

router = APIRouter(prefix="/signals", tags=["Signals"], redirect_slashes=False)


@router.get("/")
def get_top_signals(top: int = 20):
    with Session(engine) as session:
        # First try: return stored AISignal snapshots
        statement = select(AISignal).order_by(AISignal.confidence_score.desc()).limit(top)
        signals = session.exec(statement).all()

        if signals:
            return [
                {
                    "market_id": s.market_id,
                    "score": s.confidence_score,
                    "reason": s.analysis_summary,
                }
                for s in signals
            ]

        # Fallback: no snapshots yet — run the engine live from Market table
        market_statement = select(Market).where(Market.is_active == True)
        markets = session.exec(market_statement).all()
        market_dicts = [
            {
                "id": m.id,
                "question": m.question,
                "category": m.category,
                "current_odds": m.current_odds,
                "previous_odds": m.previous_odds,
                "volume": m.volume,
                "avg_volume": m.avg_volume,
                "expires_at": m.expires_at,
            }
            for m in markets
        ]
        ranked = rank_markets(market_dicts, top=top)

        # Save snapshot for next time
        save_signal_snapshot(session, ranked)

        return ranked


def save_signal_snapshot(session: Session, ranked: list):
    """
    Saves the current top signals into the AISignal table.
    Dashboard reads from this table. OpenClaw calls get_signals() which hits this endpoint.
    """
    for signal in ranked:
        snapshot = AISignal(
            market_id=signal["market_id"],
            prediction="N/A",
            confidence_score=signal["score"],
            analysis_summary=signal["reason"],
            timestamp=datetime.utcnow(),
        )
        session.add(snapshot)
    session.commit()
