"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PRODUCTS, HAMPER_PRESETS } from "@/lib/data";
import { formatLKR } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cartStore";
import { useToastStore } from "@/lib/store/toastStore";

const BOX_OPTIONS = [
  { id: "teak", name: "Classic teak box", price: 800 },
  { id: "lacquer", name: "Premium lacquer box", price: 1500 },
];

export default function HampersPage() {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { showToast } = useToastStore();

  const [selectedProductIndices, setSelectedProductIndices] = useState<Set<number>>(
    new Set()
  );
  const [selectedBox, setSelectedBox] = useState<typeof BOX_OPTIONS[0]>(
    BOX_OPTIONS[0]
  );

  const toggleProduct = (index: number) => {
    setSelectedProductIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const applyPreset = (presetName: string) => {
    const indices = HAMPER_PRESETS[presetName] || [];
    setSelectedProductIndices(new Set(indices));
    showToast(`${presetName} box selected`);
  };

  const itemsSubtotal = Array.from(selectedProductIndices).reduce(
    (acc, idx) => acc + (PRODUCTS[idx]?.basePrice || 0),
    0
  );

  const totalHamperPrice =
    selectedProductIndices.size > 0 ? itemsSubtotal + selectedBox.price : 0;

  const handleAddHamper = () => {
    if (selectedProductIndices.size < 2) {
      showToast("Pick at least two items");
      return;
    }

    const itemNames = Array.from(selectedProductIndices).map(
      (idx) => PRODUCTS[idx].name
    );

    addItem({
      id: "hamper-" + Date.now(),
      name: "Gift hamper",
      text: itemNames.join(", "),
      font: "",
      finish: selectedBox.name.replace(" box", ""),
      qty: 1,
      price: totalHamperPrice,
      isHamper: true,
      hamperItems: itemNames,
      proofApproved: true,
    });

    showToast("Hamper added");
    router.push("/cart");
  };

  return (
    <div>
      <h2>Build a gift hamper</h2>
      <p className="sub">
        Start from a ready-made box, or pick at least two handmade items.
      </p>

      {/* Preset Quick Selectors */}
      <div className="chips">
        <button
          type="button"
          className="chip font-medium"
          onClick={() => applyPreset("Birthday")}
        >
          🎁 Birthday box
        </button>
        <button
          type="button"
          className="chip font-medium"
          onClick={() => applyPreset("Anniversary")}
        >
          ❤️ Anniversary box
        </button>
        <button
          type="button"
          className="chip font-medium"
          onClick={() => applyPreset("Corporate")}
        >
          💼 Corporate box
        </button>
      </div>

      {/* Product Selection Chips */}
      <div className="chips my-5" role="group" aria-label="Select items for hamper">
        {PRODUCTS.map((product, idx) => {
          const isSelected = selectedProductIndices.has(idx);
          return (
            <button
              key={product.id}
              type="button"
              className="chip text-sm"
              aria-pressed={isSelected}
              onClick={() => toggleProduct(idx)}
            >
              {isSelected ? "✓ " : ""}{product.emoji} {product.name} · {formatLKR(product.basePrice)}
            </button>
          );
        })}
      </div>

      {/* Hamper Keepsake Box & Checkout Panel */}
      <div className="panel max-w-xl">
        <label htmlFor="hbox">Keepsake box</label>
        <select
          id="hbox"
          value={selectedBox.id}
          onChange={(e) => {
            const found = BOX_OPTIONS.find((b) => b.id === e.target.value);
            if (found) setSelectedBox(found);
          }}
        >
          {BOX_OPTIONS.map((box) => (
            <option key={box.id} value={box.id}>
              {box.name} ({formatLKR(box.price)})
            </option>
          ))}
        </select>

        <div className="line total my-4">
          <span>Hamper total</span>
          <span id="htot">{formatLKR(totalHamperPrice)}</span>
        </div>

        <button
          type="button"
          className="btn gold w-full"
          onClick={handleAddHamper}
        >
          Add hamper to cart
        </button>

        <div className="note text-center mt-2">
          {selectedProductIndices.size < 2
            ? "Select at least 2 handcrafted items to create your hamper."
            : `${selectedProductIndices.size} items included in ${selectedBox.name}.`}
        </div>
      </div>
    </div>
  );
}
