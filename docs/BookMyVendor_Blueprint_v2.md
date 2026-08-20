# BookMyVendor — Enterprise Blueprint Version 2.0
### (Formerly EventConnect v1.0 — renamed per project update)
### *"Find. Compare. Book Trusted Vendors."*

> **This is an addendum to, not a replacement of, the v1.0 blueprint (EventMarketplace_Blueprint.md).** All 57 original sections remain valid and unchanged. This document adds the 20 requested enterprise-tier enhancements on top, plus a final CTO-style design review.
>
> **One honest note before diving in, as your reviewing architect:** v1.0's final evaluation already concluded that a solo, part-time developer should narrow the MVP down (Section 11), not expand it. This v2.0 request adds 20 *more* substantial subsystems — several of which (fraud detection, ML-based trust scoring, event-driven microservice queues) are genuinely Series-A-funded-team-scope work, not pre-launch scope. I'm documenting all of it below as requested, since it's valuable to have the full enterprise picture for reference and long-term roadmap — but I'll flag in each section and in the Final CTO Review which parts are realistic pre-launch vs. which are "what this looks like at 10M users," so the two don't get conflated when you're actually deciding what to build next.

---

## V2.1 — Multi-Vendor Booking Engine

**Weakness in v1.0:** The original schema (Section 21) modeled one `booking` per accepted `quotation`, implicitly one-vendor-per-event. Real events (weddings especially) need 4–8 vendors booked independently but coordinated under one event.

