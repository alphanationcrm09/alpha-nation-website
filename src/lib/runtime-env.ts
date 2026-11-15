import { getCloudflareContext } from "@opennextjs/cloudflare";

export function runtimeEnv(name: string) {
  try {
    const value = (getCloudflareContext().env as unknown as Record<string, unknown>)[name];
    if (typeof value === "string" && value.length) return value;
  } catch {
    // Local Next.js development reads values from .env.local.
  }
  return process.env[name];
}
