import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div style={{ alignItems: "center", background: "#1d6144", display: "flex", height: "100%", justifyContent: "center", width: "100%" }}>
      <div style={{ alignItems: "center", background: "#f7f7f5", borderRadius: 108, display: "flex", height: 312, justifyContent: "center", width: 312 }}>
        <div style={{ color: "#1d6144", display: "flex", fontFamily: "Arial", fontSize: 220, fontWeight: 800, lineHeight: 1 }}>P</div>
      </div>
    </div>,
    size,
  );
}
