export type UserRole = "CUSTOMER" | "ARTISAN" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type OrderStage =
  | "CONFIRMED"
  | "PROOF_APPROVED"
  | "IN_CRAFTING"
  | "QUALITY_CHECK"
  | "DISPATCHED"
  | "DELIVERED";

export interface Product {
  id: string;
  name: string;
  material: string;
  occasion: string;
  artisanName: string;
  artisanSlug: string;
  basePrice: number;
  emoji: string;
  bgColor: string;
  description: string;
  dimensions?: string;
  leadTimeDays: number;
  customizable: boolean;
}

export interface Artisan {
  id: string;
  slug: string;
  name: string;
  location: string;
  category: string;
  bio: string;
  rating: number;
  verified: boolean;
  commissionRate: number;
  joinedYear?: number;
}

export interface FinishOption {
  id: number;
  name: string;
  startColor: string;
  endColor: string;
}

export interface FontOption {
  id: string;
  name: string;
  family: string;
  className: string;
}

export interface CartItem {
  id: string;
  productId?: string;
  name: string;
  text: string;
  font: string;
  finish: string;
  qty: number;
  price: number;
  imageUrl?: string | null;
  proofApproved: boolean;
  isHamper?: boolean;
  hamperItems?: string[];
}

export interface Order {
  id: number;
  code: string;
  name: string;
  items: CartItem[];
  col: number; // 0: New orders, 1: In crafting, 2: Quality check, 3: Ready to dispatch, 4: Dispatched
  stage: OrderStage;
  subtotal: number;
  packagingFee: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: string;
  customerName: string;
  customerEmail: string;
  giftWrap: boolean;
  giftMessage?: string;
  paymentMethod: "Card" | "Digital wallet" | "Bank slip upload";
  createdAt: string;
}

export interface Dispute {
  id: string;
  orderCode: string;
  issue: string;
  status: "OPEN" | "RESOLVED";
}

export interface ArtisanApplication {
  id: string;
  name: string;
  location: string;
  category: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}
