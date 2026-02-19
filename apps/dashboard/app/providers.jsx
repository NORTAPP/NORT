"use client";
import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";

export default function Providers({ children }) {
  return (
    <PrivyProvider appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}>
      {children}
    </PrivyProvider>
  );
}
