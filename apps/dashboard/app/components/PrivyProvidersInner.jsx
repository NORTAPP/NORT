"use client";
import { PrivyProvider } from "@privy-io/react-auth";

export default function PrivyProvidersInner({ children }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";

  return (
    <PrivyProvider
      appId={appId}
      config={{
        // Allow Google login + wallet connect
        loginMethods: ["google", "wallet", "email"],
        // Auto-create an embedded wallet for every user (Google, email, etc.)
        // This is what gives every user a wallet address even without MetaMask
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
        appearance: {
          theme: "dark",
          accentColor: "#7c3aed",
          logo: "",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
