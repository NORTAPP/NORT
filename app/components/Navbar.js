'use client';

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 nav-blur">
      <div style={{ maxWidth:1152, margin:'0 auto', padding:'0 24px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>

        <a href="#" className="nav-logo">
          
          NORT
        </a>

        <nav style={{ display:'flex', alignItems:'center', gap:32 }} className="hidden-mobile">
          <a href="#features"    className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How it works</a>
          <a href="#nort-bot"    className="nav-link">Nort Bot</a>
          <a href="#pricing"     className="nav-link">Pricing</a>
        </nav>

        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <a href="https://nort-rho.vercel.app" className="btn btn-ghost" style={{ padding:'8px 18px', fontSize:13 }}>Log in</a>
          <a href="https://nort-rho.vercel.app" className="btn btn-primary" style={{ padding:'8px 18px', fontSize:13 }}>Start Trading</a>
        </div>

      </div>
    </header>
  );
}
