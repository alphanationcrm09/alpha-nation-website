import { NextResponse } from "next/server";
import { getPrivilegedSubmissionClient } from "@/lib/public-submission";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const db = getPrivilegedSubmissionClient();
  if (!db) return NextResponse.json({ agents: [] }, { headers: { "Cache-Control": "no-store" } });

  try {
    const today = new Date().toISOString().slice(0, 10);
    const [{ data: agents, error: agentsError }, { data: licenses, error: licensesError }] = await Promise.all([
      db.from("agents")
        .select("id,full_name,states,work_days,start_time,end_time,timezone")
        .eq("status", "active")
        .order("full_name")
        .limit(30),
      db.from("agent_licenses")
        .select("agent_id,state_code")
        .eq("verification_status", "verified")
        .gte("expires_at", today),
    ]);

    if (agentsError || licensesError) {
      return NextResponse.json({ agents: [] }, { headers: { "Cache-Control": "no-store" } });
    }

    const verifiedByAgent = new Map<string, Set<string>>();
    for (const license of licenses || []) {
      const states = verifiedByAgent.get(license.agent_id) || new Set<string>();
      states.add(license.state_code);
      verifiedByAgent.set(license.agent_id, states);
    }

    const publicAgents = (agents || []).map((agent) => {
      const verified = verifiedByAgent.get(agent.id) || new Set<string>();
      const states = (agent.states || []).filter((state: string) => verified.has(state));
      return {
        name: agent.full_name,
        states,
        workDays: agent.work_days || [],
        startTime: agent.start_time,
        endTime: agent.end_time,
        timezone: agent.timezone,
      };
    }).filter((agent) => agent.states.length > 0);

    return NextResponse.json({ agents: publicAgents }, {
      headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json({ agents: [] }, { headers: { "Cache-Control": "no-store" } });
  }
}
