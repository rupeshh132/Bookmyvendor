<div align="center">

# ?? BookMyVendor

### *"Find. Compare. Book Trusted Vendors."*

**A two-sided event vendor marketplace for India**
Find, compare & book verified photographers, caterers, decorators and more — all in one place.

[![Status](https://img.shields.io/badge/Status-In%20Development-orange?style=flat-square)](https://github.com/rupeshh132/Bookmyvendor)
[![Phase](https://img.shields.io/badge/Phase-0%20%7C%20Planning%20%26%20Design-blue?style=flat-square)](https://github.com/rupeshh132/Bookmyvendor)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## ?? What is BookMyVendor?

BookMyVendor solves a real problem in India's event industry:

- **Customers** spend hours calling 10+ vendors, getting inconsistent quotes, and paying with no protection
- **Vendors** rely entirely on referrals and Instagram with no professional lead management

**BookMyVendor fixes this** — customers get side-by-side quote comparison and secure escrow payments; vendors get a qualified lead pipeline and professional dashboard.

> Think Urban Company — but for events (weddings, birthdays, corporate, college events).

---

## ? Key Features

| Feature | Description |
|---|---|
| ?? **Vendor Discovery** | Search by category, location, budget, availability |
| ?? **Quotation Engine** | Vendors submit quotes, customers compare side-by-side |
| ?? **In-App Chat** | Real-time messaging between customers and vendors |
| ?? **Secure Payments** | Razorpay-powered advance + final payment with escrow logic |
| ? **KYC Verification** | Admin-verified vendor profiles for trust |
| ? **Reviews & Ratings** | Two-way rating system post-completion |
| ?? **Vendor Dashboard** | Lead pipeline, earnings, availability calendar |
| ??? **Admin Panel** | KYC queue, dispute resolution, analytics |

---

## ??? Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React + Vite + TypeScript | Core frontend framework |
| Tailwind CSS | Styling (custom design system) |
| Framer Motion | Animations & scroll reveal |
| React Query (TanStack) | Server state management |
| Zustand | Client UI state |
| Lucide React | Icons (monoline, minimal) |
| Recharts | Analytics charts |
| Embla Carousel | Vendor cards, testimonials |

### Backend
| Technology | Purpose |
|---|---|
| Spring Boot (Java) | REST API backend |
| Spring Security + JWT | Authentication & RBAC |
| Spring Data JPA | Database ORM |
| PostgreSQL | Primary database |
| PostGIS | Geo-location search |
| Redis | Caching + pub/sub notifications |
| Flyway | Database migrations |
| WebSocket (STOMP) | Real-time chat |

### Infrastructure & Services
| Technology | Purpose |
|---|---|
| Razorpay | Payments + vendor payouts |
| Cloudinary | Image/video storage |
| Docker + Docker Compose | Containerization |
| GitHub Actions | CI/CD pipeline |
| Render / Railway | Backend hosting (MVP) |
| Vercel | Frontend hosting |

---

## ?? Design System

This project uses a custom **"Editorial Studio"** design system — NOT a generic SaaS look.

| Token | Value |
|---|---|
| Background | `#F6F3EF` Warm Ivory |
| Primary Dark | `#16232E` Deep Slate Navy |
| Card Surface | `#EDEAE5` Soft Stone |
| Accent | `#D9A98C` Dusty Terracotta |
| Heading Font | Clash Display (Fontshare) |
| Body Font | General Sans (Fontshare) |

Full design system, wireframes & component rules ? [`BookMyVendor_Wireframe_DesignSystem.md`](./BookMyVendor_Wireframe_DesignSystem.md)

---

## ??? Project Roadmap

### ? Phase 0 — Planning & Design (Current)
- [x] Product blueprint (v1.0 + v2.0)
- [x] Engineering handbook
- [x] Go-to-market strategy
- [x] Design system & wireframes
- [x] Repository setup & project scaffold
- [x] Database schema finalization

### ?? Sprint 0 — Project Setup
- [ ] React + Vite + TypeScript frontend scaffold
- [ ] Spring Boot backend scaffold
- [ ] Docker Compose (Postgres + Redis)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Tailwind config with design tokens
- [ ] Fontshare fonts integration

### ?? Sprint 1–2 — Authentication
- [ ] Customer & Vendor registration
- [ ] JWT + refresh token flow
- [ ] Role-based route protection (RBAC)

### ?? Sprint 3–4 — Vendor Profiles & KYC
- [ ] Vendor profile CRUD
- [ ] Portfolio upload (Cloudinary)
- [ ] KYC document upload + admin approval

### ?? Sprint 5–6 — Event Creation & Matching
- [ ] Customer event creation wizard
- [ ] Rule-based vendor matching (category + location + budget)

### ?? Sprint 7–8 — Quotation Flow
- [ ] Vendor quotation submission
- [ ] Customer quotation comparison view

### ?? Sprint 9–10 — Chat & Notifications
- [ ] WebSocket real-time chat
- [ ] Redis pub/sub notification system

### ?? Sprint 11–12 — Payments
- [ ] Razorpay integration
- [ ] Advance payment + booking confirmation
- [ ] Idempotency handling

### ?? Sprint 13–14 — Admin Panel
- [ ] KYC approval queue
- [ ] Dispute resolution console
- [ ] Platform analytics

### ?? Sprint 15–16 — Hardening & Launch
- [ ] Load testing (k6)
- [ ] Security audit (OWASP ZAP)
- [ ] Production deployment

---

## ?? Repository Structure

```
Bookmyvendor/
+-- docs/                          # Planning & design documents
¦   +-- EventMarketplace_Blueprint.md       # v1.0 product blueprint
¦   +-- BookMyVendor_Blueprint_v2.md        # v2.0 enterprise enhancements
¦   +-- BookMyVendor_Engineering_Handbook.md # CTO engineering handbook
¦   +-- BookMyVendor_GTM_Strategy.md        # Go-to-market strategy
¦   +-- BookMyVendor_Wireframe_DesignSystem.md # Design system & wireframes
¦
+-- bookmyvendor-frontend/         # React frontend (Sprint 0+)
¦   +-- src/
¦   ¦   +-- features/              # Feature-based folder structure
¦   ¦   +-- components/            # Shared UI components
¦   ¦   +-- hooks/                 # Shared custom hooks
¦   ¦   +-- services/              # API client layer
¦   ¦   +-- lib/                   # Utilities & constants
¦   +-- ...
¦
+-- bookmyvendor-backend/          # Spring Boot backend (Sprint 0+)
¦   +-- src/main/java/com/bookmyvendor/
¦   ¦   +-- vendor/
¦   ¦   +-- event/
¦   ¦   +-- booking/
¦   ¦   +-- payment/
¦   ¦   +-- chat/
¦   ¦   +-- auth/
¦   ¦   +-- admin/
¦   +-- ...
¦
+-- README.md
```

---

## ?? Getting Started (Sprint 0 — Coming Soon)

```bash
# Clone the repository
git clone https://github.com/rupeshh132/Bookmyvendor.git
cd Bookmyvendor

# Frontend setup
cd bookmyvendor-frontend
npm install
npm run dev

# Backend setup (requires Java 17+)
cd bookmyvendor-backend
docker-compose up -d    # starts Postgres + Redis
./mvnw spring-boot:run
```

> Full setup guide will be added in Sprint 0 completion.

---

## ?? Business Model

- **Primary:** Commission on completed bookings (10–12%)
- **Secondary:** Vendor subscription plans (Pro/Elite tiers)
- **Tertiary:** Featured listings & promotional placements

Target: City-by-city launch, starting with 1 Indian city, 4–5 vendor categories.

---

## ?? Documentation

| Document | Description |
|---|---|
| [Product Blueprint v1.0](./EventMarketplace_Blueprint.md) | Core product vision, features, DB schema |
| [Product Blueprint v2.0](./BookMyVendor_Blueprint_v2.md) | Enterprise enhancements & CTO review |
| [Engineering Handbook](./BookMyVendor_Engineering_Handbook.md) | Architecture decisions, coding standards, sprint plan |
| [GTM Strategy](./BookMyVendor_GTM_Strategy.md) | Go-to-market, vendor acquisition, business model |
| [Design System & Wireframes](./BookMyVendor_Wireframe_DesignSystem.md) | UI design tokens, page wireframes, component rules |

---

## ????? Developer

**Rupesh Vishwakarma**
- MCA Student | Full-Stack Developer
- Building BookMyVendor as a real startup attempt

---

## ?? Commit Convention

```
feat:     New feature added
fix:      Bug fix
docs:     Documentation update
style:    UI/design changes
refactor: Code refactoring (no feature change)
test:     Test additions
chore:    Build, CI/CD, dependencies
sprint:   Sprint completion commit
```

---

<div align="center">

**? Star this repo if you find it interesting!**

*Built with passion for India's event industry* ??

</div>





