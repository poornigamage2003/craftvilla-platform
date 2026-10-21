"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cartStore";
import { useAuthStore } from "@/lib/store/authStore";
import { useOrderStore } from "@/lib/store/orderStore";
import { useToastStore } from "@/lib/store/toastStore";
import { formatLKR } from "@/lib/utils";

import { useIsMounted } from "@/lib/useIsMounted";

export default function CheckoutPage() {
  const router = useRouter();
  const mounted = useIsMounted();
  const {
    items,
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

  const [bankSlipRef, setBankSlipRef] = useState("");
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!mounted) {
    return <div><p className="sub">Loading checkout...</p></div>;
  }

  if (items.length === 0) {
    return (
      <div className="panel empty">
        <h2>Checkout</h2>
        <p className="my-4">No items in your cart to checkout.</p>
        <Link href="/" className="btn gold">
          Browse gifts
        </Link>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const packagingFee = giftWrap ? 450 : 0;
  const deliveryFee = 450;
  const total = subtotal + packagingFee + deliveryFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      showToast("Sign in to place your order");
      router.push("/login?redirect=checkout");
      return;
    }

    if (!deliveryAddress.trim()) {
      showToast("Please provide a delivery address");
      document.getElementById("checkout-addr")?.focus();
      return;
    }

    setIsSubmitting(true);

    const orderName =
      items[0].name + (items.length > 1 ? ` +${items.length - 1} more` : "");

    setTimeout(() => {
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
      setIsSubmitting(false);
      showToast(`Order #${newOrder.code} confirmed!`);
      router.push(`/track/${newOrder.code}`);
    }, 400);
  };

  return (
    <div>
      <h2>Checkout</h2>
      <p className="sub">Complete your bespoke artisanal order with secure checkout.</p>

      <form onSubmit={handleSubmitOrder} className="split">
        {/* Left: Delivery & Payment Details */}
        <div className="panel">
          <h3 className="text-xl mb-3">1. Delivery details</h3>

          <label htmlFor="customer-name">Recipient / Contact name</label>
          <input
            type="text"
            id="customer-name"
            defaultValue={user?.name || "Shopper"}
            readOnly
            className="opacity-80"
          />

          <label htmlFor="checkout-addr">Delivery address</label>
          <textarea
            id="checkout-addr"
            rows={3}
            placeholder="House no, street address, city, postal district"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            required
          />

          <h3 className="text-xl mt-6 mb-3">2. Packaging & Gift options</h3>
          <label className="flex items-center gap-2 cursor-pointer font-medium">
            <input
              type="checkbox"
              checked={giftWrap}
              onChange={(e) => setGiftWrap(e.target.checked)}
              className="w-4 h-4 cursor-pointer"
            />
            Handcrafted luxury gift box (+ LKR 450)
          </label>

          <label htmlFor="checkout-msg">Personal handwritten card message</label>
          <textarea
            id="checkout-msg"
            rows={2}
            maxLength={120}
            placeholder="Write words you want included inside the package"
            value={giftMessage}
            onChange={(e) => setGiftMessage(e.target.value)}
          />

          <h3 className="text-xl mt-6 mb-3">3. Payment method</h3>
          <select
            value={paymentMethod}
            onChange={(e) =>
              setPaymentMethod(
                e.target.value as "Card" | "Digital wallet" | "Bank slip upload"
              )
            }
          >
            <option value="Card">Card (Visa, Mastercard, Amex)</option>
            <option value="Digital wallet">Digital wallet (FriMi, Genie, eZ Cash)</option>
            <option value="Bank slip upload">Bank transfer / slip upload</option>
          </select>

          {paymentMethod === "Card" && (
            <div className="mt-3 p-3 bg-[var(--bg)] rounded-lg border border-[var(--line)]">
              <label htmlFor="card-num" className="mt-0">Card number (Demo)</label>
              <input
                type="text"
                id="card-num"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <label htmlFor="card-exp" className="mt-0">Expiry</label>
                  <input
                    type="text"
                    id="card-exp"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="card-cvv" className="mt-0">CVC</label>
                  <input type="text" id="card-cvv" defaultValue="123" />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "Bank slip upload" && (
            <div className="mt-3 p-3 bg-[var(--bg)] rounded-lg border border-[var(--line)]">
              <p className="text-xs text-[var(--mut)] mb-2">
                Transfer to Commercial Bank CraftVilla PLC Acc #8102938471 (Kandy Branch).
              </p>
              <label htmlFor="slip-ref" className="mt-0">Bank transaction reference or slip #</label>
              <input
                type="text"
                id="slip-ref"
                placeholder="e.g. REF-20261021-992"
                value={bankSlipRef}
                onChange={(e) => setBankSlipRef(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Right: Review & Pay */}
        <div className="panel">
          <h3 className="text-xl mb-3">Order items ({items.length})</h3>

          <div className="flex flex-col gap-2 mb-4 max-h-60 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="line text-sm py-2">
                <div>
                  <b>{item.name}</b> × {item.qty}
                  <div className="text-xs text-[var(--mut)]">
                    {item.isHamper
                      ? item.text
                      : `“${item.text}” (${item.finish})`}
                  </div>
                </div>
                <span>{formatLKR(item.price)}</span>
              </div>
            ))}
          </div>

          <div className="line">
            <span>Subtotal</span>
            <span>{formatLKR(subtotal)}</span>
          </div>
          <div className="line">
            <span>Gift packaging</span>
            <span>{formatLKR(packagingFee)}</span>
          </div>
          <div className="line">
            <span>Island-wide courier delivery</span>
            <span>{formatLKR(deliveryFee)}</span>
          </div>
          <div className="line total">
            <span>Total payable</span>
            <span className="text-xl">{formatLKR(total)}</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn gold w-full mt-5 text-base"
          >
            {isSubmitting ? "Processing..." : `Confirm & Pay ${formatLKR(total)}`}
          </button>

          <p className="note text-center mt-3">
            Handcrafted with care. You can track progress anytime from your account.
          </p>
        </div>
      </form>
    </div>
  );
}