**Architecture:**
- Introduce `event_bookings` as a **parent aggregator** over multiple `bookings` — one `event` can have many `event_bookings` entries, each linking to a separate vendor `booking`.
- Each vendor booking retains its own quotation, payment, and status lifecycle — vendors are paid/managed independently.
- A **Combined Event Dashboard** aggregates: total spend across all vendor bookings, per-vendor status (confirmed/pending/completed), shared event date/venue info visible to all booked vendors (for logistics coordination, not competitive info like other vendors' pricing).
- **Vendor coordination:** a shared read-only "event brief" (date, venue address, timing, guest count) auto-shared with all confirmed vendors on an event, reducing customer's manual coordination overhead.
- **Shared event timeline:** ties into V2.5 (Event Timeline Planner) — each vendor booking maps to a timeline milestone.

**New tables:** `event_bookings` (id, event_id, booking_id, vendor_role, status), plus a `event_briefs` table for the shared coordination data.

**Why this matters:** Without this, "wedding" as an event type is structurally broken in v1.0 — it can only really support single-vendor bookings (e.g., "book a photographer"), not full-event planning, which is the actual differentiator vs. single-category competitors.

---

## V2.2 — Vendor Availability Engine

**Weakness in v1.0:** Section 9 (vendor uploads "availability") and Section 21 (`vendor_profiles`) never defined availability as structured data — it was a text field, not a queryable calendar.

**Architecture:**
- New `vendor_availability` table: vendor_id, date, status (available/blocked/booked), time_slot_start, time_slot_end
- Recurring rules table `vendor_working_hours`: vendor_id, day_of_week, start_time, end_time, is_active — for vendors who work standard weekly hours (e.g., studios) vs. one-off blocked dates (e.g., personal holidays)
- **Double-booking prevention:** at quotation-acceptance time, a DB-level constraint (or application-level lock + check) verifies the date/slot is still open before finalizing `booking` status — critical because multiple customers may have pending quotation requests for the same vendor/date simultaneously
- **Conflict detection:** run as a validation step in the booking-confirmation service; reject with a clear error if the vendor's calendar changed between quotation and acceptance
- **Auto availability calculation:** derive a vendor's "available" badge on search results by checking `vendor_availability` for the customer's requested event date, not a static "available" flag on the profile

**Why this matters:** Without real scheduling, the "book" step is a leap of faith — this is table stakes for any Uber/Urban Company-style booking flow, not an enhancement.

---

## V2.3 — AI Vendor Recommendation Engine

**Realistic framing:** This is Phase 3+ in v1.0's roadmap (Section 34), and that phasing should stay. Below is the *design*, to be built once there's enough booking history data to make it meaningful — an ML recommendation system trained on near-zero data will just be a worse rule-based system.

**Smart Match Score components:**

| Factor | Weight (starting point) | Data source |
|---|---|---|
| Distance | 15% | Event location vs. vendor service radius |
| Budget compatibility | 20% | Vendor base_price vs. event budget_min/max |
| Rating | 15% | `reviews.rating` average |
| Response time | 10% | Time between quotation request and vendor response |
| Completion rate | 15% | % of accepted bookings marked completed (not cancelled) |
| Repeat customers | 10% | % of vendor's bookings from repeat customer_ids |
| Cancellation rate | 10% | % of confirmed bookings cancelled by vendor |
| Trust score (V2.4) | 5% | Composite trust score |

**AI workflow (MVP-realistic version):** Start as a weighted linear scoring formula (above), computed at query time or cached hourly — this alone outperforms pure filter-based matching and requires no ML infrastructure.

**Future ML version (post-traction):** Once sufficient booking outcome data exists (hundreds of completed bookings minimum), train a learning-to-rank model (e.g., gradient-boosted trees) using booking-acceptance and post-event satisfaction as the label, with the weighted factors above as features. This is not viable before real usage data exists — flagging clearly that attempting ML before data exists would be wasted effort.

---

## V2.4 — Vendor Trust Score

**Formula (0–100 scale), computed as a scheduled batch job, not real-time:**

```
TrustScore = 
  (ReviewQualityScore × 0.25) +
  (BookingSuccessRate × 0.20) +
  ((100 - CancellationRate) × 0.15) +
  ((100 - ComplaintRate) × 0.15) +
  (ProfileCompleteness × 0.10) +
  (KYCStatus × 0.10) +   // binary: 100 if verified, 0 if not
  (RepeatClientRate × 0.05)
```

- **ReviewQualityScore:** not just average star rating — weight recent reviews higher (recency-weighted average) and discount reviews from accounts with no verified booking (prevent fake reviews)
- **ProfileCompleteness:** % of profile fields filled (portfolio count, bio, pricing, certifications)
- Recompute nightly via scheduled job, cache on `vendor_profiles.trust_score`
- **Display:** show as a badge tier (Bronze/Silver/Gold/Platinum) rather than a raw number — raw scores invite gaming/disputes, tiers are more defensible and simpler for customers to interpret

**Why this matters over raw star rating alone:** Star ratings alone are gameable and don't capture reliability (cancellations, late arrivals) — the trust score is what actually protects the marketplace's core value proposition (Section 1: trust).

---

## V2.5 — Event Timeline Planner

**Architecture:** Template-driven, not AI-generated initially (AI Timeline Generator stays Phase 3+ per v1.0 Section 12/34).

- `timeline_templates` table: event_type, milestone_name, days_before_event, category (maps to vendor category), is_required
- On event creation, system clones the relevant template into `event_timeline_items` (event_id, milestone_name, due_date [calculated from event_date - days_before], status, linked_booking_id)
- As the customer books vendors (V2.1), matching timeline items auto-mark as "in progress" → "complete" when that vendor booking confirms
- Each event type (wedding, birthday, corporate, etc.) gets its own template — this is realistic to hand-author for the top 5–6 event types at MVP, not build as a dynamic AI system initially

**Example template (Wedding, illustrative — matches the flow in the original prompt):** Venue (180 days) → Photographer (150 days) → Caterer (120 days) → Makeup Artist (90 days) → Invitations (60 days) → Guest Confirmation (30 days) → Final Checklist (7 days)

---

## V2.6 — Package Builder

**Architecture:**
- `packages` table: vendor-agnostic "template" bundles (e.g., "Essential Wedding Package" = Venue + Photographer + Decorator) OR customer-built ad-hoc combinations
- **Pricing logic:** sum of individual vendor base prices, with an optional **bundle discount** if all vendors in the package are actually booked together (incentivized via a small platform-funded discount, not vendor-margin-funded, to avoid vendor pushback)
- Two builder modes: (1) **Platform-curated packages** — admin/algorithm assembles popular combinations as a one-click starting point, (2) **Custom builder** — customer drag-and-drop selects vendors into their own package, system calculates running total live
- This ties directly into V2.1's multi-vendor booking engine — a package is essentially a pre-filled set of `event_bookings`

---

## V2.7 — Vendor CRM

**Pipeline stages:** Lead → Quotation Sent → Negotiation (chat-based) → Booked → Completed → Repeat Customer (auto-tagged if same customer_id books again)

- New table `vendor_leads`: vendor_id, event_id, stage, created_at, last_activity_at, notes (private vendor notes on the lead)
- This is largely a **view/reporting layer** over existing data (events, quotations, bookings) rather than new core entities — reduces build complexity significantly vs. building a separate CRM system
- **Analytics included:** lead-to-booking conversion rate, average time-in-stage, lost-lead reasons (optional dropdown when vendor marks a lead "lost": price, availability, chose competitor, no response)

---

## V2.8 — Vendor Analytics Dashboard

Builds directly on V2.7's data. Metrics: monthly revenue (from completed `payments`), leads count, conversion rate (booked/total leads), booking rate trend (month over month), repeat customer %, average response time (from V2.3's data), average booking value. Render as time-series charts (Recharts, matches the frontend stack already chosen) — this is a reporting feature, not new business logic, so it's lower-risk to build than it looks.

