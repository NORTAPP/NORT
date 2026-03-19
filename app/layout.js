/**
 * layout.js
 * ─────────────────────────────────────────────
 * The root layout wraps every page on the site.
 * Anything placed here appears on ALL pages.
 *
 * What's here:
 *  - Page metadata (title + description shown in browser tab / SEO)
 *  - globals.css import (loads all our styles)
 *  - Iconify script (lets us use <iconify-icon> anywhere in the app)
 *  - The <body> tag that wraps all page content
 *
 * To change the browser tab title: edit metadata.title
 * To change the SEO description: edit metadata.description
 * ─────────────────────────────────────────────
 */
import './globals.css'

export const metadata = {
  title: 'NORT — AI-Powered Prediction Market Signals',
  description: 'Trade Polymarket smarter with AI signals, heat scoring, and real-time analysis.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Fonts: Syne (display/logo), Goldman (subheadings/badges), Plus Jakarta Sans (body), Space Grotesk (chat/mono UI) */}
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Goldman:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js" async></script>
      </head>
      {/* children = whatever page is currently being rendered (page.js) */}
      <body>{children}</body>
    </html>
  )
}
