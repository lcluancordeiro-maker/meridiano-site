import { ImageResponse } from "next/og";

export const alt = "Meridiano Matemática — matemática do fundamental ao superior";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            color: "white",
            fontSize: 40,
            opacity: 0.85,
          }}
        >
          <span>∑</span>
          <span>π</span>
          <span>√x</span>
          <span>∫</span>
          <span>Δ</span>
        </div>
        <div
          style={{
            marginTop: 36,
            display: "flex",
            fontSize: 84,
            fontWeight: 700,
            color: "white",
            letterSpacing: -2,
          }}
        >
          Meridiano Matemática
        </div>
        <div
          style={{
            marginTop: 20,
            display: "flex",
            fontSize: 32,
            color: "rgba(255,255,255,0.88)",
          }}
        >
          Teoria, exercícios e widgets interativos — do fundamental ao superior
        </div>
      </div>
    ),
    { ...size }
  );
}
