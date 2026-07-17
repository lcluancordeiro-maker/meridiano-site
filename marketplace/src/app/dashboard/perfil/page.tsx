import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { fetchCurrentProfile } from "@/lib/queries/dashboard";
import { ProfileForm } from "@/components/profile-form";

export const metadata: Metadata = { title: "Perfil" };

export default async function PerfilPage() {
  const { user, profile } = await fetchCurrentProfile();
  if (!user) redirect("/entrar?next=/dashboard/perfil");
  if (!profile) redirect("/dashboard");

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-navy-deep">Perfil</h1>
      <p className="mt-1 text-sm text-muted">{user.email}</p>
      <div className="mt-8">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
