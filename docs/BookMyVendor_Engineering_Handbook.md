# BookMyVendor — CTO Engineering Handbook v1.0

---

## Engineering Principles

- **Simplicity:** Prefer the boring, well-understood solution. A modular monolith beats microservices at MVP scale — complexity should be earned by real load, not anticipated.
- **Scalability:** Design so the *data model* and *API contracts* can scale even if the *deployment* doesn't need to yet — schema and API mistakes are expensive to fix later; deployment topology is cheap to change later.
- **Security:** Never optional, never "phase 2" — auth, input validation, and payment handling are correct from commit one.
- **Maintainability:** Code is read far more than written; optimize for the next developer (including future-you) understanding it in 6 months.
- **Performance:** Measure before optimizing. No premature optimization; do profile real bottlenecks once they exist.
- **Testability:** If it's hard to test, it's probably poorly designed — testability is a design-quality signal, not just a QA concern.
- **Developer experience:** Fast local setup, fast feedback loops (build/test times), clear error messages — DX debt compounds into velocity loss.
- **Documentation:** Code explains *how*; docs explain *why*. Both are required, neither substitutes for the other.
- **Backward compatibility:** Never break a live API contract without versioning — mobile/frontend clients can't always update instantly.
- **Observability:** You cannot fix what you cannot see — logging, metrics, and tracing are part of the feature, not an afterthought.

---

## Architecture Decision Records (ADRs)

**Why Modular Monolith for MVP?** A single deployable Spring Boot application with clear internal package boundaries (vendor, event, booking, payment, chat) gets 90% of microservices' maintainability benefits (clear domain separation) without the operational cost (service discovery, distributed tracing, network failure modes) that a solo/small team cannot support at MVP scale.

**When to adopt microservices:** Only when a specific domain has genuinely different scaling needs than the rest (e.g., chat/notifications under much higher load than bookings) AND a dedicated team/on-call capacity exists to operate the added complexity. Not before ~100K users, and not just because it's "the right way" — extract one service at a time, driven by a real, measured bottleneck.

**Why PostgreSQL:** Strong relational integrity guarantees fit the marketplace's core entities (bookings, payments, quotations all have strict relational/transactional needs); PostGIS extension covers geo-search without a separate system; mature, well-supported on every cloud/free-tier host.

**Why React:** Team's existing familiarity (per background), massive ecosystem, straightforward hiring pool for future team growth.

**Why Spring Boot:** Team's existing familiarity, mature ecosystem for exactly this kind of CRUD-heavy, transaction-heavy backend, strong Spring Security/Spring Data JPA support reduces boilerplate for auth and persistence.

**Why Redis:** Single tool covering caching, session/rate-limit counters, and pub/sub notifications — avoids introducing 3 separate MVP-stage tools for what one does adequately at this scale.

**Why Cloudinary:** Managed image/video storage + transformation (resizing, format conversion) out of the box — building this yourself on raw S3 at MVP stage is wasted effort.

**Why Razorpay:** India-specific payment gateway with built-in payout/route features that avoid needing your own Payment Aggregator license for the escrow-style flow (see Legal sections in prior blueprints) — this is a compliance decision as much as a technical one.

**Why REST APIs (not GraphQL at MVP):** Simpler mental model, better tooling maturity for a small team, and the API surface (defined, bounded set of resources) doesn't yet need GraphQL's flexible querying — reconsider only if frontend teams grow and over-fetching/under-fetching becomes a measured pain point.

**Future GraphQL consideration:** Revisit if/when multiple client types (web, mobile, partner API) have significantly different data needs from the same resources — not before.

**Future event-driven architecture:** Already partially present via Redis pub/sub for notifications (MVP); expand to Kafka/SQS only when queue volume or reliability requirements (guaranteed delivery, replay) exceed what Redis pub/sub provides.

---

## Repository Strategy

**Recommendation: Polyrepo** (separate `bookmyvendor-backend` and `bookmyvendor-frontend` repos) for MVP — simpler CI/CD per repo, cleaner deploy independence (frontend to Vercel, backend to Render), and monorepo tooling overhead (Nx/Turborepo) isn't justified until there are multiple frontend apps or shared internal packages.

