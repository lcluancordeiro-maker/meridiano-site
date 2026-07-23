/** youtube-nocookie.com defers YouTube's tracking cookies until playback
 * actually starts, unlike the plain youtube.com embed domain. */
export function youtubeEmbedUrl(youtubeId: string): string {
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`;
}

export function youtubeThumbnailUrl(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}
