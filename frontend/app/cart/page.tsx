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
      <div>
        <h2>Your cart</h2>
        <p className="sub">Loading cart contents...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div>
        <h2>Your cart</h2>
        <p className="sub">Add packaging, a card message and a delivery address.</p>
        <div className="panel empty">
          <p className="text-lg mb-4">Your cart is empty.</p>
          <Link href="/" className="btn gold">
            Browse gifts
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const packagingFee = giftWrap ? 450 : 0;
  const deliveryFee = 450;
  const total = subtotal + packagingFee + deliveryFee;

  const handlePayAndPlaceOrder = () => {
    if (!user) {
      showToast("Sign in to place your order");
      router.push("/login?redirect=cart");
      return;
    }

    if (!deliveryAddress.trim()) {
      showToast("Add a delivery address");
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
    showToast(`Order #${newOrder.code} placed`);
    router.push(`/track/${newOrder.code}`);
  };

  return (
    <div>
      <h2>Your cart</h2>
      <p className="sub">Add packaging, a card message and a delivery address.</p>

      <div className="split">
        {/* Left column: Cart Items & Customization Options */}
        <div className="panel">
          <h3 className="text-xl mb-3">Customized items</h3>

          <div className="flex flex-col gap-1 mb-4">
            {items.map((item) => (
              <div key={item.id} className="line">
                <div>
                  <b className="text-[var(--ink)]">{item.name}</b> × {item.qty}
                  <br />
                  <small className="text-[var(--mut)]">
                    {item.isHamper
                      ? `Includes: ${item.text} · ${item.finish} box`
                      : `Engraving: “${item.text}” · ${item.font} · ${item.finish}`}
                  </small>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-[var(--ink)] block">
                    {formatLKR(item.price)}
                  </span>
                  <button
                    type="button"
                    className="btn ghost text-xs py-1 px-2.5 mt-1"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer font-medium mt-4">
            <input
              type="checkbox"
              id="wrap"
              checked={giftWrap}
              onChange={(e) => setGiftWrap(e.target.checked)}
              className="w-4 h-4 cursor-pointer"
            />
            Handcrafted gift box (+ LKR 450)
          </label>

          <label htmlFor="msg">Greeting card message</label>
          <textarea
            id="msg"
            rows={2}
            maxLength={120}
            placeholder="Optional gift note written by hand"
            value={giftMessage}
            onChange={(e) => setGiftMessage(e.target.value)}
          />

          <label htmlFor="addr">Delivery address</label>
          <textarea
            id="addr"
            rows={2}
            placeholder="House no, street, city (e.g. 14 Flower Road, Colombo 07)"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            required
          />

          <label htmlFor="pay">Payment method</label>
          <select
            id="pay"
            value={paymentMethod}
            onChange={(e) =>
              setPaymentMethod(
                e.target.value as "Card" | "Digital wallet" | "Bank slip upload"
              )
            }
          >
            <option value="Card">Card (Visa, Mastercard)</option>
            <option value="Digital wallet">Digital wallet (FriMi, Genie, eZ Cash)</option>
            <option value="Bank slip upload">Bank slip upload</option>
          </select>

          <div className="note mt-3">
            Payments are encrypted. Custom items are non-refundable once you approve the proof.
          </div>
        </div>

        {/* Right column: Order Summary & Placement */}
        <div className="panel">
          <h3 className="text-xl mb-3">Order summary</h3>

          <div className="line">
            <span>Products</span>
            <span>{formatLKR(subtotal)}</span>
          </div>

          <div className="line">
            <span>Packaging</span>
            <span id="sp">{formatLKR(packagingFee)}</span>
          </div>

          <div className="line">
            <span>Delivery</span>
            <span>{formatLKR(deliveryFee)}</span>
          </div>

          <div className="line total">
            <span>Total</span>
            <span id="st">{formatLKR(total)}</span>
          </div>

          <button
            type="button"
            className="btn gold w-full mt-4 text-base"
            onClick={handlePayAndPlaceOrder}
          >
            Pay and place order
          </button>

          <div className="mt-3 text-center">
            <Link
              href="/checkout"
              className="text-sm text-[var(--mut)] hover:text-[var(--ink)] underline"
            >
              Or review detailed checkout page →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
