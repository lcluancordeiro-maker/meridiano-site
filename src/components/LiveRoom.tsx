"use client";

import { useEffect, useRef, useState } from "react";
import { LocalTrackPublication, RemoteTrack, Room, RoomEvent, Track } from "livekit-client";
import { endLive } from "@/app/actions/lives";
import { useTranslation } from "@/i18n/LanguageContext";

type Status = "connecting" | "connected" | "error" | "ended";

export default function LiveRoom({ roomName, isHost }: { roomName: string; isHost: boolean }) {
  const { dict } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef<Room | null>(null);
  const [status, setStatus] = useState<Status>("connecting");
  const [micOn, setMicOn] = useState(false);
  const [camOn, setCamOn] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const room = new Room();
    roomRef.current = room;

    function attach(track: Track) {
      const el = track.attach();
      el.className = "w-full rounded-lg bg-black";
      el.setAttribute("data-track-sid", track.sid ?? "");
      containerRef.current?.appendChild(el);
    }

    function detach(track: Track) {
      for (const el of track.detach()) el.remove();
    }

    room
      .on(RoomEvent.TrackSubscribed, (track: RemoteTrack) => {
        attach(track);
      })
      .on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack) => {
        detach(track);
      })
      .on(RoomEvent.LocalTrackPublished, (pub: LocalTrackPublication) => {
        if (pub.track) attach(pub.track);
      })
      .on(RoomEvent.Disconnected, () => {
        if (!cancelled) setStatus("ended");
      });

    (async () => {
      try {
        const response = await fetch("/api/livekit/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomName }),
        });
        if (!response.ok) throw new Error("token_error");
        const { token, url } = await response.json();
        await room.connect(url, token);
        if (cancelled) {
          await room.disconnect();
          return;
        }
        setStatus("connected");
        if (isHost) {
          await room.localParticipant.setCameraEnabled(true);
          await room.localParticipant.setMicrophoneEnabled(true);
          setCamOn(true);
          setMicOn(true);
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      room.disconnect();
    };
  }, [roomName, isHost]);

  return (
    <div className="flex flex-1 flex-col gap-4">
      {status === "connecting" && <p className="text-sm text-muted">{dict.lives.connecting}</p>}
      {status === "error" && <p className="rounded-xl bg-error-bg p-3 text-sm text-error">{dict.lives.connectionError}</p>}
      {status === "ended" && (
        <p className="rounded-xl border border-border bg-surface p-4 text-sm text-muted">{dict.lives.liveEnded}</p>
      )}

      <div ref={containerRef} className="grid gap-3 sm:grid-cols-2" />

      {status === "connected" && isHost && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={async () => {
              const next = !micOn;
              await roomRef.current?.localParticipant.setMicrophoneEnabled(next);
              setMicOn(next);
            }}
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary"
          >
            {micOn ? dict.lives.micOnLabel : dict.lives.micOffLabel}
          </button>
          <button
            type="button"
            onClick={async () => {
              const next = !camOn;
              await roomRef.current?.localParticipant.setCameraEnabled(next);
              setCamOn(next);
            }}
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary"
          >
            {camOn ? dict.lives.cameraOnLabel : dict.lives.cameraOffLabel}
          </button>
          <form action={endLive.bind(null, roomName)}>
            <button
              type="submit"
              className="rounded-lg bg-error px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
            >
              {dict.lives.endButton}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
