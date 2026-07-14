"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSocialAccessStatus, isPremiumUser } from "@/lib/entitlements";
import { isLiveKitConfigured } from "@/lib/livekit/config";

export type LiveFormState = { error?: string } | undefined;

const NOT_GRANTED_ERROR: LiveFormState = { error: "Verifique sua identidade antes de usar as lives." };
const NOT_PREMIUM_ERROR: LiveFormState = { error: "Hospedar uma live é um recurso Premium. Assine para continuar." };

export async function createLive(_prevState: LiveFormState, formData: FormData): Promise<LiveFormState> {
  if (!isSupabaseConfigured || !isLiveKitConfigured) {
    return { error: "As lives ainda não estão disponíveis neste app." };
  }
  const supabase = await createClient();
  if (!supabase) return { error: "As lives ainda não estão disponíveis neste app." };

  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return { error: "Faça login para iniciar uma live." };
  if ((await getSocialAccessStatus()) !== "granted") return NOT_GRANTED_ERROR;
  if (!(await isPremiumUser())) return NOT_PREMIUM_ERROR;

  const title = String(formData.get("title") ?? "").trim();
  const communityId = String(formData.get("communityId") ?? "").trim() || null;
  if (!title) return { error: "Dê um título para a live." };

  const roomName = `live-${randomUUID()}`;

  const { error } = await supabase.from("live_sessions").insert({
    room_name: roomName,
    host_id: user.id,
    community_id: communityId,
    title,
  });

  if (error) {
    return { error: "Não foi possível iniciar a live. Tente novamente." };
  }

  redirect(`/lives/${roomName}`);
}

export async function endLive(roomName: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = await createClient();
  if (!supabase) return;

  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return;

  await supabase
    .from("live_sessions")
    .update({ ended_at: new Date().toISOString() })
    .eq("room_name", roomName)
    .eq("host_id", user.id);

  redirect("/lives");
}
