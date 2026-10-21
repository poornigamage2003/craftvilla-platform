# 🎨 CraftVilla | Personalized Gift & Handicraft E-Commerce Platform

> Prepared for student **Poorni Gamage**  
> Currency: **Sri Lankan Rupee (LKR)**  
> Architecture: Split Monorepo (`frontend/` + `backend/`)

CraftVilla is a personalized gift and artisanal handicraft e-commerce marketplace connecting discerning gift shoppers with verified master craftspersons across Sri Lanka (Kandy, Weligama, Galle Fort, Kegalle, and Negombo).

---

## 🏗️ Repository Architecture

```
craftvilla-platform/
├── frontend/                         (Next.js App Router, React 19, Tailwind CSS v4, Lucide-React)
│   ├── app/
│   │   ├── (catalog)/catalog         Faceted filter catalog (Material, Personalization, Price, Lead Time)
│   │   ├── (customizer)/customizer   Personalized gifts hub & bespoke studio
│   │   ├── products/[id]/customize   Split-screen 1:1 live preview customizer canvas
│   │   ├── hampers/                  3-Step keepsake box & multi-item hamper builder
│   │   ├── cart/                     Itemized review with proofs, eco-wrap (+LKR 350), 3-mo installments
│   │   ├── checkout/                 Multi-gateway checkout (PayHere, 3-mo Koko/Mintpay, Bank slip)
│   │   ├── track/ & track/[orderId]  5-stage live milestone progress stepper
│   │   ├── artisans/ & [slug]        Verified artisan directory & studio profiles
│   │   ├── artisan/                  Artisan Studio portal with Kanban pipeline & lead time manager
│   │   ├── artisan/register          Artisan onboarding portal with workshop portfolio upload
│   │   ├── admin/                    Super Admin portal with revenue charts, verification queue, disputes
│   │   ├── about/                    Artisan heritage stories & fair-trade mission
│   │   ├── contact/                  Direct customer care & support ticket form
│   │   ├── policies/returns          Bespoke and custom goods policy
│   │   ├── login/ & register/        Unified authentication with role-based routing
│   │   ├── layout.tsx                Global layout with Header, Footer, and Toast
│   │   └── globals.css               Tailwind CSS tokens and prototype styling
│   ├── components/
│   │   ├── Header.tsx                Navbar with logo, live debounced search, nav links, cart badge
│   │   ├── Footer.tsx                Footer with mission, category links, artisan care, copyright
│   │   ├── Customizer.tsx            Split-screen customizer with fonts (Cinzel, Script, Modern), stains, upload
│   │   ├── PlaquePreview.tsx         1:1 Live wood plaque preview canvas
│   │   ├── KanbanBoard.tsx           4-column production pipeline with spec downloads, proof upload, shipping label
│   │   ├── Stepper.tsx               5-stage milestone progress bar with handwritten notes
│   │   ├── ProductCard.tsx           Card with customizable badge, artisan link, LKR price
│   │   └── Toast.tsx                 Global notification toast
│   ├── lib/
│   │   ├── data.ts                   6 Verified artisans, 8 products, hamper presets, initial orders
│   │   ├── types.ts                  Strict TypeScript interfaces (no `any`)
│   │   ├── store/                    Zustand stores (cartStore, orderStore, authStore, toastStore)
│   │   └── utils.ts                  LKR currency format and slug utility
│   └── middleware.ts                 Route protection for /artisan/* and /admin/*
└── backend/                          (Node.js, Express.js, Prisma ORM, PostgreSQL)
    ├── prisma/
    │   └── schema.prisma             Comprehensive schema: User, Role, ArtisanProfile, Product, Customization, Order, Payment, Hamper, Dispute
    ├── src/
    │   └── index.ts                  Express API server with CORS, cookie-parser, and /api/health
    └── .env.example                  PostgreSQL, JWT, and Cloudinary configuration template
```

---

## 🌟 Master Checklist Implementation Status

### 1. Global Navigation & Layout
- [x] **Header (Navbar)**:
  - Brand logo: `🎨 CraftVilla | Artisan Gifts`
  - Navigation links: Home (`/`), All Crafts (`/catalog`), Personalized Gifts (`/customizer`), Gift Hampers (`/hampers`), Artisan Directory (`/artisans`), Track Order (`/track`)
  - Live search input with real-time debounced query handling and instant matching crafts dropdown
  - Dynamic cart trigger badge with live item count
  - Role-based action buttons ("Sign In", "Artisan Studio", "Admin Panel", user avatar)
- [x] **Footer**:
  - Brand story and mission on empowering rural Sri Lankan artisans (85%+ proceeds to makers)
  - Craft category quick links (Woodwork, Resin, Pottery, Batik, Leather, Metal)
  - Artisan network links (Meet the Makers, Become an Artisan, Studio Portal, Standards)
  - Customer care & policies (Track Order, Bespoke Returns Policy, Mission, Contact)
  - Copyright: `© 2026 CraftVilla by Poorni Gamage. All Rights Reserved.`

