import os
from sqlmodel import SQLModel, Session, create_engine

# Import all models so SQLModel knows about every table
from services.backend.data.models import (
    User, Market, AISignal, Payment, Trade,
    PaperTrade, WalletConfig, LeaderboardSnapshot
)

# ─────────────────────────────────────────────
# DATABASE URL RESOLUTION
# ─────────────────────────────────────────────

def _build_database_url() -> str:
    url = os.getenv("DATABASE_URL", "").strip()

    if url:
        # Fix legacy postgres:// prefix — SQLAlchemy needs postgresql://
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)

        # psycopg2-binary does not support channel_binding — strip it out
        url = url.replace("&channel_binding=require", "")
        url = url.replace("channel_binding=require&", "")
        url = url.replace("?channel_binding=require", "")

        print("Database: Neon PostgreSQL")
        return url

    # Local fallback — SQLite
    base_dir = os.path.dirname(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    )
    db_path = os.path.join(base_dir, "data", "assistant.db")
    print(f"Database: SQLite at {os.path.abspath(db_path)}")
    return f"sqlite:///{db_path}"


DATABASE_URL = _build_database_url()

# ─────────────────────────────────────────────
# ENGINE
# ─────────────────────────────────────────────

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=True,
    )
else:
    engine = create_engine(
        DATABASE_URL,
        echo=False,
    )


def init_db():
    """Create all tables if they don't exist. Safe to call on every startup."""
    SQLModel.metadata.create_all(engine)
    print("Database tables ready.")


def get_session():
    """FastAPI dependency that provides a database session."""
    with Session(engine) as session:
        yield session


if __name__ == "__main__":
    print("Building database tables...")
    init_db()
    print("Done.")
