"use client";

import { useState } from "react";
import Link from "next/link";

type NavItem = { href: string; label: string };

/** Renders the primary/secondary nav split two different ways depending on
 * viewport: on mobile, the hamburger reveals one flat list (everything —
 * simplest to scan on a small screen with no room for a second-level menu).
 * On desktop, primary items stay inline and secondary items collapse behind
 * a "Mais" dropdown, keeping the always-visible bar short. */
export default function MobileNavMenu({
  primaryNavItems,
  secondaryNavItems,
  moreLabel,
  openLabel,
  closeLabel,
  children,
}: {
  primaryNavItems: NavItem[];
  secondaryNavItems: NavItem[];
  moreLabel: string;
  openLabel: string;
  closeLabel: string;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={mobileOpen ? closeLabel : openLabel}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((v) => !v)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-foreground md:hidden"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {mobileOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {/* Mobile: one flat collapsible list (primary + secondary), links only. */}
      <div
        className={`${mobileOpen ? "flex" : "hidden"} w-full basis-full flex-col gap-4 text-sm font-medium text-muted md:hidden`}
      >
        {[...primaryNavItems, ...secondaryNavItems].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className="hover:text-foreground transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Desktop: primary items inline + secondary items behind "Mais". */}
      <div className="hidden items-center gap-6 text-sm font-medium text-muted md:flex">
        {primaryNavItems.map((item) => (
          <Link key={item.href} href={item.href} className="hover:text-foreground transition-colors">
            {item.label}
          </Link>
        ))}

        <div className="relative">
          <button
            type="button"
            aria-expanded={moreOpen}
            onClick={() => setMoreOpen((v) => !v)}
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            {moreLabel}
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className={`transition-transform ${moreOpen ? "rotate-180" : ""}`}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {moreOpen && (
            <div className="absolute right-0 top-full mt-2 flex w-56 flex-col gap-1 rounded-xl border border-border bg-surface p-2 shadow-lg">
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  className="rounded-lg px-3 py-2 text-foreground transition-colors hover:bg-background"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Shared actions tray (XP badge, language, theme, login) — rendered
          exactly once: toggles with the hamburger on mobile, always visible
          on desktop. Kept separate from the two link containers above so
          `children` never ends up duplicated in the DOM. */}
      <div
        className={`${mobileOpen ? "flex" : "hidden"} w-full basis-full flex-wrap items-center gap-4 md:flex md:w-auto md:basis-auto md:gap-6`}
      >
        {children}
      </div>
    </>
  );
}