**Naming convention:** `bookmyvendor-<component>` (e.g., `bookmyvendor-backend`, `bookmyvendor-frontend`, `bookmyvendor-admin` if admin becomes a separate app later).

**Backend directory structure:**
```
bookmyvendor-backend/
├── src/main/java/com/bookmyvendor/
│   ├── config/          # Security, CORS, Swagger, Redis config
│   ├── vendor/           # domain package
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── dto/
│   │   ├── mapper/
│   │   └── entity/
│   ├── event/
│   ├── booking/
│   ├── payment/
│   ├── chat/
│   ├── auth/
│   ├── admin/
│   ├── common/          # shared exceptions, base entities, utils
│   └── BookMyVendorApplication.java
├── src/main/resources/
│   ├── application.yml
│   └── db/migration/    # Flyway migrations
├── src/test/java/...
└── docker-compose.yml
```

**Frontend directory structure:**
```
bookmyvendor-frontend/
├── src/
│   ├── features/         # feature-based, not type-based
│   │   ├── vendor-search/
│   │   ├── event-creation/
│   │   ├── quotations/
│   │   ├── booking/
│   │   ├── chat/
│   │   └── vendor-dashboard/
│   ├── components/        # shared/reusable UI components
│   ├── hooks/              # shared custom hooks
│   ├── services/           # API client layer
│   ├── lib/                # utilities, constants
│   ├── routes/
│   └── App.tsx
```

---

## Backend Architecture

**Package-by-domain, not package-by-type** (as shown above) — keeps related controller/service/repository/dto together per feature, reduces cross-navigation, and makes future service extraction easier since domains are already isolated.

**Layer rules:**
- **Controller:** HTTP concerns only — request/response mapping, status codes, no business logic. Delegates immediately to service layer.
- **Service:** All business logic lives here. Transaction boundaries (`@Transactional`) defined at this layer, not in repositories or controllers.
- **Repository:** Spring Data JPA interfaces only — no business logic, custom queries via `@Query` when needed, named clearly (`findByVendorIdAndStatus`, not generic `findX`).
- **DTO:** Never expose JPA entities directly over the API — always map to DTOs. Separate `RequestDTO` and `ResponseDTO` even when similar, since request/response validation needs diverge over time.
- **Mapper:** Use MapStruct for entity↔DTO mapping — avoid manual mapping boilerplate and its associated bugs.
- **Validation:** Bean Validation annotations (`@NotNull`, `@Size`, `@Valid`) on DTOs for structural validation; business-rule validation (e.g., "event date must be future") in the service layer, throwing domain-specific exceptions.
- **Utility classes:** Stateless, static methods only, one clear responsibility per utility class — avoid "UtilityDumpingGround" anti-pattern.
- **Exception handling:** Global `@ControllerAdvice` mapping domain exceptions to consistent HTTP error responses (see API Standards below).
- **Logging:** SLF4J with structured (JSON in production) output; log at service-layer boundaries (entry with key params, exit with result summary, never full PII).
- **Audit strategy:** Every state-changing operation on `bookings` and `payments` writes to an append-only audit table (`booking_status_history`, `payment_audit_log`) — required for dispute resolution, not optional.

---

## Frontend Architecture

- **Folder structure:** Feature-based (shown above), not type-based (`components/`, `pages/`, `hooks/` scattered globally) — features should be near-independently deletable/movable.
- **Component organization:** Presentational components (pure UI, props-in) separated from container components (data-fetching, state) within each feature folder.
- **Hooks:** Feature-specific hooks live in the feature folder (`features/booking/hooks/useBookingFlow.ts`); only truly cross-cutting hooks (`useDebounce`, `useLocalStorage`-equivalent-in-memory-state) go in the shared `hooks/` folder.
- **Services (API layer):** One API client module per domain (`vendorApi.ts`, `bookingApi.ts`), all using a shared base Axios/fetch instance with interceptors for auth token attachment and 401 handling.
- **State management:** React Query (TanStack Query) for server state (API data, caching, refetching) — do NOT duplicate server state into Redux/Zustand. Use lightweight client state (Zustand) only for genuinely client-only state (UI toggles, multi-step form state).
- **Protected routes:** Route-level guard component checking auth state + role, redirecting unauthenticated/unauthorized users — never rely on hiding UI elements alone for security (backend must enforce regardless).
- **Lazy loading:** Route-based code splitting via `React.lazy` + `Suspense` for each major feature route — keeps initial bundle small.
- **Error boundaries:** Top-level and per-major-route error boundaries to prevent a single component crash from white-screening the whole app.
- **Code splitting:** Beyond route-based, split heavy dependencies (chart libraries, map libraries) into dynamic imports loaded only when the relevant view renders.

