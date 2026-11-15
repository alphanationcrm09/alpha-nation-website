"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AlphaLogo } from "@/components/AlphaLogo";

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
        <AlphaLogo compact />
        <p className="alpha-intro-eyebrow">WELCOME TO ALPHA NATION</p>
        <p className="alpha-intro-quote">Protect what matters today. Build confidence for tomorrow.</p>
      </div>
    </div>
  );
}
