# 🧠 BRAIN.md — VaadaKaro Single Source of Truth

> For any AI agent or developer: read this before touching anything.
> Last updated: 2026-09-17 (security & correctness audit pass — see §12
> for what changed and what's still open; §16's risk levels still apply).

---

## 1. WHAT IS VAADAKARO

**VaadaKaro** ("Vaada" = Promise, "Karo" = Do It) is a hyperlocal civic accountability platform for India.

Citizens file grievances (potholes, water leakage, broken lights), track resolution, verify each other's complaints, and earn gamification rewards. Officers manage and resolve complaints. AI assists with legal guidance and complaint quality analysis.

**It is NOT a social media app. It is a structured civic-tech system.**

---

## 2. TECH STACK

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 15.5.x (App Router) | SSR + RSC for SEO and performance |
| Language | TypeScript 5 | Type safety across DB ↔ UI |
| Database | PostgreSQL (Neon) + Prisma ORM 6.2 | Relational civic data with migrations |
| Auth | NextAuth v5 beta (JWT + Credentials) | Role-based, no raw session storage |
| AI | Google Gemini (`gemini-2.0-flash`, per-workload API keys) | Complaint analysis + legal chat + doc generation |
| Maps | Leaflet + Esri satellite tiles | Free, no API key for satellite view |
| Storage | Cloudinary | Complaint photo evidence |
| Email | Nodemailer | Wired — fires on complaint submission + officer status updates |
| Styling | **Tailwind CSS v4** + CSS Modules (mixed) | Tailwind used in most newer pages/components; CSS Modules in older ones. Not "vanilla CSS only" — see §18. |
| Deployment | Docker (standalone output) → Cloud Run / Vercel | SSR-compatible |

> ⚠️ This table was previously wrong about styling (said "no Tailwind") and
> email (said "not wired"). If you're an agent reading this before making a
> change, verify anything load-bearing against the actual code — this file
> has drifted from reality before and likely will again.

---

## 3. PROJECT STRUCTURE

```
src/
├── actions/                   # Direct AI server actions (bypass runAiTask)
│   ├── complaint-analysis.ts  # analyzeComplaint() — AI quality scoring
│   ├── document-generator.ts  # generateLegalDocument()
│   └── legal-assistant.ts     # getLegalAdvice() — VaadaAI chat
│
├── app/                       # Next.js App Router pages
│   ├── ai-assistant/          # VaadaAI chat page
│   ├── api/ai/health/         # GET /api/ai/health — AI connectivity check
│   ├── community-map/         # Leaflet satellite map
│   ├── dashboard/             # Citizen dashboard + officer sub-routes
│   │   ├── officer/           # Officer-only complaint management
│   │   └── settings/          # User notification settings
│   ├── file-complaint/        # 4-step complaint submission form
│   ├── gamification/          # Leaderboard + badges + points
│   ├── generate-docs/         # AI legal document generation
│   ├── track-complaint/       # Public complaint tracker
│   ├── layout.tsx             # Root layout — header + font + globals
│   └── page.tsx               # Landing page
│
├── components/
│   ├── features/
│   │   ├── complaints/        # ComplaintForm (4-step), SuccessScreen
│   │   ├── legal/             # DocumentVault, AnalysisDashboard
│   │   ├── notifications/     # NotificationCenter (bell icon)
│   │   ├── officer/           # OfficerSidebar
│   │   └── tracking/          # TrackingSearch, ComplaintDetails, Timeline
│   ├── layout/
│   │   ├── Header/            # Top nav — auth-aware, role-aware
│   │   └── MainLayout.tsx     # Wraps every page with header
│   └── ui/Logo/               # VaadaKaro logo component
│
├── lib/
│   ├── ai.ts                  # Core AI runner — runAiTask() with fallback
│   ├── prisma.ts              # Singleton Prisma client
│   ├── validation.ts          # Zod schemas (complaintSchema, registrationSchema)
│   └── actions/               # DB-facing server actions
│       ├── adminActions.ts
│       ├── ai-actions.ts      # Intelligence dashboard AI summary
│       ├── aiDocumentActions.ts
│       ├── auditActions.ts    # logAction() — audit trail
│       ├── auth-actions.ts    # register(), login()
│       ├── communityActions.ts # votes, comments, points, badges, leaderboard
│       ├── complaintActions.ts # submitComplaint(), getUserComplaints(), getComplaintByTrackingId()
│       ├── notificationActions.ts # createNotification(), markAsRead()
│       ├── officerActions.ts  # updateComplaintStatus()
│       ├── replyActions.ts    # Officer replies to INFO_REQUESTED
│       └── uploadActions.ts   # Cloudinary upload
│
├── auth.ts                    # NextAuth config + Prisma adapter + JWT
├── auth.config.ts             # Route protection rules
├── middleware.ts              # Edge auth enforcement
└── styles/globals.css         # Global CSS vars, brand colors, utilities
```

