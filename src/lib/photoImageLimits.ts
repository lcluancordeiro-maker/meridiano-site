/** Shared between the client (PhotoSolver.tsx, for early feedback before
 * uploading) and the server (`/api/resolver-foto`, the authoritative check)
 * so both sides agree on what counts as a valid batch of problem photos —
 * a problem can now span more than one photo (e.g. a statement that
 * continues on a second page). */
export const MAX_IMAGES = 4;
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);

export type ImageValidationError = "missing_image" | "too_many_images" | "unsupported_type" | "image_too_large";

export function validateImageBatch(images: { type: string; size: number }[]): ImageValidationError | null {
  if (images.length === 0) return "missing_image";
  if (images.length > MAX_IMAGES) return "too_many_images";
  for (const image of images) {
    if (!ALLOWED_IMAGE_TYPES.has(image.type)) return "unsupported_type";
    if (image.size > MAX_IMAGE_BYTES) return "image_too_large";
  }
  return null;
}
