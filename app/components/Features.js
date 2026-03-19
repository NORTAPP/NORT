'use client';

const FEATURES = [
  { icon:'solar:bolt-circle-bold',   title:'Real-Time Signals',    desc:'Live Polymarket trends scored by momentum, volume spikes, and AI confidence — before the crowd moves.',         accent:'var(--accent)' },
  { icon:'solar:brain-bold',         title:'AI Market Analysis',   desc:"Plain-English breakdowns of any market: key drivers, risks, sentiment, and NORT's recommendation.",           accent:'#a78bfa'       },
  { icon:'solar:fire-bold',          title:'Heat Scoring',         desc:'Every signal scored HOT, WARM, or COOL based on momentum, volume anomalies, and AI certainty.',               accent:'#f97316'       },
  { icon:'solar:bell-bing-bold',     title:'Instant Alerts',       desc:'Get notified the moment a signal hits your thresholds — via Telegram bot or directly in-app.',                accent:'var(--blue)'   },
  { icon:'solar:chart-bold',         title:'Performance Tracking', desc:'Track your paper trades, monitor P&L, and see which signals performed across every category.',                accent:'var(--accent)' },
  { icon:'solar:trophy-bold',        title:'Leaderboard',          desc:'Compete with other traders on the NORT leaderboard. Rankings update in real time.',                           accent:'#f5a623'       },
];

export default function Features() {
  return (
    <section id="features" style={{ padding:'120px 0', background:'var(--bg)', borderTop:'1px solid var(--border)' }}>
      <div style={{ maxWidth:1152, margin:'0 auto', padding:'0 24px' }}>

        <div className="fade-up" style={{ maxWidth:560, marginBottom:64 }}>
          <span className="pill" style={{ marginBottom:16, display:'inline-flex' }}>Features</span>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(32px,4vw,48px)', fontWeight:800, letterSpacing:'-0.03em', lineHeight:1.05, marginBottom:16 }}>
            Built for prediction<br/>market edge
          </h2>
          <p style={{ fontFamily:'var(--font-body)', fontSize:16, color:'var(--text-2)', lineHeight:1.7 }}>
            NORT combines real-time market data, AI analysis, and predictive signals to help you trade faster, smarter, and with confidence.
          </p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:16 }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} className={`feature-card fade-up fade-up-delay-${(i % 3) + 1}`}>

              <div className="icon-wrap" style={{ borderColor:`${f.accent}33` }}>
                <iconify-icon icon={f.icon} width="22" style={{ color: f.accent }}></iconify-icon>
              </div>

              <h3 style={{ fontFamily:'var(--font-display)', fontSize:17, fontWeight:700, letterSpacing:'-0.02em', marginBottom:8, color:'var(--text)' }}>{f.title}</h3>
              <p style={{ fontFamily:'var(--font-body)', fontSize:14, color:'var(--text-2)', lineHeight:1.65 }}>{f.desc}</p>

              <div style={{ position:'absolute', bottom:0, left:0, height:2, width:'40%', background:`linear-gradient(90deg, ${f.accent}, transparent)`, borderRadius:'0 0 0 16px', opacity:0.5 }}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
