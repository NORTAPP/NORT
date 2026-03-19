'use client';

export default function Footer() {
  return (
    <footer style={{ background:'var(--bg-1)', borderTop:'1px solid var(--border)' }}>

      <div style={{ padding:'80px 24px', textAlign:'center', position:'relative', overflow:'hidden' }}>

        <div className="orb" style={{ width:500, height:300, background:'radial-gradient(circle, rgba(0,200,150,0.08) 0%, transparent 70%)', top:'50%', left:'50%', transform:'translate(-50%,-50%)' }}></div>

        <div style={{ position:'relative', zIndex:2 }}>

          

          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(28px,5vw,56px)', fontWeight:800, letterSpacing:'-0.04em', color:'var(--text)', marginBottom:16 }}>
            Trade smarter,<br/>starting now
          </h2>

          <p style={{ fontFamily:'var(--font-body)', fontSize:16, color:'var(--text-2)', maxWidth:440, margin:'0 auto 36px' }}>
            Join thousands of traders using AI signals to gain edge on Polymarket.
          </p>

          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <a href="https://nort-rho.vercel.app" className="btn btn-primary">
              Get Started Free
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14m0 0l-7-7m7 7l-7 7"/>
              </svg>
            </a>
            <a href="https://nort-rho.vercel.app" className="btn btn-ghost">View Live Signals</a>
          </div>

          
        </div>
      </div>

      <div style={{ borderTop:'1px solid var(--border)', padding:'20px 24px' }}>
        <div style={{ maxWidth:1152, margin:'0 auto', display:'flex', flexWrap:'wrap', gap:16, alignItems:'center', justifyContent:'space-between' }}>

          <span className="nav-logo" style={{ fontSize:15 }}>nort</span>

          <p style={{ fontSize:12, color:'var(--text-3)' }}>© 2026 NORT. All rights reserved.</p>

          <div style={{ display:'flex', gap:20 }}>
            {['Twitter','GitHub','Discord','Status'].map(l => (
              <a key={l} href="#" className="nav-link" style={{ fontSize:12 }}>{l}</a>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}
