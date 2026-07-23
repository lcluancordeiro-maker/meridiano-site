import { ImageResponse } from "next/og";
import { NextResponse } from "next/server";
import { DIFFICULTY_ORDER, getLevel, getTopicsForLevel } from "@/data/curriculum";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ levelId: string }> }
) {
  const { levelId } = await params;
  const level = getLevel(levelId);
  if (!level) return new NextResponse("Trilha não encontrada", { status: 404 });

  const supabase = await createClient();
  if (!supabase) return new NextResponse("Supabase não configurado", { status: 503 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new NextResponse("Faça login para gerar o certificado", { status: 401 });

  const topics = getTopicsForLevel(levelId);
  if (topics.length === 0) return new NextResponse("Trilha sem tópicos", { status: 404 });

  const { data: rows } = await supabase
    .from("topic_progress")
    .select("topic_id, difficulty, completed")
    .eq("user_id", user.id)
    .eq("level_id", levelId);

  const completedTiers = new Set(
    (rows ?? []).filter((row) => row.completed).map((row) => `${row.topic_id}/${row.difficulty}`)
  );
  const isComplete = topics.every((topic) =>
    DIFFICULTY_ORDER.every((difficulty) => completedTiers.has(`${topic.id}/${difficulty}`))
  );
  if (!isComplete) {
    return new NextResponse("Trilha ainda não concluída", { status: 403 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();
  const studentName = profile?.display_name || "Estudante";
  const date = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #5b4fe9 0%, #4a3aa7 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 32, color: "rgba(255,255,255,0.85)" }}>
          Certificado de Conclusão
        </div>
        <div
          style={{
            marginTop: 28,
            display: "flex",
            fontSize: 68,
            fontWeight: 700,
            color: "white",
            letterSpacing: -1,
          }}
        >
          {studentName}
        </div>
        <div
          style={{
            marginTop: 24,
            display: "flex",
            fontSize: 34,
            color: "rgba(255,255,255,0.92)",
          }}
        >
          completou a trilha
        </div>
        <div
          style={{
            marginTop: 12,
            display: "flex",
            fontSize: 48,
            fontWeight: 700,
            color: "white",
          }}
        >
          {level.name}
        </div>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            fontSize: 24,
            color: "rgba(255,255,255,0.75)",
          }}
        >
          {date} · Meridiano Matemática
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
