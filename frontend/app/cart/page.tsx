"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cartStore";
import { useAuthStore } from "@/lib/store/authStore";
import { useOrderStore } from "@/lib/store/orderStore";
import { useToastStore } from "@/lib/store/toastStore";
import { formatLKR } from "@/lib/utils";
import { useIsMounted } from "@/lib/useIsMounted";
import { ShoppingBag, ArrowRight, Trash2, ShieldCheck, CreditCard, Gift } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const mounted = useIsMounted();
  const {
    items,
    removeItem,
    clearCart,
    giftWrap,
    setGiftWrap,
    giftMessage,
    setGiftMessage,
    deliveryAddress,
    setDeliveryAddress,
    paymentMethod,
    setPaymentMethod,
    getSubtotal,
  } = useCartStore();

  const { user } = useAuthStore();
  const { placeOrder } = useOrderStore();
  const { showToast } = useToastStore();

  if (!mounted) {
    return (
      <div className="py-12 text-center">
        <h2>Your Cart</h2>
        <p className="sub">Loading your bespoke items...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2>Your Bespoke Cart</h2>
          <p className="sub">Review your customized craft inscriptions and packaging.</p>
        </div>
        <div className="panel empty py-16 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-full bg-[var(--line)]/50 text-[var(--mut)] flex items-center justify-center mx-auto text-2xl">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h3 className="text-xl">Your cart is currently empty</h3>
          <p className="text-xs text-[var(--mut)] max-w-sm mx-auto">
            Explore our master craft catalog or personalize a solid teak plaque with your bespoke words.
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <Link href="/catalog" className="btn gold text-xs py-2 px-4">
              Browse All Crafts
            </Link>
            <Link href="/customizer" className="btn ghost text-xs py-2 px-4">
              Personalize a Gift
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const packagingFee = giftWrap ? 350 : 0;
  const deliveryFee = 450;
  const total = subtotal + packagingFee + deliveryFee;
  const installmentPerMonth = Math.round(total / 3);

  const handlePayAndPlaceOrder = () => {
    if (!user) {
      showToast("Please sign in to place your bespoke order");
      router.push("/login?redirect=cart");
      return;
    }

    if (!deliveryAddress.trim()) {
      showToast("Please add your delivery address");
      document.getElementById("addr")?.focus();
      return;
    }

    const orderName =
      items[0].name + (items.length > 1 ? ` +${items.length - 1} more` : "");

    const newOrder = placeOrder({
      name: orderName,
      items: [...items],
      subtotal,
      packagingFee,
      deliveryFee,
      total,
      deliveryAddress: deliveryAddress.trim(),
      customerName: user.name,
      customerEmail: user.email,
      giftWrap,
      giftMessage: giftMessage.trim() || undefined,
      paymentMethod,
    });

    clearCart();
    showToast(`Order #${newOrder.code} placed successfully!`);
    router.push(`/track/${newOrder.code}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Your Bespoke Cart</h2>
        <p className="sub">
          Review your customized items, inscription proofs, eco-friendly gift wrap, and delivery details.
        </p>
      </div>

      <div className="split">
        {/* Left Column: Itemized Cart Review */}
        <div className="panel space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
            <h3 className="text-lg">Customized Items ({items.length})</h3>
            <span className="text-xs text-[var(--ok)] font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Digital Proofs Approved</span>
            </span>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] flex flex-col sm:flex-row gap-4 justify-between items-start">
                <div className="flex gap-3.5 items-start">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt="Custom Proof"
                      className="w-14 h-14 rounded-lg object-cover border border-[var(--line)] filter sepia-[0.4] shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-[var(--bg)] border border-[var(--line)] flex items-center justify-center text-2xl shrink-0">
                      🎨
                    </div>
                  )}

                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-[var(--ink)]">
                      {item.name} <span className="text-xs text-[var(--mut)]">× {item.qty}</span>
                    </h4>
                    <p className="text-xs text-[var(--ink)] bg-[var(--bg)]/70 px-2.5 py-1 rounded-md border border-[var(--line)]/50">
                      <b>Inscription:</b> &ldquo;{item.text}&rdquo;
                    </p>
                    <p className="text-[11px] text-[var(--mut)]">
                      Finish: <span className="font-medium text-[var(--ink)]">{item.finish}</span> · Font: {item.font || "Artisanal"}
                    </p>
                  </div>
                </div>

                <div className="sm:text-right flex sm:flex-col justify-between w-full sm:w-auto items-center sm:items-end pt-2 sm:pt-0 border-t sm:border-0 border-[var(--line)]">
                  <span className="font-bold text-sm text-[var(--ink)]">
                    {formatLKR(item.price)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 mt-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Eco-Friendly Packaging Toggle */}
          <div className="pt-2 border-t border-[var(--line)] space-y-4">
            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-[var(--line)] bg-[var(--bg)] cursor-pointer">
              <input
                type="checkbox"
                id="wrap"
                checked={giftWrap}
                onChange={(e) => setGiftWrap(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-[var(--accent)]"
              />
              <div>
                <b className="text-xs text-[var(--ink)] flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-[var(--accent)]" />
                  <span>Eco-friendly gift wrapping with wax seal &amp; botanical twine (+ LKR 350)</span>
                </b>
                <p className="text-[11px] text-[var(--mut)] mt-0.5">
                  Hand-wrapped using recycled craft pulp paper, cinnamon bark scent, and dried floral sprigs.
                </p>
              </div>
            </label>

            <div>
              <label htmlFor="msg">Handwritten Card Message (Optional)</label>
              <textarea
                id="msg"
                rows={2}
                maxLength={120}
                placeholder="Message inscribed on unbleached cotton rag card..."
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                className="text-xs"
              />
            </div>

            <div>
              <label htmlFor="addr">Recipient Delivery Address (Sri Lanka)</label>
              <textarea
                id="addr"
                rows={2}
                placeholder="Street address, apartment, city, and postal district (e.g. 14 Flower Road, Colombo 07)"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div>
              <label htmlFor="pay">Payment Preference</label>
              <select
                id="pay"
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value as "Card" | "Digital wallet" | "Bank slip upload"
                  )
                }
                className="text-xs"
              >
                <option value="Card">Credit / Debit Card (Visa, MasterCard, Amex)</option>
                <option value="Digital wallet">Digital Wallet (FriMi, Genie, eZ Cash)</option>
                <option value="Bank slip upload">Direct Bank Transfer Slip Upload</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Installment Calculation */}
        <div className="panel space-y-4 lg:sticky lg:top-24">
          <h3 className="text-lg pb-2 border-b border-[var(--line)]">Order Summary</h3>

          <div className="space-y-2 text-xs">
            <div className="line py-1">
              <span className="text-[var(--mut)]">Subtotal ({items.length} crafts)</span>
              <span className="font-semibold text-[var(--ink)]">{formatLKR(subtotal)}</span>
            </div>
            <div className="line py-1">
              <span className="text-[var(--mut)]">Eco-Friendly Gift Wrap</span>
              <span className="font-semibold text-[var(--ink)]">{formatLKR(packagingFee)}</span>
            </div>
            <div className="line py-1">
              <span className="text-[var(--mut)]">Island-wide Courier Transit</span>
              <span className="font-semibold text-[var(--ink)]">{formatLKR(deliveryFee)}</span>
            </div>
            <div className="line total pt-3 border-t border-[var(--line)] text-base font-bold">
              <span>Total Payable</span>
              <span className="text-xl text-[var(--ink)]">{formatLKR(total)}</span>
            </div>
          </div>

          {/* 3-Month Installment Calculation Callout */}
          <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[var(--ink)]">
              <CreditCard className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>3-Month Interest-Free Installments</span>
            </div>
            <p className="text-[11px] text-[var(--mut)]">
              Or pay <b>3 monthly installments of {formatLKR(installmentPerMonth)}</b> using Koko or Mintpay at checkout.
            </p>
          </div>

          <button
            type="button"
            className="btn gold w-full text-base font-bold shadow-md py-3"
            onClick={handlePayAndPlaceOrder}
          >
            Pay &amp; Place Bespoke Order
          </button>

          <Link
            href="/checkout"
            className="btn ghost w-full text-xs py-2.5 flex items-center justify-center gap-1.5"
          >
            <span>Proceed to Dedicated Checkout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <p className="text-[11px] text-[var(--mut)] text-center">
            🔒 256-bit SSL encrypted checkout. Bespoke items are hand-carved upon proof verification.
          </p>
        </div>
      </div>
    </div>
  );
}
