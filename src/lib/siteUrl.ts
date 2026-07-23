// The canonical, publicly-reachable URL of this deployment. Falls back to
// localhost in development so metadata/sitemap generation never crashes
// when NEXT_PUBLIC_SITE_URL isn't set (e.g. in CI or a fresh checkout).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
