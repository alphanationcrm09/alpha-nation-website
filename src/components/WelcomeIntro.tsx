"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function WelcomeIntro() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (pathname !== "/") {
      setVisible(false);
      return;
    }
    setVisible(true);
    setLeaving(false);
    const fadeTimer = window.setTimeout(() => setLeaving(true), 3500);
    const removeTimer = window.setTimeout(() => setVisible(false), 4250);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
    };
  }, [pathname]);

  if (!visible || pathname !== "/") return null;

  return (
    <div className={`alpha-intro-overlay${leaving ? " alpha-intro-leaving" : ""}`} role="status" aria-label="Welcome to Alpha Nation">
      <div className="alpha-intro-glow" />
      <div className="alpha-intro-content">
        <div className="alpha-intro-mark" aria-hidden="true">
          <svg viewBox="0 0 120 92" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="alphaIntroGradient" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#0577ff"/><stop offset="1" stopColor="#63d3ff"/></linearGradient></defs>
            <path d="M12 72 41 10h15l29 62H70l-7-17H34l-7 17H12Zm28-30h18l-9-21-9 21Z" fill="url(#alphaIntroGradient)"/>
            <path d="M60 10h13l24 39V10h13v62H97L73 33v39H60V10Z" fill="#eef6ff"/>
          </svg>
        </div>
        <p className="alpha-intro-eyebrow">WELCOME TO</p>
        <h1>ALPHA <span>NATION</span></h1>
        <p className="alpha-intro-quote">Protect what matters today. Build confidence for tomorrow.</p>
      </div>
    </div>
  );
}
