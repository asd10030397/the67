import { AudioManager } from "@/components/audio/AudioManager";
import { ParticipationManager } from "@/components/participation/ParticipationManager";
import { AUDIO_CONFIG } from "@/lib/audio/constants";
import { rootMetadata } from "@/lib/site/metadata";
import "./globals.css";

export const metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preload" href={AUDIO_CONFIG.src} as="fetch" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full bg-black text-white antialiased">
        <ParticipationManager>
          <AudioManager>{children}</AudioManager>
        </ParticipationManager>
      </body>
    </html>
  );
}
