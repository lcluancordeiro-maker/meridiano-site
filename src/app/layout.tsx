import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import CloudSyncInit from "@/components/CloudSyncInit";
import InstallPwaPrompt from "@/components/InstallPwaPrompt";
import TutorChat from "@/components/TutorChat";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { getServerLocale } from "@/i18n/getServerLocale";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meridiano Matemática",
  description:
    "Aprenda matemática do ensino fundamental ao superior, com teoria e exercícios interativos.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Meridiano Matemática",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#5b4fe9",
};

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.setAttribute("data-theme","dark");}}catch(e){}})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getServerLocale();
  const supabase = isSupabaseConfigured ? await createClient() : null;
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return (
    <html lang={locale} className={`${inter.variable} ${sora.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <LanguageProvider initialLocale={locale}>
          {children}
          <InstallPwaPrompt />
          <TutorChat isSupabaseConfigured={isSupabaseConfigured} loggedIn={Boolean(user)} />
        </LanguageProvider>
        <ServiceWorkerRegister />
        <CloudSyncInit />
      </body>
    </html>
  );
}
