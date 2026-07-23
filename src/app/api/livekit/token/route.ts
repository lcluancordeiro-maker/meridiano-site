import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSocialAccessStatus } from "@/lib/entitlements";
import { isLiveKitConfigured, LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_URL } from "@/lib/livekit/config";

export async function POST(request: Request) {
  if (!isSupabaseConfigured || !isLiveKitConfigured) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!supabase || !user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if ((await getSocialAccessStatus()) !== "granted") {
    return NextResponse.json({ error: "not_granted" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const roomName = typeof body?.roomName === "string" ? body.roomName : "";
  if (!roomName) {
    return NextResponse.json({ error: "missing_room_name" }, { status: 400 });
  }

  const { data: live } = await supabase
    .from("live_sessions")
    .select("room_name, host_id, ended_at")
    .eq("room_name", roomName)
    .maybeSingle();

  if (!live) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (live.ended_at) {
    return NextResponse.json({ error: "live_ended" }, { status: 410 });
  }

  const canPublish = live.host_id === user.id;

  const accessToken = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: user.id,
    name: user.email ?? user.id,
  });
  accessToken.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish,
    canSubscribe: true,
  });

  return NextResponse.json({ token: await accessToken.toJwt(), url: LIVEKIT_URL });
}
