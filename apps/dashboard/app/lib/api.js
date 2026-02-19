// ─────────────────────────────────────────────────────────────────────────────
// lib/api.js
//
// MOCK API — plug in real endpoints by replacing each function body.
// Set NEXT_PUBLIC_API_URL in .env.local to point at FastAPI backend.
//
// INTERN MAP:
//   getSignals()        → Intern 1 (Markets) + Intern 2 (Signals Engine)
//   getMarket(id)       → Intern 1 (Markets)
//   getAdvice(id)       → Intern 3 (OpenClaw)
//   getPremiumAdvice()  → Intern 3 (OpenClaw) + Intern 4 (x402)
//   verifyPayment()     → Intern 4 (x402)
//   paperTrade()        → Intern 5 (Paper Trading)
//   getWallet()         → Intern 5 (Wallet)
//   getTrades()         → Intern 5 (Paper Trading)
// ─────────────────────────────────────────────────────────────────────────────

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const sim  = (ms = 600) => new Promise(r => setTimeout(r, ms));

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

export const MOCK_SIGNALS = [
  {
    id: 1,
    cat: 'Whale',
    heat: '95° HOT',
    status: 'hot',
    q: 'Will BTC hit $100k before Friday\'s close?',
    yes: 67,
    vol: '2.4M',
    locked: true,
    advice: 'Whale volume up 400% on Coinbase. Net long bias confirmed.',
  },
  {
    id: 2,
    cat: 'Momentum',
    heat: '42° WARM',
    status: 'warm',
    q: 'Solana ETF approved by SEC in 2025?',
    yes: 29,
    vol: '890K',
    locked: false,
    advice: 'Regulatory chatter remains bearish. SEC posture unchanged.',
  },
  {
    id: 3,
    cat: 'Volume',
    heat: '78° HOT',
    status: 'hot',
    q: 'Will ETH/BTC ratio flip above 0.065 this week?',
    yes: 51,
    vol: '1.2M',
    locked: true,
    advice: 'ETH outpacing BTC on derivatives flow. Watch 4h RSI.',
  },
  {
    id: 4,
    cat: 'Liquidity',
    heat: '18° COOL',
    status: 'cool',
    q: 'Fed rate cut confirmed for November 2025?',
    yes: 38,
    vol: '3.1M',
    locked: false,
    advice: 'CME futures imply 62% no-cut probability. Macro headwinds persist.',
  },
];

export const MOCK_TRADES = [
  { id: 't1', marketId: 1, q: 'Will BTC hit $100k before Friday\'s close?', side: 'yes', amount: 50, price: 0.67, pnl: 12.40, status: 'open',   ts: Date.now() - 3600000 },
  { id: 't2', marketId: 2, q: 'Solana ETF approved by SEC in 2025?',         side: 'no',  amount: 25, price: 0.71, pnl: -3.20, status: 'open',   ts: Date.now() - 7200000 },
  { id: 't3', marketId: 4, q: 'Fed rate cut confirmed for November 2025?',   side: 'yes', amount: 100, price: 0.38, pnl: 0,    status: 'closed', ts: Date.now() - 86400000 },
];

export const MOCK_WALLET = {
  balance: 428.60,
  pnl: 9.20,
  pnlPct: 2.2,
  trades: MOCK_TRADES.length,
};

// ─── SIGNALS ─────────────────────────────────────────────────────────────────
// Intern 1 + 2: replace with → fetch(`${BASE}/signals?top=20`)

export async function getSignals(filter = 'all') {
  // LIVE: return fetch(`${BASE}/signals?filter=${filter}`).then(r => r.json());
  await sim();
  if (filter === 'all') return MOCK_SIGNALS;
  return MOCK_SIGNALS.filter(s => s.status === filter);
}

// ─── SINGLE MARKET ───────────────────────────────────────────────────────────
// Intern 1: replace with → fetch(`${BASE}/markets/${id}`)