---

## V2.9 — AI Quotation Generator

**Realistic architecture:** Vendor inputs event type + budget + requirements text → server-side call to the AI API (already scoped in your stack) with a prompt template that includes the vendor's own historical pricing data (from past accepted quotations) as context → AI drafts a quotation (line items + price + inclusions text) → **vendor reviews and edits before sending** (never auto-send AI output directly to a customer — quotations are binding-ish commitments, human-in-the-loop is required).

This is a genuinely good AI use case for Phase 3+ specifically because it reduces vendor friction (the biggest vendor-side complaint in gig/marketplace platforms is "quoting takes too long") without removing vendor control over final pricing.

---

## V2.10 — Budget & Expense Tracker

Simple aggregation layer over `event_bookings` + `payments`: Total Budget (from `events.budget_min/max`), Spent (sum of completed payments), Pending Payments (sum of unpaid advance/final amounts on confirmed bookings), Advance Paid vs. Final Due breakdown, Upcoming Expenses (bookings not yet paid, sorted by event date proximity). No new core tables needed — this is a dashboard view, same pattern as V2.8.

---

## V2.11 — Emergency Vendor Replacement System

**This is the single most operationally complex addition in this list — flagging that clearly.**

**Workflow:**
1. Vendor cancels a confirmed booking (or fails to show, flagged by customer/admin)
2. System marks the `event_booking` as `needs_replacement`, triggers urgency-weighted search: same category, available on that specific date, within expanded radius (larger than normal search radius, since urgency > convenience)
3. Emergency requests pushed simultaneously to top 5–10 matched vendors (not sequential — speed matters more than optimal matching here) with a shortened response window (e.g., 2 hours) and a **cancellation-triggered priority incentive** (e.g., zero commission on this specific emergency booking, funded by the platform, not the customer — protects customer trust)
4. First vendor to accept gets it; others notified it's filled
5. Customer notified in real time of replacement options and final confirmation
6. Original cancelling vendor's `trust_score` (V2.4) takes an automatic cancellation-rate penalty

**Why this must be Phase 3+, not MVP:** This requires the availability engine (V2.2), trust scoring (V2.4), and a reliable notification system all working correctly first — building emergency replacement before those exist means building a safety net with no net underneath it.

---

## V2.12 — Search Architecture (Enterprise Tier)

v1.0 (Section 33) correctly scoped PostgreSQL full-text search + PostGIS for MVP and deferred Elasticsearch. That phasing is right — reaffirming it here rather than changing it:

- **MVP:** PostgreSQL `tsvector` + PostGIS geo-radius — sufficient through tens of thousands of vendor listings
- **Enterprise tier (post-traction):** Migrate to Elasticsearch when (a) vendor count crosses roughly 10,000+ per city-cluster, or (b) search relevance/typo-tolerance becomes a measurable conversion problem — not before, since running Elasticsearch adds real operational overhead
- **AI search (future):** semantic search over vendor descriptions/portfolios using embeddings, layered on top of Elasticsearch's keyword search as a hybrid ranking signal

---

## V2.13 — Event-Driven Architecture (Enterprise Tier)

v1.0 (Section 31) already specified Redis pub/sub for MVP notifications — that's correct and should stay for MVP. Enterprise-tier expansion:

