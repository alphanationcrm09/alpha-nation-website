"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PublicCarriers() {
  const [names, setNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!supabase) { if (active) setLoading(false); return; }
      const { data, error } = await supabase
        .from("carriers")
        .select("name")
        .eq("status", "active")
        .order("name");
      if (active) {
        setNames(error ? [] : (data || []).map((carrier) => carrier.name));
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  if (loading) return <p className="directory-note">Loading current carrier directory…</p>;
  if (!names.length) return <p className="directory-note">Carrier information is being updated. Contact our team to confirm current carrier relationships.</p>;

  return <div className="card-grid carrier-directory">
    {names.map((name) => <article className="info-card" key={name}><h3>{name}</h3><p>Product and state availability must be confirmed for your request.</p></article>)}
  </div>;
}
