const ERROR_MESSAGES: Record<string, string> = {
  unsupported_type: "Formato de imagem não suportado. Use JPEG, PNG, GIF ou WEBP.",
  image_too_large: "A imagem é muito grande (máximo 8MB).",
  missing_image: "Selecione ou desenhe algo antes de enviar.",
  daily_limit_exceeded: "Você atingiu o limite diário de fotos resolvidas. Tente novamente amanhã.",
  unauthorized: "Sua sessão expirou. Entre novamente para continuar.",
  anthropic_not_configured: "Essa funcionalidade ainda não está disponível.",
  ai_error: "Não foi possível analisar a imagem agora. Tente novamente em instantes.",
  empty_response: "Não foi possível analisar a imagem agora. Tente novamente em instantes.",
};

export function errorMessageFor(code: string | undefined): string {
  return (code && ERROR_MESSAGES[code]) || "Algo deu errado ao processar a imagem. Tente novamente.";
}
