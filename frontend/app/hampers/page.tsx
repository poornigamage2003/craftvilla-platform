"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PRODUCTS, HAMPER_PRESETS } from "@/lib/data";
import { formatLKR } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cartStore";
import { useToastStore } from "@/lib/store/toastStore";
import { Gift, Check, Feather } from "lucide-react";

const BOX_TYPES = [
  {
    id: "pine",
    name: "Pine Wood Keepsake Box",
    price: 800,
    tagline: "Solid pine with sliding lid and aromatic wood shavings lining.",
    emoji: "📦",
  },
  {
    id: "eco-kraft",
    name: "Eco-Kraft Artisanal Box",
    price: 550,
    tagline: "100% recycled biodegradable unbleached board with coconut fiber cushion.",
    emoji: "🌿",
  },
  {
    id: "lacquer",
    name: "Luxury Lacquer Teak Box",
    price: 1500,
    tagline: "High-gloss hand-burnished traditional lacquer finish with brass latch.",
    emoji: "✨",
  },
];

export default function HampersPage() {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { showToast } = useToastStore();

  const [selectedBox, setSelectedBox] = useState(BOX_TYPES[0]);
  const [selectedProductIndices, setSelectedProductIndices] = useState<Set<number>>(
    new Set([1, 3, 5]) // Initial Birthday preset
  );
  const [waxSealWrap, setWaxSealWrap] = useState<boolean>(true);
  const [cardMessage, setCardMessage] = useState<string>("Wishing you joy and wonderful moments!");

  const toggleProduct = (index: number) => {
    setSelectedProductIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        if (next.size >= 4) {
          showToast("Maximum 4 crafts in a single keepsake box");
          return prev;
        }
        next.add(index);
      }
      return next;
    });
  };

  const applyPreset = (presetName: string) => {
    const indices = HAMPER_PRESETS[presetName] || [];
    setSelectedProductIndices(new Set(indices));
    showToast(`${presetName} bundle loaded`);
  };

  const itemsSubtotal = Array.from(selectedProductIndices).reduce(
    (acc, idx) => acc + (PRODUCTS[idx]?.basePrice || 0),
    0
  );

  const waxSealPrice = waxSealWrap ? 350 : 0;
  const totalHamperPrice =
    selectedProductIndices.size > 0
      ? itemsSubtotal + selectedBox.price + waxSealPrice
      : 0;

  const handleAddHamper = () => {
    if (selectedProductIndices.size < 2) {
      showToast("Please bundle at least 2 artisan crafts");
      return;
    }

    const itemNames = Array.from(selectedProductIndices).map(
      (idx) => PRODUCTS[idx].name
    );

    const finishDesc = `${selectedBox.name}${waxSealWrap ? " + Red Wax Seal" : ""}`;

    addItem({
      id: "hamper-" + Date.now(),
      name: "Curated Artisan Gift Hamper",
      text: `${itemNames.join(", ")}${cardMessage ? ` · Note: "${cardMessage}"` : ""}`,
      font: "Handwritten Script",
      finish: finishDesc,
      qty: 1,
      price: totalHamperPrice,
      isHamper: true,
      hamperItems: itemNames,
      proofApproved: true,
    });

    showToast("Curated hamper added to cart!");
    router.push("/cart");
  };

  return (
    <div className="space-y-10">
      {/* Page Title & Preset Badges */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-1">
          <Gift className="w-3.5 h-3.5" />
          <span>Curated Gift Box Builder</span>
        </div>
        <h2>Build a Sri Lankan Artisan Hamper</h2>
        <p className="sub">
          Bundle authentic handcrafted crafts into a luxury presentation box with personal handwritten notes and wax seals.
        </p>

        {/* Quick Presets */}
        <div className="flex gap-2.5 flex-wrap mt-3">
          <button
            type="button"
            className="chip font-medium text-xs py-1.5 px-3"
            onClick={() => applyPreset("Birthday")}
          >
            🎁 Birthday Celebration Preset
          </button>
          <button
            type="button"
            className="chip font-medium text-xs py-1.5 px-3"
            onClick={() => applyPreset("Anniversary")}
          >
            ❤️ Heritage Anniversary Preset
          </button>
          <button
            type="button"
            className="chip font-medium text-xs py-1.5 px-3"
            onClick={() => applyPreset("Corporate")}
          >
            💼 Executive Corporate Preset
          </button>
        </div>
      </div>

      {/* 3-Step Builder Grid */}
      <div className="space-y-8">
        {/* STEP 1: Select Box Type */}
        <div className="panel space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[var(--accent)] text-[var(--accent-ink)] font-bold text-xs flex items-center justify-center shrink-0">
              1
            </span>
            <h3 className="text-lg">Select Keepsake Box Container</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BOX_TYPES.map((box) => {
              const isSelected = selectedBox.id === box.id;
              return (
                <div
                  key={box.id}
                  onClick={() => setSelectedBox(box)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-[var(--ink)] bg-[var(--surface)] shadow-md"
                      : "border-[var(--line)] bg-[var(--bg)]/50 hover:border-[var(--mut)]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-2xl mb-2">
                      <span>{box.emoji}</span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-[var(--ink)] text-[var(--bg)] flex items-center justify-center text-xs">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-[var(--ink)]">{box.name}</h4>
                    <p className="text-xs text-[var(--mut)] mt-1 leading-relaxed">
                      {box.tagline}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[var(--line)] font-bold text-xs text-[var(--ink)]">
                    {formatLKR(box.price)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 2: Interactive multi-item selection tray (bundle 3–4 artisan items) */}
        <div className="panel space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[var(--accent)] text-[var(--accent-ink)] font-bold text-xs flex items-center justify-center shrink-0">
                2
              </span>
              <h3 className="text-lg">
                Choose Artisan Crafts ({selectedProductIndices.size} of 4 Selected)
              </h3>
            </div>
            <span className="text-xs text-[var(--mut)]">
              Pick between 2 to 4 handmade pieces to fill the keepsake tray.
            </span>
          </div>

          {/* Tray Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {PRODUCTS.map((product, idx) => {
              const isSelected = selectedProductIndices.has(idx);
              return (
                <div
                  key={product.id}
                  onClick={() => toggleProduct(idx)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                    isSelected
                      ? "border-[var(--accent)] bg-[var(--surface)] shadow-xs"
                      : "border-[var(--line)] bg-[var(--bg)]/40 hover:border-[var(--mut)]"
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                    style={{ backgroundColor: product.bgColor }}
                  >
                    {product.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[var(--ink)] truncate">
                      {product.name}
                    </p>
                    <p className="text-[11px] text-[var(--mut)]">
                      {formatLKR(product.basePrice)}
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0 ${
                    isSelected
                      ? "bg-[var(--accent)] text-[var(--accent-ink)] border-[var(--accent)]"
                      : "border-[var(--line)] text-transparent"
                  }`}>
                    ✓
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 3: Handwritten Greeting Card & Wax Seal Packaging */}
        <div className="panel space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[var(--accent)] text-[var(--accent-ink)] font-bold text-xs flex items-center justify-center shrink-0">
              3
            </span>
            <h3 className="text-lg">Packaging Embellishments &amp; Greeting Note</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="card-msg" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--mut)] mb-1.5">
                <Feather className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Handwritten Calligraphy Card Inscription</span>
              </label>
              <textarea
                id="card-msg"
                rows={3}
                maxLength={150}
                placeholder="Write your personal message. Our calligrapher writes this with dip pen inside the keepsake box..."
                value={cardMessage}
                onChange={(e) => setCardMessage(e.target.value)}
                className="text-xs"
              />
              <span className="text-[11px] text-[var(--mut)] block mt-1">
                {cardMessage.length}/150 characters · Inscribed on cotton rag paper
              </span>
            </div>

            <div className="space-y-4">
              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-[var(--line)] bg-[var(--bg)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={waxSealWrap}
                  onChange={(e) => setWaxSealWrap(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-[var(--accent)]"
                />
                <div>
                  <b className="text-xs text-[var(--ink)] block">
                    Botanical Botanical Twine &amp; Red Wax Seal (+ LKR 350)
                  </b>
                  <p className="text-[11px] text-[var(--mut)] mt-0.5">
                    Sealed by hand with CraftVilla lion insignia wax seal and natural jute ribbon.
                  </p>
                </div>
              </label>

              {/* Total Calculation & Add to Cart */}
              <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                <div className="flex justify-between items-center text-xs text-[var(--mut)] mb-1">
                  <span>Hamper Items ({selectedProductIndices.size})</span>
                  <span>{formatLKR(itemsSubtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-[var(--mut)] mb-1">
                  <span>{selectedBox.name}</span>
                  <span>{formatLKR(selectedBox.price)}</span>
                </div>
                {waxSealWrap && (
                  <div className="flex justify-between items-center text-xs text-[var(--mut)] mb-1">
                    <span>Wax Seal &amp; Ribbon Packaging</span>
                    <span>{formatLKR(350)}</span>
                  </div>
                )}
                <div className="line total pt-2 mt-2 border-t border-[var(--line)] text-base font-bold">
                  <span>Total Hamper</span>
                  <span className="text-lg text-[var(--ink)]">{formatLKR(totalHamperPrice)}</span>
                </div>

                <button
                  type="button"
                  onClick={handleAddHamper}
                  disabled={selectedProductIndices.size < 2}
                  className="btn gold w-full mt-3 text-sm font-bold shadow-md"
                >
                  Add Custom Hamper to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