---

## 4. DATABASE SCHEMA

### Core Models

```
User
├── id (cuid)
├── email (unique)
├── password (bcrypt hash)
├── role: CITIZEN | OFFICER | LAWYER | ADMIN | DEPARTMENT_ADMIN | SUPER_ADMIN
│     (DEPARTMENT_ADMIN/SUPER_ADMIN added 2026-09-17 — see migration
│      20260917120000_add_super_admin_department_admin_roles. Portal
│      code assumed these existed since the /admin, /super-admin UIs
│      were built; run `npx prisma migrate deploy` before relying on
│      them against a real database.)
├── points (gamification XP)
├── isVerified (boolean)
├── department (for OFFICER role)
└── relations: complaints, votes, comments, badges, notifications, sessions

Complaint
├── id (cuid)
├── trackingId: VDK-YYYY-XXXXXXXX (unique, public-facing)
├── status: SUBMITTED → UNDER_REVIEW → IN_PROGRESS → INFO_REQUESTED → RESOLVED/REJECTED
├── priority: LOW | MEDIUM | HIGH | URGENT
├── category, department, location, pincode
├── latitude, longitude (Float, nullable — GPS optional)
├── upvotes, downvotes (Int counters, denormalized for speed)
├── citizenId → User
├── assignedOfficerId → User (nullable)
└── relations: updates, attachments, votes, comments

ComplaintVote
├── complaintId + userId (unique pair — one vote per user per complaint)
├── voteType: UPVOTE | DOWNVOTE
└── Toggle behavior: same vote = remove, different = switch

ComplaintComment
├── complaintId, userId, content (max 500 chars)

ComplaintUpdate
├── complaintId, status, remarks, updatedBy (string — "SYSTEM" or officer name)
└── Append-only status history log

Badge + UserBadge
├── Badge: key (unique), name, description, icon, color, pointsRequired
├── UserBadge: userId + badgeId (unique pair), earnedAt
└── 6 badges: first_report, community_voice, problem_solver, watchdog, civic_hero, super_citizen

PointTransaction
├── userId, points, reason, entityId (nullable complaint ref)
└── Immutable ledger — never update, only append

AILegalHistory
├── userId, query, response, legalCategory
└── Stores every VaadaAI conversation turn per user

LegalDocument
├── userId, title, content, type, category, riskLevel, analysis
└── AI-generated documents stored per user

Notification
├── userId, type, title, message, isRead, actionUrl, complaintId
```

### Enums (verified against prisma/schema.prisma 2026-09-17)
```
UserRole:        CITIZEN | OFFICER | LAWYER | ADMIN | DEPARTMENT_ADMIN | SUPER_ADMIN
ComplaintStatus: SUBMITTED | UNDER_REVIEW | IN_PROGRESS | INFO_REQUESTED | RESOLVED | REJECTED
PriorityLevel:   LOW | MEDIUM | HIGH | URGENT
BookingStatus:   PENDING | CONFIRMED | COMPLETED | CANCELLED
```
There is no `VoteType` enum and no `ComplaintVote`/`ComplaintComment`/
`PointTransaction` models — those were in an earlier draft of this doc and
never matched the schema. Voting is `model Vote { value Int }` (positive =
upvote, negative = downvote, magnitude = trust-weighted), generic `Comment`
is used for complaints, and there is no points ledger table — `User.points`
is just incremented directly by `GamificationService.awardPoints()`.