### 2. Customer-Facing Modules
- [x] **Home / Landing Page (`/`)**:
  - Hero Section: High-impact typography, artisan badge, CTA to browse personalized gifts, and live plaque preview
  - Category Showcase Grid: Visual cards for Woodwork, Resin Art, Pottery, and Batik
  - Featured Artisans Section: Verified master craftsperson profiles with workshop location and rating
  - Trending Bespoke Gifts: Product cards with real-time "Customizable" status badges and category tabs
  - Social Proof: Verified customer reviews and artisan impact statistics (50+ families, 1,400+ proofs delivered)
- [x] **Product Catalog & Faceted Filter (`/catalog`)**:
  - Multi-facet filters: Material, Personalization Type (Engraving, Photo Etching, Text Stamp), Price Slider (LKR 1,500 – 7,500), and Crafting Lead Time (Express 1-2d vs Standard 3-5d)
  - Responsive product card grid with instant "Customize & Buy" triggers
- [x] **Interactive Product Customizer (`/products/[id]/customize` & `/customizer`)**:
  - Split-screen UI: Left side features a live 1:1 preview canvas rendering custom text, font, stain, and uploaded images in real time; right side contains controls for dimensions, material stains (Natural Teak, Rich Walnut, Dark Ebony), inscription inputs with font selectors (`Cinzel / Monumental Serif`, `Script / Calligraphy`, `Modern Clean Sans`), and image upload dropzone with client-side validation (min 600×600 px)
  - Live lead-time estimate and proof approval requirement before "Add to Cart"
- [x] **Curated Gift Hamper & Box Builder (`/hampers`)**:
  - Step 1: Select Box Type (Pine Wood Keepsake Box, Eco-Kraft Box, Luxury Lacquer Box)
  - Step 2: Interactive multi-item selection tray (bundle 2–4 artisan items)
  - Step 3: Add handwritten calligraphy greeting card message and botanical twine with red wax seal packaging (+LKR 350)
- [x] **Shopping Cart & Checkout (`/cart`, `/checkout`)**:
  - Itemized review displaying custom text, stain choices, and thumbnail proofs
  - Eco-friendly gift wrapping toggle (+LKR 350) and recipient address inputs with district selector
  - Multi-gateway checkout: Credit/Debit Card (PayHere simulator), Bank Transfer slip upload with bank details, and 3-month installment calculations (Koko / Mintpay)
- [x] **Live Order Tracking (`/track` & `/track/[orderId]`)**:
  - Search order code input + quick recent order buttons
  - Real-time milestone stepper: Confirmed → In Crafting → Quality Checked → Dispatched with stage-specific artisan messages
- [x] **Static Informational Pages**:
  - `/about`: Artisan heritage stories, fair-trade mission, and regional hubs
  - `/contact`: Direct support inquiry form with auto ticket assignment
  - `/policies/returns`: Clear terms governing custom/bespoke goods and proof approval binding commitment

### 3. User Authentication & Access Control
- [x] Multi-role user models in Prisma schema: Role enum (`CUSTOMER`, `ARTISAN`, `ADMIN`)
- [x] Unified `/login` page with role-based routing (Customers to account, Artisans to `/artisan`, Admins to `/admin`)
- [x] Dedicated `/artisan/register` portal with workshop portfolio upload fields
- [x] Route protection middleware (`middleware.ts`) restricting `/artisan/*` and `/admin/*` paths

### 4. Artisan Workshop Portal (`/artisan`)
- [x] Studio Header: Status toggle ("Accepting Orders" vs "On Break"), active order count, pending payouts in LKR, and studio rating (4.9 ★)
- [x] Kanban Production Pipeline:
  - Column 1: New Orders (Order ID, specs, "Accept & Lock Ticket")
  - Column 2: In Crafting (Progress notes, "Download Customer Specs" text sheet)
  - Column 3: Quality Check ("Upload Inspection Proof" modal with photo upload)
  - Column 4: Ready to Dispatch ("Print Courier Manifest & Airway Bill" printable modal, "Hand to Courier")
- [x] Product & Lead Time Manager: Drawer to add new craft listings and adjust production lead times per craft

### 5. Super Admin Portal (`/admin`)
- [x] Platform Analytics Dashboard: Sales revenue charts, order completion metrics, top-selling materials progress bars
- [x] Artisan Verification Queue: Review artisan applications, inspect workshop sample portfolios, approve/reject
- [x] Financial Ledger & Dispute Management: Bi-weekly payout disbursements and customer dispute resolution

---

## 🚀 Running the Project

### 1. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:3000
```

### 2. Backend (Node.js + Express + Prisma)
```bash
cd backend
npm install
npm run prisma:generate
npm run dev
# Running on http://localhost:5000 (Health check: http://localhost:5000/api/health)
```

### 3. Root Convenient Scripts
From the root directory:
```bash
# Run frontend
npm run dev:frontend

# Run backend
npm run dev:backend

# Build frontend
npm run build:frontend

# Build backend
npm run build:backend
```
