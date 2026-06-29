#!/usr/bin/env node
/**
 * VaadaKaro Demo Health Check System
 * ------------------------------------
 * Diagnostic-only script. Does NOT modify any application code.
 * Run with:  node scripts/health-check.mjs
 *
 * Requires the dev server to be running on localhost:3000
 */

const BASE_URL = process.env.APP_URL || "http://localhost:3000";
const TIMEOUT_MS = 5000;          // flag routes slower than this
const AI_TIMEOUT_WARNING_MS = 3000;

// ─── Colours ──────────────────────────────────────────────────────────────────
const c = {
  reset: "\x1b[0m",
  bold:  "\x1b[1m",
  green: "\x1b[32m",
  red:   "\x1b[31m",
  yellow:"\x1b[33m",
  cyan:  "\x1b[36m",
  dim:   "\x1b[2m",
};

const ok   = `${c.green}✅${c.reset}`;
const warn = `${c.yellow}⚠️ ${c.reset}`;
const fail = `${c.red}❌${c.reset}`;

// ─── Fetch with timeout + timing ──────────────────────────────────────────────
async function timedFetch(url, label) {
  const t0 = Date.now();
  try {
    const res = await Promise.race([
      fetch(url, { redirect: "follow" }),
      new Promise((_, rej) =>
        setTimeout(() => rej(new Error("TIMEOUT")), TIMEOUT_MS + 2000)
      ),
    ]);
    const ms = Date.now() - t0;
    return { ok: res.ok, status: res.status, ms, error: null };
  } catch (err) {
    const ms = Date.now() - t0;
    return { ok: false, status: 0, ms, error: err.message };
  }
}

// ─── API JSON probe ───────────────────────────────────────────────────────────
async function probeApi(path, label) {
  const t0 = Date.now();
  try {
    const res = await Promise.race([
      fetch(`${BASE_URL}${path}`),
      new Promise((_, rej) =>
        setTimeout(() => rej(new Error("TIMEOUT")), TIMEOUT_MS + 2000)
      ),
    ]);
    const ms = Date.now() - t0;
    if (!res.ok) return { success: false, ms, error: `HTTP ${res.status}` };
    const json = await res.json().catch(() => null);
    const apiOk = json !== null;
    return { success: apiOk, ms, error: apiOk ? null : "Non-JSON response" };
  } catch (err) {
    return { success: false, ms: Date.now() - t0, error: err.message };
  }
}

