"use client";

import Link from "next/link";
import { useState } from "react";
import { setListingStatusAction } from "@/app/actions/listings";
import type { ListingStatus } from "@/lib/database.types";
import { LISTING_STATUS_LABEL } from "@/lib/constants";

const OPTIONS: ListingStatus[] = ["disponivel", "em_negociacao", "vendido", "removido"];

export function ListingStatusMenu({
  listingId,
  status,
}: {
  listingId: string;
  status: ListingStatus;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-flex items-center gap-3">
      <Link
        href={`/dashboard/anuncios/${listingId}/editar`}
        className="text-sm font-medium text-navy-deep hover:underline"
      >
        Editar
      </Link>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-navy-deep hover:border-navy-light"
      >
        Status ▾
      </button>
      {open && (
        <div className="absolute right-0 top-full z-10 mt-1 w-44 rounded-md border border-border bg-white py-1 shadow-lg">
          {OPTIONS.filter((o) => o !== status).map((o) => (
            <form key={o} action={setListingStatusAction.bind(null, listingId, o)}>
              <button
                type="submit"
                onClick={() => setOpen(false)}
                className="block w-full px-3 py-2 text-left text-sm text-navy-deep hover:bg-navy-deep/5"
              >
                {LISTING_STATUS_LABEL[o]}
              </button>
            </form>
          ))}
        </div>
      )}
    </div>
  );
}
