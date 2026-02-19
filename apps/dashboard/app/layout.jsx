"use client";
import "./globals.css";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen max-w-md mx-auto">{children}</main>
      </body>
    </html>
  );
}