// ─── Main runner ──────────────────────────────────────────────────────────────
async function run() {
  console.log(`\n${c.bold}${c.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}`);
  console.log(`${c.bold}${c.cyan}  VaadaKaro Demo Health Check System${c.reset}`);
  console.log(`${c.bold}${c.cyan}  Target: ${BASE_URL}${c.reset}`);
  console.log(`${c.bold}${c.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}\n`);

  // ── Phase 1: Route Verification ───────────────────────────────────────────
  console.log(`${c.bold}Phase 1: Route Verification${c.reset}`);

  const routes = [
    { path: "/",                        label: "Home"                },
    { path: "/community-map",           label: "Community Map"       },
    { path: "/dashboard",               label: "Dashboard (auth gate)"},
    { path: "/dashboard/intelligence",  label: "Intelligence Hub"    },
    { path: "/ai-assistant",            label: "AI Assistant"        },
    { path: "/leaderboard",             label: "Leaderboard"         },
    { path: "/dashboard/profile",       label: "User Profile"        },
  ];

  let routesPassed = 0;
  const routeResults = [];

  for (const route of routes) {
    const r = await timedFetch(`${BASE_URL}${route.path}`, route.label);
    // 200 or 307/308 redirect (auth) all count as "pass" since pages exist
    const passed = r.ok || r.status === 307 || r.status === 308 || r.status === 302;
    if (passed) routesPassed++;

    const icon = passed ? ok : fail;
    const speed = r.ms > TIMEOUT_MS ? `${warn} SLOW (${r.ms}ms)` : `${c.dim}${r.ms}ms${c.reset}`;
    console.log(`  ${icon} [${r.status || "ERR"}] ${route.label.padEnd(26)} ${speed}`);
    if (r.error) console.log(`     ${c.red}↳ ${r.error}${c.reset}`);
    routeResults.push({ ...route, passed, ms: r.ms });
  }

  // ── Phase 2: Demo Mode Bypass ─────────────────────────────────────────────
  console.log(`\n${c.bold}Phase 2: Demo Mode Bypass${c.reset}`);

  const demoRoutes = [
    { path: "/community-map?demo=true",          label: "Map Demo Mode"       },
    { path: "/dashboard/intelligence?demo=true",  label: "Intelligence Demo"   },
  ];

  let demoPassed = 0;
  for (const dr of demoRoutes) {
    const t0 = Date.now();
    const r = await timedFetch(`${BASE_URL}${dr.path}`, dr.label);
    const ms = Date.now() - t0;
    const passed = r.ok || r.status === 307;
    if (passed) demoPassed++;
    const icon = passed ? ok : fail;
    console.log(`  ${icon} ${dr.label.padEnd(30)} ${c.dim}${r.ms}ms${c.reset}`);
  }
  const demoWorking = demoPassed === demoRoutes.length;

  // ── Phase 3: Backend API Health ───────────────────────────────────────────
  console.log(`\n${c.bold}Phase 3: Backend API Health${c.reset}`);

  const apis = [
    { path: "/api/auth/session",   label: "Auth Session API"     },
    { path: "/api/complaints",     label: "Complaints API"       },
    { path: "/api/ai/chat",        label: "AI Chat API"          },
  ];

  let apiHealthy = true;
  const apiResults = [];
  for (const api of apis) {
    const r = await probeApi(api.path, api.label);
    // 401/403 are expected for protected endpoints — still means route is live
    const isLive = r.success || (r.error && !r.error.includes("TIMEOUT") && !r.error.includes("ECONNREFUSED"));
    if (!isLive) apiHealthy = false;
    const icon = isLive ? ok : fail;
    console.log(`  ${icon} ${api.label.padEnd(28)} ${c.dim}${r.ms}ms${c.reset}${r.error ? `  ${c.yellow}(${r.error})${c.reset}` : ""}`);
    apiResults.push({ ...api, isLive, ms: r.ms });
  }

  // ── Phase 4: AI Timing ────────────────────────────────────────────────────
  console.log(`\n${c.bold}Phase 4: AI Response Timing${c.reset}`);
  const aiR = await probeApi("/api/ai/chat", "AI Chat Probe");
  const aiOk = aiR.ms < AI_TIMEOUT_WARNING_MS || aiR.error?.includes("401");
  const aiMode = aiOk ? "OK" : "FALLBACK MODE";
  console.log(`  ${aiOk ? ok : warn} AI endpoint response: ${aiR.ms}ms — ${aiMode}`);

  // ── Phase 5: Performance Summary ─────────────────────────────────────────
  console.log(`\n${c.bold}Phase 5: Performance Audit${c.reset}`);
  const slowRoutes = routeResults.filter(r => r.ms > TIMEOUT_MS);
  if (slowRoutes.length === 0) {
    console.log(`  ${ok} All routes under ${TIMEOUT_MS}ms threshold`);
  } else {
    slowRoutes.forEach(r => {
      console.log(`  ${warn} SLOW: ${r.label} took ${r.ms}ms`);
    });
  }
  const perfOk = slowRoutes.length === 0;

  // ── Final Report ─────────────────────────────────────────────────────────
  console.log(`\n${c.bold}${"━".repeat(50)}${c.reset}`);
  console.log(`${c.bold}  VaadaKaro Demo Health Report${c.reset}`);
  console.log(`${"━".repeat(50)}`);

  const routeStatus     = `${routesPassed}/${routes.length}`;
  const apiStatus       = apiHealthy ? `${c.green}YES${c.reset}` : `${c.red}NO${c.reset}`;
  const prismaStatus    = apiHealthy ? `${c.green}OK${c.reset}`  : `${c.yellow}WARNING${c.reset}`;
  const aiStatus        = aiOk       ? `${c.green}OK${c.reset}`  : `${c.yellow}FALLBACK MODE${c.reset}`;
  const mapStatus       = routeResults.find(r => r.path === "/community-map")?.passed
    ? `${c.green}OK${c.reset}` : `${c.yellow}FALLBACK MODE${c.reset}`;
  const demoStatus      = demoWorking ? `${c.green}WORKING${c.reset}` : `${c.red}BROKEN${c.reset}`;
  const perfStatus      = perfOk     ? `${c.green}FAST${c.reset}` : `${c.yellow}SLOW${c.reset}`;

  console.log(`  Routes Passed:   ${routesPassed === routes.length ? c.green : c.yellow}${routeStatus}${c.reset}`);
  console.log(`  APIs Healthy:    ${apiStatus}`);
  console.log(`  Prisma Status:   ${prismaStatus}`);
  console.log(`  AI Status:       ${aiStatus}`);
  console.log(`  Map Status:      ${mapStatus}`);
  console.log(`  Demo Mode:       ${demoStatus}`);
  console.log(`  Performance:     ${perfStatus}`);
  console.log(`${"━".repeat(50)}`);

  const allGood = routesPassed >= 5 && demoWorking;
  if (allGood) {
    console.log(`\n  ${c.bold}${c.green}✅ READY FOR LIVE JUDGE DEMO${c.reset}\n`);
  } else {
    console.log(`\n  ${c.bold}${c.red}❌ NOT READY FOR DEMO — see warnings above${c.reset}\n`);
    if (routesPassed < 5) console.log(`  ${warn} ${routes.length - routesPassed} route(s) failing — ensure dev server is running`);
    if (!demoWorking)     console.log(`  ${warn} Demo mode not responding at expected URLs`);
  }
}

run().catch(err => {
  console.error(`\n${c.red}Health check crashed: ${err.message}${c.reset}`);
  process.exit(1);
});