---

## 5. AUTHENTICATION & AUTHORIZATION

### How It Works
1. User logs in via Credentials (email + bcrypt password)
2. NextAuth creates a **JWT** (not database session — `strategy: "jwt"`)
3. JWT contains: `id`, `name`, `email`, `image`, `role`, `department`
4. `auth()` is called server-side in every action/page to get session
5. `middleware.ts` imports from `./auth.config` (Edge-safe configuration) to enforce auth at the Edge without loading Prisma (which crashes in Edge runtimes). It evaluates `isLoggedIn` using both `req.auth` and, only when demo mode is enabled (see below), the `demo_role` cookie.

### Route Protection & Split Config
- **`auth.config.ts`**: Edge-safe configuration containing general configuration, routes mapping, and callbacks (JWT, Session, Authorized). Contains no Prisma or bcrypt dependencies.
- **`auth.ts`**: Node.js-only NextAuth instance wrapper. Spreads `authConfig` and hooks up `PrismaAdapter(prisma)` and `Credentials` provider. Server components and API endpoints import from `@/auth`.
- **`middleware.ts`**: Wraps the `authConfig` with NextAuth middleware. Enforces route access rules on `/dashboard`, `/citizen`, `/officer`, `/admin`, and `/super-admin`.

### Demo Mode (`demo_role` cookie) — 🔴 read this before touching it
The login page's "Quick Portal Access" buttons set a `demo_role` cookie to
preview a role's dashboard without a real login. **Until 2026-09-17 this was
honored unconditionally in production**, at the middleware, `auth.config`,
portal-layout, AND server-action level — including actions that write to
real rows (`adminActions.updateUserRole` could promote any real account,
`officerActions.updateComplaintStatus` could alter any real complaint). That
was a full unauthenticated privilege-escalation path.

It is now gated behind `src/lib/demo-mode.ts`'s `isDemoModeEnabled()`, which
checks `process.env.ENABLE_DEMO_MODE === "true"` — **off by default**. The
client-side buttons are separately gated by `NEXT_PUBLIC_ENABLE_DEMO_MODE`.
Even with the flag on, `adminActions.ts` no longer accepts a demo identity
at all (real writes always require a genuine session), and
`officerActions.ts`'s mutating functions (`updateComplaintStatus`,
`assignOfficer`) explicitly reject a demo identity via the `isDemo` flag
`ensureOfficer()` now returns. Only read-only dashboard previews should ever
honor `demo_role` — if you add a new admin/officer action, do NOT copy the
old unconditional-demo-bypass pattern from git history.

Never set `ENABLE_DEMO_MODE=true` in an environment with real user data.

### Critical Pattern
```ts
const session = await auth();
const userId = (session.user as any).id; // role, department also here
```
The `as any` cast is needed because NextAuth's default types don't include custom fields. This is technical debt — a proper type extension would fix it.

### What Breaks If Modified
- Changing `strategy: "jwt"` to `"database"` breaks all server actions (they call `auth()` which returns null without DB sessions configured)
- Importing from `@/auth` directly inside `middleware.ts` will bundle Prisma Client, crashing Next.js middleware with Edge runtime errors.
- Removing `department` from JWT means Officer dashboard loses department filtering


---

## 6. AI SYSTEM

### Two Parallel AI Paths (IMPORTANT)

There are **two separate ways** AI is called in this project:

#### Path A — `src/lib/ai.ts` → `runAiTask()`
Used by: `ai-actions.ts`, `complaint-analysis.ts` (when called via lib)
- Initializes `GoogleGenerativeAI` once at module load
- `runAiTask(taskType, prompt, options)` tries PRIMARY model, falls back to FALLBACK
- Returns `{ data, metadata }` or `{ error, metadata }`
- `options.json = true` → strips markdown fences and parses JSON

