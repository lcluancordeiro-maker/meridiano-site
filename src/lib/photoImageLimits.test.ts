import { describe, expect, it } from "vitest";
import { MAX_IMAGES, MAX_IMAGE_BYTES, validateImageBatch } from "@/lib/photoImageLimits";

function image(type = "image/png", size = 1024) {
  return { type, size };
}

describe("validateImageBatch", () => {
  it("rejects an empty batch", () => {
    expect(validateImageBatch([])).toBe("missing_image");
  });

  it("accepts a single valid image", () => {
    expect(validateImageBatch([image()])).toBeNull();
  });

  it("accepts up to MAX_IMAGES valid images", () => {
    const images = Array.from({ length: MAX_IMAGES }, () => image());
    expect(validateImageBatch(images)).toBeNull();
  });

  it("rejects more than MAX_IMAGES images", () => {
    const images = Array.from({ length: MAX_IMAGES + 1 }, () => image());
    expect(validateImageBatch(images)).toBe("too_many_images");
  });

  it("rejects an unsupported type", () => {
    expect(validateImageBatch([image("application/pdf")])).toBe("unsupported_type");
  });

  it("rejects an oversized image", () => {
    expect(validateImageBatch([image("image/png", MAX_IMAGE_BYTES + 1)])).toBe("image_too_large");
  });

  it("checks every image in the batch, not just the first", () => {
    expect(validateImageBatch([image(), image("application/pdf")])).toBe("unsupported_type");
  });
});
