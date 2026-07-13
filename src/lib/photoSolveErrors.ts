import type { Dictionary } from "@/i18n/dictionaries";

const CODE_TO_KEY: Record<string, keyof Dictionary["errors"]> = {
  unsupported_type: "unsupportedType",
  image_too_large: "imageTooLarge",
  missing_image: "missingImage",
  daily_limit_exceeded: "dailyLimitExceeded",
  unauthorized: "unauthorized",
  anthropic_not_configured: "anthropicNotConfigured",
  ai_error: "aiError",
  empty_response: "aiError",
};

export function errorMessageFor(dict: Dictionary, code: string | undefined): string {
  const key = code ? CODE_TO_KEY[code] : undefined;
  return key ? dict.errors[key] : dict.errors.generic;
}
