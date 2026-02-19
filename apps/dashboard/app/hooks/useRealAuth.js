"use client";
import { usePrivy, useWallets } from "@privy-io/react-auth";

export function useRealAuth() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { wallets } = useWallets();
  return {
    ready: !!ready,
    isAuthed: !!authenticated,
    user: user || null,
    walletAddress: wallets?.[0]?.address || null,
    login,
    logout,
  };
}