#### Path B — `src/actions/legal-assistant.ts` (direct SDK)
Used by: VaadaAI chat
- Creates its own `GoogleGenerativeAI` instance inline
- Uses `model.startChat()` for multi-turn conversation
- **Known Bug:** If history array starts with a 'model' role message, Gemini throws "First content should be with role 'user'". Fix: filter out leading model messages from history before passing to `startChat()`

### Model Config
```ts
PRIMARY: "gemini-2.0-flash"    // Free tier, fast
FALLBACK: "gemini-1.5-flash-latest"  // Backup
```
**Never use `gemini-1.5-flash` or `gemini-1.5-pro`** — deprecated/restricted on free keys.

### AI Tasks
| Task | File | Input | Output |
|---|---|---|---|
| Legal chat | `legal-assistant.ts` | userQuery + history | Markdown legal guidance |
| Complaint analysis | `complaint-analysis.ts` | title + description | JSON: qualityScore, feedback, suggestedCategory, missingDetails |
| Document generation | `document-generator.ts` | type + context | Full legal document text |
| Intelligence summary | `ai-actions.ts` | complaint stats | Civic summary paragraph |
| Health check | `api/ai/health/route.ts` | ping | `{ status: "healthy" }` |

### Health Check Fix
The health endpoint validates `result.data.length > 0` (not `includes("healthy")`). This was fixed because Gemini responses vary and rarely say "healthy" literally.

---

## 7. COMPLAINT LIFECYCLE

```
CITIZEN fills ComplaintForm (4 steps)
  → Step 1: Title, Department, Category, Description
  → Step 2: Location (State, City, Pincode, Address)
  → Step 3: Evidence (Cloudinary photo upload)
  → Step 4: Declaration + AI Disclaimer checkboxes

submitComplaint() server action:
  1. auth() check
  2. Zod validation (complaintSchema)
  3. Duplicate check (same title + department within 5 min)
  4. prisma.complaint.create() with trackingId: VDK-YYYY-XXXXXXXX
  5. logAction(COMPLAINT_CREATED) → AuditLog
  6. prisma.complaintUpdate.create() → initial SUBMITTED status
  7. createNotification() → citizen gets submission confirmation
  8. revalidatePath('/dashboard')

OFFICER updates status via officerActions.updateComplaintStatus():
  1. Role check (OFFICER or ADMIN)
  2. prisma.complaint.update({ status })
  3. prisma.complaintUpdate.create() → appends to timeline
  4. createNotification() → citizen notified of status change
  5. If RESOLVED → onComplaintResolved() → +20 points to citizen

CITIZEN tracks via /track-complaint:
  - Public access: masked data (description = "REDACTED", location = "REDACTED")
  - Owner/Officer access: full data including attachments
```

---

## 8. GAMIFICATION SYSTEM

### Points Config (communityActions.ts)
```ts
FILE_COMPLAINT:     +10
COMPLAINT_RESOLVED: +20
CAST_VOTE:          +5
ADD_COMMENT:        +3
RECEIVE_UPVOTE:     +2
```

### Flow
```
User action → awardPoints(userId, points, reason, entityId)
  → prisma.$transaction([
      user.update({ points: { increment } }),
      pointTransaction.create()
    ])
  → checkAndAwardBadges(userId)
    → checks 6 badge conditions against current user state
    → prisma.userBadge.create() if condition met (ignores duplicate)
```

### Badge Conditions
| Badge | Condition |
|---|---|
| first_report | totalComplaints >= 1 |
| community_voice | points >= 50 |
| problem_solver | resolvedComplaints >= 3 |
| watchdog | totalVotes >= 10 |
| civic_hero | points >= 200 |
| super_citizen | points >= 500 |

### Seeding Badges
Badges must exist in DB before they can be awarded. Run:
```bash
npx prisma db seed
```
This runs `prisma/seed.ts` which upserts all 6 badges.

