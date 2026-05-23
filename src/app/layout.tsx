import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "Down to Earth Fleet Management",
  title: {
    default: "Fleet Management | Down to Earth",
    template: "%s | Down to Earth Fleet Management",
  },
  description: "Realtime fleet management dashboard for Down to Earth.",
  icons: {
    icon: "/app-icon.svg",
    shortcut: "/app-icon.svg",
    apple: "/app-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full overflow-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
