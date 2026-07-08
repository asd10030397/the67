export function VisualOverlay({
  reducedEffects = false,
}: {
  reducedEffects?: boolean;
}) {
  return (
    <>
      <div
        className={`film-grain pointer-events-none fixed inset-0 z-[5] ${reducedEffects ? "film-grain--reduced" : ""}`}
        aria-hidden="true"
      />
      <div
        className={`vignette pointer-events-none fixed inset-0 z-[5] ${reducedEffects ? "vignette--reduced" : ""}`}
        aria-hidden="true"
      />
    </>
  );
}
