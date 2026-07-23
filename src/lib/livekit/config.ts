export const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
export const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;
export const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL;

/** True once real LiveKit Cloud credentials are configured. When false,
 * hosting/joining a live session is unavailable — the rest of the app keeps
 * working normally. */
export const isLiveKitConfigured = Boolean(LIVEKIT_API_KEY && LIVEKIT_API_SECRET && LIVEKIT_URL);
