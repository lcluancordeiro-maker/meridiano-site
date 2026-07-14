import Navbar from "@/components/Navbar";
import ReviewSession from "@/components/ReviewSession";

export default function RevisaoPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-2xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-foreground">Revisão</h1>
        <p className="mt-2 text-sm text-muted">
          Exercícios que você errou antes voltam aqui depois de um tempo, com
          o intervalo dobrando a cada acerto — repetição espaçada pra fixar o
          que você aprendeu.
        </p>
        <div className="mt-8">
          <ReviewSession />
        </div>
      </div>
    </div>
  );
}