---

## Coding Standards

**Backend:**
- SOLID, DRY, KISS, YAGNI as default mindset — but pragmatically: don't abstract prematurely for a single use case (a common junior-developer over-engineering trap)
- Prefer composition over inheritance; favor small, focused classes over large multi-responsibility ones
- Naming: `camelCase` for methods/variables, `PascalCase` for classes, `UPPER_SNAKE_CASE` for constants, package names lowercase no underscores
- Java style: follow Google Java Style Guide conventions unless project-specific override is documented
- Watch for code smells: long methods (>30–40 lines is a refactor signal), large classes, feature envy, duplicate code, deep nesting (>3 levels — use early returns/guard clauses)

**Frontend:**
- Functional components + hooks only, no class components
- Component files: `PascalCase.tsx` matching component name; hook files: `useCamelCase.ts`
- One component per file, co-located styles/tests
- TypeScript: no `any` without an explicit justifying comment; prefer `interface` for props, `type` for unions/utility types; strict mode enabled in `tsconfig`
- Reusability: extract a shared component only after the 2nd–3rd real duplication, not preemptively (YAGNI applies to frontend too)

---

## Database Standards

- **Naming:** `snake_case` table and column names, plural table names (`vendors`, `bookings`), singular for join/junction tables named by relationship (`event_bookings`)
- **Primary keys:** UUID (not auto-increment integer) for all public-facing entities — avoids exposing sequential IDs that leak business volume information (e.g., "booking #4521" reveals booking count)
- **Foreign keys:** Always explicitly defined with `ON DELETE` behavior considered per relationship (e.g., `RESTRICT` on payment references, `CASCADE` only where genuinely safe)
- **Indexing:** Index all foreign keys by default; add composite indexes based on actual query patterns observed via `EXPLAIN ANALYZE`, not speculatively
- **Transactions:** Wrap multi-step writes (e.g., booking confirmation + payment record creation) in a single `@Transactional` service method — never split across separate uncommitted calls
- **Soft delete:** `deleted_at TIMESTAMP NULL` column on `events`, `bookings`, `vendor_profiles` — application-layer filters exclude soft-deleted rows by default (via JPA `@Where` or repository-level filtering)
- **Audit columns:** Every table gets `created_at`, `updated_at` at minimum; sensitive/financial tables also get `created_by`, `updated_by`
- **Migration strategy:** Flyway for all schema changes — every change is a numbered, version-controlled SQL migration file, never manual production schema edits
- **Backup/restore strategy:** Automated daily backups (managed by hosting provider — Render/RDS both support this) with tested restore procedure documented and actually rehearsed at least once before production launch, not just assumed to work

---

## API Standards

- **REST naming:** Plural nouns, resource-based paths (`/api/v1/vendors/{id}/quotations`, not `/api/v1/getVendorQuotations`)
- **Versioning:** URL-based (`/api/v1/...`) — simplest to reason about and cache
- **Pagination:** `?page=0&size=20` query params, response includes `totalElements`, `totalPages`, `hasNext`
- **Filtering/sorting/searching:** Query params (`?category=photographer&sort=rating,desc&search=lucknow`), documented per endpoint in OpenAPI spec
- **Response structure (success):** `{ "data": {...}, "meta": {...} }`
- **Error response:** `{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [...] } }` — consistent shape across all endpoints
- **Status codes:** 200 (success), 201 (created), 204 (no content/delete), 400 (validation), 401 (unauthenticated), 403 (unauthorized), 404 (not found), 409 (conflict — e.g., double-booking), 429 (rate limited), 500 (server error)
- **Idempotency:** Payment-initiating endpoints require an `Idempotency-Key` header to prevent duplicate charges on retry
- **Rate limiting:** Redis-backed, per-user and per-IP, especially on auth and quotation-submission endpoints
- **API documentation:** OpenAPI/Swagger auto-generated from Spring Boot annotations (springdoc-openapi), kept in sync as a build-time check, not manually maintained separately

