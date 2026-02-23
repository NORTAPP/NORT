// ─────────────────────────────────────────────────────────────────────────────
// hooks/useTelegram.js
//
// OWNER: Intern 4 (Telegram Bot / Mini App)
//
// What this does:
//   - Reads Telegram WebApp context (user, theme, safe areas)
//   - Exposes helpers: haptic feedback, main button, back button, close
//   - Works in browser dev mode with a mock fallback (no crash)
//
// Setup:
//   1. Add <script src="https://telegram.org/js/telegram-web-app.js"> to layout
//   2. In BotFather: set the Mini App URL to your deployed Next.js domain
//   3. Use the bot's /start command with the inline keyboard "Open App" button
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';

// Safe accessor — window.Telegram may not exist in dev
const tg = () => (typeof window !== 'undefined' ? window.Telegram?.WebApp : null);

export function useTelegram() {
  const [user, setUser]   = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const app = tg();
    if (app) {
      app.ready();           // Tell Telegram the app is ready to display
      app.expand();          // Full-screen mode
      setUser(app.initDataUnsafe?.user || null);
    }
    setReady(true);
  }, []);

  // Haptic feedback helpers
  const haptic = {
    light:   () => tg()?.HapticFeedback?.impactOccurred('light'),
    medium:  () => tg()?.HapticFeedback?.impactOccurred('medium'),
    success: () => tg()?.HapticFeedback?.notificationOccurred('success'),
    error:   () => tg()?.HapticFeedback?.notificationOccurred('error'),
  };

  // Show/hide the native Telegram main button
  const mainButton = {
    show:   (text, onClick) => {
      const btn = tg()?.MainButton;
      if (!btn) return;
      btn.setText(text);
      btn.onClick(onClick);
      btn.show();
    },
    hide: () => tg()?.MainButton?.hide(),
  };

  // Back button
  const backButton = {
    show: (onClick) => {
      const btn = tg()?.BackButton;
      if (!btn) return;
      btn.onClick(onClick);
      btn.show();
    },
    hide: () => tg()?.BackButton?.hide(),
  };

  const close    = () => tg()?.close();
  const openLink = (url) => tg()?.openLink(url) || window.open(url, '_blank');

  // Open the dashboard (prefers env URL, falls back to in-app /trade)
  const openDashboard = () => {
    const fallback =
      typeof window !== 'undefined'
        ? `${window.location.origin}/markets`
        : '/markets';
    const url = process.env.NEXT_PUBLIC_DASHBOARD_URL || fallback;
    openLink(url);
  };

  return { user, ready, haptic, mainButton, backButton, close, openDashboard };
}
