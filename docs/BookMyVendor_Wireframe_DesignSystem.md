# BookMyVendor — Official Wireframe & Design System Reference
### Version 1.0 | DO NOT DEVIATE FROM THIS DOCUMENT
### *"Find. Compare. Book Trusted Vendors."*

---

> STRICT RULE: Yeh document future mein bhi follow karna hai. Koi bhi new page, component ya feature banana ho — pehle is document se match karo. Agar kuch add karna ho toh pehle yahan likho, phir code karo.

---

## SECTION 1 — DESIGN SYSTEM (Single Source of Truth)

---

### 1.1 Color Palette

| ROLE                | NAME              | HEX       | USE |
|---------------------|-------------------|-----------|-----|
| Base Background     | Warm Ivory        | #F6F3EF   | Page bg, never pure white |
| Ink / Primary Dark  | Deep Slate Navy   | #16232E   | Buttons, nav, dark sections |
| Card Surface        | Soft Stone        | #EDEAE5   | Card bg, secondary sections |
| Accent (sparingly)  | Dusty Terracotta  | #D9A98C   | CTA bg, highlights (max 2 sections/page) |
| Text Primary        | Near Black        | #1A1A1A   | Headings, body text |
| Text Muted          | Warm Gray         | #6B6560   | Captions, sub-text, meta info |
| Pure White          | White             | #FFFFFF   | Floating cards, testimonials, navbar pill |
| Success             | Sage Green        | #4A7C59   | Booking confirmed, verified badge |
| Warning             | Amber Warm        | #C4882A   | Pending payment, caution states |
| Error               | Muted Rose        | #B05252   | Error states, cancellation |

