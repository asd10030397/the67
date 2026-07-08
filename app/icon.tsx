import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
          color: "#ffffff",
          fontSize: 14,
          fontWeight: 300,
          letterSpacing: "-0.05em",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        67
      </div>
    ),
    {
      ...size,
    },
  );
}
