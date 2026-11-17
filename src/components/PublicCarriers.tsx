"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Fallback directory based on the carrier names Alpha Nation has asked to show.
// This is informational only; it does not claim current appointments or state
// availability. The live admin-managed directory takes precedence when populated.
const fallbackCarrierNames = [
  "Aetna",
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
        // Keep the informational fallback visible if the public directory is
        // unavailable. Never let a carrier-directory outage blank the page.
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
        {names.map((name) => (
          <article className="info-card" key={name}>
            <h3>{name}</h3>
            <p>Product availability, appointment authority, and state eligibility must be confirmed for your request.</p>
          </article>
        ))}
      </div>
      <p className="directory-note">This informational list is not a guarantee of an active carrier appointment, product availability, or eligibility in any state. Alpha Nation confirms current relationships and licensing before discussing or placing coverage.</p>
    </>
  );
}
