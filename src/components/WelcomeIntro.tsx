"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AlphaLogo } from "@/components/AlphaLogo";

export default function WelcomeIntro() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (pathname !== "/") { setVisible(false); return; }
    setVisible(true);
    setLeaving(false);
    const fadeTimer = window.setTimeout(() => setLeaving(true), 2400);
    const removeTimer = window.setTimeout(() => setVisible(false), 3100);
    return () => { window.clearTimeout(fadeTimer); window.clearTimeout(removeTimer); };
  }, [pathname]);

  if (!visible || pathname !== "/") return null;
  return <div className={`alpha-intro-overlay${leaving ? " alpha-intro-leaving" : ""}`} role="status" aria-label="Welcome to Alpha Nation">
    <div className="alpha-intro-orbit" aria-hidden="true" />
    <div className="alpha-intro-content">
      <span className="alpha-intro-kicker">A MORE CONSIDERED APPROACH TO PROTECTION</span>
      <AlphaLogo compact />
      <h1>Welcome to <em>Alpha Nation</em></h1>
      <p>Protect what matters. Plan with confidence.</p>
      <span className="alpha-intro-rule" />
    </div>
  </div>;
}
