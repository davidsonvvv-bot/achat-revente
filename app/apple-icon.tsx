import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ alignItems: "center", background: "#1d6144", display: "flex", height: "100%", justifyContent: "center", width: "100%" }}>
      <div style={{ alignItems: "center", background: "#f7f7f5", borderRadius: 38, display: "flex", height: 110, justifyContent: "center", width: 110 }}>
        <div style={{ color: "#1d6144", display: "flex", fontFamily: "Arial", fontSize: 78, fontWeight: 800, lineHeight: 1 }}>P</div>
      </div>
    </div>,
    size,
  );
}
