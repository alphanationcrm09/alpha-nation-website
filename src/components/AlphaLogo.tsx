export function AlphaLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={"alpha-brand alpha-brand-lockup " + (compact ? "alpha-brand-compact" : "")}>
      <img className="alpha-wolf-mark" src="/alpha-wolf-mark.png" alt="" aria-hidden="true" width="151" height="190" />
      <span className="alpha-brand-name" aria-label="Alpha Nation">
        <span>ALPHA</span>
        <strong>NATION</strong>
      </span>
    </span>
  );
}
