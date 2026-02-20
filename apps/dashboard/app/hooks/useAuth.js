"use client";
import { useRealAuth } from "./useRealAuth";
import { useMockAuth } from "./useMockAuth";

export function useAuth() {
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true";
  return isMock ? useMockAuth() : useRealAuth();
}
