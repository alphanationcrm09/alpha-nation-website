"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileQuoteBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".quote-journey, .form-card"));
    if (!targets.length) {
      setVisible(true);
      return;
    }

    const inView = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio > 0) inView.add(entry.target);
        else inView.delete(entry.target);
      }
      setVisible(inView.size === 0);
    }, { threshold: 0 });

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [pathname]);

  if (!visible) return null;
  return <Link className="mobile-quote-bar" href="/quote" aria-label="Get a free life insurance quote">Get a Free Quote</Link>;
}
