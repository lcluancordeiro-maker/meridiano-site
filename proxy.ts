import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxySession";

// Next.js 16 renamed "Middleware" to "Proxy" (file: proxy.ts, export: proxy).
export function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)"],
};