---

## Security Handbook

- **Authentication:** JWT access token (15 min expiry) + refresh token (httpOnly cookie, 7–30 days), refresh endpoint rotates both
- **Authorization/RBAC:** Role claim in JWT (`customer`/`vendor`/`admin`), enforced via Spring Security method-level annotations (`@PreAuthorize`) on every protected endpoint — never rely on frontend route guards alone
- **Password hashing:** BCrypt, never custom hashing, never reversible encryption for passwords
- **Input validation:** Every DTO validated server-side regardless of frontend validation (frontend validation is UX, not security)
- **SQL injection prevention:** JPA/parameterized queries only — never string-concatenated native queries
- **XSS prevention:** React's default JSX escaping handles most cases; sanitize any `dangerouslySetInnerHTML` use (should be rare/absent); backend sanitizes any user text rendered elsewhere (e.g., admin panel viewing chat logs)
- **CSRF:** Not required for pure JWT-bearer-token APIs (no cookie-based session), but if refresh token cookie is used, apply SameSite=Strict + CSRF token on state-changing requests
- **File upload security:** Type/size validation, virus scanning (ClamAV or cloud-native scanning) on KYC/portfolio uploads, files routed through Cloudinary rather than stored on app servers directly
- **Secrets management:** Environment variables at MVP (never committed to git — `.env` in `.gitignore` from commit #1), migrate to a secrets manager at production scale
- **Encryption:** TLS everywhere (HTTPS only, HSTS header), sensitive PII (KYC document references) encrypted at rest if stored beyond Cloudinary's own security
- **Secure headers:** `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options` set via Spring Security config
- **Audit logs:** Login events, admin actions, payment state changes all logged immutably
- **OWASP Top 10:** Use as a literal pre-launch checklist, not a vague reference
- **Fraud prevention (MVP-realistic):** Rule-based flags only (multiple accounts per device, rapid signup patterns, mismatched payout details) — full ML fraud detection is post-MVP (per prior blueprint's enterprise-tier flagging)

---

## Performance Guidelines

- **Query optimization:** `EXPLAIN ANALYZE` on any query touching booking/vendor search paths before shipping; avoid N+1 queries via JPA fetch joins or `@EntityGraph`
- **Caching:** Redis cache on vendor search results (short TTL ~60s), vendor profile reads; explicit cache invalidation on writes, not just TTL-expiry reliance
- **Lazy loading:** JPA lazy-load associations by default; explicit eager fetch only where a query pattern proves it's needed
- **Connection pooling:** HikariCP (Spring Boot default) tuned to realistic concurrent load, not left at arbitrary defaults once real traffic exists
- **Async processing:** Non-critical-path work (sending notification emails, AI API calls) dispatched via `@Async` or queue, never blocking the main request thread
- **Batch processing:** Any bulk operation (e.g., nightly trust-score recalculation) run as a scheduled batch job, not per-request computation
- **Pagination:** Mandatory on every list endpoint — no unbounded result sets, ever
- **Image optimization:** Cloudinary auto-transformation (responsive sizes, WebP conversion) rather than serving original uploads directly
- **CDN:** Static frontend assets + Cloudinary media both served via CDN (Vercel's built-in CDN + Cloudinary's own)
- **Load testing:** k6 or JMeter run against staging before major launches/marketing pushes — don't discover capacity limits in production during a traffic spike

---

## DevOps Handbook

- **Docker:** Every service containerized from day one (`Dockerfile` per repo), `docker-compose.yml` for local dev spinning up Postgres + Redis alongside the app
- **CI/CD (GitHub Actions):** On PR — lint, unit test, build. On merge to `main` — additionally deploy to staging automatically; production deploy is a manual-approval gated step
- **Environment management:** Separate `.env` configs for dev/staging/production, never shared credentials across environments
- **Secrets management:** GitHub Actions secrets for CI, Render/Vercel environment variable dashboards for runtime — never in code or committed config files
- **Branching strategy:** Trunk-based development with short-lived feature branches (see Git section below)
- **Release strategy:** Deploy small, frequent changes rather than large infrequent releases — reduces blast radius of any single deploy
- **Blue-green deployment:** Future consideration once traffic justifies zero-downtime deploy tooling (Render/most PaaS handle basic rolling deploys adequately at MVP scale)
- **Rollback strategy:** Every deploy tagged with a version; rollback = redeploy previous tagged image, should be a documented, tested one-command action
- **Backup automation:** Scheduled, automated, alerting on failure — a backup nobody verifies is not a backup

---

## Monitoring & Observability

- **Structured logging:** JSON logs with correlation IDs, shipped to a log aggregator (even free-tier options like Render's built-in logs or a Grafana Loki free tier)
- **Metrics:** Spring Actuator + Micrometer exposing request latency, error rate, JVM metrics
- **Tracing:** OpenTelemetry instrumentation once request flows cross multiple internal service calls (not critical at monolith MVP stage, but instrument early so it's ready when needed)
- **Health checks:** `/actuator/health` endpoint, used by hosting platform for auto-restart on failure
- **Alerts:** Error rate spike, payment failure spike, and KYC-queue-backlog alerts at minimum, routed to a channel someone actually monitors (Slack/email/WhatsApp — pick one that will actually get seen)
- **Error monitoring:** Sentry (generous free tier) for exception tracking with stack traces and user context
- **Uptime monitoring:** External uptime checker (UptimeRobot free tier) — don't rely solely on internal metrics to know the site is down
- **Incident response:** Even solo/small-team, document a basic runbook: what to check first (health endpoint, recent deploys, error monitor), who/how to roll back
- **SLOs/SLAs:** Internal SLO target (e.g., 99.5% uptime, p95 API latency <300ms) drives engineering priority; formal customer-facing SLA only relevant once there are paying enterprise/corporate customers with contractual expectations

---

## Testing Strategy

- **Unit testing:** Service-layer business logic is the priority target — JUnit5 + Mockito for backend, Vitest/React Testing Library for frontend
- **Integration testing:** Spring Boot `@SpringBootTest` with Testcontainers (real Postgres in a container, not H2 in-memory, to catch real SQL/dialect issues)
- **API testing:** Contract-level tests against actual endpoints (RestAssured or Postman/Newman collections run in CI)
- **End-to-end testing:** Playwright covering the critical happy paths only at MVP (signup → create event → get quotation → book → pay) — don't try to E2E-test every edge case, that's what unit/integration tests are for
- **Security testing:** OWASP ZAP baseline scan in CI as a lightweight automated check
- **Performance testing:** k6 scripts for the search and booking endpoints specifically (highest-traffic, highest-stakes paths)
- **Test coverage goals:** Realistic target 70–80% on service-layer business logic, not a blanket 100% mandate (100% coverage on trivial getters/DTOs is wasted effort)
- **Test data strategy:** Factory/builder pattern for test entity creation, seeded test database for integration tests, never test against production data

---

## Git & Collaboration Standards

**Recommendation: Trunk-based development** with short-lived feature branches (merged within 1–3 days) — appropriate for a small team/solo developer where long-lived Git Flow branches (develop/release/hotfix) add process overhead without a team large enough to need that isolation.

- **Branch naming:** `feature/vendor-availability-calendar`, `fix/booking-double-payment-bug`, `chore/update-dependencies`
- **Conventional commits:** `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:` prefixes — enables automated changelog generation later
- **PR template:** What changed, why, how tested, screenshots (for UI changes), linked issue/ticket
- **Code review checklist:** Does it follow layer rules (Backend Architecture section)? Are there tests? Any security concern (auth, input validation, secrets)? Is the DB migration reviewed separately if present?
- **Merge rules:** Squash-merge to keep `main` history clean, require at least a self-review checklist pass if solo, require 1 reviewer once a team exists
- **Release tagging:** Semantic versioning (`v1.2.0`) tagged on every production deploy
- **Versioning strategy:** MAJOR.MINOR.PATCH — major for breaking API changes, minor for new features, patch for fixes

---

## Documentation Standards

Mandatory per feature: updated OpenAPI/Swagger spec (auto-generated, verify it's accurate), a brief note on any DB schema change (what changed, why, migration file reference), an ADR entry if an architectural decision was made (not every feature needs one — only genuine decisions with tradeoffs), a changelog entry, and release notes for anything user-facing. Sprint notes (what shipped, what's blocked, what's next) kept lightweight — a paragraph, not a report, especially for a solo/small team where the audience is mostly future-you.

---

## Sprint Execution Framework

**Sprint 0 (Setup, 1 week):** Repo setup, CI/CD skeleton, local dev environment (docker-compose), base Spring Boot + React scaffolding, DB schema migration #1 (core tables). *DoD:* a developer can clone both repos and have a working local environment in under 30 minutes.

**Sprint 1–2 (Auth):** Registration, login, JWT + refresh flow, role-based route protection. *Deliverable:* a user can register and log in as customer or vendor. *DoD:* auth endpoints covered by integration tests; security checklist (password hashing, input validation) passed.

**Sprint 3–4 (Vendor profile + KYC):** Vendor profile CRUD, portfolio upload (Cloudinary), KYC document upload + admin approval flow. *Risk:* file upload security must be right from the start, not retrofitted.

**Sprint 5–6 (Event creation + matching):** Customer event creation, rule-based vendor matching (category + location + budget). *Dependency:* requires vendor profiles from Sprint 3–4 to have real data to match against.

**Sprint 7–8 (Quotation flow):** Vendor quotation submission, customer comparison view. *DoD:* end-to-end quotation flow covered by an E2E test.

**Sprint 9–10 (Chat + notifications):** WebSocket chat scoped to bookings/quotations, Redis pub/sub notification dispatch. *Risk:* WebSocket infrastructure is new territory if the team hasn't built real-time features before — budget extra time.

**Sprint 11–12 (Payments):** Razorpay integration, advance payment, booking confirmation, idempotency handling. *Risk:* highest-stakes sprint — payment bugs are the most damaging class of bug. Extra testing time budgeted here specifically.

**Sprint 13–14 (Admin panel):** KYC approval queue, dispute console, basic analytics. *Dependency:* requires audit tables (booking_status_history) from earlier sprints to be populated correctly.

**Sprint 15–16 (Hardening + launch prep):** Load testing, security scan (OWASP ZAP), production readiness checklist (see CTO Final Review), soft-launch deploy.

Each sprint's **exit criteria**: all planned features pass their DoD, no known critical/high-severity bugs open, deployed to staging and manually verified.

---

## Engineering KPIs

| Metric | Why it matters |
|---|---|
| Deployment frequency | Higher frequency (small, frequent deploys) correlates with lower risk per deploy — a core DevOps Research (DORA) signal |
| Lead time (commit → production) | Measures how much friction exists in the delivery pipeline; long lead times hide problems longer |
| Change failure rate | % of deploys causing an incident — the real quality signal, more honest than test coverage alone |
| MTTR (Mean Time to Recovery) | How fast the team detects and fixes production issues — matters more than "never having incidents," which is unrealistic |
| Bug escape rate | Bugs found in production vs. caught pre-release — measures test suite effectiveness |
| Test coverage | Directional signal for untested code risk, not a target to game |
| API response time (p50/p95/p99) | User-facing performance; p95/p99 matter more than average since they represent the worst real experiences |
| Database query performance | Slow queries are the most common root cause of production performance incidents in CRUD-heavy apps like this |
| Uptime | Direct trust impact — a booking platform going down during a payment attempt is a severe trust violation, not just downtime |

---

## Technical Debt Policy

**What qualifies:** Any shortcut taken under time pressure that a developer would fix "if there were more time" — a skipped test, a hardcoded value that should be configurable, a missing index found via slow-query logs, a TODO comment that's been there more than one sprint.

**How tracked:** A dedicated `tech-debt` label on GitHub issues, reviewed at the start of each sprint planning session — not left invisible in code comments alone.

**When fixed:** Debt directly touching security or payment correctness is fixed immediately, not scheduled. Debt affecting only internal velocity/maintainability is scheduled — a reasonable default is allocating roughly 15–20% of each sprint's capacity to debt paydown, rather than letting it accumulate indefinitely until a dedicated "cleanup sprint" that rarely actually happens.

**Who approves exceptions:** For a solo/small team, this is a self-discipline practice — write the debt down even when there's no one else to approve the exception, since future-you needs the same context a teammate would.

---

## AI Development Guidelines

- **Prompt management:** Treat prompts used to generate significant code as worth keeping (in a `prompts/` reference folder or PR description) — reproducibility matters if the code needs regenerating or debugging later
- **Human review requirement:** Every AI-generated code change gets the same review scrutiny as human-written code — no exception for "the AI wrote it, so it's probably fine." AI-generated code is a first draft, not a merge-ready artifact.
- **Security considerations:** Never paste real secrets, customer PII, or KYC data into AI tool prompts, even internal ones — treat AI chat history as effectively non-confidential
- **Code ownership:** The developer who committed AI-assisted code owns it fully — "the AI generated it" is never an acceptable explanation for a bug in review or in production
- **Documentation expectations:** AI-assisted code follows the exact same documentation standards as any other code — no lower bar because it was faster to produce

---

## Future Architecture Roadmap

| Phase | User scale | Architecture | Infra | Database | Search | Caching | Deployment |
|---|---|---|---|---|---|---|---|
| **Phase 1 — MVP** | 0–10K | Modular monolith | Single Render instance + Vercel frontend | Single Postgres instance | Postgres `tsvector` + PostGIS | Redis (single instance) | Docker + manual/simple CI/CD |
| **Phase 2 — 100K users** | 10K–100K | Still monolith, extract chat/notifications only if measured bottleneck | Multiple app instances behind load balancer | Postgres + read replica | Same, monitor for strain | Redis (managed, e.g., ElastiCache) | Blue-green or rolling deploys |
| **Phase 3 — 1M users** | 100K–1M | Selective microservice extraction (payment, search) based on proven bottlenecks | Auto-scaling app tier, multi-AZ | Read replicas + consider partitioning high-volume tables (payments, messages) | Elasticsearch introduced | Redis cluster | Kubernetes consideration begins |
| **Phase 4 — 10M+ users** | 1M+ | Full microservices where justified, event-driven backbone (Kafka) | Multi-region, Kubernetes-orchestrated | Sharding by city/region, dedicated read/write scaling | Elasticsearch cluster, hybrid semantic search | Distributed cache tier | Full CI/CD with canary releases, multi-region deploy |

**Important honest framing:** Phases 3–4 describe infrastructure appropriate for a company with real funding and a real engineering team — they are documented here for roadmap completeness, not as near-term implementation targets. Building Phase 3/4 infrastructure at Phase 1 user counts is the single most common and costly architecture mistake early-stage teams make.

---

## CTO Final Review

**1. Top engineering risks:** Payment/booking correctness bugs (highest-stakes class); solo-developer bus factor (no one else understands the system if something happens to the one developer); scope creep from the 77 sections of prior product/business blueprints leaking into "must-build-now" engineering scope instead of the phased roadmap they're meant to be.

**2. Biggest architectural mistakes to avoid:** Building microservices before there's a team to operate them; building the full event-driven Kafka topology at MVP scale; premature Elasticsearch adoption before Postgres full-text search actually becomes a bottleneck; skipping the audit/history tables early because "we'll add them later" (this data can't be retroactively reconstructed once it's missing).

**3. Features that should NOT be over-engineered in MVP:** AI recommendation/matching (start with the weighted-formula version, not ML), fraud detection (rule-based flags, not ML), search (Postgres, not Elasticsearch), notifications (Redis pub/sub, not Kafka), microservices generally.

**4. Recommended engineering culture:** Bias toward shipping small, tested, reviewed changes over large infrequent ones; treat production incidents as learning opportunities (blameless retro even if it's a retro with yourself); prioritize the boring, well-tested solution over the impressive-sounding one.

**5. Recommended documentation culture:** Write the "why" down at decision time, not retroactively — ADRs are cheap to write in the moment and expensive to reconstruct later from memory.

**6. Top 50 engineering rules** (condensed to the most load-bearing ones, grouped):

*Architecture:* (1) Modular monolith until a measured bottleneck says otherwise. (2) Package by domain, not by type. (3) Never expose JPA entities directly over the API. (4) Business logic lives in services, nowhere else. (5) One clear owning table per entity.

*Security:* (6) Validate everything server-side regardless of frontend validation. (7) Never commit secrets. (8) Every protected endpoint has an explicit authorization check. (9) Hash passwords with BCrypt, never anything else. (10) Rate-limit auth and payment endpoints.

*Database:* (11) Every schema change is a Flyway migration, never a manual edit. (12) UUID primary keys on public entities. (13) Soft delete on financial/booking-related tables. (14) Index foreign keys by default. (15) Wrap multi-step writes in transactions.

*API:* (16) Consistent error response shape everywhere. (17) Paginate every list endpoint. (18) Version the API from day one. (19) Idempotency keys on payment-initiating endpoints. (20) Document via OpenAPI, kept in sync automatically.

*Testing:* (21) Service-layer logic is always unit tested. (22) Integration tests use real Postgres via Testcontainers, not H2. (23) E2E tests cover happy paths only, not every edge case. (24) No PR merges without passing CI. (25) Test coverage target is directional (70–80%), not a religious 100%.

*Git:* (26) Trunk-based, short-lived branches. (27) Conventional commit messages. (28) Every PR has a description explaining why, not just what. (29) Squash-merge to keep history clean. (30) Tag every production release.

*Performance:* (31) No query ships without checking `EXPLAIN ANALYZE` if it touches a hot path. (32) Cache with explicit invalidation, not just TTL hope. (33) Async dispatch for anything not required in the immediate response. (34) Never return unbounded result sets. (35) Optimize images via Cloudinary transforms, not raw uploads.

*Observability:* (36) Structured JSON logs in production. (37) Never log secrets or full PII. (38) Every service has a health check endpoint. (39) Alerts route somewhere someone actually watches. (40) Correlation IDs on every request for traceability.

*Process:* (41) Technical debt is written down, not just remembered. (42) 15–20% of sprint capacity reserved for debt paydown. (43) AI-generated code gets the same review rigor as human code. (44) No secrets/PII pasted into AI tool prompts. (45) ADRs written at decision time, not retroactively.

*Discipline:* (46) MVP scope is the phased roadmap's Phase 1 only — resist building Phase 3/4 infrastructure early. (47) Ship small, frequent changes over large infrequent ones. (48) Every feature has a Definition of Done before it's started, not decided after. (49) Rollback procedure is tested, not assumed. (50) When in doubt, choose the boring, well-understood solution.

**7. Production readiness checklist:**
- [ ] All critical/high-severity bugs resolved
- [ ] Payment flow tested end-to-end in Razorpay test *and* live mode with a real small transaction
- [ ] Backups automated and restore procedure actually tested once
- [ ] Security checklist (OWASP Top 10) reviewed
- [ ] Rate limiting active on auth/payment endpoints
- [ ] Error monitoring (Sentry) and uptime monitoring (UptimeRobot) live
- [ ] Health check endpoint wired to hosting platform's auto-restart
- [ ] Load test run against expected launch-day traffic estimate
- [ ] Legal docs (Terms, Privacy Policy, Refund/Cancellation Policy) published and linked
- [ ] KYC approval flow manually verified with a real test vendor
- [ ] Rollback procedure documented and tested
- [ ] Admin has access to dispute resolution tools before first real booking, not after

**8. Engineering architecture score: 8/10.** The proposed architecture is genuinely sound and appropriately scoped for MVP — modular monolith, boring proven tech stack, clear layer separation, and (importantly) explicit deferral of premature-scale infrastructure. It loses points not on design quality but on the same theme running through every document in this series: the handbook is comprehensive enough to support a multi-developer team, and the actual team is one person. **Recommendation for continuous improvement:** the highest-leverage next step isn't more architecture documentation — it's using Sprint 0–2 of this very handbook to build the concierge-MVP-validated narrow feature set (per the GTM blueprint's Top 20 actions), and treating everything from Sprint 9 onward (chat, payments, admin panel) as work to start only once Sprints 1–8's core flow has been used by real people.
