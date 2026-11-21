"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const fallbackCarrierNames = [
  "Aetna",
  "Cigna",
  "AIG / Corebridge Financial",
  "American Amicable",
  "Americo",
  "Baltimore Life",
  "CICA Life",
  "Fidelity Life",
  "Foresters Financial",
  "Gerber Life",
  "GTL",
  "Illinois Mutual",
  "Mutual of Omaha",
  "RNA",
  "Sentinel Security Life",
  "Transamerica",
];

const carrierDomains: Record<string, string> = {
  "aetna": "aetna.com",
  "aig / corebridge financial": "corebridgefinancial.com",
  "aig": "aig.com",
  "corebridge financial": "corebridgefinancial.com",
  "american amicable": "americanamicable.com",
  "americo": "americo.com",
  "baltimore life": "baltimorelife.com",
  "the baltimore life companies": "baltimorelife.com",
  "cigna": "cigna.com",
  "cica life of america": "cicalife.com",
  "guarantee trust life": "gtlic.com",
  "mutual of omaha (moo)": "mutualofomaha.com",
  "cica life": "cicalife.com",
  "fidelity life": "fidelitylife.com",
  "foresters financial": "foresters.com",
  "foresters": "foresters.com",
  "gerber life": "gerberlife.com",
  "gtl": "gtlic.com",
  "illinois mutual": "illinoismutual.com",
  "mutual of omaha": "mutualofomaha.com",
  "rna": "royalneighbors.org",
  "royal neighbors of america": "royalneighbors.org",
  "sentinel security life": "sentinellife.com",
  "transamerica": "transamerica.com",
};

const topCarriers = fallbackCarrierNames.map((name) => ({
  name,
  domain: carrierDomains[name.trim().toLowerCase()],
}));

function initials(name: string) {
  return name.replace(/[^a-zA-Z0-9 ]/g, " ").trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function CarrierLogo({ name, domain }: { name: string; domain?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className="carrier-logo" aria-label={`${name} logo`}>
      {domain && !failed ? (
        <img
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
          alt={`${name} logo`}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : null}
      {(!domain || failed) && <span className="carrier-logo-fallback" aria-hidden="true">{initials(name)}</span>}
    </span>
  );
}

export function CarrierTrustLogos() {
  return (
    <div className="an-carrier-wordmarks" aria-label="Featured insurance carriers">
      {topCarriers.filter((carrier) => ["Aetna", "Cigna", "Foresters Financial", "Transamerica"].includes(carrier.name)).map((carrier) => (
        <span className="an-featured-carrier" key={carrier.name}>
          <CarrierLogo name={carrier.name} domain={carrier.domain} />
          <b>{carrier.name}</b>
        </span>
      ))}
    </div>
  );
}

export default function PublicCarriers() {
  const [names, setNames] = useState<string[]>(fallbackCarrierNames);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!supabase) {
        if (active) setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("carriers")
          .select("name, display_name")
          .eq("status", "active")
          .order("name");
        if (active && !error && data?.length) {
          const liveNames = data
            .map((carrier) => carrier.display_name || carrier.name)
            .filter((name): name is string => typeof name === "string" && name.trim().length > 0);
          if (liveNames.length) setNames(liveNames);
        }
      } catch {
        // Keep the informational fallback visible if the public directory is unavailable.
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <>
      {loading && <p className="directory-note">Loading the current carrier directory…</p>}
      <div className="card-grid carrier-directory">
        {names.map((name) => {
          const domain = carrierDomains[name.trim().toLowerCase()];
          return (
            <article className="info-card carrier-card" key={name}>
              <div className="carrier-card-brand">
                <CarrierLogo name={name} domain={domain} />
                <h3>{name}</h3>
              </div>
              <p>Product availability, appointment authority, and state eligibility must be confirmed for your request.</p>
            </article>
          );
        })}
      </div>
      <p className="directory-note">This informational list is not a guarantee of an active carrier appointment, product availability, or eligibility in any state. Alpha Nation confirms current relationships and licensing before discussing or placing coverage.</p>
    </>
  );
}
