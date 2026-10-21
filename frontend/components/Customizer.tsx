"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";
import { FINISHES, FONTS } from "@/lib/data";
import { formatLKR } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cartStore";
import { useToastStore } from "@/lib/store/toastStore";
import PlaquePreview from "./PlaquePreview";

interface CustomizerProps {
  product: Product;
}

export default function Customizer({ product }: CustomizerProps) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { showToast } = useToastStore();

  const [text, setText] = useState<string>("");
  const [selectedFont, setSelectedFont] = useState<string>(FONTS[0].family);
  const [selectedFinishIndex, setSelectedFinishIndex] = useState<number>(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageNote, setImageNote] = useState<{
    text: string;
    type: "neutral" | "bad" | "good";
  }>({
    text: "Minimum 600 × 600 px for a sharp engraving.",
    type: "neutral",
  });
  const [quantity, setQuantity] = useState<number>(1);
  const [proofApproved, setProofApproved] = useState<boolean>(false);

  const selectedFinish = FINISHES[selectedFinishIndex];

  // Pricing calculations
  const photoAddon = uploadedImage ? 600 : 0;
  const textAddon = text.trim() ? 400 : 0;
  const unitPrice = product.basePrice + photoAddon + textAddon;
  const totalPrice = unitPrice * quantity;

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

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value, 10));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        if (img.width < 600 || img.height < 600) {
          setImageNote({
            text: `Too small (${img.width} × ${img.height} px). Upload an image at least 600 × 600 px.`,
            type: "bad",
          });
          setUploadedImage(null);
        } else {
          setImageNote({
            text: `Looks sharp (${img.width} × ${img.height} px).`,
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

  const handleApproveProof = () => {
    if (!text.trim()) {
      showToast("Enter your engraving text first");
      return;
    }
    setProofApproved(true);
    showToast("Proof approved ✓");
  };

  const handleAddToCart = () => {
    if (!proofApproved) return;

    const fontObj = FONTS.find((f) => f.family === selectedFont) || FONTS[0];

    addItem({
      id: "cart-" + Date.now(),
      productId: product.id,
      name: product.name,
      text: text.trim(),
      font: fontObj.name,
      finish: selectedFinish.name,
      qty: quantity,
      price: totalPrice,
      imageUrl: uploadedImage,
      proofApproved: true,
    });

    showToast("Added to cart");
    router.push("/cart");
  };

  return (
    <div className="split">
      {/* Visual Preview Left Column */}
      <div>
        <PlaquePreview
          text={text}
          fontFamily={selectedFont}
          finish={selectedFinish}
          imageUrl={uploadedImage}
        />
        <p className="note mt-3 font-medium text-center">
          {product.name} by {product.artisanName}
          {product.dimensions ? ` · ${product.dimensions}` : ""}
        </p>
      </div>

      {/* Control Panel Right Column */}
      <div className="panel">
        <div>
          <label htmlFor="txt">Engraving text</label>
          <input
            type="text"
            id="txt"
            value={text}
            onChange={handleTextChange}
            maxLength={40}
            placeholder="A name or short message"
            aria-describedby="cnt"
          />
          <div className="note" id="cnt">
            <span>{text.length}</span>/40 characters
          </div>
        </div>

        <div>
          <label htmlFor="font">Font style</label>
          <select id="font" value={selectedFont} onChange={handleFontChange}>
            {FONTS.map((font) => (
              <option key={font.id} value={font.family}>
                {font.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Finish</label>
          <div className="sw" role="radiogroup" aria-label="Wood finish swatches">
            {FINISHES.map((finish, idx) => (
              <button
                key={finish.id}
                type="button"
                role="radio"
                aria-checked={selectedFinishIndex === idx}
                aria-label={`${finish.name} finish`}
                onClick={() => handleFinishSelect(idx)}
                style={{
                  background: `linear-gradient(135deg, ${finish.startColor}, ${finish.endColor})`,
                }}
              />
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="img">Reference photo (JPG or PNG)</label>
          <input
            type="file"
            id="img"
            accept="image/png,image/jpeg"
            onChange={handleImageUpload}
          />
          <div
            className={`note ${
              imageNote.type === "bad"
                ? "bad"
                : imageNote.type === "good"
                ? "good"
                : ""
            }`}
          >
            {imageNote.text}
          </div>
        </div>

        <div>
          <label htmlFor="qty">Quantity</label>
          <select
            id="qty"
            value={quantity}
            onChange={handleQuantityChange}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>

        <div className="line total mt-4">
          <span>Price</span>
          <span id="pp">{formatLKR(totalPrice)}</span>
        </div>

        <button
          type="button"
          className="btn ghost w-full mb-2.5 mt-2"
          onClick={handleApproveProof}
          aria-pressed={proofApproved}
        >
          {proofApproved ? "Proof approved ✓" : "Approve proof"}
        </button>

        <button
          type="button"
          className="btn gold w-full"
          disabled={!proofApproved}
          onClick={handleAddToCart}
        >
          Add to cart
        </button>

        <div className="note text-center mt-2">
          {proofApproved
            ? "The artisan starts only after you approve this proof."
            : "Approve the proof to unlock Add to cart."}
        </div>
      </div>
    </div>
  );
}
