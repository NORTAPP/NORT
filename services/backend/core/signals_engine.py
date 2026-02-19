# signals_engine.py
# Intern 2 — Signals Engine v3 (Final)
# Combines momentum, liquidity, and midrange scoring
# to rank Polymarket markets by opportunity.

from typing import List, Dict

# ─────────────────────────────────────────────
# CONFIGURATION
# Tune these values to adjust ranking behaviour
# ─────────────────────────────────────────────

MIN_VOLUME      = 500.0    # Minimum 24hr volume to be worth ranking
MIN_ODDS        = 0.02     # Drop markets below 2% — basically resolved
MAX_ODDS        = 0.98     # Drop markets above 98% — basically resolved

MOMENTUM_WEIGHT  = 0.50    # How much price movement matters
LIQUIDITY_WEIGHT = 0.30    # How much trading volume matters
MIDRANGE_WEIGHT  = 0.20    # How much "still in play" matters


# ─────────────────────────────────────────────
# FILTERS
# Every market must pass both before being scored
# ─────────────────────────────────────────────

def passes_liquidity_filter(market: Dict) -> bool:
    """
    Drops markets with too little trading activity.
    No point ranking a market nobody is trading.
    """
    return market.get("volume", 0) >= MIN_VOLUME


def passes_odds_filter(market: Dict) -> bool:
    """
    Drops markets that are effectively already resolved.
    A 98% market has no opportunity left.
    A 2% market is a lottery ticket, not a signal.
    """
    odds = market.get("current_odds", 0.5)
    return MIN_ODDS < odds < MAX_ODDS


# ─────────────────────────────────────────────
# SCORE 1 — MOMENTUM
# Did the price move recently?
# Bigger absolute move = higher score
# ─────────────────────────────────────────────

def momentum_score(market: Dict) -> float:
    """
    Measures absolute price movement between current and previous odds.
    A 20% point move (e.g. 0.50 -> 0.70) scores 1.0.
    Uses absolute move rather than percentage — more appropriate
    for prediction market odds which are already on a 0-1 scale.
    """
    current  = market.get("current_odds", 0.5)
    previous = market.get("previous_odds", current)

    absolute_move = abs(current - previous)

    # Cap at 0.20 absolute move = max score
    return min(absolute_move / 0.20, 1.0)


# ─────────────────────────────────────────────
# SCORE 2 — LIQUIDITY
# Is this market actively traded?
# Higher 24hr volume = more reliable signal
# ─────────────────────────────────────────────

def liquidity_score(market: Dict) -> float:
    """
    Rewards markets with high trading volume.
    More volume = more people have a view = more meaningful odds.
    $100k+ 24hr volume = max score.
    """
    volume = market.get("volume", 0)

    # Cap at 100k = score of 1.0
    return min(volume / 100_000, 1.0)


# ─────────────────────────────────────────────
# SCORE 3 — MIDRANGE
# Is there still genuine uncertainty?
# Markets near 0.5 have the most opportunity
# ─────────────────────────────────────────────

def midrange_score(market: Dict) -> float:
    """
    Rewards markets where the outcome is still genuinely uncertain.
    0.50 odds (50/50) = score 1.0 — maximum uncertainty, maximum opportunity
    0.01 or 0.99 odds = score 0.0 — basically decided, no opportunity left
    """
    odds = market.get("current_odds", 0.5)
    distance = abs(odds - 0.5)

    # Linear scale: 0 distance = 1.0, full distance = 0.0
    return max(1.0 - (distance / 0.5), 0.0)


# ─────────────────────────────────────────────
# COMPOSITE SCORE
# Weighted combination of all three signals
# Returns a single number between 0.0 and 1.0
# ─────────────────────────────────────────────

def composite_score(market: Dict) -> float:
    """
    Final ranking score.
    A market ranks high when it is:
      - Moving (momentum)
      - Actively traded (liquidity)
      - Still genuinely uncertain (midrange)
    """
    m   = momentum_score(market)
    l   = liquidity_score(market)
    mid = midrange_score(market)

    score = (
        (MOMENTUM_WEIGHT  * m)   +
        (LIQUIDITY_WEIGHT * l)   +
        (MIDRANGE_WEIGHT  * mid)
    )

    return round(score, 4)


# ─────────────────────────────────────────────
# REASON STRING
# Plain English explanation of why it ranked
# Shows up in Telegram and on the Dashboard
# ─────────────────────────────────────────────

def build_reason(market: Dict) -> str:
    """
    Generates a human-readable explanation for why this market ranked.

    Examples:
      "Odds moved +15.0pts to 65% with $42,300 volume."
      "Odds moved -8.0pts to 32% with $12,800 volume."
    """
    current  = market.get("current_odds", 0.5)
    previous = market.get("previous_odds", current)
    volume   = market.get("volume", 0)

    move_pts  = (current - previous) * 100   # in percentage points
    direction = "+" if move_pts >= 0 else ""  # show sign explicitly
    odds_pct  = current * 100

    if abs(move_pts) < 0.1:
        move_str = "No recent price move"
    else:
        move_str = f"Odds moved {direction}{move_pts:.1f}pts to {odds_pct:.0f}%"

    volume_str = f"${volume:,.0f} 24hr volume"

    return f"{move_str} with {volume_str}."


# ─────────────────────────────────────────────
# MAIN RANKING FUNCTION
# This is the only function signals.py calls.
# Takes all markets, returns top N ranked signals.
# ─────────────────────────────────────────────

def rank_markets(markets: List[Dict], top: int = 20) -> List[Dict]:
    """
    Main entry point for the signals engine.

    Pipeline:
    1. Filter out illiquid markets (too little volume)
    2. Filter out near-resolved markets (odds too extreme)
    3. Score each remaining market on 3 dimensions
    4. Sort highest score first
    5. Return top N with reason strings

    Each result includes:
      market_id, question, score, reason,
      current_odds, volume, category, expires_at
    """

    # Step 1 & 2 — apply both filters
    filtered = [
        m for m in markets
        if passes_liquidity_filter(m) and passes_odds_filter(m)
    ]

    # Step 3 & 4 — score and sort
    scored = sorted(filtered, key=composite_score, reverse=True)

    # Step 5 — build output
    results = []
    for market in scored[:top]:
        results.append({
            "market_id":    market.get("id"),
            "question":     market.get("question", "Unknown market"),
            "score":        composite_score(market),
            "reason":       build_reason(market),
            "current_odds": market.get("current_odds"),
            "volume":       market.get("volume"),
            "category":     market.get("category", "general"),
            "expires_at":   str(market.get("expires_at", "")),
        })

    return results
