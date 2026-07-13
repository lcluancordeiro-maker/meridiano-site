import Navbar from "@/components/Navbar";
import ProgressoContent from "@/components/ProgressoContent";
import NotificationOptIn from "@/components/NotificationOptIn";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function ProgressoPage() {
  const supabase = isSupabaseConfigured ? await createClient() : null;
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-4xl px-6 pt-8">
        <NotificationOptIn loggedIn={Boolean(isSupabaseConfigured && user)} />
      </div>
      <ProgressoContent />
    </div>
  );
}
