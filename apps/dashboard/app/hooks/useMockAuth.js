"use client";
import { useState, useCallback } from "react";

const MOCK_USER = {
  id: "mock_user_01",
  telegram: { username: "nortuser", firstName: "NJ" },
  wallet: { address: "0xMock...1234" },
};

export function useMockAuth() {
  const [isAuthed, setIsAuthed] = useState(false);
  const login = useCallback(() => setIsAuthed(true), []);
  const logout = useCallback(() => setIsAuthed(false), []);
  return {
    ready: true,
    isAuthed,
    user: isAuthed ? MOCK_USER : null,
    walletAddress: isAuthed ? MOCK_USER.wallet.address : null,
    login,
    logout,
  };
}