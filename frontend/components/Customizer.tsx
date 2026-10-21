"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";
import { FINISHES, FONTS } from "@/lib/data";
import { formatLKR } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cartStore";
import { useToastStore } from "@/lib/store/toastStore";
import PlaquePreview from "./PlaquePreview";
import { UploadCloud, CheckCircle2, Clock, Sparkles, AlertCircle } from "lucide-react";

interface CustomizerProps {
  product: Product;
}

const DIMENSION_OPTIONS = [
  { id: "standard", label: "Standard Size (30 × 20 cm)", priceDelta: 0 },
  { id: "grand", label: "Grand Keepsake (45 × 30 cm) · +LKR 950", priceDelta: 950 },
  { id: "compact", label: "Compact Desk (20 × 15 cm) · -LKR 400", priceDelta: -400 },
];

export default function Customizer({ product }: CustomizerProps) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { showToast } = useToastStore();

  const [text, setText] = useState<string>("");
  const [selectedFont, setSelectedFont] = useState<string>(FONTS[0].family);
  const [selectedFinishIndex, setSelectedFinishIndex] = useState<number>(0);
  const [selectedDimension, setSelectedDimension] = useState(DIMENSION_OPTIONS[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageNote, setImageNote] = useState<{
    text: string;
    type: "neutral" | "bad" | "good";
  }>({
    text: "Minimum 600 × 600 px for crisp laser etching.",
    type: "neutral",
  });
  const [quantity, setQuantity] = useState<number>(1);
  const [proofApproved, setProofApproved] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const selectedFinish = FINISHES[selectedFinishIndex];

  // Pricing calculations
  const photoAddon = uploadedImage ? 600 : 0;
  const textAddon = text.trim() ? 400 : 0;
  const basePriceWithDim = Math.max(product.basePrice + selectedDimension.priceDelta, 1000);
  const unitPrice = basePriceWithDim + photoAddon + textAddon;
  const totalPrice = unitPrice * quantity;

  // Calculated lead time based on customizations
  const calculatedLeadDays = product.leadTimeDays + (uploadedImage ? 1 : 0);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    setProofApproved(false);
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFont(e.target.value);
    setProofApproved(false);
  };

  const handleFinishSelect = (index: number) => {
    setSelectedFinishIndex(index);
    setProofApproved(false);
  };

  const handleDimensionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = DIMENSION_OPTIONS.find((d) => d.id === e.target.value) || DIMENSION_OPTIONS[0];
    setSelectedDimension(found);
    setProofApproved(false);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value, 10));
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        if (img.width < 600 || img.height < 600) {
          setImageNote({
            text: `Image too small (${img.width} × ${img.height} px). Minimum required: 600 × 600 px.`,
            type: "bad",
          });
          setUploadedImage(null);
        } else {
          setImageNote({
            text: `Sharp resolution (${img.width} × ${img.height} px) verified for engraving.`,
            type: "good",
          });
          setUploadedImage(reader.result as string);
        }
        setProofApproved(false);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleApproveProof = () => {
    if (!text.trim() && !uploadedImage) {
      showToast("Enter custom inscription or upload reference artwork first");
      return;
    }
    setProofApproved(true);
    showToast("Digital proof approved ✓");
  };

  const handleAddToCart = () => {
    if (!proofApproved) return;

    const fontObj = FONTS.find((f) => f.family === selectedFont) || FONTS[0];

    addItem({
      id: "cart-" + Date.now(),
      productId: product.id,
      name: product.name,
      text: text.trim() || "(Custom Proof Image Etching)",
      font: fontObj.name,
      finish: `${selectedFinish.name} (${selectedDimension.label.split(" (")[0]})`,
      qty: quantity,
      price: totalPrice,
      imageUrl: uploadedImage,
      proofApproved: true,
    });

    showToast("Added bespoke craft to cart");
    router.push("/cart");
  };

  return (
    <div className="split">
      {/* Visual Preview Left Column (Sticky) */}
      <div className="lg:sticky lg:top-24 space-y-3">
        <div className="flex items-center justify-between text-xs text-[var(--mut)] mb-1">
          <span className="font-semibold uppercase tracking-wider text-[var(--ink)] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Live 1:1 Rendering Canvas</span>
          </span>
          <span className="bg-[var(--surface)] px-2 py-0.5 rounded-full border border-[var(--line)]">
            {selectedDimension.label.split(" · ")[0]}
          </span>
        </div>

        <PlaquePreview
          text={text}
          fontFamily={selectedFont}
          finish={selectedFinish}
          imageUrl={uploadedImage}
        />

        <div className="panel bg-[var(--surface)]/80 text-xs text-[var(--mut)] flex items-center justify-between p-3.5 rounded-xl">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--accent)]" />
            <span>
              Estimated Crafting: <b>{calculatedLeadDays} business days</b>
            </span>
          </div>
          <span className="text-[var(--ok)] font-medium">
            100% Plantation Timber
          </span>
        </div>
      </div>

      {/* Control Panel Right Column */}
      <div className="panel space-y-4">
        <h3 className="text-xl">Customization Specifications</h3>

        {/* Dimension Select */}
        <div>
          <label htmlFor="dim">Heirloom Dimensions</label>
          <select id="dim" value={selectedDimension.id} onChange={handleDimensionChange}>
            {DIMENSION_OPTIONS.map((dim) => (
              <option key={dim.id} value={dim.id}>
                {dim.label}
              </option>
            ))}
          </select>
        </div>

        {/* Inscription Text */}
        <div>
          <div className="flex justify-between items-center">
            <label htmlFor="txt" className="mb-0">Custom Inscription Text</label>
            <span className="text-xs text-[var(--mut)]" id="cnt">
              <b className={text.length >= 40 ? "text-red-500" : "text-[var(--ink)]"}>
                {text.length}
              </b>
              /40 chars
            </span>
          </div>
          <input
            type="text"
            id="txt"
            value={text}
            onChange={handleTextChange}
            maxLength={40}
            placeholder="e.g. For Thaths, with love · 2026"
            className="mt-1.5"
            aria-describedby="cnt"
          />
        </div>

        {/* Font Style */}
        <div>
          <label htmlFor="font">Inscription Font Style</label>
          <select id="font" value={selectedFont} onChange={handleFontChange}>
            {FONTS.map((font) => (
              <option key={font.id} value={font.family}>
                {font.name}
              </option>
            ))}
          </select>
        </div>

        {/* Wood Finish Stain */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="mb-0">Material Stain &amp; Finish</label>
            <span className="text-xs font-semibold text-[var(--ink)]">
              {selectedFinish.name} Stain
            </span>
          </div>
          <div className="sw" role="radiogroup" aria-label="Wood finish swatches">
            {FINISHES.map((finish, idx) => (
              <button
                key={finish.id}
                type="button"
                role="radio"
                aria-checked={selectedFinishIndex === idx}
                aria-label={`${finish.name} stain`}
                onClick={() => handleFinishSelect(idx)}
                style={{
                  background: `linear-gradient(135deg, ${finish.startColor}, ${finish.endColor})`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Image Dropzone Upload */}
        <div>
          <label htmlFor="img">Reference Photo or Crest (Optional +LKR 600)</label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
              isDragging
                ? "border-[var(--accent)] bg-[var(--accent)]/5"
                : "border-[var(--line)] hover:border-[var(--ink)]"
            }`}
            onClick={() => document.getElementById("img")?.click()}
          >
            <UploadCloud className="w-6 h-6 text-[var(--mut)] mx-auto mb-1" />
            <p className="text-xs font-bold text-[var(--ink)]">
              {uploadedImage ? "Artwork attached! Click to replace" : "Click to browse or drop reference photo"}
            </p>
            <p className="text-[11px] text-[var(--mut)] mt-0.5">
              JPG or PNG (Min 600 × 600 px)
            </p>
            <input
              type="file"
              id="img"
              accept="image/png,image/jpeg"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div
            className={`note mt-1.5 flex items-center gap-1.5 text-xs ${
              imageNote.type === "bad"
                ? "bad text-red-600"
                : imageNote.type === "good"
                ? "good text-[var(--ok)]"
                : "text-[var(--mut)]"
            }`}
          >
            {imageNote.type === "bad" ? (
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            ) : imageNote.type === "good" ? (
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            ) : null}
            <span>{imageNote.text}</span>
          </div>
        </div>

        {/* Quantity Select */}
        <div>
          <label htmlFor="qty">Quantity</label>
          <select id="qty" value={quantity} onChange={handleQuantityChange}>
            <option value={1}>1 piece</option>
            <option value={2}>2 pieces</option>
            <option value={3}>3 pieces</option>
            <option value={4}>4 pieces</option>
            <option value={5}>5 pieces</option>
          </select>
        </div>

        {/* Price Breakdown */}
        <div className="line total pt-3 border-t border-[var(--line)]">
          <div>
            <span className="block text-sm font-normal text-[var(--mut)]">Calculated Total</span>
            <span className="text-xs text-[var(--mut)]">
              Base {formatLKR(basePriceWithDim)} {text ? "+ Text LKR 400" : ""} {uploadedImage ? "+ Photo LKR 600" : ""}
            </span>
          </div>
          <span id="pp" className="text-xl font-bold text-[var(--ink)]">
            {formatLKR(totalPrice)}
          </span>
        </div>

        {/* Actions: Approve Proof then Add to Cart */}
        <button
          type="button"
          className="btn ghost w-full text-sm font-bold flex items-center justify-center gap-1.5"
          onClick={handleApproveProof}
          aria-pressed={proofApproved}
        >
          {proofApproved ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-[var(--ok)]" />
              <span>Digital Proof Approved ✓</span>
            </>
          ) : (
            <span>Approve Proof Preview</span>
          )}
        </button>

        <button
          type="button"
          className="btn gold w-full text-base font-bold shadow-md"
          disabled={!proofApproved}
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>

        <div className="note text-center text-xs">
          {proofApproved
            ? "Proof locked. Artisan workshop will receive your exact inscription upon checkout."
            : "Please review and approve your proof to unlock Add to Cart."}
        </div>
      </div>
    </div>
  );
}
