import { describe, expect, it } from "vitest";
import { youtubeEmbedUrl, youtubeThumbnailUrl } from "./videoLessons";

describe("youtubeEmbedUrl", () => {
  it("builds a youtube-nocookie autoplay embed url from the id", () => {
    expect(youtubeEmbedUrl("abc123")).toBe("https://www.youtube-nocookie.com/embed/abc123?autoplay=1");
  });
});

describe("youtubeThumbnailUrl", () => {
  it("builds an i.ytimg.com hqdefault thumbnail url from the id", () => {
    expect(youtubeThumbnailUrl("abc123")).toBe("https://i.ytimg.com/vi/abc123/hqdefault.jpg");
  });
});
