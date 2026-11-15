export function AlphaLogo({ compact = false }: { compact?: boolean }) {
  return <span className={`alpha-brand ${compact ? "alpha-brand-compact" : ""}`} aria-label="Alpha Nation">
    <svg className="alpha-mark" viewBox="0 0 120 92" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="alphaLogoGradientSite" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#0577ff"/><stop offset="1" stopColor="#63d3ff"/></linearGradient></defs>
      <path d="M12 72 41 10h15l29 62H70l-7-17H34l-7 17H12Zm28-30h18l-9-21-9 21Z" fill="url(#alphaLogoGradientSite)"/>
      <path d="M60 10h13l24 39V10h13v62H97L73 33v39H60V10Z" fill="#eef6ff"/>
    </svg>
    <span className="alpha-wordmark">ALPHA <b>NATION</b></span>
  </span>;
}
