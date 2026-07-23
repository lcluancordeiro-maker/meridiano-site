"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import DrawingCanvas, { type DrawingCanvasHandle, type Tool } from "@/components/DrawingCanvas";
import { createClient } from "@/lib/supabase/client";
import { saveCollabBoardSnapshot } from "@/app/actions/collabBoard";
import { themeStore } from "@/lib/theme";
import { useTranslation } from "@/i18n/LanguageContext";

type Participant = { user_id: string; display_name: string | null };

/** A deliberately smaller sibling of QuadroBoard: only the ink layer
 * (freehand drawing) is here — no shapes/text/images layer, ruler, grid,
 * zoom/pan or AI-resolve. Collaboration is the point of this board, not
 * the full single-player toolkit; see supabase/schema.sql's comment on
 * collab_board_sessions for why only ink is synced. */
export default function CollabBoard({
  sessionId,
  currentUserId,
  initialCanvasDataUrl,
  initialParticipants,
  shareUrl,
}: {
  sessionId: string;
  currentUserId: string;
  initialCanvasDataUrl: string | null;
  initialParticipants: Participant[];
  shareUrl: string;
}) {
  const { dict } = useTranslation();
  const { quadro, collabBoard: t } = dict;
  const isDark = useSyncExternalStore(themeStore.subscribe, themeStore.getSnapshot, themeStore.getServerSnapshot);

  const COLORS = [
    { id: "default", label: isDark ? quadro.corBranco : quadro.corPreto, value: isDark ? "#f1f0f8" : "#1a1a1a" },
    { id: "azul", label: quadro.corAzul, value: "#2a78d6" },
    { id: "vermelho", label: quadro.corVermelho, value: "#d63b3b" },
    { id: "verde", label: quadro.corVerde, value: "#1baf7a" },
  ];
  const LINE_WIDTHS = [
    { label: quadro.fina, value: 4 },
    { label: quadro.media, value: 9 },
    { label: quadro.grossa, value: 16 },
  ];

  const inkRef = useRef<DrawingCanvasHandle>(null);
  const [colorId, setColorId] = useState("default");
  const color = COLORS.find((c) => c.id === colorId)?.value ?? COLORS[0].value;
  const [lineWidth, setLineWidth] = useState(LINE_WIDTHS[1].value);
  const [tool, setTool] = useState<Tool>("pen");
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  const [linkCopied, setLinkCopied] = useState(false);
  const appliedInitialSnapshot = useRef(false);

  useEffect(() => {
    if (appliedInitialSnapshot.current || !initialCanvasDataUrl) return;
    appliedInitialSnapshot.current = true;
    void inkRef.current?.loadDataUrl(initialCanvasDataUrl);
  }, [initialCanvasDataUrl]);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    const channel = supabase
      .channel(`collab-board:${sessionId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "collab_board_sessions", filter: `id=eq.${sessionId}` },
        (payload) => {
          const row = payload.new as { canvas_data_url: string | null; updated_by: string | null };
          // Skip our own echo — we already have this exact state locally,
          // and re-applying it would needlessly flash/redraw the canvas.
          if (row.updated_by === currentUserId || !row.canvas_data_url) return;
          void inkRef.current?.loadDataUrl(row.canvas_data_url);
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "collab_board_participants", filter: `session_id=eq.${sessionId}` },
        (payload) => {
          const row = payload.new as Participant;
          setParticipants((prev) => (prev.some((p) => p.user_id === row.user_id) ? prev : [...prev, row]));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, currentUserId]);

  function handleStrokeEnd() {
    const dataUrl = inkRef.current?.toDataUrl();
    if (dataUrl) void saveCollabBoardSnapshot(sessionId, dataUrl);
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(shareUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="text-sm text-muted">{t.shareHint}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <code className="rounded-lg bg-background px-3 py-2 text-xs text-foreground">{shareUrl}</code>
          <button
            type="button"
            onClick={handleCopyLink}
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary"
          >
            {linkCopied ? t.linkCopied : t.copyLinkButton}
          </button>
        </div>
        <p className="mt-3 text-xs text-muted">
          {t.participantsHeading}:{" "}
          {participants
            .map((p) => (p.user_id === currentUserId ? t.youLabel : p.display_name ?? "—"))
            .join(", ")}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {COLORS.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-label={c.label}
            aria-pressed={colorId === c.id && tool === "pen"}
            onClick={() => {
              setColorId(c.id);
              setTool("pen");
            }}
            className={`h-8 w-8 rounded-full border-2 ${colorId === c.id && tool === "pen" ? "border-primary" : "border-border"}`}
            style={{ backgroundColor: c.value }}
          />
        ))}
        {LINE_WIDTHS.map((w) => (
          <button
            key={w.value}
            type="button"
            aria-pressed={lineWidth === w.value}
            onClick={() => setLineWidth(w.value)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${lineWidth === w.value ? "border-primary text-primary" : "border-border text-muted"}`}
          >
            {w.label}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={tool === "eraser"}
          onClick={() => setTool("eraser")}
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${tool === "eraser" ? "border-primary text-primary" : "border-border text-muted"}`}
        >
          {quadro.borracha}
        </button>
        <button
          type="button"
          onClick={() => {
            inkRef.current?.clear();
            handleStrokeEnd();
          }}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-error hover:text-error"
        >
          {quadro.limpar}
        </button>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-border" style={{ aspectRatio: "1200 / 800" }}>
        <DrawingCanvas ref={inkRef} color={color} lineWidth={lineWidth} tool={tool} ariaLabel={t.title} onStrokeEnd={handleStrokeEnd} />
      </div>
    </div>
  );
}
