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
import { CreditCard, UploadCloud, ShieldCheck, CheckCircle2, Building, Sparkles, Gift } from "lucide-react";

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
    setPaymentMethod,
    getSubtotal,
  } = useCartStore();

  const { user } = useAuthStore();
  const { placeOrder } = useOrderStore();
  const { showToast } = useToastStore();

  const [bankSlipRef, setBankSlipRef] = useState("");
  const [bankSlipUploaded, setBankSlipUploaded] = useState(false);
  const [installmentPlan, setInstallmentPlan] = useState<"koko" | "mintpay">("koko");
  const [selectedGateway, setSelectedGateway] = useState<"card" | "installments" | "bank">("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipientDistrict, setRecipientDistrict] = useState("Colombo");

  if (!mounted) {
    return <div className="py-12 text-center"><p className="sub">Loading secure checkout...</p></div>;
  }

  if (items.length === 0) {
    return (
      <div className="panel empty py-16 text-center max-w-lg mx-auto space-y-4">
        <h2>Bespoke Checkout</h2>
        <p className="text-xs text-[var(--mut)]">No bespoke crafts in cart to checkout.</p>
        <Link href="/catalog" className="btn gold text-xs py-2 px-4">
          Browse All Crafts
        </Link>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const packagingFee = giftWrap ? 350 : 0;
  const deliveryFee = 450;
  const total = subtotal + packagingFee + deliveryFee;
  const monthlyInstallment = Math.round(total / 3);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      showToast("Please sign in to place your order");
      router.push("/login?redirect=checkout");
      return;
    }

    if (!deliveryAddress.trim()) {
      showToast("Please provide a recipient delivery address");
      document.getElementById("checkout-addr")?.focus();
      return;
    }

    setIsSubmitting(true);

    const orderName =
      items[0].name + (items.length > 1 ? ` +${items.length - 1} more` : "");

    const finalPaymentMethod =
      selectedGateway === "card"
        ? "Card"
        : selectedGateway === "installments"
        ? "Digital wallet"
        : "Bank slip upload";

    setTimeout(() => {
      const newOrder = placeOrder({
        name: orderName,
        items: [...items],
        subtotal,
        packagingFee,
        deliveryFee,
        total,
        deliveryAddress: `${deliveryAddress.trim()}, ${recipientDistrict} District`,
        customerName: user.name,
        customerEmail: user.email,
        giftWrap,
        giftMessage: giftMessage.trim() || undefined,
        paymentMethod: finalPaymentMethod,
      });

      clearCart();
      setIsSubmitting(false);
      showToast(`Order #${newOrder.code} confirmed! Milestone tracking activated.`);
      router.push(`/track/${newOrder.code}`);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--ok)]" />
          <span>PayHere &amp; Bank Verified Gateway</span>
        </div>
        <h2>Finalize Bespoke Order</h2>
        <p className="sub">
          Verify delivery details, artisan packaging, and select your preferred Sri Lankan payment method.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="split">
        {/* Left Column: Delivery & Payment Details */}
        <div className="panel space-y-6">
          {/* Section 1: Delivery Details */}
          <div>
            <h3 className="text-lg pb-2 border-b border-[var(--line)] mb-4">
              1. Recipient &amp; Delivery Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label htmlFor="customer-name" className="text-xs">Contact Name</label>
                <input
                  type="text"
                  id="customer-name"
                  defaultValue={user?.name || "Shopper"}
                  readOnly
                  className="opacity-80 text-xs py-2"
                />
              </div>
              <div>
                <label htmlFor="customer-email" className="text-xs">Confirmation Email</label>
                <input
                  type="email"
                  id="customer-email"
                  defaultValue={user?.email || "shopper@craftvilla.lk"}
                  readOnly
                  className="opacity-80 text-xs py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div className="sm:col-span-2">
                <label htmlFor="checkout-addr" className="text-xs">Street Address &amp; House No.</label>
                <input
                  type="text"
                  id="checkout-addr"
                  placeholder="e.g. 45/2 Peradeniya Road"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  required
                  className="text-xs py-2"
                />
              </div>
              <div>
                <label htmlFor="district" className="text-xs">Postal District</label>
                <select
                  id="district"
                  value={recipientDistrict}
                  onChange={(e) => setRecipientDistrict(e.target.value)}
                  className="text-xs py-2"
                >
                  <option value="Colombo">Colombo</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Galle">Galle</option>
                  <option value="Gampaha">Gampaha</option>
                  <option value="Kalutara">Kalutara</option>
                  <option value="Matara">Matara</option>
                  <option value="Kurunegala">Kurunegala</option>
                  <option value="Anuradhapura">Anuradhapura</option>
                  <option value="Jaffna">Jaffna</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Eco-friendly Gift Wrap & Card */}
          <div>
            <h3 className="text-lg pb-2 border-b border-[var(--line)] mb-4">
              2. Packaging &amp; Handwritten Inscription
            </h3>

            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-[var(--line)] bg-[var(--bg)] cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={giftWrap}
                onChange={(e) => setGiftWrap(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-[var(--accent)]"
              />
              <div>
                <b className="text-xs text-[var(--ink)] flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Eco-Friendly Kraft Packaging &amp; Red Wax Seal (+ LKR 350)</span>
                </b>
                <p className="text-[11px] text-[var(--mut)] mt-0.5">
                  Artisanal unbleached recycled board, cinnamon aroma cushion, and stamped insignia wax.
                </p>
              </div>
            </label>

            <div>
              <label htmlFor="checkout-msg" className="text-xs">Greeting Card Inscription (Optional)</label>
              <textarea
                id="checkout-msg"
                rows={2}
                maxLength={120}
                placeholder="Message inscribed by our studio calligrapher on unbleached card..."
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          {/* Section 3: Multi-Gateway Checkout */}
          <div>
            <h3 className="text-lg pb-2 border-b border-[var(--line)] mb-4">
              3. Payment Gateway Selection
            </h3>

            {/* Gateway Selector Tabs */}
            <div className="grid grid-cols-3 gap-2.5 mb-4">
              <button
                type="button"
                onClick={() => {
                  setSelectedGateway("card");
                  setPaymentMethod("Card");
                }}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  selectedGateway === "card"
                    ? "border-[var(--accent)] bg-[var(--accent)]/10 font-bold"
                    : "border-[var(--line)] bg-[var(--bg)]/50"
                }`}
              >
                <CreditCard className="w-5 h-5 text-[var(--accent)] mb-1" />
                <p className="text-xs text-[var(--ink)]">PayHere Card</p>
                <p className="text-[10px] text-[var(--mut)]">Visa / Master / Amex</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedGateway("installments");
                  setPaymentMethod("Digital wallet");
                }}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  selectedGateway === "installments"
                    ? "border-[var(--accent)] bg-[var(--accent)]/10 font-bold"
                    : "border-[var(--line)] bg-[var(--bg)]/50"
                }`}
              >
                <Sparkles className="w-5 h-5 text-indigo-500 mb-1" />
                <p className="text-xs text-[var(--ink)]">3-Mo Installments</p>
                <p className="text-[10px] text-[var(--mut)]">Koko / Mintpay</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedGateway("bank");
                  setPaymentMethod("Bank slip upload");
                }}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  selectedGateway === "bank"
                    ? "border-[var(--accent)] bg-[var(--accent)]/10 font-bold"
                    : "border-[var(--line)] bg-[var(--bg)]/50"
                }`}
              >
                <Building className="w-5 h-5 text-[var(--ok)] mb-1" />
                <p className="text-xs text-[var(--ink)]">Bank Transfer</p>
                <p className="text-[10px] text-[var(--mut)]">Direct Slip Upload</p>
              </button>
            </div>

            {/* PayHere Card Simulator Container */}
            {selectedGateway === "card" && (
              <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] space-y-3">
                <div className="flex items-center justify-between text-xs text-[var(--mut)] pb-2 border-b border-[var(--line)]">
                  <span className="font-bold text-[var(--ink)]">PayHere Sandbox Integration</span>
                  <span className="text-[var(--ok)] font-medium">✓ Secure SSL Active</span>
                </div>
                <div>
                  <label htmlFor="card-sim-num" className="text-xs">Card Number</label>
                  <input
                    type="text"
                    id="card-sim-num"
                    defaultValue="4111 2222 3333 4444"
                    className="text-xs py-2 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="card-sim-exp" className="text-xs">Expires</label>
                    <input
                      type="text"
                      id="card-sim-exp"
                      defaultValue="12/28"
                      className="text-xs py-2 font-mono"
                    />
                  </div>
                  <div>
                    <label htmlFor="card-sim-cvv" className="text-xs">CVV</label>
                    <input
                      type="text"
                      id="card-sim-cvv"
                      defaultValue="982"
                      className="text-xs py-2 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Installments Breakdown Simulator */}
            {selectedGateway === "installments" && (
              <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-[var(--ink)]">Choose BNPL Provider:</span>
                  <button
                    type="button"
                    onClick={() => setInstallmentPlan("koko")}
                    className={`text-xs px-2.5 py-1 rounded-md border font-bold ${
                      installmentPlan === "koko" ? "bg-purple-600 text-white border-purple-600" : "border-[var(--line)]"
                    }`}
                  >
                    Koko (3x)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInstallmentPlan("mintpay")}
                    className={`text-xs px-2.5 py-1 rounded-md border font-bold ${
                      installmentPlan === "mintpay" ? "bg-teal-600 text-white border-teal-600" : "border-[var(--line)]"
                    }`}
                  >
                    Mintpay (3x)
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-lg bg-[var(--bg)] border border-[var(--line)]">
                    <span className="text-[10px] text-[var(--mut)] block">Month 1 (Today)</span>
                    <b className="text-[var(--ink)]">{formatLKR(monthlyInstallment)}</b>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[var(--bg)] border border-[var(--line)]">
                    <span className="text-[10px] text-[var(--mut)] block">Month 2 (Day 30)</span>
                    <b className="text-[var(--ink)]">{formatLKR(monthlyInstallment)}</b>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[var(--bg)] border border-[var(--line)]">
                    <span className="text-[10px] text-[var(--mut)] block">Month 3 (Day 60)</span>
                    <b className="text-[var(--ink)]">{formatLKR(monthlyInstallment)}</b>
                  </div>
                </div>
                <p className="text-[11px] text-[var(--mut)] text-center">
                  Zero interest or hidden costs. Verified with any Sri Lankan debit/credit card.
                </p>
              </div>
            )}

            {/* Direct Bank Transfer & Slip Upload */}
            {selectedGateway === "bank" && (
              <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] space-y-3">
                <div className="text-xs text-[var(--mut)] space-y-1 p-3 bg-[var(--bg)] rounded-lg border border-[var(--line)]">
                  <p className="font-bold text-[var(--ink)]">Commercial Bank of Ceylon (Kandy Branch)</p>
                  <p>Account Name: <b>CraftVilla Artisanal Marketplace PLC</b></p>
                  <p>Account No: <b className="font-mono text-[var(--ink)]">8100 2938 4710</b></p>
                </div>

                <div>
                  <label htmlFor="slip-ref" className="text-xs">Deposit Slip Reference Number</label>
                  <input
                    type="text"
                    id="slip-ref"
                    placeholder="e.g. SLIP-20261021-009"
                    value={bankSlipRef}
                    onChange={(e) => setBankSlipRef(e.target.value)}
                    className="text-xs py-2"
                  />
                </div>

                <div
                  onClick={() => setBankSlipUploaded(true)}
                  className="border-2 border-dashed border-[var(--line)] p-4 rounded-xl text-center cursor-pointer hover:border-[var(--ink)] transition-colors"
                >
                  <UploadCloud className="w-6 h-6 text-[var(--mut)] mx-auto mb-1" />
                  <p className="text-xs font-bold text-[var(--ink)]">
                    {bankSlipUploaded ? "✓ Receipt slip attached successfully!" : "Click to upload deposit slip photograph (PNG / JPG / PDF)"}
                  </p>
                  <p className="text-[11px] text-[var(--mut)] mt-0.5">Admin will verify within 2 hours</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Itemized Review & Confirm Button */}
        <div className="panel space-y-5 lg:sticky lg:top-24">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
            <h3 className="text-lg">Order Items ({items.length})</h3>
            <Link href="/cart" className="text-xs text-[var(--accent)] hover:underline font-semibold">
              Edit Cart
            </Link>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="text-xs flex justify-between items-start pb-2 border-b border-[var(--line)]/50">
                <div className="space-y-0.5 max-w-[200px]">
                  <b className="text-[var(--ink)] block truncate">{item.name}</b>
                  <p className="text-[11px] text-[var(--mut)] truncate">
                    {item.isHamper ? item.text : `“${item.text}” (${item.finish})`}
                  </p>
                  <span className="text-[10px] text-[var(--mut)]">Qty: {item.qty}</span>
                </div>
                <span className="font-bold text-[var(--ink)] shrink-0">
                  {formatLKR(item.price)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Math */}
          <div className="space-y-2 text-xs pt-2">
            <div className="line py-1">
              <span className="text-[var(--mut)]">Items Subtotal</span>
              <span className="font-semibold text-[var(--ink)]">{formatLKR(subtotal)}</span>
            </div>
            <div className="line py-1">
              <span className="text-[var(--mut)]">Eco-Friendly Packaging</span>
              <span className="font-semibold text-[var(--ink)]">{formatLKR(packagingFee)}</span>
            </div>
            <div className="line py-1">
              <span className="text-[var(--mut)]">Island-wide Express Courier</span>
              <span className="font-semibold text-[var(--ink)]">{formatLKR(deliveryFee)}</span>
            </div>
            <div className="line total pt-3 border-t border-[var(--line)] text-base font-bold">
              <span>Total Payable</span>
              <span className="text-xl text-[var(--ink)]">{formatLKR(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn gold w-full text-base font-bold shadow-lg py-3"
          >
            {isSubmitting ? "Authorizing..." : `Authorize & Place Order · ${formatLKR(total)}`}
          </button>

          <div className="p-3 bg-[var(--bg)] rounded-xl text-[11px] text-[var(--mut)] space-y-1">
            <p className="flex items-center gap-1 font-semibold text-[var(--ink)]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--ok)]" />
              <span>Artisan Lead Time Notice</span>
            </p>
            <p>
              Your personalized piece will be allocated immediately to the maker studio. You can track progress in real-time.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
