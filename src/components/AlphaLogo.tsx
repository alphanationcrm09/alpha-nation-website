export function AlphaLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={"alpha-brand " + (compact ? "alpha-brand-compact" : "")}>
      <img className="alpha-full-logo" src="/alpha-nation-logo.png" alt="Alpha Nation" width="760" height="190" />
    </span>
  );
}