**NEVER USE:**
- Any blue/purple gradient
- Pure #FFFFFF as page background
- Bootstrap/Tailwind default blue (#3B82F6) anywhere
- Bright neon or oversaturated colors

---

### 1.2 Typography

```
FONT LOADING (in <head>):
  Clash Display  -> https://api.fontshare.com/v2/css?f[]=clash-display@500,600&display=swap
  General Sans   -> https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap
```

| ROLE          | FONT           | WEIGHT | SIZE      | LINE-HEIGHT |
|---------------|----------------|--------|-----------|-------------|
| Hero Heading  | Clash Display  | 600    | 56-72px   | 1.05        |
| Section H2    | Clash Display  | 500    | 36-44px   | 1.1         |
| Card H3       | Clash Display  | 500    | 24-28px   | 1.15        |
| Body Text     | General Sans   | 400    | 16-18px   | 1.5         |
| UI Medium     | General Sans   | 500    | 14-16px   | 1.4         |
| Small Labels  | General Sans   | 500    | 11-12px   | 1.0         |
| Button Text   | General Sans   | 600    | 13-14px   | 1.0         |

Small Labels Rule: UPPERCASE + letter-spacing: 0.05em (e.g., "VERIFIED VENDOR", "NEW LEAD")

**NEVER USE:** Poppins, Inter, Roboto, Montserrat

---

### 1.3 Spacing & Sizing System

```
Base unit: 4px (rem: 0.25rem)

Spacing scale:
  xs  ->  8px   (0.5rem)
  sm  ->  12px  (0.75rem)
  md  ->  16px  (1rem)
  lg  ->  24px  (1.5rem)
  xl  ->  32px  (2rem)
  2xl ->  48px  (3rem)
  3xl ->  64px  (4rem)
  4xl ->  80px  (5rem)

Section padding (vertical): 80px desktop / 56px tablet / 40px mobile
Container max-width: 1280px
Horizontal padding: 24px (mobile) / 48px (tablet) / 80px (desktop)

Border Radius:
  Buttons:      rounded-full (9999px)
  Cards:        28px - 32px
  Input fields: 12px
  Badges/Tags:  9999px (pill shape)
  Images:       16px (within cards)
```

---

### 1.4 Shadow System

```
NEVER use: shadow-lg or drop-shadow-lg on cards

USE ONLY:
  card-shadow:     0 2px 12px rgba(22, 35, 46, 0.06)
  card-hover:      0 8px 32px rgba(22, 35, 46, 0.12)
  floating-navbar: 0 4px 24px rgba(22, 35, 46, 0.10)
  elevated-card:   0 12px 40px rgba(22, 35, 46, 0.14)  [center testimonial card only]
```

---

### 1.5 Component Rules

#### BUTTONS
```
Primary (light bg):
  bg: #16232E | text: #FFFFFF | rounded-full | px-28 py-14
  font: General Sans 600, 13px, UPPERCASE, letter-spacing 0.06em

Secondary (dark bg):
  bg: #FFFFFF | text: #16232E | rounded-full | px-28 py-14

Accent:
  bg: #D9A98C | text: #16232E | rounded-full | px-28 py-14
  (use sparingly — max 1-2 per page)

NEVER: gradient fills, icon inside button, glow effects, shadow-xl
```

#### CARDS
```
Standard Card:
  bg: #EDEAE5 (or #FFFFFF for elevated)
  border-radius: 28px
  padding: 32px - 40px
  shadow: card-shadow (subtle only)
  border: NONE

Image Card:
  Full-bleed image, border-radius: 28px
  Text overlay: linear-gradient(to top, rgba(22,35,46,0.7) 0%, transparent 60%)
  NO glassmorphism, NO blur on cards

Hover state:
  transform: scale(1.02)
  shadow: card-hover
  transition: all 200ms ease
```

#### NAVBAR (Floating Pill)
```
Position: fixed top, centered horizontally
Shape: rounded-full pill
bg: rgba(255,255,255,0.92) + backdrop-blur: 8px (ONLY navbar gets blur)
shadow: floating-navbar
padding: 8px 20px | margin-top: 16px

Structure: [LOGO/Wordmark]  [Nav Links]  [CTA Button]

Active nav link: white pill highlight, smooth transition 200ms
Mobile: hamburger -> full-screen slide-down menu overlay
```

#### INPUT FIELDS
```
bg: #FFFFFF
border: 1.5px solid #EDEAE5
border-radius: 12px
padding: 14px 18px
font: General Sans 400, 16px
focus: border-color #16232E, shadow: 0 0 0 3px rgba(22,35,46,0.08)
placeholder color: #6B6560
```

#### BADGES / TAGS
```
Verified:   bg:#4A7C59 | text:#FFFFFF | rounded-full | px-10 py-4 | 11px UPPERCASE
Category:   bg:#EDEAE5 | text:#1A1A1A | rounded-full | px-12 py-6 | 12px
Pending:    bg:#C4882A | text:#FFFFFF | rounded-full
```

#### ICONS
```
Use sparingly. If needed:
  - Style: monoline, 20-24px stroke
  - Container: plain circle bg:#EDEAE5, size 40x40px
  - NO colored circles, NO gradient badge icons
  - Preferred library: Lucide Icons

Functional icons ALLOWED (search, filter, chevron, menu, close)
Decorative icons as feature bullets: NEVER
```

---

### 1.6 Motion Rules

```
Scroll Reveal:
  opacity 0->1, translateY 20px->0
  duration: 500ms, ease-out
  stagger delay: 100ms between sibling cards

Card Hover:    scale 1.02, shadow deepen, duration 200ms, ease
Nav pill slide: duration 200ms, ease
Page transitions: fade-in 300ms

NEVER: bounce, spring, elastic, wobble animations
NEVER: heavy parallax effects
YES: Subtle, purposeful, fast transitions only
```

---

## SECTION 2 — RESPONSIVE BREAKPOINTS

```
Mobile Small:  < 375px   (old phones)
Mobile:        375px - 767px   (PRIMARY TARGET — majority Indian traffic)
Tablet:        768px - 1023px
Desktop Small: 1024px - 1279px
Desktop:       1280px+

MOBILE-FIRST APPROACH:
  Default styles = mobile, scale up with md: lg: xl: Tailwind prefixes

Grid system:
  Mobile:  1 column (full width)
  Tablet:  2 columns
  Desktop: Asymmetric — defined per section (NOT always 3 equal columns)
```

---

## SECTION 3 — PAGE WIREFRAMES

---

### 3.1 LANDING PAGE (Home)

```
[FLOATING NAVBAR — Fixed Top]
  LOGO    ABOUT  VENDORS  HOW IT WORKS    [Get Started]

????????????????????????????????????????????????????
HERO SECTION — full viewport height, bg: #F6F3EF

DESKTOP (60/40 asymmetric split):
+----------------------------------------------------+
¦ Label: "TRUSTED BY 500+     ¦  [HERO IMAGE CARD]   ¦
¦ VENDORS ACROSS INDIA"       ¦  Full-bleed editorial ¦
¦                             ¦  event photography   ¦
¦ Heading (Clash Display 64px)¦  rounded-[32px]      ¦
¦ "Every Celebration,         ¦                      ¦
¦  Perfectly Planned."        ¦  Floating stat card  ¦
¦                             ¦  (white, elevated):  ¦
¦ Body (General Sans 18px):   ¦  500+ Vendors        ¦
¦ "Stop calling 10 vendors.   ¦  1200+ Events        ¦
¦  Compare real quotes,       ¦  4.9 Star Rating     ¦
¦  book securely."            ¦                      ¦
¦                             ¦                      ¦
¦ [Find Vendors]              ¦                      ¦
¦ [See How It Works]          ¦                      ¦
+----------------------------------------------------+

MOBILE (stacked):
  Small label
  Heading (40px, 2 lines)
  Body text (16px)
  [Find Vendors] button full-width
  Hero Image (full width)
  Stat card (full width)

????????????????????????????????????????????????????
SEARCH BAR SECTION — bg: #16232E (dark)

"Find the Perfect Vendor for Your Event"

DESKTOP (1-row):
+----------------------------------------------------+
¦ Category       ¦ City        ¦ Date     ¦ [Search] ¦
+----------------------------------------------------+

Popular pills below:
[Photographer] [Caterer] [Decorator] [DJ] [Makeup Artist] [Venue]

MOBILE: All inputs stacked vertically, Search button full-width

????????????????????????????????????????????????????
HOW IT WORKS — bg: #F6F3EF

Label: "THE PROCESS"
Heading: "From Search to Celebration in 4 Steps"

DESKTOP (asymmetric bento — NOT equal 4 columns):
+-------------------------------------------------------+
¦ STEP 1 (large card)   ¦ STEP 2    ¦ STEP 3            ¦
¦ bg: #16232E           ¦ bg:#D9A98C¦ bg: #EDEAE5       ¦
¦ text: white           ¦           ¦                   ¦
¦ "Create Your Event"   ¦ "Get      ¦ "Compare Quotes"  ¦
¦                       ¦ Matched"  ¦                   ¦
+-------------------------------------------------------¦
¦ STEP 4 (full width image card)                        ¦
¦ Photo of happy couple at event                        ¦
¦ overlay: "Book & Pay Securely"                        ¦
¦ "Advance held safely, released after event"           ¦
+-------------------------------------------------------+

MOBILE: 4 cards stacked vertically, each full width

????????????????????????????????????????????????????
FEATURED VENDORS — bg: #EDEAE5

Label: "TOP VENDORS"
Heading: "Trusted by Thousands Across India"

DESKTOP (3 visible, peek 4th):
+--------------+  +--------------+  +--------------+
¦ [Photo]      ¦  ¦ [Photo]      ¦  ¦ [Photo]      ¦
¦ Vendor Name  ¦  ¦ Vendor Name  ¦  ¦ Vendor Name  ¦
¦ Category     ¦  ¦ Category     ¦  ¦ Category     ¦
¦ 4.9 (120)    ¦  ¦ 4.8 (98)     ¦  ¦ 5.0 (45)     ¦
¦ Lucknow      ¦  ¦ Lucknow      ¦  ¦ Lucknow      ¦
¦ [View Profile]¦  ¦[View Profile]¦  ¦[View Profile]¦
+--------------+  +--------------+  +--------------+

MOBILE: Horizontal scroll, 1.2 cards visible (peek next)

????????????????????????????????????????????????????
TESTIMONIALS — bg: #F6F3EF

Label: "REAL STORIES"
Heading: "What Our Customers Say"

DESKTOP (center elevated, sides faded):
+----------+  +------------------+  +----------+
¦ [Photo]  ¦  ¦ [Photo] CENTER   ¦  ¦ [Photo]  ¦
¦ Portrait ¦  ¦ scale: 1.05      ¦  ¦ Portrait ¦
¦ opacity  ¦  ¦ elevated shadow  ¦  ¦ opacity  ¦
¦ 0.6      ¦  ¦                  ¦  ¦ 0.6      ¦
¦ "Great!" ¦  ¦ "Made our        ¦  ¦ "Saved   ¦
¦ - Priya  ¦  ¦ wedding perfect" ¦  ¦ us time" ¦
¦          ¦  ¦ - Rahul, Lko     ¦  ¦ - Ananya ¦
+----------+  +------------------+  +----------+
<- [prev]                              [next] ->

MOBILE: Single card, full width, swipe navigation

????????????????????????????????????????????????????
VENDOR CTA SECTION — bg: #D9A98C (terracotta accent)

"Are You a Vendor? Join 500+ Professionals"
"Get qualified leads. Zero upfront cost."

[List Your Business Free]   [See How It Works]

MOBILE: Text centered, buttons stacked vertically

????????????????????????????????????????????????????
FOOTER — bg: #16232E

DESKTOP (4 columns):
+---------------------------------------------------+
¦ BookMyVendor ¦ Platform ¦ Company  ¦ Contact      ¦
¦ Tagline text ¦ Find     ¦ About    ¦ Email        ¦
¦              ¦ Vendors  ¦ Blog     ¦ WhatsApp     ¦
¦              ¦ Post     ¦ Careers  ¦ Social icons ¦
¦              ¦ Event    ¦ Legal    ¦              ¦
+---------------------------------------------------+
Copyright 2025 BookMyVendor | Privacy | Terms

MOBILE: 2-column stacked links, logo centered top
```

---

### 3.2 VENDOR SEARCH / DISCOVERY PAGE

```
[FLOATING NAVBAR — same as landing]

STICKY SEARCH BAR (top, bg: #F6F3EF):
[Category] [City] [Date] [Budget] [Search]
Active filters as removable pills: [Photographer x] [Lucknow x]

DESKTOP (2-pane layout):
+------------------------------------------------------+
¦ FILTERS (240px)  ¦ RESULTS (remaining width, 2-col)  ¦
¦                  ¦                                   ¦
¦ Rating           ¦ "142 Photographers in Lucknow"    ¦
¦ [] 4.5+          ¦ Sort: [Recommended]               ¦
¦ [] 4.0+          ¦                                   ¦
¦                  ¦ +--------------+ +--------------+ ¦
¦ Price Range      ¦ ¦ [Photo]      ¦ ¦ [Photo]      ¦ ¦
¦ Slider: 5K-50K   ¦ ¦ Vendor Name  ¦ ¦ Vendor Name  ¦ ¦
¦                  ¦ ¦ 4.9 (120)    ¦ ¦ 4.8 (90)     ¦ ¦
¦ Availability     ¦ ¦ Lucknow      ¦ ¦ Lucknow      ¦ ¦
¦ [] On my date    ¦ ¦ From Rs15000 ¦ ¦ From Rs8000  ¦ ¦
¦                  ¦ ¦ [VERIFIED]   ¦ ¦ [VERIFIED]   ¦ ¦
¦ Event Type       ¦ ¦ [View][Rq]   ¦ ¦ [View][Rq]   ¦ ¦
¦ [] Wedding       ¦ +--------------+ +--------------+ ¦
¦ [] Corporate     ¦                                   ¦
¦ [] Birthday      ¦ [Load More vendors]               ¦
¦                  ¦                                   ¦
¦ [Apply Filters]  ¦                                   ¦
+------------------------------------------------------+

TABLET: Filters collapse into horizontal filter bar (scroll)
MOBILE:
  - Filters: bottom sheet drawer (swipe up to open)
  - Results: 1 column full-width cards
  - [Filter] [Sort] sticky bar above results
```

---

### 3.3 VENDOR PROFILE PAGE

```
HERO — full width image, 60vh height
  Editorial photo, bottom gradient overlay
  Floating info card (white, elevated, rounded-[28px]):
    [Avatar] Vendor Name
    [VERIFIED] 4.9 (142 reviews)
    Category | City
    From Rs15,000 per event
    [Request Quote] [Chat]

MOBILE: Floating card becomes full-width below hero image

TABS (sticky below navbar):
  [Portfolio]  [Services & Pricing]  [Reviews]  [Availability]
  Active: thin terracotta underline bar

PORTFOLIO SECTION:
  Desktop: 3-column masonry grid, images rounded-[16px]
  Tablet:  2-column masonry
  Mobile:  2-column equal grid OR horizontal scroll strip

SERVICES & PRICING (left list + right detail panel):

DESKTOP:
+------------------------------------------------------+
¦ SERVICE LIST (35%)    ¦ DETAIL PANEL (65%)           ¦
¦                       ¦                              ¦
¦ [|] Basic Package     ¦ Basic Package                ¦
¦     Standard Package  ¦ Rs15,000                     ¦
¦     Premium Package   ¦ 8 hours coverage             ¦
¦     Custom Quote      ¦ 500+ edited photos           ¦
¦                       ¦ Online gallery               ¦
¦ Active item gets      ¦ Travel: 50km included        ¦
¦ left accent bar       ¦                              ¦
¦ (#D9A98C color)       ¦ [Request This Package]       ¦
+------------------------------------------------------+

MOBILE: Full-width expandable accordion cards

STICKY BOTTOM BAR (mobile only):
From Rs15,000   [Chat]   [Request Quote]
```

---

### 3.4 CUSTOMER DASHBOARD

```
DESKTOP SIDEBAR (240px, always visible):
  BookMyVendor logo
  My Events
  Quotations
  Bookings
  Messages
  Reviews
  Settings
  Logout

MOBILE: Bottom tab bar (5 icons max, Lucide monoline)

MAIN CONTENT:
  "Good morning, Priya"   [+ Create New Event]

STAT CARDS (bento, 4 cards):
+----------+ +----------+ +----------+ +----------+
¦ 2 Active ¦ ¦ 8 Quotes ¦ ¦1 Upcoming¦ ¦ Rs45,000 ¦
¦ Events   ¦ ¦ Received ¦ ¦ Booking  ¦ ¦ Spent    ¦
+----------+ +----------+ +----------+ +----------+
TABLET/MOBILE: 2x2 grid

MY EVENTS (card list):
+------------------------------------------------------+
¦ Priya's Wedding               March 15, 2026         ¦
¦ Lucknow, 300 guests, Budget: Rs5L - Rs8L             ¦
¦ ------------------------------------------           ¦
¦ [Photographer Done] [Caterer Done] [Decorator Wait]  ¦
¦                                   [View Details]     ¦
+------------------------------------------------------+

RECENT QUOTATIONS:
+------------------------------------------------------+
¦ [Avatar] Aryan Photography         Rs18,000          ¦
¦ Wedding Package | Valid till Dec 31                  ¦
¦ [View Quote]    [Accept]    [Reject]                 ¦
+------------------------------------------------------+

MOBILE: Full-width stacked cards
```

---

### 3.5 VENDOR DASHBOARD

```
SIDEBAR NAV:
  Overview | New Leads | Quotations | Bookings
  Messages | Portfolio | Availability | Reviews | Settings

MAIN CONTENT — OVERVIEW:
  "Welcome back, Aryan"

STATS ROW (asymmetric bento):
+---------------------------------------------------+
¦ Rs1,24,000       ¦ 12 New   ¦ 8 Active ¦ 4.9 Avg  ¦
¦ This Month       ¦ Leads    ¦ Bookings ¦ Rating   ¦
¦ (large, accent)  ¦          ¦          ¦          ¦
+---------------------------------------------------+

NEW LEADS LIST:
+------------------------------------------------------+
¦ NEW  Priya Sharma — Wedding Photography              ¦
¦ Lucknow | March 2026 | Budget: Rs15K-Rs25K           ¦
¦ [Send Quote]   [View Event]                          ¦
+------------------------------------------------------¦
¦ PENDING  Rahul Gupta — Birthday                      ¦
¦ Lucknow | Jan 10, 2026 | Budget: Rs8K-Rs12K          ¦
¦ Quote sent 2 days ago   [Follow Up]   [View]         ¦
+------------------------------------------------------+

EARNINGS CHART:
  bg: #EDEAE5, rounded-[28px], padding: 32px
  Line chart (navy line, clean minimal)
  Toggle: [This Week] [This Month] [This Year]

MOBILE: Full-width stacked, bottom tab nav
```

---

### 3.6 QUOTATION COMPARISON PAGE

```
PAGE HEADER:
  "Quotes for: Priya's Wedding — Photography"
  8 quotes received | Event: March 15, 2026
  Sort: [Best Match] | Filter pills: [Price] [Rating] [Distance]

QUOTE CARDS (vertical list):
+------------------------------------------------------+
¦ [Avatar] Aryan Photography              4.9 (142)    ¦
¦ [VERIFIED] Wedding Specialist                        ¦
¦ Lucknow (5km away)                                   ¦
¦                                                      ¦
¦ Rs18,000                      Valid till: Dec 31     ¦
¦ ----------------------------------------------       ¦
¦ 8 hrs coverage  500+ photos  Same-day delivery       ¦
¦ Travel: 50km included                                ¦
¦                                                      ¦
¦ [View Full Quote]    [Chat]    [Accept]              ¦
+------------------------------------------------------+

DESKTOP: 2-col if viewport >1280px
MOBILE: Full-width, [Accept] button full-width at bottom
```

---

### 3.7 CHAT PAGE

```
DESKTOP (2-pane split):
+-------------------------------------------------------+
¦ CONVERSATIONS      ¦ ACTIVE CHAT                      ¦
¦ (300px left)       ¦ (flex right)                     ¦
¦                    ¦                                  ¦
¦ [Search chats]     ¦ Header: Aryan Photography        ¦
¦                    ¦ VERIFIED | 4.9 | Online          ¦
¦ Aryan Photo        ¦ ----------------------------     ¦
¦ "Sure, I can..."   ¦                                  ¦
¦ 2 min ago [unread] ¦ [Quotation Card Attachment]      ¦
¦                    ¦ Quote: Rs18,000 | Wedding Pkg    ¦
¦ Raj Catering       ¦ [View Full Quote]                ¦
¦ "Thank you..."     ¦                                  ¦
¦ Yesterday          ¦ Priya: "Can you visit us?"       ¦
¦                    ¦                                  ¦
¦                    ¦ Aryan: "Yes, let's schedule it"  ¦
¦                    ¦                                  ¦
¦                    ¦ ----------------------------     ¦
¦                    ¦ [Attach]  [Type message...]  [>] ¦
+-------------------------------------------------------+

MOBILE: Full-screen chat, back button to conversation list
```

---

### 3.8 PAYMENT / CHECKOUT PAGE

```
DESKTOP (60/40 split):
+----------------------------------------------------+
¦ ORDER SUMMARY (left 60%)     ¦ PAYMENT (right 40%) ¦
¦                              ¦                     ¦
¦ Booking Summary Card:        ¦ Payment Breakdown:  ¦
¦   Aryan Photography          ¦ Package:  Rs18,000  ¦
¦   Wedding Package            ¦ Platform fee: Rs0   ¦
¦   March 15, 2026 | Lucknow   ¦ ------------------- ¦
¦                              ¦ Total: Rs18,000     ¦
¦ Whats included:              ¦                     ¦
¦   8 hrs photography          ¦ Advance (50%):      ¦
¦   500+ edited photos         ¦ Rs9,000             ¦
¦   Online gallery             ¦                     ¦
¦                              ¦ [Pay Rs9,000]       ¦
¦ SECURE PAYMENT INFO:         ¦ via Razorpay        ¦
¦ "Your advance is held safely ¦                     ¦
¦  and released only after     ¦ ------------------- ¦
¦  your event completion."     ¦ Rs9,000 remaining   ¦
¦                              ¦ due after event     ¦
+----------------------------------------------------+

MOBILE: Stacked — summary top, payment below
        [Pay Rs9,000] sticky at screen bottom
```

---

### 3.9 ADMIN PANEL

```
SIDEBAR (always visible, darker bg #0F1A23):
  BookMyVendor Admin
  ------------------
  Overview | Users | Vendors (KYC Queue)
  Bookings | Disputes | Payouts | Coupons | Settings

OVERVIEW — bento stat cards:
  GMV This Month | Active Vendors | Pending KYC | Open Disputes
  Revenue Chart (line chart, navy color, minimal)
  Recent bookings (clean table, subtle row dividers only)

KYC APPROVAL QUEUE:
  Vendor Name | Category | Submitted | Documents | [Approve] [Reject]
  MOBILE: Card-based list instead of table
```

---

## SECTION 4 — RESPONSIVE RULES PER COMPONENT

| COMPONENT          | MOBILE                     | TABLET                    | DESKTOP                       |
|--------------------|----------------------------|---------------------------|-------------------------------|
| Navbar             | Hamburger, full-screen menu| Same as mobile            | Floating pill, inline links   |
| Hero Section       | Stacked, 40px heading      | 60/40 split, 52px         | 60/40 asymmetric, 64px        |
| Search Bar         | Full-width stacked         | 1-row horizontal          | 1-row horizontal              |
| Vendor Cards       | 1 col full-width           | 2 col grid                | 2-3 col grid (search page)    |
| Bento Sections     | 1 col stacked              | 2 col                     | Asymmetric bento              |
| Vendor Profile     | Full-width tabs, sticky CTA| Full-width tabs           | Sticky tab bar                |
| Dashboard Sidebar  | Bottom tab bar             | Collapsible sidebar       | Full 240px sidebar            |
| Stat Cards         | 2x2 grid                   | 2x2 or 4-row              | 4-col bento row               |
| Chat               | Full-screen                | Full-screen               | 2-pane split                  |
| Testimonials       | Single card + swipe        | 3 cards row               | 3 cards (center elevated)     |
| Footer             | 2-col stacked              | 3-col                     | 4-col                         |
| Payment Page       | Stacked, sticky CTA        | Stacked                   | 2-pane split                  |

---

## SECTION 5 — DESIGN CHECKLIST (Before Every Commit)

```
[ ] Background is #F6F3EF (never pure white on page bg)
[ ] Headings using Clash Display font
[ ] Body text using General Sans (NOT Poppins, NOT Inter)
[ ] No blue/purple gradients anywhere
[ ] Buttons are rounded-full only
[ ] Card border-radius is 28-32px
[ ] No harsh shadow-lg on cards (only subtle card-shadow)
[ ] Terracotta accent max 1-2 sections per page
[ ] Mobile layout tested at 375px min-width
[ ] Tablet layout tested at 768px
[ ] Desktop layout tested at 1280px
[ ] No icon-in-colored-circle feature rows
[ ] No glassmorphism on cards (blur only on navbar)
[ ] Hover: scale 1.02, 200ms ease (no bounce)
[ ] Scroll reveal: fade-up, translateY 20px, 500ms
[ ] Image cards use bottom gradient overlay (no blur)
[ ] All text readable on mobile (min 16px body)
[ ] Touch targets min 44x44px on mobile
```

---

## SECTION 6 — TECH STACK FOR FRONTEND

```
Framework:     React (Vite) + TypeScript
Styling:       Tailwind CSS (with custom tokens below)
Animation:     Framer Motion (scroll reveal + transitions)
Icons:         Lucide React (monoline, clean)
Charts:        Recharts (earnings, admin analytics)
Maps:          Leaflet + OpenStreetMap (free at MVP)
Carousel:      Embla Carousel (vendor cards, testimonials)
State:         React Query (server state) + Zustand (UI state)
Fonts:         Fontshare CDN (Clash Display + General Sans)
```

### Tailwind Config (tailwind.config.js)

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        ivory:      '#F6F3EF',
        navy:       '#16232E',
        stone:      '#EDEAE5',
        terracotta: '#D9A98C',
        ink:        '#1A1A1A',
        muted:      '#6B6560',
        sage:       '#4A7C59',
        amber:      '#C4882A',
        rose:       '#B05252',
      },
      fontFamily: {
        display: ['Clash Display', 'sans-serif'],
        sans:    ['General Sans', 'sans-serif'],
      },
      borderRadius: {
        card:   '28px',
        cardLg: '32px',
      },
      boxShadow: {
        card:     '0 2px 12px rgba(22, 35, 46, 0.06)',
        cardHover:'0 8px 32px rgba(22, 35, 46, 0.12)',
        floating: '0 4px 24px rgba(22, 35, 46, 0.10)',
        elevated: '0 12px 40px rgba(22, 35, 46, 0.14)',
      }
    }
  }
}
```

---

## SECTION 7 — TWO-ZONE DESIGN STRATEGY

```
ZONE 1 — Marketing Pages (Landing, About, Features):
  Full "Editorial Studio" system
  Bento-grid, Clash Display large, editorial photography
  Goal: First impression, trust, differentiation from WedMeGood

ZONE 2 — App / Functional Pages (Search, Dashboard, Booking, Chat):
  Same color palette and typography
  Standard functional UX patterns (lists, tables, forms)
  Editorial feel maintained via consistent colors + cards
  Functional icons allowed here
  Goal: Easy to use, fast, clear information hierarchy
```

---

*Version 1.0 | Created: August 2026*
*Author: BookMyVendor Product Team*
*RULE: Do not modify design tokens without updating this document first.*
*Next Review: After first 50 real user sessions (usability data driven updates only)*
