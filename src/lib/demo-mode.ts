/**
 * Demo-mode gate.
 *
 * The `demo_role` cookie lets a visitor preview a role's dashboard without a
 * real login (useful for hackathon judging). Previously this cookie was
 * honored unconditionally in production, which let ANYONE grant themselves
 * ADMIN/SUPER_ADMIN/OFFICER access — including to server actions that write
 * to the real database (e.g. promoting a real user's role).
 *
 * Now the cookie is only honored when explicitly enabled via env var, and
 * even when enabled it must NEVER be trusted by an action that mutates real
 * data — only by read-only "preview" views. See ensureAdmin()/ensureOfficer()
 * in the action files for how mutating actions reject demo identities.
 *
 * This file has zero heavy imports so it is safe to import from Edge
 * middleware / auth.config.ts.
 */
export function isDemoModeEnabled(): boolean {
  return process.env.ENABLE_DEMO_MODE === "true";
}
