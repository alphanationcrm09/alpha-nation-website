"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

type Props = {
  action: "appointment" | "inquiry";
  theme?: "light" | "dark";
  onToken?: (token: string) => void;
};

export default function TurnstileChallenge({ action, theme = "dark", onToken }: Props) {
  const [siteKey, setSiteKey] = useState("");
  const [scriptReady, setScriptReady] = useState(false);
  const [error, setError] = useState("");
  const container = useRef<HTMLDivElement | null>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/public-config", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Public configuration unavailable");
        return response.json();
      })
      .then((config) => {
        if (!active) return;
        if (typeof config.turnstileSiteKey === "string" && config.turnstileSiteKey.trim()) {
          setSiteKey(config.turnstileSiteKey.trim());
        } else {
          setError("Security verification is not configured. Please contact aalphanation@gmail.com.");
        }
      })
      .catch(() => {
        if (active) setError("Security verification could not load. Refresh the page or contact aalphanation@gmail.com.");
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!scriptReady || !siteKey || !container.current) return;
    if (!window.turnstile) {
      setError("Cloudflare security verification did not initialize. Refresh the page and try again.");
      return;
    }
    try {
      container.current.replaceChildren();
      widgetId.current = window.turnstile.render(container.current, {
        sitekey: siteKey,
        action,
        theme,
        callback: (token: string) => onToken?.(token),
        "expired-callback": () => onToken?.(""),
        "error-callback": () => onToken?.(""),
      });
      setError("");
    } catch {
      setError("Cloudflare security verification could not be displayed. Refresh the page and try again.");
    }
    return () => {
      onToken?.("");
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, [scriptReady, siteKey, action, theme, onToken]);

  return (
    <div className="turnstile-wrap">
      {siteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={() => setScriptReady(true)}
          onError={() => setError("Cloudflare security verification could not load. Check your connection and refresh.")}
        />
      )}
      <div ref={container} />
      {error && <p className="form-notice" role="status">{error}</p>}
      <noscript>JavaScript is required for the security check.</noscript>
    </div>
  );
}
