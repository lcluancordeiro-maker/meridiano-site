"use client";

import { useState } from "react";
import type { VideoLesson } from "@/data/curriculum";
import { youtubeEmbedUrl, youtubeThumbnailUrl } from "@/lib/videoLessons";

/** Renders a thumbnail + play button until clicked, only then mounting the
 * real YouTube iframe — avoids loading YouTube's embed JS for visitors who
 * never watch (same "don't pay for it until it's used" discipline as the
 * rest of the app's heavier widgets). youtube-nocookie.com skips setting
 * tracking cookies until playback actually starts. */
function VideoCard({ video }: { video: VideoLesson }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="aspect-video overflow-hidden rounded-xl border border-border">
        <iframe
          src={youtubeEmbedUrl(video.youtubeId)}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative block aspect-video w-full overflow-hidden rounded-xl border border-border bg-surface text-left"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- a remote YouTube thumbnail, not a build-time optimizable local asset */}
      <img
        src={youtubeThumbnailUrl(video.youtubeId)}
        alt=""
        className="h-full w-full object-cover"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-2xl text-foreground shadow">
          ▶
        </span>
      </span>
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <span className="block text-sm font-semibold text-white">{video.title}</span>
        <span className="block text-xs text-white/80">{video.channel}</span>
      </span>
    </button>
  );
}

export default function VideoLessons({ videos }: { videos: VideoLesson[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {videos.map((video) => (
        <VideoCard key={video.youtubeId} video={video} />
      ))}
    </div>
  );
}
