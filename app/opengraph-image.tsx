import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site/metadata";

export const alt = SITE_NAME;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 280,
            fontWeight: 300,
            color: "#ffffff",
            letterSpacing: "-0.07em",
            lineHeight: 1,
          }}
        >
          67
        </div>
        <div
          style={{
            marginTop: 56,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            fontSize: 30,
            fontWeight: 300,
            color: "rgba(255, 255, 255, 0.65)",
            textAlign: "center",
            lineHeight: 1.55,
            maxWidth: 760,
            letterSpacing: "-0.015em",
          }}
        >
          <div>Nothing has meaning.</div>
          <div>Until we choose to create it together.</div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
