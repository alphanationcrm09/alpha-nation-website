"use client";

import { useEffect, useState } from "react";

type PublicAgent = {
  name: string;
  states: string[];
  workDays: string[];
  startTime: string | null;
  endTime: string | null;
  timezone: string | null;
};

const stateNames: Record<string, string> = {
  AL:"Alabama", AK:"Alaska", AZ:"Arizona", AR:"Arkansas", CA:"California",
  CO:"Colorado", CT:"Connecticut", DE:"Delaware", FL:"Florida", GA:"Georgia",
  HI:"Hawaii", ID:"Idaho", IL:"Illinois", IN:"Indiana", IA:"Iowa", KS:"Kansas",
  KY:"Kentucky", LA:"Louisiana", ME:"Maine", MD:"Maryland", MA:"Massachusetts",
  MI:"Michigan", MN:"Minnesota", MS:"Mississippi", MO:"Missouri", MT:"Montana",
  NE:"Nebraska", NV:"Nevada", NH:"New Hampshire", NJ:"New Jersey", NM:"New Mexico",
  NY:"New York", NC:"North Carolina", ND:"North Dakota", OH:"Ohio", OK:"Oklahoma",
  OR:"Oregon", PA:"Pennsylvania", RI:"Rhode Island", SC:"South Carolina",
  SD:"South Dakota", TN:"Tennessee", TX:"Texas", UT:"Utah", VT:"Vermont",
  VA:"Virginia", WA:"Washington", WV:"West Virginia", WI:"Wisconsin", WY:"Wyoming",
};

export default function PublicAgents() {
  const [agents, setAgents] = useState<PublicAgent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/public-directory", { cache: "no-store" })
      .then((response) => response.json())
      .then((result) => { if (active) setAgents(Array.isArray(result.agents) ? result.agents : []); })
      .catch(() => { if (active) setAgents([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  if (loading) return <p className="directory-note">Loading verified agent profiles…</p>;
  if (!agents.length) return <div className="directory-empty"><h3>Connect with an Alpha Nation professional</h3><p>Our team will review your state and service request, then coordinate with an appropriately licensed professional.</p><a className="button" href="/quote">Request an appointment</a></div>;

  return <div className="agent-directory">
    {agents.map((agent) => (
      <article className="info-card public-agent-card" key={agent.name}>
        <span className="agent-kicker">ALPHA NATION PROFESSIONAL</span>
        <h3>{agent.name}</h3>
        <p><strong>Verified states:</strong> {agent.states.map((state) => stateNames[state] || state).join(", ")}</p>
        {agent.workDays.length > 0 && <p><strong>Typical schedule:</strong> {agent.workDays.join(", ")}</p>}
        <a href="/quote">Request an appointment ↗</a>
      </article>
    ))}
  </div>;
}
