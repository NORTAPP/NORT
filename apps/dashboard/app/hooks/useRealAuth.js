"use client";
import { useEffect, useState, useRef } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useTelegram } from "./useTelegram";

export function useRealAuth() {
  const { ready: privyReady, authenticated, user: privyUser, login: privyLogin, logout: privyLogout } = usePrivy();
  const { wallets } = useWallets();
  const { user: tgUser } = useTelegram();
  const [lsWallet, setLsWallet] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const logoutInProgress = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window.localStorage.getItem("walletAddress");
    if (w) setLsWallet(w);
    setInitialized(true);
  }, []);

  // Get wallet address - prefer connected wallet, fallback to localStorage
  const walletAddress = wallets?.[0]?.address || lsWallet || null;
  
  // Build combined user object
  const user = privyUser || (tgUser ? {
    id: tgUser.id?.toString(),
    firstName: tgUser.first_name,
    name: tgUser.first_name,
    displayName: tgUser.first_name,
    email: null,
    telegram: tgUser
  } : null);
  
  // Force not authenticated if logout is in progress
  const isAuthed = !logoutInProgress.current && !!privyReady && initialized && (!!authenticated || !!walletAddress);

  const logout = () => {
    if (logoutInProgress.current) {
      console.log("[Auth] Logout already in progress");
      return;
    }
    
    logoutInProgress.current = true;
    console.log("[Auth] Starting logout, redirecting to login...");
    
    // Clear ALL local storage
    if (typeof window !== "undefined") {
      try {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key && (key.includes('privy') || key.includes('wallet') || key.includes('auth') || key.includes('nort'))) {
            localStorage.removeItem(key);
          }
        }
      } catch (e) {
        console.log("[Auth] localStorage clear error:", e);
      }
    }
    
    // Try Privy logout
    try {
      privyLogout();
    } catch (e) {
      // Ignore errors
    }
    
    // Immediate redirect to home (which shows login)
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return {
    ready: !!privyReady && initialized,
    isAuthed,
    user,
    walletAddress,
    login: privyLogin,
    logout,
  };
}
