# CraftVilla Platform 🪵🎨

CraftVilla is a personalized gift and artisanal handicraft e-commerce platform tailored for Sri Lanka (currency: **LKR**). The platform connects discerning gift shoppers with verified master artisans across Sri Lanka (Kandy, Weligama, Galle, Kegalle, Negombo), enabling bespoke personalized engravings, live previews, curated gift hampers, milestone tracking, and artisan production workflows.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router, TypeScript strict mode, Turbopack)
- **Styling**: Vanilla CSS tokens integrated with [Tailwind CSS v4](https://tailwindcss.com)
- **Typography**: Google Fonts via `next/font/google`:
  - `Young Serif` (Headings & Logo branding)
  - `DM Sans` (Clean UI sans-serif)
  - `Caveat` (Artisanal handwritten script)
  - `Playfair Display` (Classic serif typography)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) with `persist` middleware
- **Icons**: [Lucide React](https://lucide.dev)
- **Database & ORM**: PostgreSQL with Prisma ORM *(Phase 2)*
- **Image Optimization & Signed Uploads**: Cloudinary *(Phase 3)*
- **Payments**: Multi-gateway abstraction (Card, Digital Wallet, Bank slip upload) *(Phase 3)*
- **Testing**: Jest unit & integration tests *(Phase 5)*

---

## 🚀 Phase 1 Completion Summary

### 1. Design & Typography
- Transferred all custom CSS variables (`--bg`, `--surface`, `--ink`, `--mut`, `--line`, `--accent`, `--accent-ink`, `--teak`, `--ok`, `--wood1`, `--wood2`) to `app/globals.css` and `@theme`.
- Implemented full light & dark mode support (`prefers-color-scheme: dark` and `:root[data-theme="dark"]` / `:root[data-theme="light"]`) with a header theme switcher.
- Strict keyboard accessibility (`:focus-visible`), touch target sizing, and standard ARIA attributes (`aria-current="page"`, `aria-label`, `role="status"`, `role="progressbar"`).

### 2. Routes
| Route | Purpose | Features |
|---|---|---|
| `/` | Catalog & Landing | Hero plaque preview, category chips (`Wood`, `Ceramic`, `Leather`, `Batik`, `Metal`, `Resin`, `Anniversary`, etc.), search bar, product grid |
| `/artisans` | Makers Directory | Profiles of the 6 verified artisans, location, rating, bio, and "Apply as an artisan" CTA |
| `/artisans/[slug]` | Artisan Profile | In-depth story, workshop location, verification badge, and list of products crafted by this artisan |
| `/customize/[productId]` | Bespoke Customizer | Real-time interactive wood plaque live preview, 40-character limit counter, font styles, wood finish swatches, 600×600 px photo validator, proof approval workflow, and Add to Cart |
| `/hampers` | Luxury Hampers | Ready-made boxes (Birthday, Anniversary, Corporate), multi-item artisan picker (at least 2 items), keepsake box options (Teak, Lacquer), dynamic price calculation |
| `/cart` | Client Cart | Zustand persistent cart, quantity adjustments, removal, luxury gift box packaging toggle (`+ LKR 450`), handwritten card note, delivery address input |
| `/checkout` | Order Checkout | Delivery details review, packaging options, payment method picker (Card, Digital Wallet, Bank Slip), total calculations |
| `/track/[orderId]` | Order Milestones | 5-stage progress stepper (`Confirmed`, `Proof approved`, `In crafting`, `Quality check`, `Dispatched`), stage-sensitive artisan notes, order code search |
| `/account` | Shopper Account | Profile information, order history with live status badges, direct links to track each order |
| `/login` | Authentication | Role switcher (`Customer`, `Artisan`, `Admin`), credentials validation, role-based redirects |
| `/register` | Registration | Full name input, email and password validation, role onboarding |
| `/artisan` | Artisan Dashboard | 4-column production Kanban board (`New orders`, `In crafting`, `Quality check`, `Ready to dispatch`), ticket advance actions, deadlines, workshop stats |
| `/admin` | Marketplace Admin | Real-time monthly revenue, gross sales, 8% commission metrics, artisan verification table with Approve/Reject, dispute resolution table |

### 3. Reusable Components
- `Header` (`components/Header.tsx`): Responsive navbar, active route indicator, cart counter badge, auth state link, and theme switch.
- `ProductCard` (`components/ProductCard.tsx`): Card showing background tint, emoji thumbnail, customizable badge, title, artisan link, base price in LKR, and customize CTA.
- `Customizer` (`components/Customizer.tsx`): Live engraving preview, character counter, font and finish controls, photo upload with HTML5 Image dimension verification, proof approval toggle, and cart submission.
- `PlaquePreview` (`components/PlaquePreview.tsx`): Wood grain overlay, gradient finish, sepia photo medallion, and embossed typography.
- `Stepper` (`components/Stepper.tsx`): 5-stage progress indicator with connecting lines and stage notes.
- `KanbanBoard` (`components/KanbanBoard.tsx`): 4-column drag/advance board for artisan production tickets.
- `Toast` (`components/Toast.tsx`): Accessible global notification toast with automatic timer dismiss.

---

## 📝 Assumptions (Phase 1)

1. **State Persistence**: In Phase 1 (frontend without backend), the client cart, auth session, orders, applications, and disputes are managed using `zustand` with `persist` (localStorage). When tickets are moved in the artisan Kanban board, orders immediately update across `/track/[orderId]` and `/account`.
2. **Pricing Structure**:
   - Base product price as defined in prototype.
   - Text engraving add-on: `+ LKR 400`
   - Photo engraving add-on: `+ LKR 600`
   - Handcrafted gift box packaging: `+ LKR 450`
   - Island-wide delivery fee: `+ LKR 450`
3. **Proof Approval Rule**: An order cannot be added to the cart until the user explicitly approves the proof in the customizer. Any change to engraving text, font, finish, or photo resets proof approval.
4. **Artisan Role Redirection**: When signing in with the `Artisan` role, the user is navigated directly to `/artisan`. When signing in with `Admin`, the user is navigated to `/admin`.

---

## 🏃 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node.js v20+)
- npm or pnpm

### Installation
```bash
git clone https://github.com/poornigamage2003/craftvilla-platform.git
cd craftvilla-platform
npm install
```

### Running Locally
```bash
npm run dev
# App runs at http://localhost:3000
```

### Building for Production
```bash
npm run build
npm run start
```
