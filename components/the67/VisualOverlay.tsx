export function VisualOverlay() {
  return (
    <>
      <div className="film-grain pointer-events-none fixed inset-0 z-[5]" aria-hidden="true" />
      <div className="vignette pointer-events-none fixed inset-0 z-[5]" aria-hidden="true" />
    </>
  );
}