### What Breaks If Modified
- Deleting a Badge row without deleting UserBadge rows → foreign key violation
- Changing badge `key` values → badge award logic stops matching
- Not seeding badges → `checkAndAwardBadges()` silently does nothing (badge not found = no-op)

---

## 9. COMMUNITY MAP

### Architecture
- `page.tsx` (server) → fetches complaints from `getPublicComplaintsForMap()`
- `CommunityMapClient.tsx` (client, `dynamic import { ssr: false }`) → Leaflet map
- Map tiles: Esri World Imagery (satellite, free, no API key)
- Markers: color-coded by status (red = open, green = resolved)
- Clicking a marker → side panel slides in with complaint details + vote + comment UI

### Why `ssr: false`
Leaflet uses `window` and `document` — crashes on server. Always import map components with `{ ssr: false }`.

### Demo Mode
`?demo=true` → loads 5 hardcoded New Delhi markers, zero DB calls. Used for hackathon demos.

### Voting from Map
`voteOnComplaint(complaintId, 'UPVOTE'|'DOWNVOTE')` → toggle logic:
- Same vote again = remove vote
- Different vote = switch vote
- Own complaint = blocked
- Unauthenticated = blocked

---

## 10. CRITICAL WORKFLOWS

### New User Registration
```
/signup → auth-actions.registerUser()
  → Zod registrationSchema validation
  → bcrypt.hash(password, 12)
  → prisma.user.create({ role: 'CITIZEN' })  ← role hardcoded server-side
  → signIn() → JWT created
```
**Role is always forced to CITIZEN on signup.** Officers/Admins must be manually set in DB.

### Officer Assignment
1. Go to DB directly: `UPDATE "User" SET role = 'OFFICER', department = 'Roads' WHERE email = '...'`
2. Or via adminActions (if admin panel exists)

### Notification Flow
```
createNotification({ userId, type, title, message, actionUrl, complaintId })
  → prisma.notification.create()
  → NotificationCenter component polls/reads on bell icon click
```
Email via Nodemailer is configured but **not fully wired** — notifications are in-app only currently.

---

## 11. ENVIRONMENT VARIABLES

```env
DATABASE_URL="postgresql://user:pass@host:5432/vaadakaro"
DIRECT_URL="postgresql://user:pass@host:5432/vaadakaro"   # required by schema.prisma's directUrl — missing this breaks migrations against pooled connections (e.g. Neon)
AUTH_SECRET="<random 32+ char string>"                     # REQUIRED in prod — app now throws at boot if unset (see §5 / §13)
NEXTAUTH_URL="http://localhost:3000"                       # Change to production URL on deploy
AUTH_URL="http://localhost:3000"
AUTH_TRUST_HOST="1"
GEMINI_API_KEY_CHAT="<Google AI Studio key>"
GEMINI_API_KEY_ANALYSIS="<Google AI Studio key>"
GEMINI_API_KEY_DOCUMENTS="<Google AI Studio key>"
# GEMINI_API_KEY="<legacy single-key fallback, used only if the three above are unset>"
```

Optional:
```env
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
SMTP_HOST="" SMTP_PORT="587" SMTP_USER="" SMTP_PASS=""
GOVT_EMAIL_GENERAL=""   # + GOVT_EMAIL_<DEPARTMENT> per department, used by emailActions.sendComplaintToGovernment

# Demo mode (hackathon/judging preview only) — see §5. Leave unset in any
# deployment with real users; both default to false/off.
ENABLE_DEMO_MODE="true"
NEXT_PUBLIC_ENABLE_DEMO_MODE="true"
```

### Common Mistakes
- `NEXTAUTH_URL` must match the exact domain in production (no trailing slash)
- `AUTH_SECRET` missing in production now fails the build/boot on purpose (was previously a hardcoded fallback — a real security hole, fixed 2026-09-17)
- Missing all three `GEMINI_API_KEY_*` (and no legacy `GEMINI_API_KEY`) → that workload's AI calls return a "not configured" error, not a crash
- `DIRECT_URL` must be set for Prisma Migrate to work against a pooled connection (Neon, PgBouncer, etc.) even though the app itself only needs `DATABASE_URL`

