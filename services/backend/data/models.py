from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime

# 1. User Table
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    wallet_address: str = Field(unique=True, index=True)
    telegram_id: Optional[str] = Field(default=None, unique=True)
    username: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    payments: List["Payment"] = Relationship(back_populates="user")
    trades: List["Trade"] = Relationship(back_populates="user")

# 2. Market Table
class Market(SQLModel, table=True):
    id: str = Field(primary_key=True)
    question: str
    category: str
    current_odds: float
    previous_odds: float = Field(default=0.5)
    volume: float = Field(default=0.0)
    avg_volume: float = Field(default=0.0)
    is_active: bool = Field(default=True)
    expires_at: datetime

    signals: List["AISignal"] = Relationship(back_populates="market")
    trades: List["Trade"] = Relationship(back_populates="market")

# 3. AISignal Table
class AISignal(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    market_id: str = Field(foreign_key="market.id")
    prediction: str
    confidence_score: float
    analysis_summary: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    market: Market = Relationship(back_populates="signals")

# 4. Payment Table (x402)
class Payment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    market_id: str = Field(foreign_key="market.id")
    amount: float
    tx_hash: str = Field(unique=True)
    is_confirmed: bool = Field(default=False)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    user: User = Relationship(back_populates="payments")

# 5. Trade Table
class Trade(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    market_id: str = Field(foreign_key="market.id")
    outcome_selected: str
    bet_amount: float
    odds_at_time: float
    status: str = Field(default="Open")
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    user: User = Relationship(back_populates="trades")
    market: Market = Relationship(back_populates="trades")

class PaperTrade(SQLModel, table=True):
    """Stores all paper trades. No real money is ever moved."""
    __tablename__ = "paper_trades"

    id: Optional[int] = Field(default=None, primary_key=True)
    telegram_user_id: str = Field(index=True)
    market_id: str
    market_question: str
    outcome: str                    # "YES" or "NO"
    shares: float
    price_per_share: float          # e.g. 0.65 (65 cents on the dollar)
    total_cost: float               # shares * price_per_share
    direction: str                  # "BUY" or "SELL"
    status: str = Field(default="OPEN")  # OPEN | CLOSED | CANCELLED
    tx_hash: Optional[str] = None   # Polygon testnet receipt (optional)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    closed_at: Optional[datetime] = None
    pnl: Optional[float] = None     # Filled when trade is closed


class LeaderboardSnapshot(SQLModel, table=True):
    """Daily snapshot of each user's leaderboard stats (for history/charts)."""
    __tablename__ = "leaderboard_snapshots"

    id: Optional[int] = Field(default=None, primary_key=True)
    telegram_user_id: str = Field(index=True)
    display_name: Optional[str] = None
    portfolio_value: float = Field(default=1000.0)
    net_pnl: float = Field(default=0.0)
    total_trades: int = Field(default=0)
    win_rate: float = Field(default=0.0)   # 0-100
    snapshot_date: datetime = Field(default_factory=datetime.utcnow)


class WalletConfig(SQLModel, table=True):
    """Stores per-user paper wallet balances and settings."""
    __tablename__ = "wallet_config"

    id: Optional[int] = Field(default=None, primary_key=True)
    telegram_user_id: str = Field(index=True, unique=True)
    paper_balance: float = Field(default=1000.0)  # Start with $1,000 paper money
    total_deposited: float = Field(default=1000.0)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


from sqlmodel import JSON, Column

# 6. Conversation Table
class Conversation(SQLModel, table=True):
    """
    Stores the full chat history per user per market session.
    Messages are stored as a JSONB array: [{role, content, timestamp}]
    The orchestrator loads the last N messages as a sliding window.
    """
    __tablename__ = "conversations"

    id: Optional[int] = Field(default=None, primary_key=True)
    telegram_user_id: str = Field(index=True)
    market_id: str = Field(index=True)
    # Stored as JSON array: [{"role": "user|assistant", "content": "...", "ts": "..."}]
    messages: list = Field(default_factory=list, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# 7. UserPermission Table
class UserPermission(SQLModel, table=True):
    """
    Auto-trade permission settings per user.
    These are the HARD LIMITS the AutoTradeEngine enforces in pure Python
    — the AI cannot override these values.
    """
    __tablename__ = "user_permissions"

    id: Optional[int] = Field(default=None, primary_key=True)
    telegram_user_id: str = Field(index=True, unique=True)

    # Auto-trade master switch
    auto_trade_enabled: bool = Field(default=False)

    # Trade mode: "paper" (no money moves) or "real" (live blockchain trade)
    trade_mode: str = Field(default="paper")

    # Hard bet size cap — AutoTradeEngine will NEVER exceed this even if AI says higher
    max_bet_size: float = Field(default=10.0)   # in USDC

    # Minimum confidence before AutoTradeEngine fires
    # 0.75 for solo users, 0.80 enforced for copy-trade leaders
    min_confidence: float = Field(default=0.75)

    # Language preference for advice output
    preferred_language: str = Field(default="en")  # "en" or "sw"

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


