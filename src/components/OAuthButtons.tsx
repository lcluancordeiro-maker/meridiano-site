import { signInWithGoogle, signInWithMicrosoft, signInWithGitHub, signInWithApple } from "@/app/actions/auth";
import type { Dictionary } from "@/i18n/dictionaries";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.7a5.4 5.4 0 0 1 0-3.4V4.97H.98a9 9 0 0 0 0 8.06l2.97-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .98 4.97L3.95 7.3C4.66 5.17 6.65 3.58 9 3.58Z"
      />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true">
      <rect x="0" y="0" width="8.5" height="8.5" fill="#F25022" />
      <rect x="9.5" y="0" width="8.5" height="8.5" fill="#7FBA00" />
      <rect x="0" y="9.5" width="8.5" height="8.5" fill="#00A4EF" />
      <rect x="9.5" y="9.5" width="8.5" height="8.5" fill="#FFB900" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true" fill="currentColor">
      <path d="M9 0a9 9 0 0 0-2.85 17.54c.45.08.61-.2.61-.43v-1.68c-2.5.55-3.03-1.07-3.03-1.07-.41-1.04-1-1.32-1-1.32-.82-.56.06-.55.06-.55.9.06 1.38.93 1.38.93.8 1.38 2.11.98 2.62.75.08-.58.32-.98.57-1.21-2-.23-4.1-1-4.1-4.45 0-.98.35-1.79.92-2.42-.09-.23-.4-1.15.09-2.4 0 0 .75-.24 2.46.92a8.5 8.5 0 0 1 4.48 0c1.71-1.16 2.46-.92 2.46-.92.49 1.25.18 2.17.09 2.4.57.63.92 1.44.92 2.42 0 3.46-2.1 4.22-4.11 4.44.33.28.62.84.62 1.7v2.51c0 .24.16.52.62.43A9 9 0 0 0 9 0Z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true" fill="currentColor">
      <path d="M13.1 9.5c0-1.98 1.62-2.93 1.7-2.98a3.86 3.86 0 0 0-3.03-1.64c-1.28-.13-2.5.75-3.15.75-.65 0-1.65-.73-2.72-.71a4.04 4.04 0 0 0-3.4 2.08c-1.47 2.55-.37 6.31 1.04 8.38.69 1 1.5 2.13 2.58 2.09 1.03-.04 1.42-.67 2.67-.67 1.24 0 1.6.67 2.7.65 1.11-.02 1.82-1.02 2.5-2.03a8.8 8.8 0 0 0 1.13-2.32 3.6 3.6 0 0 1-2.02-3.6ZM11.05 3.5A3.63 3.63 0 0 0 11.9.4a3.7 3.7 0 0 0-2.42 1.25 3.46 3.46 0 0 0-.86 2.55 3.05 3.05 0 0 0 2.43-.7Z" />
    </svg>
  );
}

export default function OAuthButtons({
  dict,
  intent = "login",
}: {
  dict: Dictionary["auth"];
  intent?: "login" | "signup";
}) {
  return (
    <div className="flex flex-col gap-3">
      <form action={signInWithGoogle.bind(null, intent)}>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary"
        >
          <GoogleIcon />
          {dict.continuarComGoogle}
        </button>
      </form>
      <form action={signInWithMicrosoft.bind(null, intent)}>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary"
        >
          <MicrosoftIcon />
          {dict.continuarComMicrosoft}
        </button>
      </form>
      <form action={signInWithGitHub.bind(null, intent)}>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary"
        >
          <GitHubIcon />
          {dict.continuarComGitHub}
        </button>
      </form>
      <form action={signInWithApple.bind(null, intent)}>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary"
        >
          <AppleIcon />
          {dict.continuarComApple}
        </button>
      </form>
      <div className="flex items-center gap-3 py-1 text-xs text-muted">
        <span className="h-px flex-1 bg-border" />
        {dict.ouContinueComEmail}
        <span className="h-px flex-1 bg-border" />
      </div>
    </div>
  );
}