| Queue | Technology (at scale) | Purpose |
|---|---|---|
| Notification Queue | Redis (MVP) → AWS SQS/Kafka (scale) | Fan-out to email/push/WhatsApp |
| Payment Queue | SQS (dedicated, not shared with notifications) | Payment webhook processing, retry-safe |
| Email Queue | SQS + SES or SendGrid | Transactional email dispatch |
| Analytics Queue | Kafka (if event volume is high) → data warehouse | Event stream for BI/analytics pipeline |
| AI Queue | SQS | Async AI API calls (quotation gen, recommendations) so user-facing requests aren't blocked on LLM latency |

**Important honest note:** This full queue topology is 10M-user-scale infrastructure. At MVP and even at moderate scale (tens of thousands of users), a single Redis pub/sub instance handles all of this fine — don't provision Kafka clusters for a pre-launch product.

---

## V2.14 — Database Optimization (Enterprise Tier)

- **Index strategy:** composite indexes on frequent query patterns (`events(city, event_type, event_date)`, `bookings(vendor_id, status)`) — audit via `EXPLAIN ANALYZE` on real slow queries, don't index speculatively
- **Partitioning:** partition `payments` and `messages` tables by date range once row counts exceed several million — not needed at MVP scale
- **Read replicas:** add once read (search/browse) traffic clearly outpaces write capacity — typical marketplace read:write ratio is heavily read-skewed, so this is a realistic first scaling step post-launch
- **Soft delete:** add `deleted_at` timestamp columns instead of hard deletes on `events`, `bookings`, `vendor_profiles` — preserves data for disputes/analytics/audit
- **Audit/history tables:** `booking_status_history`, `payment_audit_log` — append-only tables recording every status transition, critical for dispute resolution (Section 15/Admin Journey in v1.0)
- **Backup strategy:** automated daily snapshots + point-in-time recovery (RDS supports this natively) — non-negotiable once real payment data exists, should be in place before production launch, not "later"

---

## V2.15 — Production Architecture (Enterprise Tier)

Extends v1.0 Section 45's deployment diagram:

```
[CDN (CloudFront)] → [React Frontend]
        │
        ▼
[API Gateway] → [Load Balancer]
        │
        ▼
[Spring Boot App Cluster (auto-scaled, stateless)]
        │
   ┌────┼────┬─────────┬──────────┐
   ▼    ▼    ▼         ▼          ▼
[PostgreSQL  [Redis]  [S3/       [Queue      [Monitoring:
 + Replicas]          Cloudinary] System]     Prometheus+Grafana,
                                              Logging: ELK/CloudWatch,
                                              Tracing: OpenTelemetry]
```

This is the natural evolution of v1.0's architecture (Section 43/45), not a replacement — same components, added redundancy and observability layers appropriate once real users depend on uptime.

---

## V2.16 — Security Hardening (Enterprise Tier)

Adds to v1.0 Section 35:

- **MFA:** optional for customers, **mandatory for admin accounts** (highest-value attack target)
- **Device/session tracking:** log device fingerprint + IP on login, allow users to view/revoke active sessions
- **Fraud detection:** rule-based flags initially (e.g., multiple accounts from same device, unusual payment patterns, rapid account creation) — full ML fraud detection is enterprise-tier, not MVP
- **Suspicious login detection:** alert on login from new device/location, especially for vendor accounts (payout destination risk)
- **Secure file upload:** virus scanning on KYC/portfolio uploads (ClamAV or cloud provider's built-in scanning), strict file type/size validation, uploads go to a quarantine bucket before being served publicly
- **Secrets management:** move from environment variables (MVP-acceptable) to a dedicated secrets manager (AWS Secrets Manager/HashiCorp Vault) at production scale

---

## V2.17 — Business Model Improvements (Enterprise Tier)

Extends v1.0 Sections 3/52: tiered vendor subscription plans (Basic/Pro/Elite with escalating lead volume and reduced commission), premium customer membership (priority support, exclusive vendor access — genuinely optional, low priority), loyalty program (points per booking redeemable for platform credit), B2B/corporate package contracts (recurring corporate clients get dedicated account management and invoicing, not the standard consumer checkout flow — meaningfully different sales motion, worth designing separately if B2B becomes a real segment).

---

## V2.18 — Legal & Compliance (Enterprise Tier)

Extends v1.0 Section 57 with more specificity:

- **Vendor Agreement:** must explicitly define commission terms, cancellation penalties, dispute process, and IP rights over portfolio content uploaded
- **Customer Agreement:** liability disclaimer (platform facilitates, doesn't guarantee vendor service quality), refund eligibility conditions
- **Refund/Cancellation Policy:** tiered by notice period (e.g., full refund >30 days out, 50% 15–30 days, non-refundable <7 days) — should be configurable per vendor category since norms differ (a photographer's cancellation cost structure differs from a caterer's)
- **Escrow rules:** reiterating v1.0's flag — confirm with Razorpay/legal counsel whether the "hold and release" flow requires PA authorization at your actual transaction volume, before scaling past MVP
- **GST:** commission revenue is taxable; consult a CA on invoicing structure for vendor payouts
- **RBI Payment Compliance / DPDP:** unchanged from v1.0, both still apply and become higher-stakes as real money and PII flow through the system

---

## V2.19 — UI/UX Improvements (Enterprise Tier)

Mobile-first responsive design (majority of Indian marketplace traffic is mobile), accessibility basics (semantic HTML, alt text, keyboard navigation — not full WCAG AA compliance at MVP, but not ignored either), dark mode (nice-to-have, low priority), and dedicated journey optimization passes for both customer and vendor flows once real usage data (drop-off points, funnel analytics) exists to inform where the friction actually is — redesigning UX before you have usage data is guessing.

---

## V2.20 — Final CTO Review (Version 2.0)

**1. What is still weak?** The v2.0 additions describe *what* to build well, but nothing here addresses the cold-start/liquidity problem flagged in v1.0 Section 5/50 — that remains the single biggest unsolved risk, and no amount of additional architecture fixes it. Architecture was never the bottleneck; vendor and customer acquisition is.

**2. What should never be included in MVP:** Emergency Vendor Replacement (V2.11), full event-driven Kafka topology (V2.13), ML-based trust scoring and recommendation (V2.3/V2.4's ML variant — the formula-based versions are fine), fraud detection ML, Elasticsearch, read replicas/partitioning, corporate B2B sales motion, premium membership tier.

**3. What should be postponed until "Version 2" (post-traction, not pre-launch):** Everything in V2.11 through V2.19 essentially — these are correctly named "Version 2.0" in the sense of *after* a working, liquid MVP exists, not before. V2.1 (multi-vendor booking) and V2.2 (availability engine) are the two exceptions — those are arguably MVP-necessary, not enhancements, since without them the core booking flow is incomplete.

**4. Biggest technical risks:** Building the availability engine (V2.2) correctly is harder than it looks — double-booking bugs directly damage the trust the entire platform depends on. Second risk: over-investing in AI/ML features (V2.3, V2.9) before there's enough data to make them better than simple heuristics.

**5. Biggest business risks:** Unchanged from v1.0 — cold start and disintermediation. No section in this v2.0 addition changes that calculus; it makes the eventual platform better, not the initial bootstrapping problem easier.

**6. Biggest scalability risks:** Payment reconciliation logic (advance + final + refunds + commission across multiple vendors per event, per V2.1) becomes genuinely complex bookkeeping at scale — this deserves careful testing disproportionate to its "just a feature" framing.

**7. What would change with a $10M budget:** Skip the bootstrapped city-by-city playbook; hire local city-launch teams to manually onboard vendor supply in 5–10 cities simultaneously (paid vendor acquisition, not organic), build the full ML recommendation/trust-score stack from day one with a dedicated data science hire, and absorb commission losses for 12–18 months to win vendor-side market share before monetizing hard.

**8. What would change to support 10 million users:** Full microservice extraction (booking, payment, chat, notification, search as separate deployable services), Kafka-based event backbone (V2.13's full version), Elasticsearch/geo-distributed search, database sharding by city/region, multi-region deployment for latency, dedicated fraud/trust ML team — essentially, everything currently marked "enterprise tier" in this document becomes mandatory, not optional.

**9. Blueprint rating out of 10:** As a *reference architecture document*, 9/10 — it's thorough and technically sound. As a *build plan for a solo developer's next project*, unchanged from v1.0's assessment: the risk isn't the architecture's quality, it's treating this scope as buildable before validating the underlying marketplace with a much smaller concierge-style test.

**10. What's preventing a perfect 10/10 enterprise blueprint:** Nothing architectural — the gap isn't design quality, it's that no blueprint, however complete, substitutes for the thing investors and reality actually require: proof that vendors and customers will use this in a real city. A 10/10 blueprint built before that proof exists is still a 10/10 description of an unvalidated assumption.
