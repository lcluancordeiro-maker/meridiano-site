import { createBrowserClient } from "@supabase/ssr";

// Not parameterized with the generated `Database` type: this project ships
// hand-written row types (see database.types.ts) rather than types generated
// via `supabase gen types typescript`. Run that once your Supabase project
// exists and wire it back in here for full query-level type safety.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
