import Navbar from "@/components/Navbar";
import FunctionGrapher from "@/components/FunctionGrapher";

export default function CalculadoraPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-2xl px-6 py-12">
        <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
          Calculadora gráfica
        </h1>
        <p className="mt-2 text-muted">
          Plote funções como <code className="rounded bg-border px-1.5 py-0.5 text-sm">x^2 - 3x + 2</code>,{" "}
          <code className="rounded bg-border px-1.5 py-0.5 text-sm">sin(x)</code> ou{" "}
          <code className="rounded bg-border px-1.5 py-0.5 text-sm">sqrt(x)</code>. Arraste o
          gráfico para navegar e use os botões para dar zoom.
        </p>
        <div className="mt-8">
          <FunctionGrapher initialExpressions={["x^2"]} />
        </div>
      </div>
    </div>
  );
}
