import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ContaExcluidaPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-xl px-6 py-16 text-center">
        <h1 className="font-display text-3xl font-semibold text-foreground">Conta excluída</h1>
        <p className="mt-3 text-muted">
          Sua conta e todos os dados associados foram apagados permanentemente. Sentiremos sua falta!
        </p>
        <Link href="/" className="mt-6 inline-block font-semibold text-primary hover:underline">
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}
