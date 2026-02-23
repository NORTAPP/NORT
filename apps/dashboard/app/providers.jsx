"use client";
import dynamic from "next/dynamic";
const PrivyProvidersInner = dynamic(
  () => import("./components/PrivyProvidersInner"),
  { ssr: false }
);
export default function Providers({ children }) {
  return <PrivyProvidersInner>{children}</PrivyProvidersInner>;
}
