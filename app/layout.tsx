import type { Metadata } from "next";
import { AudioManager } from "@/components/audio/AudioManager";
import "./globals.css";

export const metadata: Metadata = {
  title: "THE67",
  description:
    "An interactive philosophical experience about how meaning emerges from collective belief.",
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-hidden bg-black text-white antialiased">
        <AudioManager>{children}</AudioManager>
      </body>
    </html>
  );
}
