import Navbar from "@/components/Navbar";
import LojaContent from "@/components/LojaContent";

export const metadata = {
  title: "Loja",
  description: "Troque gemas por congelamentos de sequência, temas de cor e um impulso de XP.",
};

export default function LojaPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <LojaContent />
    </div>
  );
}