export async function getMarket(id) {
  // LIVE: return fetch(`${BASE}/markets/${id}`).then(r => r.json());
  await sim(300);
  return MOCK_SIGNALS.find(s => s.id === id) || null;
}

// ─── FREE ADVICE (OpenClaw) ───────────────────────────────────────────────────
// Intern 3: replace with → fetch(`${BASE}/agent/advice/${id}`)
// OpenClaw runs ONLY here and in getPremiumAdvice — never on normal signals.

export async function getAdvice(marketId, question) {
  // LIVE: return fetch(`${BASE}/agent/advice/${marketId}`).then(r => r.json());
  await sim(1400);
  return {
    summary: 'Net long bias confirmed across major CEX order books.',
    why: 'Whale wallets moved 18,400 BTC to exchange hot wallets in last 6h.',
    risks: ['Weekend liquidity gap', 'Mt. Gox distribution overhang'],
    plan: 'Small YES position. Set 30% stop. Take profit at 80¢.',
    disclaimer: 'Paper trade only. Not financial advice.',
  };
}

// ─── PREMIUM ADVICE (x402 gated) ─────────────────────────────────────────────
// Intern 3 + 4: x402 receipt checked on backend before OpenClaw runs.

export async function getPremiumAdvice(marketId, paymentProof) {
  // LIVE:
  // return fetch(`${BASE}/agent/premium_advice/${marketId}`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ proof: paymentProof }),
  // }).then(r => r.json());
  await sim(1800);
  if (!paymentProof) throw new Error('PAYMENT_REQUIRED');
  return {
    summary: 'High conviction YES. Whale accumulation phase active.',
    why: 'Cross-exchange flow data shows 94th percentile buy pressure.',
    risks: ['Flash crash risk', 'Low weekend volume amplifies moves'],
    plan: 'Scale in: 40% now, 40% on any dip to $94k, 20% reserve.',
    levels: { entry: 94000, target: 101500, stop: 90000 },
    disclaimer: 'Paper trade only. Not financial advice.',
  };
}

// ─── x402 PAYMENT VERIFICATION ───────────────────────────────────────────────
// Intern 4: replace with → fetch(`${BASE}/x402/verify`, { method: 'POST', ... })

export async function verifyPayment(proof) {
  // LIVE:
  // return fetch(`${BASE}/x402/verify`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ proof }),
  // }).then(r => r.json());
  await sim(800);
  // Mock: any non-empty proof string passes
  if (!proof || proof.length < 4) return { valid: false, error: 'Invalid proof' };
  return { valid: true, receipt: `mock_receipt_${Date.now()}` };
}

// ─── PAPER TRADE ─────────────────────────────────────────────────────────────
// Intern 5: replace with → fetch(`${BASE}/papertrade`, { method: 'POST', ... })

export async function paperTrade({ marketId, side, amount, price }) {
  // LIVE:
  // return fetch(`${BASE}/papertrade`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ marketId, side, amount, price }),
  // }).then(r => r.json());
  await sim(700);
  return {
    id: `t${Date.now()}`,
    marketId, side, amount, price,
    pnl: 0,
    status: 'open',
    ts: Date.now(),
    txHash: null, // Intern 5: set to Polygon testnet hash if COMMIT_TX mode
  };
}

// ─── WALLET SUMMARY ──────────────────────────────────────────────────────────
// Intern 5: replace with → fetch(`${BASE}/wallet/summary`)

export async function getWallet() {
  // LIVE: return fetch(`${BASE}/wallet/summary`).then(r => r.json());
  await sim(400);
  return MOCK_WALLET;
}

// ─── MY TRADES ───────────────────────────────────────────────────────────────
// Intern 5: replace with → fetch(`${BASE}/trades`)

export async function getTrades() {
  // LIVE: return fetch(`${BASE}/trades`).then(r => r.json());
  await sim(400);
  return MOCK_TRADES;
}