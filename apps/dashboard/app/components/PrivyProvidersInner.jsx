"use client";
import { PrivyProvider } from "@privy-io/react-auth";
export default function PrivyProvidersInner({ children }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";
  return <PrivyProvider appId={appId}>{children}</PrivyProvider>;
}
