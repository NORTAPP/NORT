import "./globals.css";
import Script from "next/script";
import Providers from "./providers";
import AuthSync from "./components/AuthSync";
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="afterInteractive" />
        <Providers>
          <AuthSync />
          <main className="min-h-screen max-w-md mx-auto">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
