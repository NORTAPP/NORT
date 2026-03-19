'use client';
import { useState } from 'react';

const PLANS = [
  {
    name:'Free',
    price:{ mo:'$0',   hr:'$0'   },
    suffix:{ mo:'/ mo', hr:''    },
    desc:'Explore signals and get started with paper trading.',
    features:['10 signals / day','Basic AI summaries','Paper trading','Telegram bot'],
    cta:'Get Started',
    featured:false,
  },
  {
    name:'Pro',
    price:{ mo:'$49',  hr:'$0.85' },
    suffix:{ mo:'/ mo', hr:'/ hr' },
    desc:'Full platform access with unlimited signals and priority alerts.',
    features:['Unlimited signals','Full AI analysis','Heat scoring','Priority alerts','Performance analytics','Leaderboard access'],
    cta:'Start Trading',
    featured:true,
  },
  {
    name:'Elite',
    price:{ mo:'$249', hr:'$4.20' },
    suffix:{ mo:'/ mo', hr:'/ hr' },
    desc:'Maximum edge with early signals, API access, and dedicated support.',
    features:['Everything in Pro','Early signal access','Private leaderboard','API access','Dedicated support','Custom alerts'],
    cta:'Go Elite',
    featured:false,
  },
];

export default function Pricing() {
  const [monthly, setMonthly] = useState(true);

  return (
    <section id="pricing" style={{ padding:'120px 0', background:'var(--bg)', borderTop:'1px solid var(--border)' }}>
      <div style={{ maxWidth:1152, margin:'0 auto', padding:'0 24px' }}>

        <div className="fade-up" style={{ textAlign:'center', marginBottom:56 }}>
          <span className="pill" style={{ marginBottom:16, display:'inline-flex' }}>Pricing</span>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(32px,4vw,48px)', fontWeight:800, letterSpacing:'-0.03em', lineHeight:1.05, marginBottom:16 }}>
            Simple, honest pricing
          </h2>
          <p style={{ fontFamily:'var(--font-body)', fontSize:15, color:'var(--text-2)', marginBottom:32 }}>Start free. Upgrade when you need more edge.</p>

          <div style={{ display:'inline-flex', alignItems:'center', gap:4, background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:10, padding:'4px' }}>
            {['Monthly','Hourly'].map((label) => {
              const active = (label === 'Monthly') === monthly;
              return (
                <button key={label} onClick={() => setMonthly(label === 'Monthly')}
                  style={{ padding:'7px 20px', borderRadius:8, fontSize:13, fontFamily:'var(--font-display)', fontWeight:600, cursor:'pointer', border:'none', transition:'all 0.2s',
                    background: active ? 'var(--accent)' : 'transparent',
                    color:      active ? '#000'       : 'var(--text-3)' }}>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:16, alignItems:'start' }}>
          {PLANS.map((plan, i) => (
            <div key={plan.name} className={`pricing-card fade-up fade-up-delay-${i + 1}${plan.featured ? ' featured' : ''}`}>

              {plan.featured && (
                <div style={{ position:'absolute', top:20, right:20 }}>
                  <span className="pill pill-accent" style={{ fontSize:10 }}>Most Popular</span>
                </div>
              )}

              <div style={{ marginBottom:28 }}>
                <h3 style={{ fontFamily:'var(--font-display)', fontSize:15, fontWeight:700, color:'var(--text-2)', letterSpacing:'0.04em', textTransform:'uppercase', marginBottom:20 }}>{plan.name}</h3>

                <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:8 }}>
                  <span style={{ fontFamily:'var(--font-display)', fontSize:48, fontWeight:800, color:'var(--text)', letterSpacing:'-0.04em', lineHeight:1 }}>
                    {monthly ? plan.price.mo : plan.price.hr}
                  </span>
                  <span style={{ fontFamily:'var(--font-display)', fontSize:13, color:'var(--text-3)' }}>
                    {monthly ? plan.suffix.mo : plan.suffix.hr}
                  </span>
                </div>

                <p style={{ fontFamily:'var(--font-body)', fontSize:13, color:'var(--text-2)', lineHeight:1.6 }}>{plan.desc}</p>
              </div>

              <ul style={{ flex:1, listStyle:'none', marginBottom:28, display:'flex', flexDirection:'column', gap:10 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display:'flex', alignItems:'center', gap:10, fontSize:13, color:'var(--text-2)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4L19 7"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <a href="https://nort-rho.vercel.app" className={`btn ${plan.featured ? 'btn-primary' : 'btn-ghost'}`}
                style={{ width:'100%', justifyContent:'center', borderRadius:10 }}>
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
