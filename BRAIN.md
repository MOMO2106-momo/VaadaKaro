# 🧠 BRAIN.md — VaadaKaro Single Source of Truth

> For any AI agent or developer: read this before touching anything.
> Last updated: June 2026

---

## 1. WHAT IS VAADAKARO

**VaadaKaro** ("Vaada" = Promise, "Karo" = Do It) is a hyperlocal civic accountability platform for India.

Citizens file grievances (potholes, water leakage, broken lights), track resolution, verify each other's complaints, and earn gamification rewards. Officers manage and resolve complaints. AI assists with legal guidance and complaint quality analysis.

**It is NOT a social media app. It is a structured civic-tech system.**

---

## 2. TECH STACK

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSR + RSC for SEO and performance |
| Language | TypeScript 5 | Type safety across DB ↔ UI |
| Database | PostgreSQL + Prisma ORM 6.2 | Relational civic data with migrations |
| Auth | NextAuth v5 (JWT + Credentials) | Role-based, no raw session storage |
| AI | Google Gemini (`gemini-2.0-flash`) | Complaint analysis + legal chat |
| Maps | Leaflet + Esri satellite tiles | Free, no API key for satellite view |
| Storage | Cloudinary | Complaint photo evidence |
| Email | Nodemailer | Notifications (not yet fully wired) |
| Styling | Vanilla CSS Modules | Zero runtime overhead, scoped styles |
| Deployment | Vercel / Node.js | SSR-compatible |

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
├── role: CITIZEN | OFFICER | LAWYER | ADMIN
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

### Enums
```
UserRole:       CITIZEN | OFFICER | LAWYER | ADMIN
ComplaintStatus: SUBMITTED | UNDER_REVIEW | IN_PROGRESS | INFO_REQUESTED | RESOLVED | REJECTED
PriorityLevel:  LOW | MEDIUM | HIGH | URGENT
VoteType:       UPVOTE | DOWNVOTE
```

---

## 5. AUTHENTICATION & AUTHORIZATION

### How It Works
1. User logs in via Credentials (email + bcrypt password)
2. NextAuth creates a **JWT** (not database session — `strategy: "jwt"`)
3. JWT contains: `id`, `name`, `email`, `image`, `role`, `department`
4. `auth()` is called server-side in every action/page to get session
5. `middleware.ts` imports from `./auth.config` (Edge-safe configuration) to enforce auth at the Edge without loading Prisma (which crashes in Edge runtimes). It evaluates `isLoggedIn` using both `req.auth` and the `demo_role` cookie for quick test-bypasses.

### Route Protection & Split Config
- **`auth.config.ts`**: Edge-safe configuration containing general configuration, routes mapping, and callbacks (JWT, Session, Authorized). Contains no Prisma or bcrypt dependencies.
- **`auth.ts`**: Node.js-only NextAuth instance wrapper. Spreads `authConfig` and hooks up `PrismaAdapter(prisma)` and `Credentials` provider. Server components and API endpoints import from `@/auth`.
- **`middleware.ts`**: Wraps the `authConfig` with NextAuth middleware. Enforces route access rules on `/dashboard`, `/citizen`, `/officer`, `/admin`, and `/super-admin`. Supports quick-access bypasses via `demo_role` cookie check.

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
NEXTAUTH_SECRET="<random 32+ char string>"
NEXTAUTH_URL="http://localhost:3000"  # Change to production URL on deploy
GEMINI_API_KEY="<Google AI Studio key — starts with AQ.>"
```

Optional (for Cloudinary uploads):
```env
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

### Common Mistakes
- `NEXTAUTH_URL` must match the exact domain in production (no trailing slash)
- `GEMINI_API_KEY` starting with `AQ.` is valid — it's the new AI Studio format
- Missing `GEMINI_API_KEY` → genAI initializes with empty string → all AI calls return 403

---

## 12. KNOWN BUGS & TECHNICAL DEBT

| Bug | Location | Impact | Fix |
|---|---|---|---|
| History starts with 'model' role | `legal-assistant.ts` line 123 | Chat crashes on first message if bot welcome message is in history | Filter leading model messages: `.filter((_, i, arr) => !(i === 0 && arr[0].role === 'model'))` |
| `as any` session casts everywhere | All server actions | No TypeScript safety on user fields | Extend NextAuth `Session` type with custom fields |
| No latitude/longitude on submission | `complaintActions.ts` | Map shows no pins for new complaints | **[RESOLVED]** GPS Auto-Fill and manual pincode reverse geocoding added in Step 2. Coords are passed and stored in DB, updating community map instantly. |
| Nodemailer not wired | `notificationActions.ts` | Email notifications silent | Implement sendEmail() call after createNotification() |
| No rate limiting on votes/comments | `communityActions.ts` | Spam votes possible | Add Redis or DB-based rate limit (5 votes/min per user) |
| Duplicate action file paths | `src/actions/` vs `src/lib/actions/` | Confusion — two folders for actions | Consolidate into `src/lib/actions/` only |

---

## 13. SECURITY

- Passwords: bcrypt with salt rounds 12
- No raw Aadhaar/ID stored (hash only — schema has `idFingerprint` for future use)
- Role enforcement: server-side only — never trust client-passed role
- Public complaint view: masks description and location for non-owners
- File uploads: Cloudinary — files never stored on server
- Audit log: every complaint creation logged to `AuditLog` table
- Middleware runs on all routes except static assets and `_next/*`

---

## 14. DEPLOYMENT

```bash
# 1. Set env vars on Vercel / Cloud Run (or .env.production)
# 2. Push DB schema
npx prisma db push
# 3. Seed badges (one-time)
npx prisma db seed
# 4. Build
npm run build
# 5. Deploy
vercel --prod  # or Google Cloud Build for Cloud Run deployment
```

### Build & Deployment Notes
- **ESLint Checks**: ESLint warnings/errors are ignored during the production build step (`eslint: { ignoreDuringBuilds: true }` in `next.config.ts`) to prevent non-blocking style/unused-var issues from breaking Google Cloud Build pipelines.
- `export const dynamic = 'force-dynamic'` is set on pages with real-time DB data — prevents stale static builds.
- Map page uses `dynamic()` import — handled correctly by SSR and Next.js.
- Prisma needs `DATABASE_URL` at build time for type generation.

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
npx prisma db push          # sync schema to DB
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
