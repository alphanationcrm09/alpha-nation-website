"use client";
import { useEffect, useState } from "react";
import { AlphaLogo } from "@/components/AlphaLogo";
export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  useEffect(() => { const id = window.setTimeout(() => setVisible(false), 1450); return () => window.clearTimeout(id); }, []);
  if (!visible) return null;
  return <div className="splash-screen" aria-label="Alpha Nation"><AlphaLogo compact /></div>;
}
