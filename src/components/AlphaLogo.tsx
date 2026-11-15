import Image from "next/image";
export function AlphaLogo({ compact = false }: { compact?: boolean }) {
  return <span className={`alpha-brand ${compact ? "alpha-brand-compact" : ""}`} aria-label="Alpha Nation">
    <Image src="/alpha-nation-logo.png" alt="Alpha Nation" width={305} height={65} priority className="alpha-logo-image" />
  </span>;
}