---

## 12. KNOWN BUGS & TECHNICAL DEBT

**Status as of 2026-09-17 security/correctness pass** (branch
`security/audit-fixes-2026-09`) — the table below in earlier versions of this
file was significantly out of date; several "known bugs" were already fixed
and several real, more serious issues weren't listed at all.

| Item | Status | Notes |
|---|---|---|
| `demo_role` cookie = unauthenticated role bypass, including on real DB writes | ✅ **FIXED** | Gated behind `ENABLE_DEMO_MODE` (default off); stripped entirely from `adminActions.ts`; `officerActions.ts` mutating actions reject demo identities even when the flag is on. See §5. |
| Hardcoded fallback JWT secret in `auth.config.ts` | ✅ **FIXED** | Now throws in production if `AUTH_SECRET`/`NEXTAUTH_SECRET` is unset; dev falls back to a random per-process secret with a warning. |
| `next@15.0.3` — 8 vulnerabilities incl. critical middleware auth-bypass CVE-2025-29927 | ✅ **FIXED** | Upgraded to `15.5.25`. `npm audit` down to 2 low findings nested in Next's own bundled `postcss`, only fixable by a Next 16 major upgrade (deliberately deferred — real migration, not a patch). |
| `emailActions.ts` had `'use server'` with zero auth — public open mail relay | ✅ **FIXED** | Dropped `'use server'`, added `server-only` guard; these are internal helpers only ever called from other server actions. |
| `uploadFileToCloudinary()` had no auth check | ✅ **FIXED** | Added `auth()` check (it's called directly from a client component so must stay a Server Action). |
| `getMapComplaints()` used Prisma `include`, leaking `internalNotes`/`citizenId`/`assignedOfficerId`/`pincode` to the public map | ✅ **FIXED** | Switched to explicit `select` with only the fields the map UI renders. |
| `demoActions.ts` referenced a nonexistent `platformMetric` model + wrong `AccountabilityPartner` field names | ✅ **FIXED** | `getPlatformMetrics()` now computes real live counts; `setupDemoData()` uses the real schema fields. Also restored a missing `'use server'` that was leaking Prisma into the client bundle (118 kB → 2 kB). |
| `verifyComplaint()` double-counted `verifiedScore` on re-vote, no self-vote guard | ✅ **FIXED** | Now adjusts by delta vs. previous vote; self-vote blocked. **Still true:** this function has no caller anywhere in the UI — voting is not actually wired up on the community map despite BRAIN.md §9 describing it. That's a missing feature, not a bug. |
| `flagFalseReport()` no self-flag guard | ✅ **PARTIALLY FIXED** | Self-flag blocked. Per-user one-flag-max still not possible — no table tracks who flagged what (would need a schema addition). Also has no caller anywhere yet. |
| `AntiSpamService.checkRateLimit()` re-applied -30 trust penalty on every blocked attempt | ✅ **FIXED** | Now only applies once when the cap is first crossed. |
| `submitComplaint()` logged the full payload (name/address/pincode/description) unconditionally | ✅ **FIXED** | Gated to non-production only. |
| `React`/`react-dom` pinned to a dated pre-release RC (`19.0.0-rc-66855b96-20241106`) | ✅ **FIXED** | Moved to `^19.0.0` (resolves to stable 19.3.0); `@types/react(-dom)` bumped `^18` → `^19` to match. |
| `SUPER_ADMIN`/`DEPARTMENT_ADMIN` used throughout code but missing from the `UserRole` enum | ✅ **FIXED (schema)**, ⏳ **migration not yet applied** | Added to schema + migration `20260917120000_add_super_admin_department_admin_roles`. **Run `npx prisma migrate deploy` against the real database before relying on this** — it was unreachable from the environment this fix was made in, so it has not been applied yet. |
| History starts with 'model' role crash | ✅ Already fixed before this pass | `legal-assistant.ts`'s `sanitizeChatHistory()` already filters leading model messages — this item in earlier BRAIN.md revisions was stale. |
| `as any` session casts everywhere | ✅ Already fixed before this pass | `src/types/next-auth.d.ts` already extends `Session`/`JWT`/`User` with `role`/`id`/`department` — this item was stale too. |
| Nodemailer not wired | ✅ Already fixed before this pass | `emailActions.ts` sends confirmation + government notification emails from `submitComplaint()`, and status-update emails from `officerActions`/`notificationActions`. |
| No rate limiting on votes/comments | ✅ Already fixed before this pass | `AntiSpamService.checkVoteRateLimit`/`checkCommentRateLimit` (5/min) exist — though note the `/api/community/vote` and `/api/community/comment` routes don't currently call them (only the unused `verifyComplaint` server action does). |
| Duplicate action file paths (`src/actions/` vs `src/lib/actions/`) | ✅ Already fixed before this pass | Only `src/lib/actions/` exists now. |
| **NOT YET FIXED:** two parallel route trees (`/dashboard/*` vs `/(portals)/*`) + duplicate sidebar/layout components | 🟡 Open | Real workflows live under `/dashboard/*`; most of `/(portals)/admin`, `/(portals)/super-admin`, and 7 of 8 `/(portals)/officer/*` pages are hardcoded mock UI with no DB calls. Needs a deliberate consolidation pass, not a quick fix. |
| **NOT YET FIXED:** voting has no UI anywhere | 🟡 Open | Neither `verifyComplaint()` nor `/api/community/vote` is called from any component. Building the actual vote UI on the community map is a real feature task. |
| **NOT YET FIXED:** `/api/community/vote` and `/api/community/comment` don't call `AntiSpamService`'s rate limiters | 🟡 Open | They award points on every call with no cap. |
| **NOT YET FIXED:** `zod ^4.4.3` alongside `next@15.5.x`/React 19.3 — no compatibility issues found in build/typecheck, but worth re-verifying after any future zod major bump | 🟡 Note only | |

---

## 13. SECURITY

- Passwords: bcrypt with salt rounds 12
- No raw Aadhaar/ID stored (hash only — schema has `idFingerprint` for future use)
- Role enforcement: server-side only — never trust client-passed role
- Public complaint view: masks description and location for non-owners
- Public community map: uses an explicit Prisma `select` (fixed 2026-09-17 — previously leaked `internalNotes`, `citizenId`, etc. via `include`)
- File uploads: Cloudinary — files never stored on server; `uploadFileToCloudinary` requires auth (fixed 2026-09-17)
- Internal-only actions (`emailActions.ts`) are not `'use server'` and cannot be called from the client (fixed 2026-09-17 — see §12)
- Audit log: every complaint creation logged to `AuditLog` table
- Middleware runs on all routes except static assets and `_next/*`
- `AUTH_SECRET` has no hardcoded fallback — app refuses to boot in production without it (fixed 2026-09-17)
- `demo_role` cookie bypass is off by default and cannot reach real DB-mutating actions even when enabled (fixed 2026-09-17 — see §5)
- `npm audit`: 2 low-severity findings remain, both nested in Next.js's own bundled `postcss`, requiring a Next 16 major upgrade to clear (deliberately deferred, see §12)

---

## 14. DEPLOYMENT

```bash
# 1. Set env vars on Vercel / Cloud Run (or .env.production) — AUTH_SECRET
#    is now mandatory in production, the app will not boot without it.
# 2. Apply pending migrations (includes the 2026-09-17 role enum addition)
npx prisma migrate deploy
# 3. Seed badges (one-time)
npx prisma db seed
# 4. Build
npm run build
# 5. Deploy
vercel --prod  # or Google Cloud Build for Cloud Run deployment
```

`npx prisma db push` (schema-sync without migration history) still works for
a scratch/dev database, but prefer `migrate deploy` for any database that
already has data — `db push` doesn't apply the migrations directory.

### Build & Deployment Notes
- **ESLint Checks**: ESLint warnings/errors are ignored during the production build step (`eslint: { ignoreDuringBuilds: true }` in `next.config.ts`) to prevent non-blocking style/unused-var issues from breaking Google Cloud Build pipelines.
- `export const dynamic = 'force-dynamic'` is set on pages with real-time DB data — prevents stale static builds.
- Map page uses `dynamic()` import — handled correctly by SSR and Next.js.
- Prisma needs `DATABASE_URL` at build time for type generation.
- `npm install`/`npm ci` need `--legacy-peer-deps` (see the Dockerfile) — `next-auth@5.0.0-beta.25` peer-requests `nodemailer@^6.6.5` while the project uses `nodemailer@^9.x`; this is a pre-existing mismatch, not something introduced by the 2026-09-17 dependency bump.

---

## 15. DEPENDENCY MAP

```
page.tsx (server)
  └── auth() ← auth.ts ← NextAuth ← prisma.ts ← PostgreSQL
  └── serverAction() ← lib/actions/*.ts ← prisma.ts
  └── ClientComponent.tsx (client)
        └── serverAction() via "use server" import
        └── communityActions.ts → awardPoints() → checkAndAwardBadges()

AI Chain:
  legal-assistant.ts → GoogleGenerativeAI (direct)
  complaint-analysis.ts → runAiTask() → lib/ai.ts → GoogleGenerativeAI
  ai-actions.ts → runAiTask() → lib/ai.ts → GoogleGenerativeAI

Map Chain:
  community-map/page.tsx → getPublicComplaintsForMap() → prisma.complaint.findMany()
  CommunityMapClient.tsx (client) → Leaflet → Esri tile server (external)

Auth Chain:
  middleware.ts → NextAuth(authConfig).auth → JWT verification
  Server actions → auth() → JWT decode → user.id, user.role
```

---

## 16. FILE MODIFICATION RISK MAP

| File | Risk Level | Why |
|---|---|---|
| `prisma/schema.prisma` | 🔴 HIGH | Any change needs migration + client regen |
| `src/auth.ts` | 🔴 HIGH | Breaks all auth if misconfigured |
| `src/lib/ai.ts` | 🟡 MEDIUM | Model names affect all AI features |
| `src/lib/actions/complaintActions.ts` | 🟡 MEDIUM | Core business logic |
| `src/lib/actions/communityActions.ts` | 🟡 MEDIUM | Points + badges tightly coupled |
| `src/middleware.ts` | 🟡 MEDIUM | Wrong matcher = broken auth |
| `src/styles/globals.css` | 🟢 LOW | Visual only, CSS vars used everywhere |
| `src/app/*/page.tsx` | 🟢 LOW | Individual pages, isolated |

---

## 17. QUICK COMMANDS

```bash
# Dev
npm run dev

# Reset .next cache (Windows)
Remove-Item -Recurse -Force .next && npm run dev

# DB
npx prisma migrate deploy   # apply pending migrations (use this, not db push, once the DB has real data)
npx prisma db push          # schema-sync without migration history — fine for a scratch/dev DB only
npx prisma db seed          # seed badges
npx prisma studio           # visual DB browser

# Build check
npm run build

# Make user an officer (via psql)
UPDATE "User" SET role = 'OFFICER', department = 'Roads & Infrastructure' WHERE email = 'officer@example.com';
```

---

## 18. CONVENTIONS

- All server actions start with `'use server'`
- All server actions return `{ success: boolean, error?: string, data?: any }`
- Prisma singleton via `globalThis.prisma` (prevents connection pool exhaustion in dev HMR)
- CSS Modules for all styling — no Tailwind, no styled-components
- Brand colors: Navy `#123B69`, Saffron `#F4A261`
- Tracking ID format: `VDK-YYYY-XXXXXXXX` (8 hex chars)
- Citizen ID format: `VK-YYYY-XXXXX` (stored in `citizenId` or generated on profile)
