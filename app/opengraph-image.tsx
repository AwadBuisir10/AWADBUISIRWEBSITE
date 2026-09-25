import { ImageResponse } from "next/og";

export const alt = "Awad Buisir — Software Engineer · Applied AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#f7f8fa", color: "#111A4A", padding: "64px 72px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 620, height: 620, borderRadius: 620, right: -110, top: -150, border: "1px solid rgba(17,26,74,.12)", background: "radial-gradient(circle at 42% 38%, rgba(136,222,235,.3), rgba(68,180,139,.10) 54%, transparent 70%)" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 600 }}><span>Awad Buisir</span><span style={{ color: "#167E6C", fontSize: 20, fontWeight: 400 }}>awadbuisir.com</span></div>
      <div style={{ display: "flex", maxWidth: 900, fontSize: 72, lineHeight: 1.05, letterSpacing: "-.035em", fontWeight: 600 }}>I build AI that answers phones and watches game film.</div>
      <div style={{ display: "flex", gap: 20, alignItems: "center", fontSize: 16, letterSpacing: ".08em" }}><span style={{ width: 9, height: 9, borderRadius: 9, background: "#EC652B" }} /><span style={{ letterSpacing: 0, fontSize: 22 }}>Computer Science at Northeastern · Voice AI · Computer vision</span></div>
    </div>,
    size
  );
}
