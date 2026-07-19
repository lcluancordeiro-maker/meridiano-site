"use client";

import dynamic from "next/dynamic";

const FunctionGrapher = dynamic(() => import("./FunctionGrapher"), {
  ssr: false,
  loading: () => (
    <div className="h-64 animate-pulse rounded-2xl border border-border bg-surface" aria-hidden />
  ),
});

// Only ~10 of ~230 topics render a graph — a plain static import in
// TopicPage would ship FunctionGrapher's JS (parser + plotting) to every
// topic page regardless, same issue InteractiveWidgetRenderer had. This
// wrapper is the "use client" boundary next/dynamic needs to actually
// code-split instead of resolving eagerly during the page's SSR.
export default function LazyFunctionGrapher({
  initialExpressions,
}: {
  initialExpressions?: string[];
}) {
  return <FunctionGrapher initialExpressions={initialExpressions} />;
}
