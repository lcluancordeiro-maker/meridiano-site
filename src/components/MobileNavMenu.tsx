"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileNavMenu({
  navItems,
  openLabel,
  closeLabel,
  children,
}: {
  navItems: { href: string; label: string }[];
  openLabel: string;
  closeLabel: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={open ? closeLabel : openLabel}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-foreground md:hidden"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      <div
        className={`${open ? "flex" : "hidden"} w-full basis-full flex-col gap-4 text-sm font-medium text-muted md:flex md:w-auto md:basis-auto md:flex-row md:items-center md:gap-6`}
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className="hover:text-foreground transition-colors"
          >
            {item.label}
          </Link>
        ))}
        <div className="flex flex-wrap items-center gap-4 md:gap-6">{children}</div>
      </div>
    </>
  );
}
