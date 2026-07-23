import Script from "next/script";

// Privacy-friendly, cookieless page-view analytics (Plausible-compatible).
// Renders nothing unless NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set, so the app
// behaves identically to before for anyone who hasn't configured it.
export default function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;

  const scriptUrl = process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL || "https://plausible.io/js/script.js";

  return <Script defer data-domain={domain} src={scriptUrl} strategy="afterInteractive" />;
}
